---
name: ship
description: Open a pull request the way CP+R repos require - commit, run the full local suite on the committed HEAD (scripts/ci-local.sh), push, post the ci/local commit status, then create the PR or mark a draft ready. Use whenever the user asks to open, create, submit, raise or ship a PR, to mark a draft PR ready for review, or to gate someone else's PR (for example a Dependabot PR) with a local run.
---

# Ship a pull request

GitHub Actions only runs fast checks on pull requests. The full suite (everything in this repo's `check` script, including browser and build steps) runs on your machine, and the `ci/local` commit status is the proof that it passed. The `Local gate` workflow fails any non-draft PR whose head commit has no `ci/local` success, and an agent hook blocks `gh pr create` (without `--draft`) and `gh pr ready` until HEAD has passed locally. Follow these steps in order.

`scripts/ci-local.sh` works the same in every repo, whatever the package manager. `AGENTS.md` says what this repo's `check` script runs.

## Steps

1. **Check the branch.** Never ship from `main`. If you are on `main`, create a branch first.
2. **Commit everything.** The gate refuses a dirty tree, because the result is recorded against the commit SHA. Commit all changes, including untracked files, with a message in the repo's style.
3. **Run the gate:** `bash scripts/ci-local.sh run`.
   - It checks Node against `.nvmrc`, reinstalls dependencies from the lockfiles if they changed, then runs `check` with `CI=true TZ=UTC` and records a pass for HEAD.
   - It can take several minutes. Run it in the background if your tools allow that, and wait for it to finish.
   - On failure, fix the cause, commit, and run it again. Never weaken, skip or delete a test or check to get to green. If the same failure happens on `main`, report it instead of hiding it.
   - If you change anything after it passes, commit and run it again. A pass belongs to one SHA only.
4. **Push:** `git push -u origin HEAD`.
5. **Post the status:** `bash scripts/ci-local.sh post`. This sets `ci/local = success` on the pushed commit.
6. **Open the PR** with `gh pr create`, or `gh pr ready <number>` for an existing draft.
   - Follow the repo's PR template if it has one.
   - Say what changed and why, and how it was tested, quoting the line `ci-local: passed on <sha> in <N>s`.
   - **Linear:** if the branch name, the commits or the task name a Linear issue (for example `CPR-61`), put the ID in the PR title and add `Fixes CPR-61` to the body. Use `Part of CPR-61` when the PR does not fully resolve the issue.
7. Report the PR URL and the gate result.

## Pushing more commits to an open PR

Every new HEAD needs its own pass: commit, `bash scripts/ci-local.sh run`, push, `bash scripts/ci-local.sh post`. The PR's `Local suite passed (ci/local)` check fails until you do, and then needs a re-run (`gh run rerun <run-id> --failed`, or push again).

## Gating a PR you did not write

For a Dependabot PR, or a branch updated with GitHub's "Update branch" button:

```bash
gh pr checkout <number>
bash scripts/ci-local.sh run --post
```

Then re-run the failed `Local gate` check on the PR.

## Work in progress

To share work before it is ready, open a draft with `gh pr create --draft`. Drafts skip the gate and remote CI. Run this skill when the draft is ready for review.
