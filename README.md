# PR Tracking System - end-to-end tests (Playwright)

Tests run against the sandbox: https://sandbox-pr.zcmc.online

## Folder layout

```
e2e/
  tests/
    smoke/        quick "is the site alive" checks
    requests/     filing a petty cash request (end user) + print
    terminal/     OMCC terminal: submit and receive
    omcc/         OMCC release and return
    custodian/    custodian process and return
    support/      shared helpers (loginAs, terminal steps, ...). Not tests.
  fixtures/       files the tests upload (CSV, etc.)
  scripts/        run-tests.mjs (keeps every run's results), open-report.mjs
  recordings/     where `npm run record` saves a raw recording (git-ignored, may hold PINs)
  results/        one folder per run (git-ignored)
  .auth/          saved User Switcher sessions (state.json) - SECRET, git-ignored
  playwright.config.ts
```

Add new feature folders under `tests/` as we go (for example `tests/receiving/`,
`tests/omcc/`, `tests/custodian/`). Name each file after what it tests:
`<action>-<thing>.spec.ts`. Only files ending in `.spec.ts` are run.

## Setup on a new PC

This repo has one branch per system. The PR Tracking System tests are on the branch
`pr-tracking-system`.

```bash
git clone -b pr-tracking-system https://github.com/moonofblues/zcmc-e2e-tests.git
cd zcmc-e2e-tests
npm install
npx playwright install chromium
```

Secrets are NOT in the repo. Create these two files yourself:

1. `.env` - copy `.env.example` and fill in `TEST_USER_EMPLOYEE_ID` and `TEST_USER_PIN` (sandbox values).
2. `.auth/state.json` - the saved User Switcher sessions; see `.auth/README.md`.

## Run tests

| What                               | Command                                    |
| ---------------------------------- | ------------------------------------------ |
| Everything                         | `npm test`                                 |
| Watch the browser while it runs    | `npm run test:headed`                      |
| Interactive runner (best to debug) | `npm run test:ui`                          |
| Only smoke checks                  | `npm run test:smoke`                       |
| Only one folder                    | `npm run test:requests` / `test:omcc` / `test:terminal` / `test:custodian` |
| One file                           | `npm test -- tests/requests/file-petty-cash-request.spec.ts` |
| One test by name                   | `npm test -- -g "files a new petty cash"`  |
| Open the latest HTML report        | `npm run report`                           |
| Open an earlier run's report       | `npm run report -- 2026-10-16_16-30-05`    |

Use `npm test` (not plain `npx playwright test`) so the results of the run are kept.

NOTE: tests that file, submit, process or return requests change real records in the sandbox.

## Results of every run

Each run is saved in its own folder and never overwritten:

```
results/2026-10-16_16-30-05/
  report/          HTML report (npm run report)
  artifacts/       screenshots, videos and traces of failed tests
  results.json     machine-readable results
  console.log      what was printed in the terminal
```

`results/` stays on your PC (it is not pushed to GitHub). Delete old folders when you no longer need them.

## Order of the tests

Some tests use requests left by earlier ones, so they depend on this order:
file (tests/requests) -> submit at the terminal (tests/terminal) -> OMCC release/return (tests/omcc)
-> receive at the terminal (tests/terminal) -> custodian process, then return (tests/custodian).
A test with nothing to work on is skipped, not failed.

## Record a new test

1. `npm run record`. A browser and the Playwright Inspector open, already loaded with
   your saved users. The recording is saved to `recordings/new-recording.spec.ts`
   when you close the browser window. (Each recording overwrites the previous one.)
2. Click through the feature (switch user in the Developer Tools drawer, then go to `/`).
3. Close the browser window.
4. Tell Claude the feature name and what should be true at the end. Claude turns the
   recording into `tests/<folder>/<name>.spec.ts`, tidies it, adds checks, runs it,
   and clears `recordings/`.
