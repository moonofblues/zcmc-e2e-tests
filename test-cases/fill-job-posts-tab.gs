/**
 * Fills the "Job Posts" tab (Admin / Staff Portal > Job Posts) of the "[QA 2026] Recruitment System" sheet.
 * Same method as create-test-case-tabs.gs. A script cannot copy the "Test Cases" tab because it contains a Table, so:
 *   1. Right-click the "Test Cases" tab > Duplicate.
 *   2. Rename the copy exactly: Job Posts
 *   3. Extensions > Apps Script, paste this file, choose fillJobPostsTab and click Run. Approve the prompt.
 * A tab whose row 10 already has data is skipped, never overwritten.
 * The whole script lives inside the one function fillJobPostsTab, so this file adds a single global name and cannot clash
 * with create-test-case-tabs.gs or the dashboard script (all files in an Apps Script project share one scope).
 * Results (Passed / Failed) are what was seen on the live site on 2026-11-20 while exploring by hand. Not run = not tried yet.
 * Playwright: tests/admin-job-posts.spec.ts
 */
function fillJobPostsTab() {
const JP_CREATED_BY = 'Quin Ledesma';
const JP_TEST_SUITE = 'Recruitment Portal (Admin)';
const JP_TAB_NAME = 'Job Posts';
const JP_FIRST_DATA_ROW = 10; // the template header row is row 9

const JP_PREREQ = 'Internet access to https://recruitment.zcmc.online/. An account with Admin / Staff access, signed in through the Portal Gateway (Admin / Staff Portal). The login shows a Security Verification challenge that a person must complete. Use only "PW TEST" data on this live system and delete what you create.';
const JP_SPEC = 'Playwright: admin-job-posts.spec.ts';

// Each case: [ID, Title, Description, Test steps, Expected results, Status, Actual results, Bug Status, Severity, Notes]
function jpCase(id, title, desc, steps, expected, status, actual, bug, sev, notes) {
  return [id, title, desc, steps, expected, status, actual || '', bug || '', sev || '', notes || JP_SPEC];
}
const JP_LIST_URL = 'https://recruitment.zcmc.online/admin/job-posts';
const JP_CREATE_URL = 'https://recruitment.zcmc.online/admin/job-posts/create';

const JP_CASES = [
  // ---------------- List page ----------------
  jpCase('TC-JP-001', 'Job Posts list opens with title, heading and breadcrumb', 'Verify the Job Posts list page loads',
    '1. Sign in and open the Admin / Staff Portal\n2. Click Job Posts in the sidebar',
    "The page opens at " + JP_LIST_URL + ". The browser tab title is 'Job Posts - ZCMC Recruitment Portal', the breadcrumb reads Job Posts > List, the heading is 'Job Posts' and a 'New job posts' button is shown",
    'Passed', 'As expected'),
  jpCase('TC-JP-002', 'The four status tabs are shown with counts', 'Verify the status tabs',
    '1. Open the Job Posts list\n2. Look at the tabs above the table',
    "The tabs All Job Posts, Published, Unpublished and Filing Closed are shown, each with a count",
    'Passed', 'As expected. On 2026-11-20: All 16, Published 0, Unpublished 0, Filing Closed 16 before testing'),
  jpCase('TC-JP-003', 'The table shows the expected columns', 'Verify the list columns',
    '1. Open the Job Posts list\n2. Read the column headings',
    "The columns are Job Position, Place of Assignment, Status, Published Date, Closing Date, No Of Vacancy, Employment Type and Created at",
    'Passed', 'As expected'),
  jpCase('TC-JP-004', 'A closed post shows the Filing Closed status', 'Verify the status badge of a closed post',
    '1. Open the Filing Closed tab',
    "Each post shows a 'Filing Closed' badge with its published date and a closing date in the past",
    'Passed', 'As expected'),
  jpCase('TC-JP-005', 'Search narrows the list', 'Verify the search box filters posts',
    "1. Open the Job Posts list\n2. Type 'NURSE' in Search",
    "Only posts whose details match 'NURSE' are listed",
    'Not run', '', '', '', JP_SPEC + '. Not tried yet'),
  jpCase('TC-JP-006', 'Filter button opens the filter panel', 'Verify the table filter',
    '1. Open the Job Posts list\n2. Click the Filter button',
    'A filter panel opens and applying a filter changes the list',
    'Not run', '', '', '', JP_SPEC + '. Not tried yet. Update the expected result after seeing the filter fields'),
  jpCase('TC-JP-007', 'Column manager button is available', 'Verify columns can be shown or hidden',
    '1. Open the Job Posts list\n2. Click the Column manager button\n3. Hide a column',
    'The chosen column is hidden from the table',
    'Not run', '', '', '', JP_SPEC + '. Not tried yet'),
  jpCase('TC-JP-008', 'Page size offers 5, 10, 25 and 50', 'Verify the per-page choices',
    '1. Open the Job Posts list\n2. Open the Per page dropdown',
    'The choices 5, 10, 25 and 50 are listed; the default is 10',
    'Passed', 'Choices present and default 10. Changing the value was not tried'),
  jpCase('TC-JP-009', 'Pagination shows the result range and Next', 'Verify paging',
    '1. Open the Job Posts list with more posts than the page size',
    "The text 'Showing 1 to 10 of N results' and page links with Next are shown",
    'Passed', 'As expected (Showing 1 to 10 of 16 results, pages 1 and 2)'),
  jpCase('TC-JP-010', 'Clicking a row opens that post', 'Verify a row opens its details',
    '1. Open the Job Posts list\n2. Click a post row',
    'The post opens at /admin/job-posts/{id}',
    'Not run', '', '', '', JP_SPEC + '. Not tried yet. Row links point to /admin/job-posts/{id}'),
  jpCase('TC-JP-011', "'New job posts' opens the create form", 'Verify the create button',
    "1. Open the Job Posts list\n2. Click 'New job posts'",
    'The Create Job Posts form opens at ' + JP_CREATE_URL,
    'Passed', 'As expected'),
  jpCase('TC-JP-012', 'Row actions menu lists View and Edit (no Delete)', 'Verify the row actions',
    '1. Open the Unpublished tab\n2. Click the three-dot Actions button on a row',
    'The menu offers View, Edit and Publish. There is no Delete option',
    'Passed', 'Menu shows View, Edit and Publish. No Delete. Posts can only be deleted through Bulk actions',
    '', '', JP_SPEC + '. Published posts were not checked (expect Unpublish instead of Publish)'),
  jpCase('TC-JP-013', 'Ticking a row enables the bulk actions menu', 'Verify bulk actions',
    '1. Open the Unpublished tab\n2. Tick a row\n3. Click Bulk actions',
    "The menu offers 'Delete selected', 'Publish selected' and 'Unpublish selected'",
    'Passed', 'As expected'),
  jpCase('TC-JP-014', 'Ticking a row shows the selected count with Select all / Deselect all', 'Verify row selection',
    '1. Open the Unpublished tab\n2. Tick one row',
    "The text '1 record selected' appears with 'Select all N' and 'Deselect all' links",
    'Passed', 'As expected. After a delete the selected count can stay stale (it said 3 records selected when 2 rows were left)'),
  jpCase('TC-JP-015', 'Tab choice is kept in the address', 'Verify the tab is in the URL',
    '1. Open the Job Posts list\n2. Click the Unpublished tab',
    'The address ends with ?tab=unpublished and opening that address shows the Unpublished tab',
    'Passed', 'As expected (?tab=unpublished and ?tab=published)'),

  // ---------------- Create form ----------------
  jpCase('TC-JP-016', 'Create page opens with Back, Create and Create & Create Another', 'Verify the create page',
    "1. Open the Job Posts list\n2. Click 'New job posts'",
    "The browser tab title is 'Create Job Posts - ZCMC Recruitment Portal'. The buttons Back, Create and 'Create & Create Another' are shown",
    'Passed', 'As expected'),
  jpCase('TC-JP-017', 'All form fields and sections are shown', 'Verify the form content',
    '1. Open the create form\n2. Scroll through the whole form',
    "Fields: Job Title*, Publication Date, Closing Date Time, Max Applicants (Optional), Salary Grade*, Salary Step*, Monthly Salary*, Description. Sections: Plantilla, Add Job Order (Place of Assignment), Job Qualifications (reference validation, Educational Background, Experiences, Trainings, Eligibility, Competencies, Skills) and File Upload (File requirements)",
    'Passed', 'As expected'),
  jpCase('TC-JP-018', 'Submitting an empty form shows the required messages', 'Verify required-field validation',
    '1. Open the create form\n2. Click Create without entering anything',
    "The form is not saved. Messages appear: 'The job Title field is required.', 'The salary Grade field is required.', 'The salary Step field is required.', 'The monthly Salary field is required.'. The page stays on /admin/job-posts/create",
    'Passed', 'As expected. Also showed the file type and file name required messages (see TC-JP-036)'),
  jpCase('TC-JP-019', 'Job Title is a searchable list', 'Verify the job title dropdown',
    "1. Open the create form\n2. Click Job Title\n3. Type 'NURSE II'",
    "The list opens in alphabetical order (ACCOUNTANT I, ACCOUNTANT II ...). The search returns NURSE II and NURSE III",
    'Passed', 'As expected. The search matches part of the name (NURSE II also returns NURSE III)'),
  jpCase('TC-JP-020', 'Salary Grade is a searchable list starting at SG 1', 'Verify the salary grade dropdown',
    "1. Open the create form\n2. Click Salary Grade\n3. Type '15'",
    "The list starts at SG 1, SG 2, SG 3 ... and the search shows SG 15",
    'Passed', 'As expected'),
  jpCase('TC-JP-021', 'Choosing a grade fills Step 1 and the monthly salary', 'Verify the auto-fill after choosing a grade',
    '1. Open the create form\n2. Choose Salary Grade SG 15',
    'Salary Step is set to Step 1 and Monthly Salary is filled in automatically',
    'Passed', 'SG 15 filled Step 1 and a Monthly Salary of 38413'),
  jpCase('TC-JP-022', 'Changing the step changes the monthly salary correctly', 'Verify the salary follows the step',
    '1. Choose Salary Grade SG 15 (Step 1)\n2. Change Salary Step to Step 2',
    'Monthly Salary changes to the Step 2 amount, which is not lower than the Step 1 amount',
    'Failed', 'SG 15 Step 1 = 38413 and Step 2 = 36997. The higher step shows a LOWER salary',
    'Open', 'Medium', JP_SPEC + '. Confirm against the official salary schedule before reporting'),
  jpCase('TC-JP-023', 'Setting a publication date auto-fills the closing date', 'Verify the closing date rule',
    '1. Open the create form\n2. Set Publication Date to a date',
    "Closing Date Time is filled in automatically (11:59:59 PM) with the hint '10 weekdays applied', and Closing Date Time is now marked required",
    'Passed', 'Publication 11/21/2026 gave Closing 12/07/2026 11:59:59 PM with the hint',
    '', '', JP_SPEC + '. The publication date was dropped once when it was entered before the grade was chosen'),
  jpCase('TC-JP-024', 'Max Applicants is optional and takes a whole number', 'Verify the Max Applicants field',
    '1. Open the create form\n2. Type 5 in Max Applicants',
    'The value 5 is accepted. The field can also be left empty',
    'Passed', 'As expected'),
  jpCase('TC-JP-025', 'Max Applicants rejects a negative number', 'Verify the lower limit of Max Applicants',
    '1. Open the create form\n2. Type -3 in Max Applicants',
    'The value is rejected or corrected',
    'Failed', 'The value -3 stays in the field. Not checked whether the server accepts it on save',
    'Open', 'Medium', JP_SPEC + '. Edge case'),
  jpCase('TC-JP-026', 'Monthly Salary rejects a negative number', 'Verify the lower limit of Monthly Salary',
    '1. Open the create form\n2. Choose a grade so the salary is filled\n3. Replace the salary with -5',
    'The value is rejected or corrected',
    'Failed', 'The value -5 stays in the field. Not checked whether the server accepts it on save',
    'Open', 'Medium', JP_SPEC + '. Edge case. The salary is also editable by hand, which overrides the grade and step'),
  jpCase('TC-JP-027', 'Description is a rich text editor', 'Verify the Description toolbar',
    '1. Open the create form\n2. Look at the Description field',
    'A toolbar is shown with Bold, Italic, Underline, Strikethrough, subscript, superscript, H2, H3, three alignments, bullet list, numbered list, Undo and Redo',
    'Passed', 'Toolbar present and typing works. Each button was not tried one by one'),
  jpCase('TC-JP-028', 'Add Place of Assignment adds a row with a grouped list and vacancies', 'Verify the place of assignment row',
    "1. Open the create form\n2. Click 'Add Place of Assignment'\n3. Open the Place of Assignment list",
    "A row appears with Place of Assignment*, Number of Vacancies*, a drag handle and a delete icon. The list is grouped under Divisions (Office of Medical Center Chief, Medical Service, Hospital Operations & Patient Support Service, Nursing Service, Finance Service, Allied Health Professional Services, Test Divisions, Demo ...)",
    'Passed', 'As expected. The list is searchable'),
  jpCase('TC-JP-029', 'A Place of Assignment row can be removed', 'Verify the delete icon of a row',
    '1. Add a Place of Assignment row\n2. Click the red delete icon',
    'The row is removed',
    'Not run', '', '', '', JP_SPEC + '. Not tried yet'),
  jpCase('TC-JP-030', 'Plantilla list loads UMIS plantilla numbers', 'Verify the Plantilla dropdown',
    '1. Open the create form\n2. Click Select Plantilla Numbers',
    "'Loading...' is shown for a few seconds and then the plantilla numbers load (for example UMIS-NURSE-II-0006)",
    'Passed', 'As expected. The list takes about 3 seconds. The field is optional',
    '', '', JP_SPEC + '. Plantilla numbers come from UMIS'),
  jpCase('TC-JP-031', 'Reference validation modal lists education and civil service options', 'Verify the reference validation modal',
    "1. Open the create form\n2. Click 'Add reference validation'\n3. Open both dropdowns",
    "The modal 'Add reference validation' shows Educational Background Level (Elementary, Secondary, Vocational/Trade Course, College, Graduate Studies) and Civil Service Eligibility (Career Service Professional (Second Level), Career Service Sub-Professional (First Level), PRC Board Passer, Bar Exam Passer, PD 907 (Honor Graduate) ...). The note says applications without the preselected references are rejected automatically",
    'Passed', 'As expected. Both fields allow several selections. Each list takes a few seconds to load'),
  jpCase('TC-JP-032', 'Submitting a reference validation shows the pre-filled panel', 'Verify the reference validation result',
    '1. Open the reference validation modal\n2. Choose College and Career Service Professional (Second Level)\n3. Click Submit',
    "A 'Filters Applied' message appears and a green 'Pre-filled Reference Validation' panel shows the Educational Background and Eligibility",
    'Passed', 'As expected'),
  jpCase('TC-JP-033', 'Escape closes the reference validation modal without adding anything', 'Verify Escape on the modal',
    "1. Open the reference validation modal\n2. Press Escape",
    "The modal closes and the text 'No reference validation criteria currently set' stays",
    'Passed', 'The whole modal closes (Escape does not only close an open dropdown)'),
  jpCase('TC-JP-034', 'The six qualification editors accept text', 'Verify the qualification fields',
    '1. Open the create form\n2. Type in Educational Background, Experiences, Trainings, Eligibility, Competencies and Skills',
    'Each field is a rich text editor and keeps what is typed',
    'Passed', 'As expected'),
  jpCase('TC-JP-035', 'File type list offers four types', 'Verify the file requirement types',
    '1. Open the create form\n2. In File requirements, open Select file type',
    'The list shows Application Letter, Diploma, Personal Data Sheet and Work Experience Sheet',
    'Passed', 'As expected. The list order is not the same each time'),
  jpCase('TC-JP-036', 'A file requirement needs a file type and a file name format', 'Verify required validation of the file row',
    '1. Open the create form\n2. Click Create with the file requirement row empty',
    "The messages 'The file type field is required.' and 'The file name field is required.' appear",
    'Passed', 'As expected'),
  jpCase('TC-JP-037', 'Sample attachment states the accepted types and size', 'Verify the sample attachment area',
    '1. Open the create form\n2. Look under Sample Attachment\n3. Add a small PDF',
    "The text 'Accepted: PDF, JPG, PNG, DOC, DOCX | Max: 5MB' is shown and a PDF uploads ('Upload complete')",
    'Passed', 'A PDF uploaded fine. Other types and the size limit were not tried'),
  jpCase('TC-JP-038', 'An oversized or wrong-type sample attachment is rejected', 'Verify the file limits',
    '1. Add a file over 5 MB\n2. Add a .exe or .txt file',
    'Both files are rejected with a clear message',
    'Not run', '', '', '', JP_SPEC + '. Manual. Not tried yet'),
  jpCase('TC-JP-039', "'Add to file requirements' adds another row", 'Verify adding a second file requirement',
    "1. Click 'Add to file requirements'",
    'A second row with File Type, File Name Format and Sample Attachment appears',
    'Not run', '', '', '', JP_SPEC + '. Not tried yet'),
  jpCase('TC-JP-040', 'Back returns to the list without saving', 'Verify the Back button',
    '1. Open the create form\n2. Type something\n3. Click Back',
    'The list opens and nothing is saved',
    'Not run', '', '', '', JP_SPEC + '. Not tried yet. Check whether a warning about unsaved changes appears'),
  jpCase('TC-JP-041', 'A closing date before the publication date is rejected', 'Verify the date order rule',
    '1. Set a Publication Date\n2. Change Closing Date Time to an earlier date\n3. Click Create',
    'An error is shown on the closing date and nothing is saved',
    'Not run', '', '', '', JP_SPEC + '. Manual. Edge case, not tried yet'),
  jpCase('TC-JP-042', 'A past publication date is handled', 'Verify a publication date in the past',
    '1. Set Publication Date to a past date\n2. Complete the form and click Create',
    'Behavior to confirm: the post is rejected, or it is published at once',
    'Not run', '', '', '', JP_SPEC + '. Manual. Edge case, not tried yet'),
  jpCase('TC-JP-043', 'Required messages clear once the fields are filled', 'Verify validation messages update',
    '1. Click Create on an empty form\n2. Fill in Job Title, Salary Grade and Salary Step',
    "The red 'required' messages disappear as each field is filled",
    'Failed', 'The messages stayed on screen after the fields were filled (Job Title, Salary Grade, Salary Step and Monthly Salary). They cleared only after setting the publication date',
    'Open', 'Low', JP_SPEC),
  jpCase('TC-JP-044', 'No stray script text is shown at the bottom of the form', 'Verify the form page has no leaked code',
    '1. Open the create form\n2. Scroll to the bottom',
    'Only the form is shown',
    'Failed', "Raw JavaScript text ('const response = await fetch(fileUrl ...') is shown below the form once the page has loaded",
    'Open', 'Low', JP_SPEC),

  // ---------------- Save and delete ----------------
  jpCase('TC-JP-045', 'A valid post is created, shows a success message and lands under Unpublished', 'Verify the happy path of creating a post',
    "1. Open the create form\n2. Job Title NURSE II, Salary Grade SG 15 (Step 1 and salary fill in), Publication Date tomorrow (closing date fills in), Max Applicants 5\n3. Description and the six qualification fields: 'PW TEST ...'\n4. Add Place of Assignment: Test Divisions, 1 vacancy\n5. Add reference validation: College and Career Service Professional (Second Level)\n6. File requirement: Personal Data Sheet, format PDS_LastName_FirstName, a small PDF\n7. Click Create",
    "A 'Job Post Created' message says 'The job post has been created successfully.'. The list opens and the post appears under Unpublished with its publication date and closing date",
    'Passed', "As expected. The post showed as NURSE II, Test Divisions, Unpublished, Nov 21 2026 to Dec 7 2026 11:59 PM, 1 vacancy",
    '', '', JP_SPEC + '. Writes a real post: run with ALLOW_JOB_POST_WRITES=1 and delete it afterwards. Plantilla was left empty'),
  jpCase('TC-JP-046', 'A failed save leaves no partial post behind', 'Verify an error does not leave half-saved posts',
    '1. Click Create and get a server error\n2. Open the Unpublished tab',
    'No new post is created when the save fails',
    'Failed', "On 2026-11-20 Create returned HTTP 500 ('An error occurred. Please try again later.') and three NURSE II posts were left with no place of assignment and dates NOT SET",
    'Open', 'High', JP_SPEC + '. Manual. The developer fixed the Create button the same day; re-test that a failed save leaves nothing behind'),
  jpCase('TC-JP-047', 'Bulk delete removes the selected post', 'Verify deleting a post',
    "1. Open the Unpublished tab\n2. Tick a PW TEST post\n3. Bulk actions > Delete selected\n4. Click Delete",
    'The selected post is removed from the list and the counts go down',
    'Passed', 'The post was deleted. The list updates a few seconds after the click',
    '', '', JP_SPEC + '. Writes: run with ALLOW_JOB_POST_WRITES=1'),
  jpCase('TC-JP-048', 'Bulk delete does not show a false error', 'Verify the message after a delete',
    '1. Delete a post with Bulk actions > Delete selected\n2. Read the message',
    'A success message is shown and no error',
    'Failed', "A red 'An error occurred. Please try again later.' message appears every time (3 delete attempts), but the post is deleted. The dialog also stays open until it is closed",
    'Open', 'Medium', JP_SPEC + '. Writes: run with ALLOW_JOB_POST_WRITES=1'),
  jpCase('TC-JP-049', 'Delete asks for confirmation first', 'Verify the delete confirmation',
    '1. Tick a post\n2. Bulk actions > Delete selected',
    "A dialog 'Delete selected Job Posts' asks 'Are you sure you would like to do this?' with Cancel and Delete. Cancel keeps the post",
    'Passed', 'As expected. Cancel was used and the posts stayed',
    '', '', JP_SPEC + '. Covered inside TC-JP-047'),
  jpCase('TC-JP-050', 'A new post gets the intended employment type', 'Verify the Employment Type of a new post',
    '1. Create a post\n2. Read Employment Type in the list',
    'The employment type matches what the team expects',
    'Not run', "The form has no employment type field, but the new post shows 'Job Order' (older posts show Permanent Full-time or Temporary)", '', '', JP_SPEC + '. Manual. Confirm with the team whether Job Order is the intended default before logging a bug'),
  jpCase('TC-JP-051', 'Publish selected and Unpublish selected change the status', 'Verify publishing',
    '1. Tick an unpublished post\n2. Bulk actions > Publish selected\n3. Then Unpublish selected',
    'The post moves to Published and back to Unpublished',
    'Not run', '', '', '', JP_SPEC + '. Manual. Not tried yet. A published post is visible on the public site'),
  jpCase('TC-JP-052', 'Edit changes an existing post', 'Verify editing a post',
    '1. Open a PW TEST post\n2. Click Edit\n3. Change the vacancies and save',
    'The change is saved and shown in the list',
    'Not run', '', '', '', JP_SPEC + '. Manual. Not tried yet'),
  jpCase('TC-JP-053', 'View shows the full post details', 'Verify the post details page',
    '1. Click View on a post',
    'The full post is shown: title, dates, salary, description, qualifications and file requirements',
    'Not run', '', '', '', JP_SPEC + '. Manual. Not tried yet'),
  jpCase('TC-JP-054', 'A published post appears on the public /jobs page', 'Verify a published post is visible to applicants',
    '1. Publish a PW TEST post with a publication date of today or earlier\n2. Open https://recruitment.zcmc.online/jobs',
    'The post is listed and can be opened',
    'Not run', '', '', '', JP_SPEC + '. Manual. Not tried yet. Unpublish or delete the post afterwards')
];

// Writes one typed column. A value the dropdown rejects is logged instead of stopping the run.
function jpSafeSet(sh, col, values, label, problems) {
  for (var i = 0; i < values.length; i++) {
    try {
      sh.getRange(JP_FIRST_DATA_ROW + i, col).setValue(values[i]);
    } catch (e) {
      problems.push(label + ' row ' + (JP_FIRST_DATA_ROW + i) + ' ("' + values[i] + '"): ' + e.message);
    }
  }
}

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const today = new Date();
  const sh = ss.getSheetByName(JP_TAB_NAME);
  if (!sh) { SpreadsheetApp.getUi().alert('NOT FILLED: the tab "' + JP_TAB_NAME + '" was not found (duplicate "Test Cases" and rename the copy).'); return; }
  if (String(sh.getRange(JP_FIRST_DATA_ROW, 1).getValue()) !== '') { SpreadsheetApp.getUi().alert(JP_TAB_NAME + ': skipped, row ' + JP_FIRST_DATA_ROW + ' already has data'); return; }

  const problems = [];
  function step(name, fn) {
    try { fn(); } catch (e) { throw new Error(JP_TAB_NAME + ' / ' + name + ': ' + e.message); }
  }
  try {
    step('prerequisites', function () { sh.getRange('G1').setValue(JP_PREREQ); });
    step('test suite', function () { sh.getRange('B3').setValue(JP_TEST_SUITE); });
    step('module name', function () { sh.getRange('E3').setValue(JP_TAB_NAME); });
    step('created by', function () { sh.getRange('B4').setValue(JP_CREATED_BY); });
    step('created at', function () { sh.getRange('B5').setValue(today); });
    step('last updated by', function () { sh.getRange('B6').setValue(JP_CREATED_BY); });
    step('last updated at', function () { sh.getRange('B7').setValue(today); });
    step('executed at', function () { sh.getRange('D6').clearContent(); });
    step('executed by', function () { sh.getRange('E7').clearContent(); });

    // Columns: A ID, B Title, C Description, D Pre-conditions (empty), E Steps, F Expected, G Status, H Actual,
    // I Bug Status, J Severity, AC Notes. No merging and no data validation: the tab is a Table with typed columns.
    const n = JP_CASES.length;
    const last = JP_FIRST_DATA_ROW + n - 1;
    if (sh.getMaxRows() < last) sh.insertRowsAfter(sh.getMaxRows(), last - sh.getMaxRows());
    step('ID, title, description', function () {
      sh.getRange(JP_FIRST_DATA_ROW, 1, n, 3).setValues(JP_CASES.map(function (x) { return [x[0], x[1], x[2]]; }));
    });
    step('steps and expected results', function () {
      sh.getRange(JP_FIRST_DATA_ROW, 5, n, 2).setValues(JP_CASES.map(function (x) { return [x[3], x[4]]; }));
    });
    step('actual results', function () {
      sh.getRange(JP_FIRST_DATA_ROW, 8, n, 1).setValues(JP_CASES.map(function (x) { return [x[6]]; }));
    });
    step('notes', function () {
      sh.getRange(JP_FIRST_DATA_ROW, 29, n, 1).setValues(JP_CASES.map(function (x) { return [x[9]]; }));
    });
    // Typed columns (dropdowns), written one cell at a time so a rejected value is reported, not fatal.
    jpSafeSet(sh, 7, JP_CASES.map(function (x) { return x[5]; }), 'Status', problems);
    jpSafeSet(sh, 9, JP_CASES.map(function (x) { return x[7]; }), 'Bug Status', problems);
    jpSafeSet(sh, 10, JP_CASES.map(function (x) { return x[8]; }), 'Severity', problems);
    step('wrap text', function () {
      sh.getRange(JP_FIRST_DATA_ROW, 1, n, 29).setWrap(true).setVerticalAlignment('top');
    });
  } catch (e) {
    SpreadsheetApp.flush();
    SpreadsheetApp.getUi().alert('NOT FINISHED: ' + e.message);
    return;
  }

  SpreadsheetApp.flush();
  var msg = JP_TAB_NAME + ': ' + JP_CASES.length + ' test cases added';
  if (problems.length) msg += '\n\nThese values were rejected by the sheet and left empty (check the dropdown choices):\n' + problems.slice(0, 15).join('\n');
  SpreadsheetApp.getUi().alert(msg);
}
