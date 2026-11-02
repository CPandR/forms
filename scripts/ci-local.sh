#!/usr/bin/env bash
set -euo pipefail

CONTEXT="ci/local"
cd "$(git rev-parse --show-toplevel)"
MARKER_DIR="$(git rev-parse --path-format=absolute --git-common-dir)/ci-local"

die() {
  echo "ci-local: $*" >&2
  exit 1
}

say() {
  echo "ci-local: $*"
}

require_clean_tree() {
  if [ -n "$(git status --porcelain)" ]; then
    git status --short >&2
    die "working tree has uncommitted or untracked changes${1:-}. Commit them first so the result belongs to a commit."
  fi
}

head_sha() {
  git rev-parse HEAD
}

package_manager() {
  if [ -f pnpm-lock.yaml ]; then
    echo pnpm
  elif [ -f yarn.lock ]; then
    echo yarn
  else
    echo npm
  fi
}

node_major() {
  node -p 'process.versions.node.split(".")[0]'
}

require_node_version() {
  [ -f .nvmrc ] || die ".nvmrc is missing, so the Node version cannot be checked."
  local wanted actual
  wanted="$(tr -d '[:space:]' < .nvmrc)"
  wanted="${wanted#v}"
  wanted="${wanted%%.*}"
  actual="$(node_major)"
  [ "$wanted" = "$actual" ] || die "Node $(node -v) is running but .nvmrc asks for Node $wanted. Switch with: nvm use"
}

lockfile_hash() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | cut -d' ' -f1
  else
    shasum -a 256 "$1" | cut -d' ' -f1
  fi
}

install_command() {
  case "$1" in
    package-lock.json) echo "npm ci" ;;
    yarn.lock) echo "yarn install --frozen-lockfile" ;;
    pnpm-lock.yaml) echo "pnpm install --frozen-lockfile" ;;
  esac
}

sync_dependencies() {
  local lockfile dir name stamp expected
  while IFS= read -r lockfile; do
    dir="$(dirname "$lockfile")"
    name="$(basename "$lockfile")"
    stamp="$dir/node_modules/.ci-local-lock"
    expected="$(lockfile_hash "$lockfile") node$(node_major)"
    if [ -f "$stamp" ] && [ "$(cat "$stamp")" = "$expected" ]; then
      continue
    fi
    say "installing dependencies in $dir from $name"
    (cd "$dir" && HUSKY=0 $(install_command "$name"))
    mkdir -p "$dir/node_modules"
    printf '%s\n' "$expected" > "$stamp"
  done < <(git ls-files -- '*package-lock.json' '*yarn.lock' '*pnpm-lock.yaml')
}

run_suite() {
  local pm="$1"
  env -u SENTRY_AUTH_TOKEN -u SENTRY_ORG -u SENTRY_PROJECT -u SENTRY_URL -u SOURCE_VERSION -u NODE_ENV \
    CI=true TZ=UTC LC_ALL=en_US.UTF-8 \
    "$pm" run check
}

cmd_run() {
  require_clean_tree
  require_node_version
  local sha pm started elapsed
  sha="$(head_sha)"
  pm="$(package_manager)"
  sync_dependencies
  require_clean_tree " after installing dependencies"
  started="$(date +%s)"
  say "running '$pm run check' on ${sha:0:12} with node $(node -v)"
  run_suite "$pm"
  require_clean_tree " after the suite ran"
  elapsed=$(( $(date +%s) - started ))
  mkdir -p "$MARKER_DIR"
  printf '%s run check passed in %ss · node %s · %s\n' "$pm" "$elapsed" "$(node -v)" "$(hostname -s)" > "$MARKER_DIR/$sha"
  say "passed on ${sha:0:12} in ${elapsed}s"
  if [ "${1:-}" = "--post" ]; then
    cmd_post
  fi
}

cmd_check() {
  local sha
  sha="$(head_sha)"
  [ -z "$(git status --porcelain)" ] || die "working tree is dirty, so HEAD ${sha:0:12} is not what was tested."
  [ -f "$MARKER_DIR/$sha" ] || die "no local pass recorded for HEAD ${sha:0:12}. Run: bash scripts/ci-local.sh run"
  say "HEAD ${sha:0:12} passed locally"
}

cmd_post() {
  cmd_check >/dev/null
  local sha repo description
  sha="$(head_sha)"
  description="$(head -n 1 "$MARKER_DIR/$sha")"
  repo="$(gh repo view --json nameWithOwner --jq .nameWithOwner)" || die "could not find the GitHub repo for this checkout."
  git fetch --quiet origin "$sha" 2>/dev/null || die "commit ${sha:0:12} is not on GitHub yet. Push it first."
  gh api --silent "repos/$repo/statuses/$sha" \
    -f state=success \
    -f context="$CONTEXT" \
    -f description="${description:0:140}"
  say "posted $CONTEXT=success on $repo@${sha:0:12}"
}

case "${1:-run}" in
  run) shift || true; cmd_run "$@" ;;
  check) cmd_check ;;
  post) cmd_post ;;
  *) die "usage: ci-local.sh [run [--post] | check | post]" ;;
esac
