# QA strategy: ZCMC Human Milk Bank Tracker

System under test: http://192.168.36.164:8000/ (ZCMC private network). Single-page app: the URL stays `/` for every module, so tests open each module from the sidebar. No login, no roles, no sandbox. Data is mock data.

## 1. Goals
- Protect the workflows where an error could affect infant safety or traceability.
- Catch regressions before each release to the ZCMC network.
- Keep the suite stable and cheap to run on a single shared instance.

## 2. Scope
Modules (one test case file each, in `test-cases/`):
1. Overview
2. Donors
3. Pooling & Lab
4. Pasteurization
5. Cold-Chain Storage
6. NICU Recipients & MOM
7. Chain Traceback

Also in scope: form validation and business rules (dates, volumes, expiry, batch linkage), lists, search and filters, Export to Excel, Audit Trail, Screening Rules, basic accessibility, Chromium first.

Out of scope for now: load testing, security and penetration testing (there is no auth), native mobile.

## 3. Risk-based priority
| Priority | Area | Reason |
|---|---|---|
| P0 | Traceability (donor to pool to batch to bottle to recipient), expiry, stock counts | Patient safety, record accuracy |
| P0 | Data integrity (no orphaned or duplicate records, correct totals) | Audit and reporting |
| P1 | Validation, error handling, status transitions | Bad data entry |
| P1 | Reports, exports, audit trail | Operational and regulatory use |
| P2 | Search, filters, navigation | Usability |
| P3 | Layout, accessibility, cosmetics | Lower risk |

## 4. Test layers
1. **Smoke** (about 1 minute): app loads, each module opens from the sidebar, no console errors.
2. **Regression E2E**: one spec per module, driven by the reviewed test cases.
3. **Accessibility**: axe scan per key page and a keyboard check on the main dialogs.
4. **Manual exploratory**: timeboxed session per release, plus clinical-workflow sense-checks with milk bank staff.

## 5. Process and conventions
- Write the test cases first in the module CSV (format: `docs/TEST-CASE-FORMAT.md`), review them, then write the spec. Never write the spec before the cases are reviewed.
- Test case IDs (`TC-XXX-nnn`) go in the Playwright test titles.
- Page Object per module, user-facing locators (tests find elements by their text), no fixed sleeps.
- Test data is named "PW TEST" and deleted at the end of the test, even on failure. Never touch records that are not "PW TEST".
- Keep a traceability list: requirement, test case ID, automated or manual, status.

## 6. Environment and execution
- One environment: the live mock server, ZCMC network only.
- Run on a developer PC inside the network. Scheduled runs need a self-hosted runner (the GitHub workflow is manual only).
- One worker (`workers: 1`) until tests are proven isolated.
- Capture trace and screenshots on failure.
- Tests run only when the team asks for it.

## 7. Entry and exit criteria
- Entry: build deployed, smoke passes, network reachable.
- Exit for release: all P0 and P1 cases pass, no open Critical or Major bugs, exploratory session done, known failures documented.

## 8. Defect handling
- Severity: Critical, Major, Minor, Low.
- Bug Status: Open, Closed, Fixed.
- Each bug records steps, expected and actual results, the test case ID, and a trace or screenshot.
- Metrics: pass rate, flaky-test rate, P0 and P1 coverage, defects by module, run time.

## 9. Roadmap
1. Module inventory and risk list, expanded smoke test.
2. Donors cases and spec, then the P0 modules (Pooling & Lab, Pasteurization, Cold-Chain Storage, Chain Traceback).
3. NICU Recipients & MOM, Overview, then P1 validation, exports and accessibility scans.
4. Self-hosted runner with nightly runs, and a flaky-test review.
