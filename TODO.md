# TODO and handoff (updated 2026-11-23, to continue on another PC)

Nothing from the application-flow tests has been run yet. The cases and results below come from hand walk-throughs of the live site on 2026-11-20 and 2026-11-23. The current goal is to write the test cases and scripts for the whole system first, then run the tests.

## What was added
| File | Contents |
|---|---|
| `tests/apply-job.spec.ts` | `TC-APPLY-001` to `008`: public job details, portal Apply Now page, confirm dialog, blocked upload step |
| `tests/applicant-applications.spec.ts` | `TC-APPPORTAL-001` to `010`: top menu, Track Applications, My Files, Account Settings, raw script text, user menu |
| `tests/admin-applications.spec.ts` | `TC-APPADM-001` to `062` (023 and 062 are documented only): HR Applications list (`/admin/applications`), status tabs, search, filters, sort, column manager, bulk actions, row actions (modals opened and closed, never confirmed), View page, View Documents, Exam Result, Generate Report page, Action Logs |
| `tests/hr-mpsb.spec.ts` | `TC-MPSB-001` to `003`: HR-MPSB Panel (`/hRMPSBportal/applicant-info`) |
| `tests/application-journey.spec.ts` | `TC-E2E-001` (start in the portal) and `TC-E2E-002` (start on the main page): apply, check applicant portal, check HR admin. Both `test.fixme` (Blocked) |
| `tests/helpers/application-flow.ts` | shared helpers: module switch (waits for the new module), portal, admin and HR-MPSB entry, job card, counters |
| `tests/fixtures/dummy-application-letter.pdf` | dummy file for the upload step |
| `test-cases/Applicant Portal.csv`, `HR Applications.csv`, `HR-MPSB Panel.csv` | the cases for three new sheet tabs (11 columns, see "Sheet tabs" below) |
| `test-cases/fill-applications-tab.gs` | the first Apps Script, already run once for the `Application Flow` tab. New cases use CSVs instead of scripts |

## Sheet tabs (split by role, decided 2026-11-23)
- `Application Flow`: `TC-APPLY-*` and `TC-E2E-*` only (the process).
- `Applicant Portal`: `TC-APPPORTAL-001` to `010`. `HR Applications`: `TC-APPADM-001` to `062` (the CSV has all 62 rows). `HR-MPSB Panel`: `TC-MPSB-001` to `003`.
- Status of the sheet work: the three CSVs are written but **not pasted yet**. The 16 old `TC-APPPORTAL-001` to `007` and `TC-APPADM-001` to `009` rows must still be deleted by hand from the `Application Flow` tab.
- How to paste a CSV: duplicate the `Test Cases` tab by hand, rename the copy, clear sample rows from row 10. Copy CSV columns A to J (ID through Severity, no header) into column A at row 10. Copy CSV column K (Notes) into column AC at row 10. The CSV has the Pre-conditions column after Description, like the sheet.

## Continue on another PC
1. `git clone -b recruitment-system https://github.com/moonofblues/zcmc-e2e-tests.git`, then `cd zcmc-e2e-tests`
2. `npm run setup` (npm install, Chromium, and the Claude Code skills restored from `skills-lock.json`)
3. Create `.env` from `.env.example` and save `admin-state.json` by hand (README, Admin login: the login has a Security Verification challenge)
4. Open the folder in Claude Code and start from "To do next" below. `CLAUDE.md` has the working rules.

