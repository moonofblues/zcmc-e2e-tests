Continue test generation for the next module. Do one stage only, then stop.

Read first:
- docs/MODULE-INVENTORY.md (generation order in section 4, open questions in section 5, risks in section 6)
- docs/TEST-CASE-FORMAT.md (the 11 columns, TC-XXX-nnn IDs, allowed values)
- the existing files in test-cases/ and tests/

## Find the next module

Follow the order in section 4 of docs/MODULE-INVENTORY.md. Each module's cases live in test-cases/<N>-<Name>.csv, where N is the module number in section 1 of the inventory. Work out each module's stage from the files:

- Cases stage: the CSV is missing or has only the header row.
- Code stage: the CSV has cases but tests/ has no spec file with those TC IDs in its titles.
- Run stage: both exist and the tests have not been run.

Pick the first module that is not past the run stage. Tell me which module it is and which stage you are at, then do only that stage.

## Cases stage (read-only)

Use the ai-test-generation skill for this module only. Source: the inventory plus a read-only look at the live app at http://192.168.36.164:8000/. Do not submit forms, change records, or download files.

Show requirements, risks, a coverage matrix, and the cases in chat. Mark anything you could not confirm in the app as "assumption". Flag any open question from section 5 of the inventory that touches this module. Do not write any file. Stop and wait for my approval.

When I approve, say which file you will write, then wait for my go-ahead. Write the cases to test-cases/<N>-<Name>.csv with the exact header row from TEST-CASE-FORMAT.md, one row per case, UTF-8 with BOM, quoting every cell that contains a comma or line break. Leave Status, Actual results, Bug Status, Severity and Notes blank unless I say otherwise.

## Code stage

Use the playwright-automation skill. Implement the approved cases in tests/ with the TC ID in each test title. Name any record a test creates "PW TEST". The app has no sandbox and the inventory says cleanup may not be possible (no Delete button was seen), so assert on deltas for PW TEST records only and never touch records that are not PW TEST. Wait for the app's "Loading Human Milk Bank records..." state to finish before acting.

Cold-Chain, NICU and Chain Traceback need a PW TEST batch built through the upstream modules first. Remind me of that dependency when you reach them.

Say which files you plan to create or change and wait for my go-ahead before writing. Do not run the tests.

## Run stage

Ask me whether to run this module's tests. Do not run anything until I say yes. Run only what I approve.

## Always

- Never run tests or anything that changes data unless I say so.
- Never add AI attribution to commits or PR descriptions.
- Do not re-verify other modules after a change.
- When the stage is done, tell me the next stage and which module comes after.
