# Agent instructions for CP+R Forms

This file is the single source of truth for AI coding agents (Claude Code, Codex, Cursor). `CLAUDE.md` imports it; do not duplicate content into tool-specific files.

## Repo layout

This is the public patient questionnaire site. It serves two forms that patients reach from emailed links and the mobile app, and it posts answers to The Hub's `/api/forms` API (`CPandR/The-Hub`, `server/api/forms.js`):

- `/had_form/:id`: the Hospital Anxiety and Depression (HAD) scale
- `/exe_form/:id`: the Exercise + Confidence form

These paths are part of a contract with emails already sent and with the mobile app. Never rename or remove them.

The app is React 19, TypeScript, Vite, react-router 7 (declarative mode) and Tailwind 4, with source in `src/`. Use Node 22 (`.nvmrc`) and npm.

- `src/forms/`: one `FormDefinition` per questionnaire (`had.ts`, `exe.ts`), holding the questions, answer scores, copy and API endpoints, plus the API client (`api.ts`) and scoring (`scale.ts`).
- `src/pages/QuestionnairePage.tsx`: renders any `FormDefinition`. To add a form, add a definition and a route in `src/App.tsx`; do not copy the page.
- `server/`: the Express 5 static server Heroku runs (`npm start`). It serves `dist/` with SPA fallback, `/healthz`, an HTTPS redirect, security headers and long-lived caching for hashed `/assets/*`.
- `VITE_API_URL` is The Hub's forms API base, for example `http://localhost:5001/api/forms` (see `.env.example`). It is baked in at build time, so set it as a Heroku config var before building.

Hosting is Heroku (`Procfile`, `heroku-postbuild` runs the build). `deploy/netlify-redirect/` is a one-file Netlify site that 301s the old `cpandrforms.netlify.app` URLs to Heroku; it is deployed by hand at cutover and is not part of the build.

This repository is public. Never commit secrets, `.env` files or patient data.

## Commands

| What | Command |
|---|---|
| Local gate before a PR (runs `check`) | `bash scripts/ci-local.sh run` |
| Everything the gate runs | `npm run check` (lint, type-check, tests, build) |
| Lint | `npm run lint` |
| Type-check | `npm run type-check` |
| Tests once | `npm test`; focused: `npx vitest run <pattern>` |
| Tests in watch mode | `npm run test:watch` |
| Dev server (port 5173) | `npm run dev` |
| Build | `npm run build` |
| Serve the build like Heroku | `npm run build && PORT=5055 npm start` |

## Merge rules (mandatory)

This repo has no server-side branch protection, so these rules are the guardrail:

1. Never commit or push directly to `main`. Work on a branch and open a PR.
2. Before a PR is opened for review, the local gate must pass on its head commit (see "Opening pull requests").
3. Merge only after every GitHub check is green (`gh pr checks <number> --watch`). A merge to `main` deploys once Heroku auto-deploys are enabled.
4. If CI fails, fix it on the branch. Never delete or weaken a check to get to green.

Commit messages use Conventional Commits, for example `feat(forms): …`.

## Opening pull requests (mandatory)

GitHub Actions only runs fast checks on pull requests. The full suite, which is everything in this repo's `check` script, runs on your machine before a PR is opened for review. The `ci/local` commit status records that it passed. The `Local gate` workflow fails any non-draft PR whose head commit has no `ci/local` success.

1. Commit all changes. The gate refuses a dirty tree.
2. `bash scripts/ci-local.sh run`
3. `git push -u origin HEAD`
4. `bash scripts/ci-local.sh post`
5. `gh pr create`, or `gh pr ready <number>` for a draft.

The `ship` skill does all of this. Repeat steps 2 to 4 for every new commit pushed to an open PR. Draft PRs skip both the gate and remote CI.

Rules:
- Never post the status without a passing run.
- Never weaken, skip or delete a test or check to get to green.
- To gate a PR you did not write, such as a Dependabot PR: `gh pr checkout <number> && bash scripts/ci-local.sh run --post`, then re-run its `Local gate` check.

What `ci-local.sh run` does:
- Requires the Node major version in `.nvmrc`.
- Reinstalls from each tracked lockfile when that lockfile has changed (`npm ci`, `yarn install --frozen-lockfile`).
- Runs `check` with `CI=true TZ=UTC LC_ALL=en_US.UTF-8`, with the Sentry upload variables unset.
- Records the pass against the commit SHA in the shared git directory, so every worktree sees it.

## Testing standard (all CP+R repos)

| Layer | Libraries |
|---|---|
| Node backends | Vitest + supertest. Mock models and external services at the module level; no test may need a real database or network. |
| Web frontends (Vite) | Vitest + @testing-library/react + jsdom for units and components; Playwright for browser end-to-end tests |
| Expo / React Native apps | Jest + jest-expo + @testing-library/react-native; Maestro for on-device flows (local only, not part of the gate) |

Conventions:
- Pin Node in `.nvmrc` (22).
- The `test` script runs once and never watches. Use `test:watch` for watch mode.
- Tests live next to the code in `__tests__/` folders.
- Every repo has a `check` script that runs the whole local gate.
- Add tests for meaningful logic, especially auth, permissions and money-adjacent code. Do not add placeholder or trivial tests.

## Shared agent tooling

These files are identical in every CP+R repo, and The Hub (`CPandR/The-Hub`) holds the master copy. Change them there first, then copy the change to the other repos.

| File | Purpose |
|---|---|
| `scripts/ci-local.sh` | The local gate (`run`, `check`, `post`) |
| `scripts/agent-hooks/require-local-ci.cjs` | Blocks opening a ready PR until HEAD has passed locally |
| `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` | Run that hook before shell commands in Claude Code, Codex and Cursor |
| `.agents/skills/ship/SKILL.md` | The `ship` skill. Codex and Cursor read `.agents/skills`; `.claude/skills/ship` is a symlink to it for Claude Code. |
| `.github/workflows/local-gate.yml` | Fails a ready PR whose head commit has no `ci/local` success |

Codex only runs project hooks for trusted projects. Trust the repo, then approve the hook with `/hooks`. Edit skills at their real path under `.agents/skills`, not through the `.claude/skills` symlink.

## Testing in this repo

- Web tests live in `src/**/__tests__/` and run under Vitest with jsdom, @testing-library/react and jest-dom (`src/test/setup.ts`). They stub `fetch` with `vi.stubGlobal`; `VITE_API_URL` is fixed to `https://hub.test/api/forms` in `vite.config.ts`.
- Server tests live in `server/__tests__/` and run under Vitest's node environment with supertest against a temporary `dist/`.
- The two environments are Vitest projects (`web` and `server`) in `vite.config.ts`.
- The question data and scores are clinical instruments, and The Hub stores answers by key (`q1` to `q14` for HAD, `q1` to `q8` for Exercise + Confidence). Do not reorder questions or change scores without changing The Hub too.
- jsdom 30 needs Node 22.22 or later; the gate's Node check only compares the major version, so update an older Node 22 first.
- CI minutes are limited (GitHub free tier). On pull requests, CI runs lint, type-check and tests in one job, plus the `Local gate` check. The build runs in the local gate.
