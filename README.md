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

## Admin login
The login page shows a Security Verification challenge (icon selection) that automation must not solve, so the admin tests reuse a login you save once by hand:
```
npx playwright codegen --save-storage=admin-state.json https://recruitment.zcmc.online/login
```
Sign in yourself, solve the challenge, choose the Admin / Staff Portal, then close the browser. Set `ADMIN_STORAGE_STATE=admin-state.json` in `.env`. The file is git-ignored; never commit it. Re-save it when the session expires.

## Application flow (apply, applicant portal, HR admin)
Read **`TODO.md`** first: it lists what is blocked and what is left to do.
- `tests/apply-job.spec.ts` (`TC-APPLY-*`), `tests/applicant-applications.spec.ts` (`TC-APPPORTAL-*`) and `tests/admin-applications.spec.ts` (`TC-APPADM-*`) are read-only. They use the same `ADMIN_STORAGE_STATE` login: the account has an Admin Dashboard and an Applicant Portal module, and the tests switch module from the user menu (Switch Module).
- `tests/application-journey.spec.ts` (`TC-E2E-*`) applies for a job, checks the applicant portal and checks HR admin. It creates a REAL application and runs only with `RUN_APPLICATION_JOURNEY=1`, `ADMIN_STORAGE_STATE` and `E2E_APPLICANT_EMAIL`. Both journey tests are `test.fixme` (Blocked) until the defects in `TODO.md` are fixed.
- Run: `npm run test:apply`, `npm run test:applications`, `npm run test:journey`.
- The server keeps the active module in the session: do not open the applicant and admin sides in two contexts with the same saved login at the same time.
- Sheet script: `test-cases/fill-applications-tab.gs`, function `fillApplicationsFlowTab`, fills a tab named exactly `Application Flow` (duplicate the Test Cases tab by hand first).

## Test case IDs
Every test title starts with an ID that matches the test case document:
`TC-LAND-*` landing, `TC-BTN-*` landing buttons, `TC-JOB-*` jobs (applicant side), `TC-REG-*` registration, `TC-LOGIN-*` login, `TC-JP-*` Job Posts (Admin / Staff portal), `TC-APPLY-*` applying for a job, `TC-APPPORTAL-*` applicant portal, `TC-APPADM-*` HR Applications list, `TC-E2E-*` full apply-to-HR journey.

## Test case sheet scripts
New cases go into the spec and an Apps Script file that fills a tab of the "[QA 2026] Recruitment System" sheet (no new CSVs). Google Sheets will not let a script copy the "Test Cases" tab (it holds a Table), so duplicate it by hand, rename the copy, then run the script.
- `test-cases/create-test-case-tabs.gs`, function `fillTestCaseTabs`: Landing Page, Landing Buttons, Job Browsing, Registration, Login.
- `test-cases/fill-job-posts-tab.gs`, function `fillJobPostsTab`: fills the `Job Posts` tab (TC-JP-001 to TC-JP-054). The tab must be named exactly `Job Posts`. A value the sheet's dropdowns reject is left empty and listed in the final message.
- `test-cases/update-job-posts-tab.gs`, function `updateJobPostsTab`: run it AFTER `fillJobPostsTab`. It updates the results of TC-JP-051 to 054 in place (by ID) and adds TC-JP-055 to TC-JP-074 below the last used row. Running it twice adds nothing twice.
Each fill script skips a tab whose row 10 already has data. The Job Posts scripts keep everything inside a single function, so they cannot clash with the other scripts in the Apps Script project (all files in a project share one scope; a clash gives "Identifier ... has already been declared").

## Known gaps
- One job (ATTORNEY I, a test post) is posted as of 2026-11-20, so `TC-JOB-007` to `TC-JOB-009` no longer skip; their `TODO`s still need filling in. See `TODO.md` for the apply-flow defects (disabled Apply Now on the public page, 404 after Proceed to Application).
- The registration dropdown data (`/api/selection-templates`) is loaded now.
- **Defect:** after Confirm & Finalize the site opens `/verify`, which is blank, and no verification email arrived (`TC-REG-032`, `TC-REG-033`). New accounts cannot be verified, so `TC-LOGIN-016` is blocked.
- The destinations of the Applicant, Admin / Staff and HRMPSB Board portals are not confirmed (`TC-LOGIN-012` to `TC-LOGIN-014`).
- Several registration cases are marked "to confirm" in the Notes column (for example whether Steps 3-6 can be skipped).
- Admin portal destination: the Admin / Staff Portal opens `/admin/admin-dashboard`. The Applicant and HRMPSB Board portals are not inspected yet.
- Job Posts selectors for the custom dropdowns were written from a manual walk-through and never run; expect small fixes on the first run (marked TODO in the spec). `TC-JP-045` also needs a small dummy PDF in `tests/fixtures`.
- **Job Posts defects found by hand on 2026-11-20 (Open):** Step 2 salary is lower than Step 1 (`TC-JP-022`); negative Max Applicants and Monthly Salary are accepted (`TC-JP-025`, `TC-JP-026`); required messages do not clear (`TC-JP-043`); raw JavaScript text shows under the create form (`TC-JP-044`); a failed Create returned HTTP 500 and left partial posts, fixed by the developer the same day, re-test (`TC-JP-046`); bulk delete shows a false error toast though the post is deleted (`TC-JP-048`); a published post's Actions menu still offers Publish (`TC-JP-059`); Skills is not shown on View or Edit, re-test before reporting (`TC-JP-066`); the edit form has no Plantilla section and renames the sample attachment (`TC-JP-065`); View does not show Max Applicants (`TC-JP-067`); the public job card shows the Educational Background text instead of the Description (`TC-JP-068`); the tab count badges are stale until a reload (`TC-JP-069`).
- **Job Posts behavior to confirm with the team:** Unpublish clears the published and closing dates (`TC-JP-062`); publishing with a future date leaves the post under Unpublished, with no "Scheduled" status (`TC-JP-057`); new posts get Employment Type "Job Order" although the form has no such field (`TC-JP-050`).
- Not tried yet: Close, bulk Publish selected / Unpublish selected, edit validation and the edit form's Back / View (`TC-JP-070` to `TC-JP-074`), the file size and type limits (`TC-JP-038`), and the date-order cases (`TC-JP-041`, `TC-JP-042`).
- The `.gs` results (Passed / Failed) come from manual exploration. The Playwright tests have not been run.

## .env variables
`BASE_URL`, `TEST_EMAIL`, `TEST_PASSWORD`, `TEST_MOBILE` (registration data), `TEST_EXISTING_EMAIL` (duplicate email test), `TEST_LOGIN_EMAIL` / `TEST_LOGIN_PASSWORD` (existing account for the Portal Gateway), `TEST_APPLICANT_ONLY_EMAIL` / `TEST_APPLICANT_ONLY_PASSWORD` (optional, role test), `ADMIN_STORAGE_STATE` (saved admin login for the Job Posts tests), `ALLOW_JOB_POST_WRITES` (set to `1` to create and delete a "PW TEST" post). See `.env.example`.
