#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const path = require('node:path');

function readStdin() {
  try {
    return require('node:fs').readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function commandFrom(payload) {
  const raw = payload?.tool_input?.command ?? payload?.command ?? '';
  return Array.isArray(raw) ? raw.join(' ') : String(raw);
}

function stripQuoted(command) {
  return command.replace(/"(?:\\.|[^"\\])*"/gs, '""').replace(/'[^']*'/gs, "''");
}

function opensReadyPr(command) {
  const text = stripQuoted(command);
  const start = String.raw`(?:^|[;&|(\s])`;
  const create = new RegExp(`${start}gh\\s+pr\\s+create\\b([^;&|]*)`, 'g');
  const ready = new RegExp(`${start}gh\\s+pr\\s+ready\\b([^;&|]*)`, 'g');
  for (const match of text.matchAll(create)) {
    if (!/(?:^|\s)(?:--draft|-d)(?=\s|=true|$)/.test(match[1])) return true;
  }
  for (const match of text.matchAll(ready)) {
    if (!/(?:^|\s)--undo(?=\s|$)/.test(match[1])) return true;
  }
  return false;
}

function deny(reason) {
  process.stderr.write(`${reason}\n`);
  process.stdout.write(`${JSON.stringify({ permission: 'deny', user_message: reason, agent_message: reason })}\n`);
  process.exit(2);
}

let payload = {};
try {
  payload = JSON.parse(readStdin() || '{}');
} catch {
  process.exit(0);
}

const command = commandFrom(payload);
if (!opensReadyPr(command)) process.exit(0);

const cwd = payload.cwd || process.cwd();
const root = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd, encoding: 'utf8' });
const repo = root.status === 0 ? root.stdout.trim() : path.resolve(__dirname, '..', '..');
const check = spawnSync('bash', [path.join(repo, 'scripts', 'ci-local.sh'), 'check'], { cwd: repo, encoding: 'utf8' });

if (check.status !== 0) {
  deny(
    [
      'Blocked: a pull request can only be opened for review after the full suite passes locally on this exact commit.',
      (check.stderr || check.stdout || '').trim(),
      'Use the ship skill (or: bash scripts/ci-local.sh run, git push -u origin HEAD, bash scripts/ci-local.sh post), or open the PR with --draft.',
    ]
      .filter(Boolean)
      .join('\n'),
  );
}
process.exit(0);
