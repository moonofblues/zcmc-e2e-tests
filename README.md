# ZCMC Recruitment Portal: Playwright tests

Automated tests for the **live** site <https://recruitment.zcmc.online/>.

## Continue on another PC
This repo has one branch per system. The Recruitment System tests are on the branch `recruitment-system`.
```
git clone -b recruitment-system https://github.com/moonofblues/zcmc-e2e-tests.git
cd zcmc-e2e-tests
npm run setup
```
`npm run setup` runs `npm install`, `npx playwright install chromium` and `node scripts/restore-skills.mjs`. The last one downloads the Claude Code skills (`.agents/skills`, linked from `.claude/skills`) from the commits pinned in `skills-lock.json`; they are not stored in the repo. Needs Node 22+, git and internet. Open the folder in Claude Code afterwards: `CLAUDE.md` tells it what to do, and **`TODO.md` lists what is blocked and what is left**.

Secrets are NOT in the repo. Create them yourself:
1. `.env`: copy `.env.example` and fill it in.
2. `admin-state.json`: sign in by hand and save the session (see "Admin login" below). Never commit it.

`test-results/` is committed on purpose so the last run can be inspected from any PC. Running the tests rewrites that folder, so `git status` will show changes after a run.

## Rules for a live system
- Tests are read-only except the final-submit group `TC-REG-031` to `TC-REG-033`, which creates a real account and is skipped unless `RUN_FULL_REGISTRATION=1`. Use a NEW `TEST_EMAIL` for every run. The email `zcmc.pwtest01@mailinator.com` is already registered.
- `TC-REG-010` to `TC-REG-030` and `TC-REG-034` to `TC-REG-035` walk through registration Steps 1-7 but stop before Finish Registration. The site may still save a draft after Step 1.
- The Portal Gateway tests (`TC-LOGIN-009` to `TC-LOGIN-015`) sign in once each with an existing account. They skip unless `TEST_LOGIN_EMAIL` and `TEST_LOGIN_PASSWORD` are set in `.env`.
- The Admin / Staff Job Posts tests (`TC-JP-001` to `TC-JP-074`, file `tests/admin-job-posts.spec.ts`) are read-only except two groups that run only with `ALLOW_JOB_POST_WRITES=1`: the "writes" group (`TC-JP-045`, `TC-JP-047`, `TC-JP-048`) creates and deletes a real "PW TEST" post, and the publish/edit/view group (`TC-JP-055` to `TC-JP-069`, run in order) creates one PW TEST post, publishes it for a short time and deletes it. **While it is published, real applicants can see it on `/jobs`.** Run that group at a quiet time. All Job Posts tests skip unless `ADMIN_STORAGE_STATE` is set (see "Admin login" below).
- Tests run one at a time (`workers: 1`) to avoid loading the site.
- Use throwaway data only. Mailinator inboxes are public.
- Keep credentials in `.env` (git-ignored). Copy `.env.example` to `.env`.

## Setup (already done on this machine)
```
npm install
npx playwright install chromium
```

## Run
```
npm test                 # everything
npm run test:landing     # landing page + buttons
npm run test:jobs        # job browsing
npm run test:register    # registration form checks
npm run test:login       # login
npm run report           # open the HTML report
```
Full registration (creates a real account): `$env:RUN_FULL_REGISTRATION="1"; npm run test:register`

Admin / Staff Job Posts (read-only): `npx playwright test tests/admin-job-posts.spec.ts`
Job Posts including the tests that create and delete a post: `$env:ALLOW_JOB_POST_WRITES="1"; npx playwright test tests/admin-job-posts.spec.ts`

## Specs and what each needs

There is no required run order. The specs do not depend on each other: each one checks its own prerequisites and skips itself with a message if they are missing. Playwright runs the files one at a time (`workers: 1`) in alphabetical order, and that order is not intentional.

Run a single spec with `npx playwright test tests/<file>`.

