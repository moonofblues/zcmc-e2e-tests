---
name: next-module
description: Continue Playwright test generation for the ZCMC Human Milk Bank Tracker. Finds the next module that is not finished, does one stage only (cases, then code, then run), and stops for approval. Use when asked to continue test generation or when /next-module is typed.
---

# next-module

Continue test generation for the next module. Do one stage only, then stop.

This file mirrors `.claude/commands/next-module.md`, which is the Claude Code version of the same command. If the stage logic changes, update both.

## Project rules (always apply)

- System under test: http://192.168.36.164:8000/ (private network). It has no sandbox, no login and no roles. The data is mock data.
- Never run tests, scripts, or anything that changes data unless the user says so. Ask first, every time. Run only what the user approves.
- Before creating or editing any file, say what you plan to change and wait for the user's go-ahead.
- Never submit forms, change records, or download files while exploring the live app. Look only.
- Any record a test creates is named "PW TEST". Never touch records that are not "PW TEST".
- Test case IDs (`TC-XXX-nnn`) go in the Playwright test titles.
- Never add AI attribution to commits or PR descriptions (no Co-Authored-By lines, no "Generated with" lines).
- Do not re-run or re-verify other modules after a change unless asked.

If your terminal-command mode is set to run automatically, do not use it for anything that runs tests or touches the app's data. Ask first.

## Read first

- `docs/MODULE-INVENTORY.md`: generation order (section 4), open questions (section 5), risks (section 6)
- `docs/TEST-CASE-FORMAT.md`: the 11 columns, `TC-XXX-nnn` IDs, allowed values
- the existing files in `test-cases/` and `tests/`

## Find the next module

Follow the order in section 4 of `docs/MODULE-INVENTORY.md`. Each module's cases live in `test-cases/<N>-<Name>.csv`, where N is the module number in section 1 of the inventory. Work out each module's stage from the files:

- Cases stage: the CSV is missing or has only the header row.
- Code stage: the CSV has cases but `tests/` has no spec file with those TC IDs in its titles.
- Run stage: both exist and the tests have not been run.

Pick the first module that is not past the run stage. Tell the user which module it is and which stage it is at, then do only that stage.

## Cases stage (read-only)

Source: the inventory plus a read-only look at the live app. Do not write any file in this step.

Produce and show in chat:

1. Requirements for this module, extracted from the app and the inventory.
2. Risks, ranked by impact on infants, donors and data integrity.
3. A coverage matrix: each requirement mapped to the cases that cover it.
4. The test cases, with positive paths, negative paths, validation, boundaries, and state changes. Each case has a clear expected result that can be checked on screen.

Mark anything you could not confirm in the app as "assumption". Do not invent fields, buttons, or flows. Flag any open question from section 5 of the inventory that touches this module. Then stop and wait for approval.

When the user approves, say which file you will write and wait for the go-ahead. Write the cases to `test-cases/<N>-<Name>.csv` with the exact header row from `docs/TEST-CASE-FORMAT.md`, one row per case, UTF-8 with BOM, quoting every cell that contains a comma or line break. Leave Status, Actual results, Bug Status, Severity and Notes blank unless the user says otherwise.

## Code stage

Implement the approved cases as Playwright tests in `tests/` using TypeScript:

- the TC ID in each test title
- page objects for each screen, fixtures for shared setup
- user-facing locators (role, label, text), not CSS paths or XPath
- rely on Playwright auto-waiting, with no fixed sleeps
- wait for "Loading Human Milk Bank records..." to finish before acting
- any record a test creates is named "PW TEST"
- assert on changes (deltas) to PW TEST records only, not absolute counts. The inventory says cleanup may not be possible (no Delete button was seen), so do not rely on deleting data.

Cold-Chain, NICU and Chain Traceback need a PW TEST batch built through the upstream modules first. Remind the user of that dependency when you reach them.

Say which files you plan to create or change and wait for the go-ahead before writing. Do not run the tests.

## Run stage

Ask the user whether to run this module's tests. Do not run anything until they say yes. Run only that module's tests (for example `npx playwright test tests/<file>`).

## Always

When the stage is done, tell the user the next stage and which module comes after.
