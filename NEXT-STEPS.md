# Next steps

## Where things stand
- Playwright is set up on this branch (config, smoke spec, CI workflow, README, CLAUDE.md). Pushed to GitHub.
- `test-cases/` has 7 CSVs with only the header row (one per module). No test cases written yet.
- No specs written yet except `tests/smoke.spec.ts`.
- App: http://192.168.36.164:8000/ (ZCMC network only). Mock data, no login, no roles. Tests may create and delete records: name them "PW TEST" and clean up.
- It is a single-page app. The URL stays `/` for every module, so tests must open each module by clicking the sidebar.

## To do
1. **Donors test cases** (`test-cases/2-Donors.csv`). Write them, show them for review, then write the Donors spec. Do not write the spec before the cases are reviewed.
   - Dialogs already mapped: New Donor Registration (tabs "New donor registration" and "Existing donor (subsequent donation)"), Log Donation Session, Add Laboratory Screening Test (Renew Screening).
2. Repeat for the other modules, one at a time: Overview, Pooling & Lab, Pasteurization, Cold-Chain Storage, NICU Recipients & MOM, Chain Traceback.
3. Add a `human-milk-bank-tracker` row to the systems table in the README on `main`.
4. Not yet explored: Cold-Chain dialogs (Authorize New Batch, Log Bottle Thawed), Screening Rules, Audit Trail, Export to Excel.

## CSV rules
- Columns: `Test case ID,Title,Description,Pre-conditions,Test steps,Expected results,Status,Actual results,Bug Status,Severity,Notes` (see `docs/TEST-CASE-FORMAT.md`)
- IDs look like `TC-XXX-nnn` and go in the test titles.
- Status: Passed / Failed / Blocked / [Retested] Passed (blank if not run). Bug Status: Open / Closed / Fixed. Severity: Critical / Major / Minor / Low.

## Working rules
- Ask before acting. Never run tests or anything that changes data unless told to.
- No AI attribution in commits or PR descriptions.

## On the new PC
```
git clone -b human-milk-bank-tracker https://github.com/moonofblues/zcmc-e2e-tests.git
cd zcmc-e2e-tests
npm run setup
```
Then copy `.env.example` to `.env`.

## UI/UX work (separate from the tests)
- Two private pages were made in Claude: the developer brief https://claude.ai/artifact/JHfFtYxcsHZMkc8hUvgChg and the designer notes https://claude.ai/artifact/6UxKL8ZxDMGyjUnUbwCrar.
- The designer notes have not been updated for the Overview, Temperature Log and full-width work.
- Tests find elements by their text, so labels must not be renamed without updating the test cases.