| Spec | Covers | Needs (in `.env`) | Writes to the live site? |
|---|---|---|---|
| `landing.spec.ts` | Landing page | nothing | No |
| `landing-buttons.spec.ts` | Landing page buttons | nothing | No |
| `jobs.spec.ts` | Job browsing | a published job, otherwise it skips | No |
| `register.spec.ts` | Registration | Nothing for TC-REG-001 to 030, 034, 035. `RUN_FULL_REGISTRATION=1` for TC-REG-031 to 033. Optional: `TEST_EMAIL`, `TEST_PASSWORD`, `TEST_MOBILE`, `TEST_EXISTING_EMAIL` (defaults exist) | Full flow creates a real account. The other cases stop before Finish Registration, but the site may save a draft after Step 1 |
| `login.spec.ts` | Login | `TEST_LOGIN_EMAIL`, `TEST_LOGIN_PASSWORD`, and `TEST_APPLICANT_ONLY_EMAIL` / `TEST_APPLICANT_ONLY_PASSWORD` for the applicant-only case | No |
| `apply-job.spec.ts` | Apply Now from the public page | a published job, `ADMIN_STORAGE_STATE` | No |
| `applicant-applications.spec.ts` | Applicant Portal pages | `ADMIN_STORAGE_STATE`. The account needs access to the Applicant Portal module. TC-APPPORTAL-003 skips if the account already has applications | No |
| `admin-applications.spec.ts` | HR Applications | `ADMIN_STORAGE_STATE` | No |
| `hr-mpsb.spec.ts` | HR MPSB Panel | `ADMIN_STORAGE_STATE` | No |
| `admin-job-posts.spec.ts` | HR Job Posts | `ADMIN_STORAGE_STATE`. The create, publish and delete tests also need `ALLOW_JOB_POST_WRITES=1` | Only with `ALLOW_JOB_POST_WRITES=1` |
| `application-journey.spec.ts` | Full apply-to-review journey | `RUN_APPLICATION_JOURNEY=1`, `ADMIN_STORAGE_STATE`, `E2E_APPLICANT_EMAIL` | Yes, creates a real application |

`ADMIN_STORAGE_STATE` is the saved login file; see Admin login below. The `.env` variables are listed at the end of this file.

`TC-APPPORTAL-008` and `TC-APPPORTAL-009` are marked as expected failures (`test.fail`) for an open defect. A red result there is not a regression.

### The one shared dependency: a published job

`jobs`, `apply-job` and `application-journey` need at least one published job on the live portal. No spec creates one for the others: `admin-job-posts` can publish a test post, but it deletes it at the end. A job has to be posted by hand first (as of 2026-11-20, one test post, ATTORNEY I). If none is posted, these specs skip.

## Admin login
The login page shows a Security Verification challenge (icon selection) that automation must not solve, so the admin tests reuse a login you save once by hand:
```
npx playwright codegen --save-storage=admin-state.json https://recruitment.zcmc.online/login
```
Sign in yourself, solve the challenge, choose the Admin / Staff Portal, then close the browser. Set `ADMIN_STORAGE_STATE=admin-state.json` in `.env`. The file is git-ignored; never commit it. Re-save it when the session expires.