## Blocked: needs a developer
1. **Apply Now is disabled on the public job details page** (`/jobs` > View Details). Seen for the Admin and the Applicant Portal module. No message. -> `TC-APPLY-003`, `TC-E2E-002`. Ask the team whether applying is meant to happen only inside the portal.
2. **Proceed to Application returns 404** (`/portal/application?record=...`) after Apply Now in `/portal/apply-now`. The upload step cannot be reached. -> `TC-APPLY-006`, `TC-APPLY-007`, `TC-E2E-001`. The only job posted (ATTORNEY I) is test data, so **re-test with a properly configured job before reporting**.
3. **Raw JavaScript text is shown under the page content on `/portal/apply-now`, `/portal/my-files`, `/portal/account-settings` and the admin `/admin/applications`** (`TC-APPLY-008`, `TC-APPPORTAL-008`, `TC-APPPORTAL-009`, `TC-APPADM-060`, Low). It looks like a page-wide problem in the layout. The text comes from the file preview script (`newWin.document ...`) and a small "404" box shows under it.
3b. Other defects found 2026-11-23 (all Low, Open): View Documents shows a raw number for Graduated and 75.200000000000003 for a rating (`TC-APPADM-040`); row action modals take 5 to 8 seconds to appear with nothing shown meanwhile (`TC-APPADM-062`, the 3 second target is an assumption); the "N records selected" bar stays when another status tab is opened (`TC-APPADM-029`, confirm it is not intended).
4. **Ask the team:** the HR-MPSB Panel shows "No published job posts" although ATTORNEY I is published on the public site (`TC-MPSB-003`). Does the panel list only postings with applications or interviews?

## To do next (in order)
Write all test cases and scripts first. The first Playwright run comes after that, when the user says so.
1. **Sheet:** paste the three new CSVs into their tabs and delete the 16 old rows from `Application Flow` (see "Sheet tabs"). If the sheet rejects `Blocked` as a Status in `Application Flow`, add `Blocked` to the dropdown and set the 5 cases (`TC-APPLY-003`, `006`, `007`, `TC-E2E-001`, `002`) by hand.
2. **Skipped or not inspected yet (pick up here on another PC):** see "Pickup list" below. `TC-APPPORTAL-004`, `005` and `TC-APPADM-006` are still `Not run`.
   - `HR Applications.csv` now has 62 rows (`TC-APPADM-001` to `062`). If the tab already holds `001` to `014`, paste only rows `015` to `062` below them.
3. **Cases for the rest of the system:** continue writing cases and CSVs for the parts of the system not covered yet. Follow the coverage rule in `CLAUDE.md` (inventory first, then cases). Recommended module order:
   1. Calendar Schedules (Set for interview feeds it)
   2. Exam Management, then Examinee Management (Attach Exam Types feeds them)
   3. Email Templates and Sms Templates (Send Email and Send SMS feed them; the SMS template list was empty)
   4. Users, HRMPSB and Administrators (Account Management)
   5. Dashboard, Action Logs filters and paging, and Settings
   6. Applicant side extras: the bell, the Examinations popup, Security & Account Settings
4. **First run of the read-only tests** (only when the user says so), with `ADMIN_STORAGE_STATE` set (README, Admin login). Expect small selector fixes. Spots marked `TODO` in the specs: `switchModule` in `tests/helpers/application-flow.ts` (dropdown and option selectors were never run) and the accessible names of the filter and column icon buttons.
5. When the apply flow is fixed:
   - Look at the upload page and fill in the `TODO` selectors in `uploadAndSubmit` (file input, Submit button, success message).
   - Remove `test.fixme` from `TC-APPLY-003`, `006`, `007` and `TC-E2E-001`, `002`.
   - Remove `test.fail` from `TC-APPLY-008`, `TC-APPPORTAL-008` and `009` once the raw script text is gone.
   - Update the matching rows in the sheet.
6. Journey data: it currently uses the posted job (`E2E_JOB_TITLE`, default `ATTORNEY I`). Better, as recommended: create a "PW TEST" job post as an admin step (writes group, `ALLOW_JOB_POST_WRITES=1`, as in `TC-JP-055` to `069`), apply to it, then delete it. Do this once the apply flow works. The post is visible to real applicants while published.
7. Cleanup of the test application: HR admin has no obvious delete for applications. Ask the team how test applications are removed (the journey adds a `cleanup` annotation until then).
8. Add the `E2E_APPLICANT_EMAIL` (email of the signed-in account) to `.env` before the journey.

