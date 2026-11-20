# TODO and handoff (written 2026-11-20, to continue on another PC)

Nothing from the new application-flow tests has been run yet. The cases and results below come from a hand walk-through of the live site on 2026-11-20.

## What was added in this session
| File | Contents |
|---|---|
| `tests/apply-job.spec.ts` | `TC-APPLY-001` to `008`: public job details, portal Apply Now page, confirm dialog, blocked upload step |
| `tests/applicant-applications.spec.ts` | `TC-APPPORTAL-001` to `007`: Track Applications, My Files, Account Settings |
| `tests/admin-applications.spec.ts` | `TC-APPADM-001` to `009`: HR Applications list (`/admin/applications`) |
| `tests/application-journey.spec.ts` | `TC-E2E-001` (start in the portal) and `TC-E2E-002` (start on the main page): apply, check applicant portal, check HR admin. Both `test.fixme` (Blocked) |
| `tests/helpers/application-flow.ts` | shared helpers: module switch, portal and admin entry, job card, counters |
| `tests/fixtures/dummy-application-letter.pdf` | dummy file for the upload step |
| `test-cases/fill-applications-tab.gs` | Apps Script, function `fillApplicationsFlowTab`, fills a tab named exactly `Application Flow` |

## Continue on another PC
1. `git clone -b recruitment-system https://github.com/moonofblues/zcmc-e2e-tests.git`, then `cd zcmc-e2e-tests`
2. `npm run setup` (npm install, Chromium, and the Claude Code skills restored from `skills-lock.json`)
3. Create `.env` from `.env.example` and save `admin-state.json` by hand (README, Admin login: the login has a Security Verification challenge)
4. Open the folder in Claude Code and start from "To do next" below. `CLAUDE.md` has the working rules.

## Blocked: needs a developer
1. **Apply Now is disabled on the public job details page** (`/jobs` > View Details). Seen for the Admin and the Applicant Portal module. No message. -> `TC-APPLY-003`, `TC-E2E-002`. Ask the team whether applying is meant to happen only inside the portal.
2. **Proceed to Application returns 404** (`/portal/application?record=...`) after Apply Now in `/portal/apply-now`. The upload step cannot be reached. -> `TC-APPLY-006`, `TC-APPLY-007`, `TC-E2E-001`. The only job posted (ATTORNEY I) is test data, so **re-test with a properly configured job before reporting**.
3. Raw JavaScript text is shown under the table on `/portal/apply-now` (`TC-APPLY-008`, Low).

## To do next (in order)
1. Sheet: duplicate the `Test Cases` tab by hand, rename the copy `Application Flow`, then run `fillApplicationsFlowTab`. If the sheet rejects `Blocked` as a Status, the script lists it: add `Blocked` to the dropdown and set the 4 cases (`TC-APPLY-003`, `006`, `007`, `TC-E2E-001`, `002`) by hand.
2. First run of the read-only tests, with `ADMIN_STORAGE_STATE` set (see README, Admin login). Expect small selector fixes. Spots marked `TODO` in the specs, mainly `switchModule` in `tests/helpers/application-flow.ts` (dropdown and option selectors were never run).
3. Confirm whether opening a `/portal/...` or `/admin/...` URL directly works when the other module is active (`enterModule` switches module when it does not).
4. Not inspected yet: `/portal/my-files`, `/portal/account-settings`, the HR row Actions menu and application view page, the HR-MPSB panel, the filter and column manager buttons. `TC-APPPORTAL-004` to `007`, `TC-APPADM-006` and `008` are `Not run`.
5. When the apply flow is fixed:
   - Look at the upload page and fill in the `TODO` selectors in `uploadAndSubmit` (file input, Submit button, success message).
   - Remove `test.fixme` from `TC-APPLY-003`, `006`, `007` and `TC-E2E-001`, `002`.
   - Remove `test.fail` from `TC-APPLY-008` once the raw script text is gone.
   - Update the matching rows in the sheet.
6. Journey data: it currently uses the posted job (`E2E_JOB_TITLE`, default `ATTORNEY I`). Better, as recommended: create a "PW TEST" job post as an admin step (writes group, `ALLOW_JOB_POST_WRITES=1`, as in `TC-JP-055` to `069`), apply to it, then delete it. Do this once the apply flow works. The post is visible to real applicants while published.
7. Cleanup of the test application: HR admin has no obvious delete for applications. Ask the team how test applications are removed (the journey adds a `cleanup` annotation until then).
8. Add the `E2E_APPLICANT_EMAIL` (email of the signed-in account) to `.env` before the journey.

## Things to remember
- Live system, `workers: 1`. The saved login is a **server-side module session**: never open the applicant side and the admin side in two browser contexts with the same saved login at once. Use one page and switch module.
- The login page has a Security Verification challenge: never solve it by script. Save the login by hand (README, Admin login). Sessions expire: re-save `admin-state.json`.
- The HR Applications list shows real applicants' personal data. The tests never read or print names, emails or phone numbers.
- README "Known gaps" said "No jobs are posted". That is out of date: ATTORNEY I is posted (deadline Dec 8 2026).
- Other open items from before this session: see README "Known gaps" (registration `/verify` defect, Job Posts defects and cases not tried yet).
- Never commit `.env`, `admin-state.json` or `.auth/` (already in `.gitignore` except `.auth/`).