## Application flow (apply, applicant portal, HR admin)
Read **`TODO.md`** first: it lists what is blocked and what is left to do.
- `tests/apply-job.spec.ts` (`TC-APPLY-*`), `tests/applicant-applications.spec.ts` (`TC-APPPORTAL-*`), `tests/admin-applications.spec.ts` (`TC-APPADM-*`) and `tests/hr-mpsb.spec.ts` (`TC-MPSB-*`) are read-only. They use the same `ADMIN_STORAGE_STATE` login: the account has an Admin Dashboard, an Applicant Portal and an HR-MPSB Panel module, and the tests switch module from the user menu (Switch Module). The switch takes several seconds. Opening an `/admin/...` URL directly while the Applicant Portal module is active redirects to the portal, so the helper always switches first.
- The specs never click the data-changing buttons (Send SMS, Send Email Notification, Mark not qualified, Attach Exam Types, Set for interview, Mark as Hired, Change status, Generate RDR). They only check that those buttons exist.
- `tests/application-journey.spec.ts` (`TC-E2E-*`) applies for a job, checks the applicant portal and checks HR admin. It creates a REAL application and runs only with `RUN_APPLICATION_JOURNEY=1`, `ADMIN_STORAGE_STATE` and `E2E_APPLICANT_EMAIL`. Both journey tests are `test.fixme` (Blocked) until the defects in `TODO.md` are fixed.
- Run: `npm run test:apply`, `npm run test:applications`, `npm run test:journey`.
- The server keeps the active module in the session: do not open the applicant and admin sides in two contexts with the same saved login at the same time.
- Sheet: the application-flow cases are split by role into four tabs. `Application Flow` holds `TC-APPLY-*` and `TC-E2E-*`. `Applicant Portal` (`TC-APPPORTAL-*`), `HR Applications` (`TC-APPADM-*`) and `HR-MPSB Panel` (`TC-MPSB-*`) are filled from the CSVs in `test-cases/` (see "Test case sheet scripts").
- Sheet script (first version, already run): `test-cases/fill-applications-tab.gs`, function `fillApplicationsFlowTab`, fills a tab named exactly `Application Flow`. It still holds the old `TC-APPPORTAL-001` to `007` and `TC-APPADM-001` to `009` rows: delete them by hand from that tab once the new tabs are filled.

## Test case IDs
Every test title starts with an ID that matches the test case document:
`TC-LAND-*` landing, `TC-BTN-*` landing buttons, `TC-JOB-*` jobs (applicant side), `TC-REG-*` registration, `TC-LOGIN-*` login, `TC-JP-*` Job Posts (Admin / Staff portal), `TC-APPLY-*` applying for a job, `TC-APPPORTAL-*` applicant portal, `TC-APPADM-*` HR Applications list, `TC-MPSB-*` HR-MPSB Panel, `TC-E2E-*` full apply-to-HR journey.

## Test case sheet scripts
New cases go into the spec and, since 2026-11-23, into a CSV in `test-cases/` that is copied by hand into a tab of the "[QA 2026] Recruitment System" sheet (no new Apps Scripts). Google Sheets will not let a script copy the "Test Cases" tab (it holds a Table), so duplicate it by hand and rename the copy.
- New CSVs have 11 columns: Test case ID, Title, Description, Pre-conditions, Test steps, Expected results, Status, Actual results, Bug Status, Severity, Notes. To fill a tab: clear sample rows from row 10, copy CSV columns A to J (no header) into column A at row 10, then copy column K (Notes) into column AC at row 10. (The older CSVs `1` to `5` have no Pre-conditions column.)
- `test-cases/Applicant Portal.csv` (`TC-APPPORTAL-001` to `010`), `test-cases/HR Applications.csv` (`TC-APPADM-001` to `062`) and `test-cases/HR-MPSB Panel.csv` (`TC-MPSB-001` to `003`): tabs named `Applicant Portal`, `HR Applications` and `HR-MPSB Panel`.
The Apps Script files below are the earlier approach.
- `test-cases/create-test-case-tabs.gs`, function `fillTestCaseTabs`: Landing Page, Landing Buttons, Job Browsing, Registration, Login.
- `test-cases/fill-job-posts-tab.gs`, function `fillJobPostsTab`: fills the `Job Posts` tab (TC-JP-001 to TC-JP-054). The tab must be named exactly `Job Posts`. A value the sheet's dropdowns reject is left empty and listed in the final message.
- `test-cases/update-job-posts-tab.gs`, function `updateJobPostsTab`: run it AFTER `fillJobPostsTab`. It updates the results of TC-JP-051 to 054 in place (by ID) and adds TC-JP-055 to TC-JP-074 below the last used row. Running it twice adds nothing twice.
Each fill script skips a tab whose row 10 already has data. The Job Posts scripts keep everything inside a single function, so they cannot clash with the other scripts in the Apps Script project (all files in a project share one scope; a clash gives "Identifier ... has already been declared").