## Done on 2026-11-23
- Direct `/admin/...` URLs do not work while the Applicant Portal module is active: the site redirects to `/portal/apply-now`. The helper switches module first.
- The module switch takes several seconds. The helper now waits for the new module's page (`/admin/`, `/portal/` or `/hRMPSBportal/`).
- Inspected by hand: My Files, Account Settings, the HR filters dialog, column manager (nine columns, Updated at off by default), row Actions menu (nine items), application View page (seven tabs), admin user menu and HR-MPSB Panel.
- The applicant portal has a top menu bar, not a sidebar (`TC-APPPORTAL-001` fixed).

## Pickup list: Applications module (written 2026-11-23)
Method used: every control was opened by hand in Chrome, filled in where safe, then closed with Cancel or Escape. **Nothing was confirmed or submitted.** Modals can take 5 to 8 seconds to appear: wait before deciding a click did nothing, and do not click twice.

**Skipped on purpose (needs a test application of ours, because Confirm changes data or sends a real message):**
- The result of every Confirm / Submit / Send: Change status, Mark as Hired (Confirm Hire), Mark not qualified (all reasons), Attach Exam Types (Submit / Save Exam Attachment), Set for interview, Set for initial screening, Send SMS (Send Message), Acknowledgement Email, Letter of Regret, Custom Message, Review Auto-Rejections (Submit), and each Generate link on `/admin/generate-report`.
- Empty-field validation inside the modals (needs pressing Submit / Confirm).
- Do these once the apply flow works and a "PW TEST" application exists (item 6 above).

**Opened row modals not checked one by one (assumed to follow the same pattern):** Mark not qualified reasons Training, Experience, Eligibility and Incomplete file uploads; the same bulk reasons and bulk email message types (only the menus were seen); the last statuses of the Change status list (at least 16 exist).

**Not inspected yet:**
- The application View page: its header icon buttons, the content of each tab (Education, Experiences, Trainings, Eligibilities, Vol. Work, Char. References), View File and Download.
- The Applicant Details and Date Applied sort buttons; whether Apply columns really adds Updated at to the table; the per-page selector effect; paging with more than 10 rows.
- The "Manage Room & Controls" link in Exam Result; what each of the five reports asks for; the result list of Review Auto-Rejections; Action Logs filters and paging.
- The Not Qualified tab's locked row (why it has no checkbox or menu).
- Other sidebar modules, none inspected: Dashboard, Calendar Schedules, Exam Management, Examinee Management, Users, HRMPSB, Administrators, Email Templates, Sms Templates (the SMS template list was empty), and Settings.
- Applicant side: the bell, the Examinations popup, Security & Account Settings.

**Questions for the team:** is the search meant to match name and email only? Why is the HR-MPSB Panel empty (`TC-MPSB-003`)? Should the selection survive a tab change (`TC-APPADM-029`)? Is 5 to 8 seconds to open a modal expected (`TC-APPADM-062`)?

## Things to remember
- Live system, `workers: 1`. The saved login is a **server-side module session**: never open the applicant side and the admin side in two browser contexts with the same saved login at once. Use one page and switch module.
- The login page has a Security Verification challenge: never solve it by script. Save the login by hand (README, Admin login). Sessions expire: re-save `admin-state.json`.
- The HR Applications list and the View page show real applicants' personal data. The tests never read or print names, emails or phone numbers. Never click Send SMS, Send Email Notification, Mark not qualified, Attach Exam Types, Set for interview, Mark as Hired, Change status or Generate RDR: they send a message or change a real application.
- README "Known gaps" said "No jobs are posted". That is out of date: ATTORNEY I is posted (deadline Dec 8 2026).
- Other open items from before: see README "Known gaps" (registration `/verify` defect, Job Posts defects and cases not tried yet).
- Never commit `.env`, `admin-state.json` or `.auth/` (already in `.gitignore` except `.auth/`).
