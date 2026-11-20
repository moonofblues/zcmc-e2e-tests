/**
 * Fills the "Application Flow" tab of the "[QA 2026] Recruitment System" sheet with TC-APPLY-001 to 008, TC-APPPORTAL-001 to 007,
 * TC-APPADM-001 to 009 and TC-E2E-001 to 002.
 * Duplicate the "Test Cases" tab by hand first (a script cannot copy a tab that holds a Table), rename the copy exactly
 * "Application Flow", then run fillApplicationsFlowTab. Safe to run twice: an ID already on the tab is not added again.
 * Everything lives inside the one function, so it adds a single global name and cannot clash with the other scripts.
 * Results are what was seen by hand on the live site on 2026-11-20. The Playwright tests have not been run.
 * Playwright: tests/apply-job.spec.ts, applicant-applications.spec.ts, admin-applications.spec.ts, application-journey.spec.ts
 */
function fillApplicationsFlowTab() {
  const TAB = 'Application Flow';
  const FIRST_ROW = 10;                       // first data row (the template header row is row 9)
  const NOTES_COL = 29;                       // column AC
  const A = 'Playwright: apply-job.spec.ts';
  const P = 'Playwright: applicant-applications.spec.ts';
  const H = 'Playwright: admin-applications.spec.ts';
  const E = 'Playwright: application-journey.spec.ts. Creates a real application: run with RUN_APPLICATION_JOURNEY=1';
  const MOD = '. Needs ADMIN_STORAGE_STATE. The account is switched to the Applicant Portal module (user menu > Switch Module)';

  // [ID, Title, Description, Test steps, Expected results, Status, Actual results, Bug Status, Severity, Notes]
  const CASES = [
    // ----- Apply for a job -----
    ['TC-APPLY-001', 'View Details on a job card opens the job details page', 'Verify the public job details page',
      '1. Open https://recruitment.zcmc.online/jobs\n2. Click View Details on a job card',
      "The details page opens (address /job-details/<token>) with the title, an OPEN badge, employment type, salary grade, monthly salary, place of assignment, published date, submission deadline and a Back to Jobs button",
      'Passed', 'As expected (ATTORNEY I)', '', '', A + '. Read-only, no login needed'],
    ['TC-APPLY-002', 'Job details list the qualifications and the file requirements', 'Verify the requirements section',
      '1. Open a job details page\n2. Scroll to Job Qualifications and File Requirements',
      "Job Qualifications (Education, Experience, Training, Eligibility, Competencies, Skills) and File Requirements are shown with the warning 'Applications with incomplete documents will not be processed' and an Apply Now button",
      'Passed', "As expected. The file requirement was 'APPLICATION LETTER', format 'sad' (test data)", '', '', A + '. Read-only, no login needed'],
    ['TC-APPLY-003', 'Apply Now on the public job details page starts an application for a signed-in applicant', 'Verify applying from the main page, outside the portal',
      '1. Sign in and switch to the Applicant Portal module\n2. Open https://recruitment.zcmc.online/jobs\n3. Click View Details\n4. Click Apply Now',
      "Apply Now is enabled and opens the 'Confirm Application' dialog",
      'Blocked', 'Apply Now is greyed out and disabled on the public details page, for the Admin module and for the Applicant Portal module. No message explains why',
      'Open', 'Medium', A + '. Tried by hand 2026-11-20. Blocked until Apply Now works from the main page. Confirm with the team whether applying is meant to happen only inside the portal'],
    ['TC-APPLY-004', 'The portal Apply Now page lists the open vacancies', 'Verify the portal vacancy list',
      '1. Sign in and open the Applicant Portal\n2. Open Apply Now (/portal/apply-now)',
      "'Open Job Positions' with '1 Active Vacancy' and a table (Job Position, Submission Deadline, Monthly Salary, Assignment, Employment Type) with View and Apply Now on each row",
      'Passed', 'As expected (ATTORNEY I, Job Order, 2 vacancies, deadline Dec 8 2026, SG 16 Step 8, 42,694.00)', '', '', A + MOD],
    ['TC-APPLY-005', 'Apply Now asks for confirmation and Cancel creates no application', 'Verify the confirm dialog',
      '1. Open /portal/apply-now\n2. Click Apply Now on a job\n3. Click Cancel',
      "A 'Confirm Application' dialog says 'Are you sure you want to apply for this position? You will be directed to upload the required documents.' with Proceed to Application and Cancel. Cancel closes it and nothing is created",
      'Passed', 'As expected. Track Applications still showed 0 applications afterwards', '', '', A + MOD],
    ['TC-APPLY-006', 'Proceed to Application opens the document upload step', 'Verify the step after the confirm dialog',
      '1. Open /portal/apply-now\n2. Click Apply Now on a job\n3. Click Proceed to Application',
      'The page for uploading the required documents opens',
      'Blocked', "The browser went to /portal/application?record=... and showed '404 Resource Not Found'. No application was created (Track Applications still showed 0)",
      'Open', 'High', A + MOD + '. Tried by hand 2026-11-20 with the ATTORNEY I test post (odd test data). Re-test with a properly configured job before reporting'],
    ['TC-APPLY-007', 'A required document can be uploaded and the application submitted', 'Verify the final submit',
      '1. Reach the upload step\n2. Upload the Application Letter (PDF)\n3. Submit',
      'A success message appears and the application is saved',
      'Blocked', 'Not reachable: blocked by TC-APPLY-006', '', '', A + '. Creates a real application. Selectors for the upload step are unknown until TC-APPLY-006 works'],
    ['TC-APPLY-008', 'No raw script text is shown on the Apply Now page', 'Verify the page is clean',
      '1. Open /portal/apply-now\n2. Scroll below the table',
      'Only the page content is shown',
      'Failed', "JavaScript source text (\"... response = await fetch(fileUrl, { credentials: 'same-origin' }) ...\") is displayed under the table",
      'Open', 'Low', A + MOD + '. Same kind of defect as TC-JP-044. The Playwright test uses test.fail until it is fixed'],

    // ----- Applicant portal -----
    ['TC-APPPORTAL-001', 'The sidebar lists Apply Now, Track Applications, My Files and Account Settings', 'Verify the portal navigation',
      '1. Open the Applicant Portal\n2. Expand the sidebar',
      'The four links are listed and lead to /portal/apply-now, /portal/track-applications, /portal/my-files and /portal/account-settings',
      'Passed', 'As expected', '', '', P + MOD],
    ['TC-APPPORTAL-002', 'Track Applications shows the status dashboard and its four counters', 'Verify the tracking page',
      '1. Open /portal/track-applications',
      "'Track Your Job Applications' with Total Applications, Under Screening / Review, Scheduled Interviews, Qualified / Hired and a Track Application Table",
      'Passed', 'As expected', '', '', P + MOD],
    ['TC-APPPORTAL-003', 'An account with no applications sees the empty state', 'Verify the empty state',
      '1. Open /portal/track-applications with an account that has no applications',
      "'No Application History Found - You have not submitted any applications yet' and a Browse Open Positions button",
      'Passed', 'As expected (all four counters 0)', '', '', P + MOD],
    ['TC-APPPORTAL-004', 'Browse Open Positions leads to the Apply Now page', 'Verify the link',
      '1. Open /portal/track-applications\n2. Click Browse Open Positions', 'The Apply Now page opens (/portal/apply-now)',
      'Not run', '', '', '', P + MOD],
    ['TC-APPPORTAL-005', 'Track Applications has a search box and page sizes 5, 10, 25 and 50', 'Verify the table controls',
      '1. Open /portal/track-applications with at least one application', 'A search box and a page size dropdown with 5, 10, 25 and 50 are shown',
      'Not run', '', '', '', P + MOD + '. The page size control is only seen when there are rows'],
    ['TC-APPPORTAL-006', 'My Files opens', 'Verify My Files', '1. Open /portal/my-files', 'The page opens',
      'Not run', '', '', '', P + MOD + '. Content not inspected yet'],
    ['TC-APPPORTAL-007', 'Account Settings opens', 'Verify Account Settings', '1. Open /portal/account-settings', 'The page opens',
      'Not run', '', '', '', P + MOD + '. Content not inspected yet'],

    // ----- HR admin: Applications -----
    ['TC-APPADM-001', 'The Applications list opens with title and heading', 'Verify the HR applications list',
      '1. Sign in to the Admin Dashboard\n2. Open Applications (/admin/applications)',
      "The title is 'Applications - ZCMC Recruitment Portal' and the heading 'Applications' with the breadcrumb Applications > List",
      'Passed', 'As expected', '', '', H],
    ['TC-APPADM-002', 'The seven status tabs are shown with counts', 'Verify the status tabs',
      '1. Open /admin/applications', 'All Applications, Screening & Shortlist, Interview & Evaluation, Hired, Onboarded, Not Selected and Not Qualified, each with a count',
      'Passed', 'As expected (counts on 2026-11-20: 4, 4, 0, 3, 0, 0, 2)', '', '', H],
    ['TC-APPADM-003', 'Review Auto-Rejections and Generate Reports buttons are available', 'Verify the header buttons',
      '1. Open /admin/applications', 'Both buttons are shown', 'Passed', 'As expected. Neither was clicked', '', '', H],
    ['TC-APPADM-004', 'The table shows the expected columns', 'Verify the columns',
      '1. Open /admin/applications', 'Applicant Details, Demographics, Addresses, Contact Info, Position Applied, Status, Attached Exam(s) and Date Applied',
      'Passed', 'As expected', '', '', H],
    ['TC-APPADM-005', 'Each applicant row carries an application number like #APP-00024', 'Verify the application numbers',
      '1. Open /admin/applications', 'Every row shows #APP- followed by five digits', 'Passed', 'As expected (for example #APP-00024)', '', '', H],
    ['TC-APPADM-006', 'Search with a value that matches nothing shows no rows', 'Verify the search',
      "1. Open /admin/applications\n2. Type 'zzzz-no-such-applicant-zzzz' in Search", 'No application rows are shown',
      'Not run', '', '', '', H + '. Empty-state wording to confirm'],
    ['TC-APPADM-007', 'Page size offers 5, 10, 25 and 50', 'Verify the page size',
      '1. Open /admin/applications', 'The Per page dropdown offers 5, 10, 25 and 50', 'Passed', 'As expected', '', '', H],
    ['TC-APPADM-008', 'Filter and column manager buttons are available', 'Verify the toolbar',
      '1. Open /admin/applications', 'A filter button (with a count badge) and a column manager button are shown',
      'Not run', '', '', '', H + '. The two icon buttons had no visible label'],
    ['TC-APPADM-009', 'Switch Module offers Admin Dashboard, Applicant Portal and HR-MPSB Panel', 'Verify the module switcher',
      '1. Open the user menu\n2. Click Switch Module\n3. Open the Available Modules dropdown', 'The three modules are listed',
      'Passed', 'As expected. One login covers the applicant and the HR side', '', '', H],

    // ----- Full journey -----
    ['TC-E2E-001', 'Apply from the portal, see it in the applicant portal, see it saved in HR admin', 'Verify the whole process end to end',
      "1. Note the Total Applications on Track Applications\n2. Open Apply Now, click Apply Now on the job, Proceed to Application\n3. Upload the Application Letter and submit\n4. Open Track Applications\n5. Switch to the Admin Dashboard, open Applications and search for the account",
      'The applicant portal total goes up by one and lists the job. HR admin lists the same application with an #APP number, the job and a first status',
      'Blocked', 'Blocked by TC-APPLY-006 (404 after Proceed to Application)', '', '', E],
    ['TC-E2E-002', 'Apply from the main page, see it in the applicant portal, see it saved in HR admin', 'Verify the whole process starting outside the portal',
      '1. Note the Total Applications on Track Applications\n2. Open /jobs, View Details, Apply Now\n3. Proceed, upload the Application Letter and submit\n4. Check Track Applications\n5. Check HR admin Applications',
      'Same as TC-E2E-001',
      'Blocked', 'Blocked by TC-APPLY-003 (Apply Now is disabled on the public page) and TC-APPLY-006', '', '', E],
  ];

  // ---------------------------------------------------------------------------------------------------------
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(TAB);
  if (!sh) { SpreadsheetApp.getUi().alert('NOT DONE: the tab "' + TAB + '" was not found. Duplicate the Test Cases tab by hand and rename the copy exactly "' + TAB + '".'); return; }

  const lastSheetRow = Math.max(sh.getLastRow(), FIRST_ROW);
  const ids = sh.getRange(FIRST_ROW, 1, lastSheetRow - FIRST_ROW + 1, 1).getValues().map(function (r) { return String(r[0]).trim(); });
  const present = {};
  let lastUsed = FIRST_ROW - 1;
  ids.forEach(function (id, i) { if (id !== '') { present[id] = true; lastUsed = FIRST_ROW + i; } });

  const problems = [];
  // One cell at a time so a value rejected by a dropdown (for example Blocked) is reported, not fatal.
  function setCell(row, col, value, label) {
    try { sh.getRange(row, col).setValue(value); }
    catch (e) { problems.push(label + ' row ' + row + ' ("' + value + '"): ' + e.message); }
  }

  const toAdd = CASES.filter(function (c) { return !present[c[0]]; });
  let msg;
  if (toAdd.length === 0) {
    msg = TAB + ': nothing to add, all IDs are already on the tab';
  } else {
    const start = lastUsed + 1;
    const n = toAdd.length;
    const last = start + n - 1;
    if (sh.getMaxRows() < last) sh.insertRowsAfter(sh.getMaxRows(), last - sh.getMaxRows());
    // Columns: A ID, B Title, C Description, D Pre-conditions (empty), E Steps, F Expected, G Status, H Actual,
    // I Bug Status, J Severity, AC Notes. No merging and no data validation: the tab is a Table with typed columns.
    sh.getRange(start, 1, n, 3).setValues(toAdd.map(function (c) { return [c[0], c[1], c[2]]; }));
    sh.getRange(start, 5, n, 2).setValues(toAdd.map(function (c) { return [c[3], c[4]]; }));
    sh.getRange(start, 8, n, 1).setValues(toAdd.map(function (c) { return [c[6]]; }));
    sh.getRange(start, NOTES_COL, n, 1).setValues(toAdd.map(function (c) { return [c[9]]; }));
    toAdd.forEach(function (c, i) {
      setCell(start + i, 7, c[5], 'Status');
      setCell(start + i, 9, c[7], 'Bug Status');
      setCell(start + i, 10, c[8], 'Severity');
    });
    sh.getRange(start, 1, n, 29).setWrap(true).setVerticalAlignment('top');
    msg = TAB + ': ' + n + ' test cases added (rows ' + start + ' to ' + last + ')';
  }

  SpreadsheetApp.flush();
  if (problems.length) msg += '\n\nThese values were rejected by the sheet and left empty (check the dropdown choices, for example whether "Blocked" is an allowed Status):\n' + problems.slice(0, 15).join('\n');
  SpreadsheetApp.getUi().alert(msg);
}