## Known gaps
- One job (ATTORNEY I, a test post) is posted as of 2026-11-20, so `TC-JOB-007` to `TC-JOB-009` no longer skip; their `TODO`s still need filling in. See `TODO.md` for the apply-flow defects (disabled Apply Now on the public page, 404 after Proceed to Application).
- The registration dropdown data (`/api/selection-templates`) is loaded now.
- **Defect:** after Confirm & Finalize the site opens `/verify`, which is blank, and no verification email arrived (`TC-REG-032`, `TC-REG-033`). New accounts cannot be verified, so `TC-LOGIN-016` is blocked.
- The destinations of the portals (`TC-LOGIN-012` to `TC-LOGIN-014`): seen by hand, Applicant `/portal/apply-now`, Admin / Staff `/admin/admin-dashboard`, HR-MPSB Panel `/hRMPSBportal/applicant-info`. The login test cases still need updating.
- **Defect (Open, Low):** raw JavaScript text and a small "404" box are shown under the content of `/portal/apply-now`, `/portal/my-files` and `/portal/account-settings` (`TC-APPLY-008`, `TC-APPPORTAL-008`, `TC-APPPORTAL-009`).
- The HR-MPSB Panel shows "No published job posts" although ATTORNEY I is published on the public site (`TC-MPSB-003`). Ask the team whether that is expected.
- Several registration cases are marked "to confirm" in the Notes column (for example whether Steps 3-6 can be skipped).
- Admin portal destination: the Admin / Staff Portal opens `/admin/admin-dashboard`. The Applicant Portal and the HR-MPSB Panel were inspected on 2026-11-23 (see the application-flow specs). Not inspected yet: Action Logs, and the Manage Applications and Manage Disqualified buttons.
- Job Posts selectors for the custom dropdowns were written from a manual walk-through and never run; expect small fixes on the first run (marked TODO in the spec). `TC-JP-045` also needs a small dummy PDF in `tests/fixtures`.
- **Job Posts defects found by hand on 2026-11-20 (Open):** Step 2 salary is lower than Step 1 (`TC-JP-022`); negative Max Applicants and Monthly Salary are accepted (`TC-JP-025`, `TC-JP-026`); required messages do not clear (`TC-JP-043`); raw JavaScript text shows under the create form (`TC-JP-044`); a failed Create returned HTTP 500 and left partial posts, fixed by the developer the same day, re-test (`TC-JP-046`); bulk delete shows a false error toast though the post is deleted (`TC-JP-048`); a published post's Actions menu still offers Publish (`TC-JP-059`); Skills is not shown on View or Edit, re-test before reporting (`TC-JP-066`); the edit form has no Plantilla section and renames the sample attachment (`TC-JP-065`); View does not show Max Applicants (`TC-JP-067`); the public job card shows the Educational Background text instead of the Description (`TC-JP-068`); the tab count badges are stale until a reload (`TC-JP-069`).
- **Job Posts behavior to confirm with the team:** Unpublish clears the published and closing dates (`TC-JP-062`); publishing with a future date leaves the post under Unpublished, with no "Scheduled" status (`TC-JP-057`); new posts get Employment Type "Job Order" although the form has no such field (`TC-JP-050`).
- Not tried yet: Close, bulk Publish selected / Unpublish selected, edit validation and the edit form's Back / View (`TC-JP-070` to `TC-JP-074`), the file size and type limits (`TC-JP-038`), and the date-order cases (`TC-JP-041`, `TC-JP-042`).
- The `.gs` results (Passed / Failed) come from manual exploration. The Playwright tests have not been run.

## .env variables
`BASE_URL`, `TEST_EMAIL`, `TEST_PASSWORD`, `TEST_MOBILE` (registration data), `TEST_EXISTING_EMAIL` (duplicate email test), `TEST_LOGIN_EMAIL` / `TEST_LOGIN_PASSWORD` (existing account for the Portal Gateway), `TEST_APPLICANT_ONLY_EMAIL` / `TEST_APPLICANT_ONLY_PASSWORD` (optional, role test), `ADMIN_STORAGE_STATE` (saved admin login for the Job Posts tests), `ALLOW_JOB_POST_WRITES` (set to `1` to create and delete a "PW TEST" post). See `.env.example`.
