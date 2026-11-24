# ZCMC Human Milk Bank Tracker: Playwright tests

End-to-end tests for the Human Milk Bank Tracker at <http://192.168.36.164:8000/> (private network address: you must be on the ZCMC network).

## Continue on another PC
This repo has one branch per system. These tests are on the branch `human-milk-bank-tracker`.
```
git clone -b human-milk-bank-tracker https://github.com/moonofblues/zcmc-e2e-tests.git
cd zcmc-e2e-tests
npm run setup
```
`npm run setup` runs `npm install` and `npx playwright install chromium`. Needs Node 22+.

Secrets are NOT in the repo: copy `.env.example` to `.env` and fill it in.

## Rules
- Tests run one at a time (`workers: 1`).
- Use throwaway data only. Keep credentials in `.env` (git-ignored).
- The app has no sandbox, no login and no roles, and its data is mock data. Tests may create and delete records. Give test records an obvious name (for example "PW TEST") and delete them at the end of the test.

## Run
```
npm test            # everything
npm run test:headed # with a visible browser
npm run report      # open the HTML report
```

## Generating test cases and scripts (/next-module)
Work through the modules one at a time, in the order in `docs/MODULE-INVENTORY.md`.

1. Open this folder in Claude Code or Antigravity and type `/next-module`.
   - Claude Code: `.claude/commands/next-module.md`. It uses the QA skills `ai-test-generation` and `playwright-automation`, so install them first.
   - Antigravity: `.agents/skills/next-module/SKILL.md`. Set terminal commands to require confirmation.
2. It names the next module and its stage. Review the proposed cases against the real app. Remove anything invented, check the expected results, and keep the "assumption" marks until confirmed. Reply "approved" or list changes.
3. Approve the CSV it writes to `test-cases/<N>-<Name>.csv`.
4. Run `/next-module` again to write the Playwright tests in `tests/`. It does not run them.
5. Run `/next-module` again and say yes to run that module's tests only. Chromium must be installed (`npm run setup`).
6. Record the results (see below), commit, then run `/next-module` for the next module.

Settle the open questions in section 5 of `docs/MODULE-INVENTORY.md` with the app owner before Cold-Chain, NICU and Overview. No AI attribution in commits or PRs.

## Recording results
After every run, the CSV reporter (`reporters/csv-status-reporter.ts`) fills **Status** and **Actual results** for each test it ran, matching rows by the `TC-XXX-nnn` ID at the start of the test title.

- Default: updated copies go to `test-results/csv-status/` and `test-cases/` is not changed. Review them, then copy them over `test-cases/`.
- `UPDATE_CSV=1 npm test` writes the updated CSVs straight into `test-cases/`.
- Passed gives `Passed`. Failed or timed out gives `Failed` plus the first line of the error. A row that was `Failed` or `Blocked` and now passes becomes `[Retested] Passed`. Skipped tests leave their row alone.
- Not touched: **Bug Status**, **Severity** and **Notes**. Fill these in by hand, because a failed test is not always an app bug. A stale Actual results from an earlier failure is also left for you to clear.
- Then import the CSV into the Google Sheet (File > Import > Replace current sheet, or paste the rows). Check the sheet's columns match the CSV header the first time.

## CI
`.github/workflows/playwright.yml` is manual only. GitHub-hosted runners cannot reach the private address, so use a self-hosted runner on the ZCMC network (and set the `BASE_URL` repository variable).

## Docs
- `docs/TEST-CASE-FORMAT.md`: columns and allowed values for the test case CSVs.
- `docs/QA-STRATEGY.md`: QA strategy for this system.
- `docs/MODULE-INVENTORY.md`: modules, risk ranking, test order and open questions.
