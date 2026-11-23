# ZCMC Human Milk Bank Tracker: Playwright tests

System under test: http://192.168.36.164:8000/ (private network). Read `README.md` for the rules.

## First time on a new PC
- `npm install` and `npx playwright install chromium` are needed once (`npm run setup` does both).
- Secrets are not in the repo: create `.env` from `.env.example`.

## Rules for working here
- Never run tests or anything that changes data unless the user says so. The app has no sandbox, no login and no roles, and its data is mock data, so tests may create and delete records: name them "PW TEST" and clean up.
- Test case IDs (`TC-XXX-nnn`) go in the test titles.
- Never add AI attribution to commits (no `Co-Authored-By: Claude` lines, no "Generated with Claude Code" lines), in commit messages or PR descriptions.
