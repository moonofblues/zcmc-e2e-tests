/**
 * Follow-up to fill-job-posts-tab.gs. Run it AFTER that script has filled the "Job Posts" tab (TC-JP-001 to TC-JP-054).
 *   - Updates the result of TC-JP-051, 052, 053 and 054 in place (found by test case ID in column A).
 *   - Adds TC-JP-055 to TC-JP-074 (publish, unpublish, edit, view, public page) below the last used row.
 * Safe to run twice: an ID that is already on the tab is not added again, and an update only rewrites Status, Actual results,
 * Bug Status, Severity and Notes of the four rows named above. Nothing else on the tab is touched.
 * Everything lives inside the one function updateJobPostsTab, so this file adds a single global name and cannot clash with
 * the other scripts in the project (all files in an Apps Script project share one scope).
 * Results are what was seen by hand on the live site on 2026-11-20. Playwright: tests/admin-job-posts.spec.ts
 */
function updateJobPostsTab() {
  const TAB = 'Job Posts';
  const FIRST_ROW = 10;                       // first data row (the template header row is row 9)
  const NOTES_COL = 29;                       // column AC
  const SPEC = 'Playwright: admin-job-posts.spec.ts';
  const WRITES = SPEC + '. Creates, publishes and deletes a real PW TEST post: run with ALLOW_JOB_POST_WRITES=1';

  // [ID, Status, Actual results, Bug Status, Severity, Notes]
  const UPDATES = [
    ['TC-JP-051', 'Passed',
      'Publish and Unpublish both work from the row Actions menu (see TC-JP-055 to TC-JP-062). The bulk Publish selected and Unpublish selected were not tried (TC-JP-071, TC-JP-072)',
      '', '', WRITES],
    ['TC-JP-052', 'Passed',
      'Edit opens the post pre-filled and Save changes updates it (see TC-JP-063 to TC-JP-066). Max Applicants was changed from 5 to 8; the new value was not re-opened to confirm',
      '', '', WRITES],
    ['TC-JP-053', 'Passed',
      'View shows the title, status, employment type, salary grade, monthly salary, place of assignment, published date, deadline, description, qualifications, reference validation and file requirements. Max Applicants is not shown and Skills shows N/A (see TC-JP-066, TC-JP-067)',
      '', '', SPEC],
    ['TC-JP-054', 'Passed',
      "A post published with today's date appeared on /jobs ('2 jobs found') and was gone after Unpublish ('1 job found') (see TC-JP-058, TC-JP-061)",
      '', '', WRITES + '. The post was visible to real applicants for a few minutes']
  ];

  // [ID, Title, Description, Test steps, Expected results, Status, Actual results, Bug Status, Severity, Notes]
  const NEW_CASES = [
    ['TC-JP-055', 'The Publish dialog asks for a published date, number of days and closing time', 'Verify the Publish dialog',
      "1. Open the Unpublished tab\n2. Click the three-dot Actions button of a post\n3. Click Publish",
      "A dialog 'Publish Job Post - Are you sure you would like to do this?' shows Published date (today by default), Days from Published date (10) and Closing Time (11:59:59 PM) with Cancel and Confirm",
      'Passed', 'As expected', '', '', WRITES],
    ['TC-JP-056', "Publishing with today's date moves the post to Published with a closing date", 'Verify publishing a post now',
      '1. Open the Publish dialog of an unpublished post\n2. Keep the defaults (today, 10 days, 11:59:59 PM)\n3. Click Confirm\n4. Open the Published tab',
      "A message 'Job Post Published - The job posting has been published successfully.' appears. The post is listed under Published with today as the published date and a closing date 10 weekdays later at 11:59 PM",
      'Passed', 'Published Nov 20 2026 with a closing date of Dec 4 2026 11:59 PM (10 weekdays later). The Published tab shows the post after a reload', '', '', WRITES],
    ['TC-JP-057', 'Publishing with a future date keeps the post under Unpublished until that date', 'Verify publishing with a date in the future',
      '1. Open the Publish dialog of an unpublished post\n2. Change Published date to a future date\n3. Click Confirm\n4. Open the Unpublished tab',
      'The post keeps the chosen published date and closing date. Behavior to confirm: it stays Unpublished until the date arrives, or a Scheduled status is shown',
      'Passed', "A success message appeared. The post stayed under Unpublished with Published date Nov 25 2026 and closing Dec 9 2026. There is no 'Scheduled' status, and its Actions menu still offers Publish",
      '', '', WRITES + '. To confirm with the team: is staying Unpublished until the date intended?'],
    ['TC-JP-058', 'A published post appears on the public /jobs page', 'Verify a published post is visible to applicants',
      '1. Publish a PW TEST post with today as the published date\n2. Open https://recruitment.zcmc.online/jobs',
      "The post is listed (title, place of assignment, employment type, salary grade and amount, deadline) and the count includes it",
      'Passed', "The page said '2 jobs found' and listed ATTORNEY I and NURSE II (Test Divisions, Job Order, SG 15 - 38,413.00, Deadline December 4, 2026)", '', '', WRITES + '. The post was visible to real applicants for a few minutes'],
    ['TC-JP-059', "A published post's Actions menu offers View, Edit, Publish, Unpublish and Close", 'Verify the row actions of a published post',
      '1. Open the Published tab\n2. Click the three-dot Actions button of a post',
      'The menu offers View, Edit, Unpublish and Close. Publish is not offered because the post is already published',
      'Failed', 'The menu shows View, Edit, Publish, Unpublish and Close. Publish is still offered on an already published post',
      'Open', 'Low', WRITES + '. Confirm with the team whether Publish is meant to stay (for example to change the dates)'],
    ['TC-JP-060', 'Unpublish asks for confirmation and shows a success message', 'Verify unpublishing a post',
      '1. Open the Published tab\n2. Actions > Unpublish\n3. Click Confirm',
      "A dialog 'Unpublish - Are you sure you would like to do this?' appears. After Confirm, a message 'Job Post Unpublished - The job posting has been unpublished successfully.' appears",
      'Passed', 'As expected. The row stayed on the Published tab until the page was reloaded', '', '', WRITES],
    ['TC-JP-061', 'An unpublished post is removed from the public /jobs page', 'Verify an unpublished post is hidden from applicants',
      '1. Unpublish the post\n2. Open https://recruitment.zcmc.online/jobs',
      'The post is no longer listed and the count goes down',
      'Passed', "The page changed from '2 jobs found' to '1 job found'", '', '', WRITES],
    ['TC-JP-062', 'An unpublished post keeps its published and closing dates', 'Verify the dates after Unpublish',
      '1. Unpublish a published post\n2. Open the Unpublished tab and read the dates',
      'Behavior to confirm: the dates are kept so the post can be published again, or they are cleared on purpose',
      'Passed', 'Published date and Closing date both show NOT SET after Unpublish (they were Nov 20 and Dec 4 before). Seen, not judged',
      '', '', WRITES + '. Confirm with the team whether clearing the dates is intended. Publishing again asks for the dates anyway'],
    ['TC-JP-063', 'Edit opens the post with its saved values filled in', 'Verify the edit form',
      '1. Actions > Edit on a post\n2. Look at the form',
      "The page opens at /admin/job-posts/{id}/edit with the tab title 'Edit job posts - ZCMC Recruitment Portal'. The heading is 'Update Job Posting' with Back, View and Save changes. All saved values are filled in, including the reference validation",
      'Passed', 'As expected (Job Title, dates, Max Applicants 5, salary, description, place of assignment, qualifications, reference validation and file requirement were all pre-filled)', '', '', WRITES],
    ['TC-JP-064', 'Save changes updates the post, shows a message and returns to the list', 'Verify saving an edit',
      '1. Open Edit on a post\n2. Change Max Applicants from 5 to 8\n3. Click Save changes',
      "A message 'Job Post Updated - The job post has been updated successfully.' appears and the Job Posts list opens",
      'Passed', 'As expected. The new value 8 was not re-opened to confirm it was stored', '', '', WRITES],
    ['TC-JP-065', 'The edit form matches the create form', 'Verify nothing is missing from the edit form',
      '1. Compare the Edit form with the Create form',
      'The same fields and sections are shown, and the saved sample attachment keeps its name',
      'Failed', "The edit form has no Plantilla section (it says 'Manage Place of Assignments' only). The saved sample attachment shows a generated file name (01M7VTWKJG694V8TNMMV95VQ1G.pdf) instead of the original",
      'Open', 'Low', SPEC + '. Manual. Confirm with the team whether the missing Plantilla section is intended'],
    ['TC-JP-066', 'All six qualification fields are saved and shown', 'Verify the qualification fields are stored',
      "1. Create a post with text in Educational Background, Experiences, Trainings, Eligibility, Competencies and Skills\n2. Open View and Edit for the post",
      'All six values are shown on both pages',
      'Failed', "Skills shows 'N/A' on View and is empty on Edit. The other five fields were saved. Skills was typed in the create form but was not re-checked before saving, so this needs one more run to rule out a typing miss",
      'Open', 'Medium', WRITES + '. Re-test once more before reporting'],
    ['TC-JP-067', 'The View page shows Max Applicants', 'Verify the View page is complete',
      '1. Create a post with Max Applicants 5\n2. Open View',
      'Max Applicants is shown with the other details',
      'Failed', 'Max Applicants is not shown on the View page, although the Edit form shows 5',
      'Open', 'Low', WRITES],
    ['TC-JP-068', 'The public job card shows the job description', 'Verify what applicants read on the card',
      "1. Publish a post whose Description is 'PW TEST posting for QA' and whose Educational Background is different\n2. Open /jobs and read the card",
      'The card shows the job description',
      'Failed', "The card showed the Educational Background text ('PW TEST education: Bachelor's degree.') instead of the Description",
      'Open', 'Low', WRITES + '. Confirm with the team which field the card should show'],
    ['TC-JP-069', 'Tab counts refresh after a publish, unpublish or delete', 'Verify the tab badges stay correct',
      '1. Publish, unpublish or delete a post\n2. Look at the badges on All Job Posts, Published, Unpublished and Filing Closed',
      'The numbers match the rows without reloading',
      'Failed', 'The badges kept the old numbers until the page was reloaded (for example Published 2 while the list showed 1 row; All Job Posts stayed 20 right after a delete)',
      'Open', 'Low', SPEC + '. Manual'],
    ['TC-JP-070', 'Close marks a post as Filing Closed', 'Verify the Close action',
      '1. Open the Published tab\n2. Actions > Close',
      'The post moves to the Filing Closed tab and no longer appears on /jobs',
      'Not run', '', '', '', SPEC + '. Manual. Not tried yet'],
    ['TC-JP-071', 'Publish selected publishes several posts at once', 'Verify the bulk publish',
      '1. Tick two unpublished posts\n2. Bulk actions > Publish selected',
      'Both posts are published (or a dialog asks for the dates first)',
      'Not run', '', '', '', SPEC + '. Manual. Not tried yet'],
    ['TC-JP-072', 'Unpublish selected unpublishes several posts at once', 'Verify the bulk unpublish',
      '1. Tick two published posts\n2. Bulk actions > Unpublish selected',
      'Both posts are unpublished and leave /jobs',
      'Not run', '', '', '', SPEC + '. Manual. Not tried yet'],
    ['TC-JP-073', 'The edit form rejects a cleared required field', 'Verify validation on Edit',
      '1. Open Edit on a post\n2. Clear Closing Date Time or Monthly Salary\n3. Click Save changes',
      'The post is not saved and a required message is shown',
      'Not run', '', '', '', SPEC + '. Manual. Not tried yet'],
    ['TC-JP-074', 'Back and View on the edit form leave without saving', 'Verify the edit form buttons',
      '1. Open Edit on a post\n2. Change a value\n3. Click Back (and again with View)',
      'The page closes without saving the change',
      'Not run', '', '', '', SPEC + '. Manual. Not tried yet']
  ];

  // ---------------------------------------------------------------------------------------------------------
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(TAB);
  if (!sh) { SpreadsheetApp.getUi().alert('NOT DONE: the tab "' + TAB + '" was not found. Run fillJobPostsTab first.'); return; }

  // Find the used rows by ID in column A.
  const lastSheetRow = Math.max(sh.getLastRow(), FIRST_ROW);
  const ids = sh.getRange(FIRST_ROW, 1, lastSheetRow - FIRST_ROW + 1, 1).getValues().map(function (r) { return String(r[0]).trim(); });
  const rowOf = {};
  let lastUsed = FIRST_ROW - 1;
  ids.forEach(function (id, i) { if (id !== '') { rowOf[id] = FIRST_ROW + i; lastUsed = FIRST_ROW + i; } });
  if (!rowOf['TC-JP-001']) { SpreadsheetApp.getUi().alert('NOT DONE: TC-JP-001 was not found on the "' + TAB + '" tab. Run fillJobPostsTab first.'); return; }

  const log = [];
  const problems = [];
  // One cell at a time so a value rejected by a dropdown is reported, not fatal.
  function setCell(row, col, value, label) {
    try { sh.getRange(row, col).setValue(value); }
    catch (e) { problems.push(label + ' row ' + row + ' ("' + value + '"): ' + e.message); }
  }

  // 1. Update the four existing rows.
  let updated = 0;
  UPDATES.forEach(function (u) {
    const row = rowOf[u[0]];
    if (!row) { log.push(u[0] + ': not found, not updated'); return; }
    sh.getRange(row, 8).setValue(u[2]);       // H Actual results
    sh.getRange(row, NOTES_COL).setValue(u[5]); // AC Notes
    setCell(row, 7, u[1], 'Status');
    setCell(row, 9, u[3], 'Bug Status');
    setCell(row, 10, u[4], 'Severity');
    updated++;
  });
  log.push(updated + ' existing test cases updated');

  // 2. Add the new cases that are not on the tab yet.
  const toAdd = NEW_CASES.filter(function (c) { return !rowOf[c[0]]; });
  if (toAdd.length > 0) {
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
    log.push(n + ' new test cases added (rows ' + start + ' to ' + last + ')');
  } else {
    log.push('no new test cases to add (all IDs are already on the tab)');
  }

  SpreadsheetApp.flush();
  let msg = TAB + ': ' + log.join('; ');
  if (problems.length) msg += '\n\nThese values were rejected by the sheet and left empty (check the dropdown choices):\n' + problems.slice(0, 15).join('\n');
  SpreadsheetApp.getUi().alert(msg);
}
