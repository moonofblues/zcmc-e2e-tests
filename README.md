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

## CI
`.github/workflows/playwright.yml` is manual only. GitHub-hosted runners cannot reach the private address, so use a self-hosted runner on the ZCMC network (and set the `BASE_URL` repository variable).

## Docs
- `docs/TEST-CASE-FORMAT.md`: columns and allowed values for the test case CSVs.
- `docs/QA-STRATEGY.md`: QA strategy for this system.
