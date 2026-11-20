# ZCMC Recruitment System: Playwright tests

Live system (https://recruitment.zcmc.online). Read `README.md` for the rules and `TODO.md` for what is blocked and what is left to do.

## First time on a new PC
- The skills (`.agents/skills`, `.claude/skills`) are NOT in the repo. If `.agents/skills` is missing, tell the user and offer to run `npm run setup:skills` (it downloads them from the commits pinned in `skills-lock.json`), then restart Claude Code.
- `npm install` and `npx playwright install chromium` are needed once (`npm run setup` does both and the skills).
- Secrets are not in the repo: create `.env` from `.env.example` and save `admin-state.json` by hand (README, Admin login).

## Rules for working here
- Live site: never run tests that create data (`RUN_FULL_REGISTRATION`, `ALLOW_JOB_POST_WRITES`, `RUN_APPLICATION_JOURNEY`) unless the user says so.
- Never solve the login Security Verification challenge by script. Never print applicants' personal data from HR admin.
- Test case IDs (`TC-XXX-nnn`) in the specs match the sheet scripts in `test-cases/`.
