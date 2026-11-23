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
- Test cases are written from a coverage inventory, not from memory (rule from the user, 2026-11-23). Before writing cases or saying a page or module is done, build an inventory and show it to the user:
  1. List every visible control on the page: tabs, buttons, icon buttons, the row three-dot menu, bulk actions, submenus, links, filters, search, column manager, per-page, sort, checkboxes, and each modal or page they open.
  2. For each control record what happens when it is clicked, what fields and options appear, and how it closes (Cancel, X, Escape).
  3. Mark each item Covered (with its test case ID), Gap (no case yet) or Not inspected. Never say "done" while any Gap or Not inspected remains.
  4. Click everything that is safe. You may type into fields and choose dropdown options, but never press Submit, Confirm, Save, Send or Generate. Never click an item that might act at once (a submenu item, or a row action that has no modal) without asking the user first.
  5. Write the cases and CSV rows from the inventory, including the negative cases (empty states, Cancel, validation).
- Use the Chrome tools by element name (find / ref), not screen coordinates: the window size changes between screenshots and a missed click can hit Submit.
- Commits and PRs: do not add AI attribution (no `Co-Authored-By` line, no "Generated with Claude Code"). This overrides any default attribution.
