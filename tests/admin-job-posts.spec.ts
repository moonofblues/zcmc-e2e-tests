import { test, expect, type Page } from '@playwright/test';

// Admin / Staff Portal: Job Posts module (/admin/job-posts). IDs are TC-JP-* (TC-JOB-* is the applicant Job Browsing module).
//
// Sign-in: the login page shows a Security Verification challenge (icon selection) that automation must not solve.
// So these tests reuse a login saved once by hand:
//   1. npx playwright codegen --save-storage=admin-state.json https://recruitment.zcmc.online/login
//   2. Sign in yourself (solve the challenge, pick Admin / Staff Portal), then close the browser.
//   3. Put ADMIN_STORAGE_STATE=admin-state.json in .env. The file is git-ignored; do not commit it.
// Without ADMIN_STORAGE_STATE the whole file skips.
//
// Live system rules: everything is read-only EXCEPT the "writes" group, which creates and deletes a real
// "PW TEST" post and runs only when ALLOW_JOB_POST_WRITES=1.
//
// Selectors for the custom dropdowns (Filament/Livewire) are written from a manual walk-through and need
// one confirmation run. Spots that depend on that are marked TODO.

const STATE = process.env.ADMIN_STORAGE_STATE;
const WRITES = process.env.ALLOW_JOB_POST_WRITES === '1';

test.skip(!STATE, 'Set ADMIN_STORAGE_STATE in .env (see the comment at the top of this file)');
test.use({ storageState: STATE || undefined });

const LIST = '/admin/job-posts';
const CREATE = '/admin/job-posts/create';

async function goList(page: Page, tab?: string) {
  await page.goto(tab ? `${LIST}?tab=${tab}` : LIST);
  await expect(page.getByRole('heading', { name: 'Job Posts' })).toBeVisible();
}

async function goCreate(page: Page) {
  await page.goto(CREATE);
  await expect(page.getByRole('heading', { name: 'Create Job Posts' })).toBeVisible();
}

// Opens a custom dropdown that shows `placeholder`, types a search and clicks the matching option.
async function pick(page: Page, placeholder: string | RegExp, search: string, option: string | RegExp) {
  await page.getByText(placeholder, { exact: typeof placeholder === 'string' }).first().click();
  await page.getByPlaceholder('Start typing to search...').last().fill(search);
  await page.getByRole('option', { name: option }).first().click();
}

// Fills the minimum valid form. Publication date is set after the grade so the form does not drop it.
async function fillValidForm(page: Page) {
  await pick(page, 'Select an option', 'NURSE II', /^NURSE II$/);
  await pick(page, 'Select', '15', 'SG 15'); // grade (also fills Step 1 and the salary)
  await page.locator('input[type="date"]').first().fill('2026-12-01'); // TODO: use a date in the future of the run
  await page.getByText('Add Place of Assignment').click();
  await pick(page, 'Select Place of Assignment', 'Test Divisions', 'Test Divisions');
  await page.getByLabel(/Number of Vacancies/).fill('1');
  await pick(page, 'Select file type', 'Personal', 'Personal Data Sheet');
  await page.getByLabel(/File name/).fill('PDS_LastName_FirstName');
}

// ---------------------------------------------------------------------------------------------------------
// List page
// ---------------------------------------------------------------------------------------------------------
test.describe('Job Posts list (read-only)', () => {
  test.beforeEach(async ({ page }) => {
    await goList(page);
  });

  test('TC-JP-001: Job Posts list opens with title, heading and breadcrumb', async ({ page }) => {
    await expect(page).toHaveTitle('Job Posts - ZCMC Recruitment Portal');
    await expect(page.getByText('List', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'New job posts' })).toBeVisible();
  });

  test('TC-JP-002: the four status tabs are shown with counts', async ({ page }) => {
    for (const name of [/All Job Posts/, /Published/, /Unpublished/, /Filing Closed/]) {
      await expect(page.getByRole('tab', { name }).first()).toBeVisible();
    }
  });

  test('TC-JP-003: the table shows the expected columns', async ({ page }) => {
    for (const col of ['Job Position', 'Place of Assignment', 'Status', 'Published Date', 'Closing Date', 'No Of Vacancy', 'Employment Type', 'Created at']) {
      await expect(page.getByText(col, { exact: true }).first()).toBeAttached();
    }
  });

  test('TC-JP-004: a closed post shows the Filing Closed status', async ({ page }) => {
    await goList(page, 'filing-closed'); // TODO: confirm the tab query value
    await expect(page.getByText('Filing Closed').first()).toBeVisible();
  });

  test('TC-JP-005: search narrows the list', async ({ page }) => {
    await page.getByPlaceholder('Search').fill('NURSE');
    // TODO: confirm the debounce and the empty state wording
    await expect(page.getByText('NURSE II').first()).toBeVisible();
  });

  test('TC-JP-006: filter button opens the filter panel', async ({ page }) => {
    await page.getByRole('button', { name: 'Filter' }).click();
    // TODO: assert the filter fields once seen
    await expect(page.getByRole('button', { name: 'Filter' })).toBeVisible();
  });

  test('TC-JP-007: column manager button is available', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Column manager' })).toBeVisible();
  });

  test('TC-JP-008: page size offers 5, 10, 25 and 50', async ({ page }) => {
    const sizes = page.getByRole('combobox').filter({ hasText: '10' });
    for (const n of ['5', '10', '25', '50']) {
      await expect(sizes.locator(`option[value="${n}"]`)).toHaveCount(1);
    }
  });

  test('TC-JP-009: pagination shows the result range and Next', async ({ page }) => {
    await expect(page.getByText(/Showing 1 to \d+ of \d+ results/)).toBeVisible();
  });

  test('TC-JP-010: clicking a row opens that post', async ({ page }) => {
    await page.locator('a[href*="/admin/job-posts/"]').first().click();
    await expect(page).toHaveURL(/\/admin\/job-posts\/\d+/);
  });

  test('TC-JP-011: "New job posts" opens the create form', async ({ page }) => {
    await page.getByRole('link', { name: 'New job posts' }).click();
    await expect(page).toHaveURL(/\/admin\/job-posts\/create$/);
  });

  test('TC-JP-012: row actions menu lists View and Edit (no Delete)', async ({ page }) => {
    await page.getByRole('button', { name: 'Actions' }).first().click();
    await expect(page.getByText('View', { exact: true })).toBeVisible();
    await expect(page.getByText('Edit', { exact: true })).toBeVisible();
    await expect(page.getByText('Delete', { exact: true })).toHaveCount(0);
  });

  test('TC-JP-013: ticking a row enables the bulk actions menu', async ({ page }) => {
    await page.getByRole('checkbox', { name: /Select\/deselect item/ }).first().check();
    await page.getByRole('button', { name: 'Bulk actions' }).first().click();
    await expect(page.getByText('Delete selected')).toBeVisible();
    await expect(page.getByText('Publish selected')).toBeVisible();
    await expect(page.getByText('Unpublish selected')).toBeVisible();
  });

  test('TC-JP-014: ticking a row shows the selected count with Select all / Deselect all', async ({ page }) => {
    await page.getByRole('checkbox', { name: /Select\/deselect item/ }).first().check();
    await expect(page.getByText(/1 record selected/)).toBeVisible();
    await expect(page.getByText(/Select all \d+/)).toBeVisible();
    await expect(page.getByText('Deselect all')).toBeVisible();
  });

  test('TC-JP-015: tab choice is kept in the address (?tab=)', async ({ page }) => {
    await page.getByRole('tab', { name: /Unpublished/ }).click();
    await expect(page).toHaveURL(/tab=unpublished/);
  });
});

// ---------------------------------------------------------------------------------------------------------
// Create form: look and type only. Nothing is saved.
// ---------------------------------------------------------------------------------------------------------
test.describe('Create Job Posts form (nothing is saved)', () => {
  test.beforeEach(async ({ page }) => {
    await goCreate(page);
  });

  test('TC-JP-016: create page opens with Back, Create and Create & Create Another', async ({ page }) => {
    await expect(page).toHaveTitle('Create Job Posts - ZCMC Recruitment Portal');
    await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create & Create Another' })).toBeVisible();
  });

  test('TC-JP-017: all form fields and sections are shown', async ({ page }) => {
    for (const label of ['Job Title', 'Publication Date', 'Closing Date Time', 'Max Applicants ( Optional )', 'Salary Grade', 'Salary Step', 'Monthly Salary', 'Description', 'Plantilla',
      'Add Job Order', 'Job Qualifications', 'Educational Background', 'Experiences', 'Trainings', 'Eligibility', 'Competencies', 'Skills', 'File Upload', 'File requirements']) {
      await expect(page.getByText(label, { exact: false }).first()).toBeVisible();
    }
  });

  test('TC-JP-018: submitting an empty form shows the required messages', async ({ page }) => {
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    for (const msg of ['The job Title field is required.', 'The salary Grade field is required.', 'The salary Step field is required.', 'The monthly Salary field is required.']) {
      await expect(page.getByText(msg)).toBeVisible();
    }
    await expect(page).toHaveURL(/\/job-posts\/create$/);
  });

  test('TC-JP-019: Job Title is a searchable list (substring match)', async ({ page }) => {
    await page.getByText('Select an option').first().click();
    await page.getByPlaceholder('Start typing to search...').last().fill('NURSE II');
    await expect(page.getByRole('option', { name: 'NURSE II', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'NURSE III' })).toBeVisible();
  });

  test('TC-JP-020: Salary Grade is a searchable list starting at SG 1', async ({ page }) => {
    await page.getByText('Select', { exact: true }).first().click();
    await expect(page.getByRole('option', { name: 'SG 1', exact: true })).toBeVisible();
    await page.getByPlaceholder('Start typing to search...').last().fill('15');
    await expect(page.getByRole('option', { name: 'SG 15' })).toBeVisible();
  });

  test('TC-JP-021: choosing a grade fills Step 1 and the monthly salary', async ({ page }) => {
    await pick(page, 'Select', '15', 'SG 15');
    await expect(page.getByText('Step 1')).toBeVisible();
    await expect(page.locator('input[type="number"]').last()).not.toHaveValue('');
  });

  test('TC-JP-022: changing the step changes the monthly salary', async ({ page }) => {
    await pick(page, 'Select', '15', 'SG 15');
    const salary = page.locator('input[type="number"]').last();
    const step1 = Number(await salary.inputValue());
    await page.getByText('Step 1').click();
    await page.getByRole('option', { name: 'Step 2' }).click();
    const step2 = Number(await salary.inputValue());
    // Expected: a higher step pays at least as much. Observed on the live site: Step 1 = 38413, Step 2 = 36997.
    expect(step2).toBeGreaterThanOrEqual(step1);
  });

  test('TC-JP-023: setting a publication date auto-fills a closing date and marks it required', async ({ page }) => {
    await page.locator('input[type="date"]').first().fill('2026-12-01');
    await expect(page.getByText('10 weekdays applied')).toBeVisible();
    await expect(page.locator('input[type="datetime-local"]').first()).not.toHaveValue('');
  });

  test('TC-JP-024: Max Applicants is optional and takes a whole number', async ({ page }) => {
    const max = page.getByLabel(/Max Applicants/);
    await max.fill('5');
    await expect(max).toHaveValue('5');
  });

  test('TC-JP-025: Max Applicants rejects a negative number', async ({ page }) => {
    const max = page.getByLabel(/Max Applicants/);
    await max.fill('-3');
    // Expected: rejected or corrected. Observed on the live site: -3 is accepted.
    await expect(max).not.toHaveValue('-3');
  });

  test('TC-JP-026: Monthly Salary rejects a negative number', async ({ page }) => {
    const salary = page.getByLabel(/Monthly Salary/);
    await salary.fill('-5');
    // Expected: rejected or corrected. Observed on the live site: -5 is accepted.
    await expect(salary).not.toHaveValue('-5');
  });

  test('TC-JP-027: Description is a rich text editor with a formatting toolbar', async ({ page }) => {
    // Toolbar: Bold, Italic, Underline, Strikethrough, subscript, superscript, H2, H3, 3 alignments, bullets, numbers, Undo, Redo
    await expect(page.getByRole('button', { name: 'Bold' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Italic' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Undo' }).first()).toBeVisible();
  });

  test('TC-JP-028: Add Place of Assignment adds a row with a grouped list and vacancies', async ({ page }) => {
    await page.getByText('Add Place of Assignment').click();
    await page.getByText('Select Place of Assignment').first().click();
    await expect(page.getByText('Divisions', { exact: true })).toBeVisible();
    await expect(page.getByText('Test Divisions').first()).toBeVisible();
    await expect(page.getByText('Number of Vacancies')).toBeVisible();
  });

  test('TC-JP-029: a Place of Assignment row can be removed', async ({ page }) => {
    await page.getByText('Add Place of Assignment').click();
    await expect(page.getByText('Number of Vacancies')).toBeVisible();
    // TODO: confirm the trash button selector
    await page.locator('button:has(svg)').filter({ has: page.locator('[class*="red"], [class*="danger"]') }).first().click();
    await expect(page.getByText('Number of Vacancies')).toHaveCount(0);
  });

  test('TC-JP-030: Plantilla list loads UMIS plantilla numbers', async ({ page }) => {
    await page.getByText('Select Plantilla Numbers').click();
    await expect(page.getByText('Loading...')).toBeVisible();
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15_000 });
  });

  test('TC-JP-031: reference validation modal lists education and civil service options', async ({ page }) => {
    await page.getByRole('button', { name: 'Add reference validation' }).click();
    await expect(page.getByText('Educational Background Level')).toBeVisible();
    await expect(page.getByText('Civil Service Eligibility')).toBeVisible();
    await expect(page.getByText(/automatically reject application/i)).toBeVisible();
    await page.getByText('Select an option').first().click();
    for (const o of ['Elementary', 'Secondary', 'Vocational/Trade Course', 'College', 'Graduate Studies']) {
      await expect(page.getByRole('option', { name: o })).toBeVisible({ timeout: 15_000 });
    }
  });

  test('TC-JP-032: submitting a reference validation shows the pre-filled panel', async ({ page }) => {
    await page.getByRole('button', { name: 'Add reference validation' }).click();
    await page.getByText('Select an option').first().click();
    await page.getByRole('option', { name: 'College' }).click({ timeout: 15_000 });
    await page.getByText('Add reference validation', { exact: true }).first().click(); // click the title to close the list
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Filters Applied')).toBeVisible();
    await expect(page.getByText('Pre-filled Reference Validation')).toBeVisible();
  });

  test('TC-JP-033: Escape closes the reference validation modal without adding anything', async ({ page }) => {
    await page.getByRole('button', { name: 'Add reference validation' }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByText('Educational Background Level')).toBeHidden();
    await expect(page.getByText(/No reference validation criteria/)).toBeVisible();
  });

  test('TC-JP-034: the six qualification editors accept text', async ({ page }) => {
    const editors = page.locator('[contenteditable="true"]');
    await expect(editors).toHaveCount(7); // Description + 6 qualification editors
    for (let i = 0; i < 7; i++) {
      await editors.nth(i).click();
      await page.keyboard.type(`PW TEST ${i}`);
      await expect(editors.nth(i)).toContainText(`PW TEST ${i}`);
    }
  });

  test('TC-JP-035: file type list offers four types', async ({ page }) => {
    await page.getByText('Select file type').click();
    for (const t of ['Application Letter', 'Diploma', 'Personal Data Sheet', 'Work Experience Sheet']) {
      await expect(page.getByRole('option', { name: t })).toBeVisible();
    }
  });

  test('TC-JP-036: a file requirement row needs a file type and a file name format', async ({ page }) => {
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByText('The file type field is required.')).toBeVisible();
    await expect(page.getByText('The file name field is required.')).toBeVisible();
  });

  test('TC-JP-037: the sample attachment area states the accepted types and size', async ({ page }) => {
    await expect(page.getByText(/Accepted: PDF, JPG, PNG, DOC, DOCX \| Max: 5MB/)).toBeVisible();
  });

  test('TC-JP-038: an oversized or wrong-type sample attachment is rejected', async () => {
    test.skip(true, 'Manual. Not tried yet: needs a file over 5 MB and a .exe or .txt file.');
  });

  test('TC-JP-039: "Add to file requirements" adds another row', async ({ page }) => {
    await page.getByRole('button', { name: 'Add to file requirements' }).click();
    await expect(page.getByText('Select file type')).toHaveCount(2);
  });

  test('TC-JP-040: Back returns to the list without saving', async ({ page }) => {
    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page).toHaveURL(/\/admin\/job-posts$/);
  });

  test('TC-JP-041: a closing date before the publication date is rejected', async () => {
    test.skip(true, 'Manual. Not tried yet. Expected: an error on the closing date. The form currently auto-sets the closing date after the publication date.');
  });

  test('TC-JP-042: a past publication date is handled', async () => {
    test.skip(true, 'Manual. Not tried yet. Behavior to confirm: allowed (post goes live at once) or rejected.');
  });

  test('TC-JP-043: required messages clear once the fields are filled', async ({ page }) => {
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByText('The job Title field is required.')).toBeVisible();
    await pick(page, 'Select an option', 'NURSE II', /^NURSE II$/);
    // Expected: the message goes away. Observed on the live site: it stays until the next submit.
    await expect(page.getByText('The job Title field is required.')).toBeHidden();
  });

  test('TC-JP-044: no stray script text is shown at the bottom of the form', async ({ page }) => {
    // Observed on the live site: raw JavaScript (const response = await fetch(fileUrl ...) shows under the form.
    await expect(page.getByText(/const response = await fetch\(fileUrl/)).toHaveCount(0);
  });
});

// ---------------------------------------------------------------------------------------------------------
// Writes: creates and deletes a real post on the live system. Off unless ALLOW_JOB_POST_WRITES=1.
// ---------------------------------------------------------------------------------------------------------
test.describe('Job Posts writes (creates and deletes a PW TEST post)', () => {
  test.skip(!WRITES, 'Set ALLOW_JOB_POST_WRITES=1 to create and delete a real post');

  async function deleteTestPosts(page: Page) {
    await goList(page, 'unpublished');
    const rows = page.getByRole('row').filter({ hasText: 'Test Divisions' });
    const count = await rows.count();
    if (count === 0) return;
    for (let i = 0; i < count; i++) {
      await rows.nth(i).getByRole('checkbox').check();
    }
    await page.getByRole('button', { name: 'Bulk actions' }).first().click();
    await page.getByText('Delete selected').click();
    await expect(page.getByText('Delete selected Job Posts')).toBeVisible(); // TC-JP-049
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
  }

  test('TC-JP-045: a valid post is created, shows a success message and lands under Unpublished', async ({ page }) => {
    await goCreate(page);
    await fillValidForm(page);
    // TODO: attach a dummy PDF: await page.locator('input[type="file"]').setInputFiles('tests/fixtures/PDS_sample.pdf');
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByText('Job Post Created')).toBeVisible();
    await expect(page.getByText('The job post has been created successfully.')).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/job-posts$/);
    await goList(page, 'unpublished');
    await expect(page.getByRole('row').filter({ hasText: 'Test Divisions' }).first()).toBeVisible();
    await deleteTestPosts(page); // clean up
  });

  test('TC-JP-047: bulk delete removes the selected post', async ({ page }) => {
    await goCreate(page);
    await fillValidForm(page);
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByText('Job Post Created')).toBeVisible();
    await deleteTestPosts(page);
    await page.waitForTimeout(5000); // the list refreshes a few seconds after the delete
    await goList(page, 'unpublished');
    await expect(page.getByRole('row').filter({ hasText: 'Test Divisions' })).toHaveCount(0);
  });

  test('TC-JP-048: bulk delete does not show a false error', async ({ page }) => {
    await goCreate(page);
    await fillValidForm(page);
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByText('Job Post Created')).toBeVisible();
    await deleteTestPosts(page);
    // Observed on the live site: "An error occurred. Please try again later." shows even though the post is deleted.
    await expect(page.getByText('An error occurred')).toHaveCount(0);
  });
});

// ---------------------------------------------------------------------------------------------------------
// Manual only
// ---------------------------------------------------------------------------------------------------------
test.describe('Job Posts (manual checks)', () => {
  test('TC-JP-046: a failed save leaves no partial post behind', async () => {
    test.skip(true, 'Manual. On 2026-11-20 Create returned HTTP 500 and left posts with no place of assignment and dates NOT SET. Re-test after the developer fix.');
  });

  test('TC-JP-049: delete asks for confirmation first', async () => {
    test.skip(true, 'Covered inside TC-JP-047 (run with ALLOW_JOB_POST_WRITES=1): dialog "Delete selected Job Posts" with Cancel and Delete.');
  });

  test('TC-JP-050: a new post gets the intended employment type', async () => {
    test.skip(true, 'Manual. The form has no employment type field, but the new post shows "Job Order" (older posts show Permanent Full-time or Temporary). Confirm the intended default.');
  });

  test('TC-JP-051: Publish and Unpublish change the status', async () => {
    test.skip(true, 'Covered by TC-JP-055 to TC-JP-062 (run with ALLOW_JOB_POST_WRITES=1). Tried by hand with the row Actions menu; the bulk "Publish selected" / "Unpublish selected" are TC-JP-071 / TC-JP-072.');
  });

  test('TC-JP-052: Edit changes an existing post', async () => {
    test.skip(true, 'Covered by TC-JP-063 to TC-JP-066 (run with ALLOW_JOB_POST_WRITES=1).');
  });

  test('TC-JP-053: View shows the full post details', async () => {
    test.skip(true, 'Covered by TC-JP-067 (run with ALLOW_JOB_POST_WRITES=1).');
  });

  test('TC-JP-054: a published post appears on the public /jobs page', async () => {
    test.skip(true, 'Covered by TC-JP-058 and TC-JP-061 (run with ALLOW_JOB_POST_WRITES=1). Publishing briefly shows the post to real applicants.');
  });
});

// ---------------------------------------------------------------------------------------------------------
// Publish, Unpublish, Edit, View and the public page. Needs a real post: one "PW TEST" post is created first,
// worked on in order, and deleted at the end. It is PUBLISHED for a short time, so real applicants can see it
// on /jobs. Runs only with ALLOW_JOB_POST_WRITES=1.
// ---------------------------------------------------------------------------------------------------------
test.describe.serial('Job Posts publish, edit and view (creates, publishes and deletes a PW TEST post)', () => {
  test.skip(!WRITES, 'Set ALLOW_JOB_POST_WRITES=1 to create, publish and delete a real post');

  let page: Page;

  const testRow = () => page.getByRole('row').filter({ hasText: 'Test Divisions' }).first();
  const openRowMenu = async () => {
    await testRow().getByRole('button', { name: 'Actions' }).click();
  };

  async function removeTestPosts() {
    for (const tab of ['unpublished', 'published']) {
      await goList(page, tab);
      const rows = page.getByRole('row').filter({ hasText: 'Test Divisions' });
      const n = await rows.count();
      if (n === 0) continue;
      for (let i = 0; i < n; i++) await rows.nth(i).getByRole('checkbox').check();
      await page.getByRole('button', { name: 'Bulk actions' }).first().click();
      await page.getByText('Delete selected').click();
      await page.getByRole('button', { name: 'Delete', exact: true }).click();
      await page.waitForTimeout(5000); // the list refreshes a few seconds after the delete
    }
  }

  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STATE });
    page = await ctx.newPage();
    await goCreate(page);
    await fillValidForm(page);
    // TODO: attach a dummy PDF as in TC-JP-045
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByText('Job Post Created')).toBeVisible();
  });

  test.afterAll(async () => {
    await removeTestPosts();
    await page.context().close();
  });

  test('TC-JP-055: the Publish dialog asks for a published date, number of days and closing time', async () => {
    await goList(page, 'unpublished');
    await openRowMenu();
    await page.getByText('Publish', { exact: true }).click();
    await expect(page.getByText('Publish Job Post')).toBeVisible();
    await expect(page.getByText('Published date')).toBeVisible();
    await expect(page.getByText('Days from Published date')).toBeVisible();
    await expect(page.getByText('Closing Time')).toBeVisible();
    await expect(page.getByLabel(/Days from Published date/)).toHaveValue('10');
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('TC-JP-057: publishing with a future date keeps the post under Unpublished until that date', async () => {
    await goList(page, 'unpublished');
    await openRowMenu();
    await page.getByText('Publish', { exact: true }).click();
    await page.getByLabel(/Published date/).fill('2026-12-15'); // TODO: use a date in the future of the run
    await page.getByRole('button', { name: 'Confirm' }).click();
    await expect(page.getByText('Job Post Published')).toBeVisible();
    await goList(page, 'unpublished');
    await expect(testRow()).toContainText('Unpublished'); // no "Scheduled" status exists
  });

  test('TC-JP-056: publishing with today\'s date moves the post to Published with a closing date', async () => {
    await goList(page, 'unpublished');
    await openRowMenu();
    await page.getByText('Publish', { exact: true }).click();
    await page.getByRole('button', { name: 'Confirm' }).click(); // the dialog defaults to today and 10 days
    await expect(page.getByText('The job posting has been published successfully.')).toBeVisible();
    await goList(page, 'published');
    await expect(testRow()).toContainText('Published');
    await expect(testRow()).toContainText(/11:59 PM/);
  });

  test('TC-JP-058: a published post appears on the public /jobs page', async () => {
    await page.goto('/jobs');
    await expect(page.getByText('NURSE II').first()).toBeVisible();
    await expect(page.getByText('Test Divisions').first()).toBeVisible();
  });

  test('TC-JP-068: the public job card shows the job description', async () => {
    await page.goto('/jobs');
    const card = page.locator('div').filter({ hasText: 'Test Divisions' }).last();
    // Expected: the Description text. Observed on the live site: the Educational Background text is shown instead.
    await expect(card).toContainText('PW TEST posting for QA');
  });

  test('TC-JP-059: a published post\'s Actions menu offers View, Edit, Publish, Unpublish and Close', async () => {
    await goList(page, 'published');
    await openRowMenu();
    for (const item of ['View', 'Edit', 'Publish', 'Unpublish', 'Close']) {
      await expect(page.getByText(item, { exact: true })).toBeVisible();
    }
    await page.keyboard.press('Escape');
  });

  test('TC-JP-063: Edit opens the post with its saved values filled in', async () => {
    await goList(page, 'published');
    await openRowMenu();
    await page.getByText('Edit', { exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/job-posts\/\d+\/edit$/);
    await expect(page).toHaveTitle('Edit job posts - ZCMC Recruitment Portal');
    await expect(page.getByText('Update Job Posting')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeVisible();
    await expect(page.getByText('NURSE II').first()).toBeVisible();
    await expect(page.getByText('Pre-filled Reference Validation')).toBeVisible();
  });

  test('TC-JP-064: Save changes updates the post, shows a message and returns to the list', async () => {
    await page.getByLabel(/Max Applicants/).fill('8');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Job Post Updated')).toBeVisible();
    await expect(page.getByText('The job post has been updated successfully.')).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/job-posts$/);
  });

  test('TC-JP-066: all six qualification fields are saved and shown', async () => {
    await goList(page, 'published');
    await openRowMenu();
    await page.getByText('View', { exact: true }).click();
    // Observed on the live site: Skills shows "N/A" although text was typed in the create form (to re-test).
    await expect(page.getByText('PW TEST skill')).toBeVisible();
  });

  test('TC-JP-067: the View page shows Max Applicants', async () => {
    // Observed on the live site: Max Applicants is saved (the edit form shows it) but the View page does not show it.
    await expect(page.getByText(/Max Applicants/i)).toBeVisible();
  });

  test('TC-JP-060: Unpublish asks for confirmation and shows a success message', async () => {
    await goList(page, 'published');
    await openRowMenu();
    await page.getByText('Unpublish', { exact: true }).click();
    await expect(page.getByText('Are you sure you would like to do this?')).toBeVisible();
    await page.getByRole('button', { name: 'Confirm' }).click();
    await expect(page.getByText('The job posting has been unpublished successfully.')).toBeVisible();
  });

  test('TC-JP-061: an unpublished post is removed from the public /jobs page', async () => {
    await page.goto('/jobs');
    await expect(page.getByText('Test Divisions')).toHaveCount(0);
  });

  test('TC-JP-062: an unpublished post keeps its published and closing dates', async () => {
    await goList(page, 'unpublished');
    // Observed on the live site: both dates become NOT SET after Unpublish. Confirm with the team whether that is intended.
    await expect(testRow()).not.toContainText('NOT SET');
  });

  test('TC-JP-069: tab counts refresh after a publish, unpublish or delete', async () => {
    test.skip(true, 'Manual. Observed: the All / Published / Unpublished badges kept the old numbers until the page was reloaded (for example Published 2 while the list showed 1).');
  });
});

// Not tried yet
test.describe('Job Posts publish, edit and view (manual checks)', () => {
  test('TC-JP-065: the edit form matches the create form', async () => {
    test.skip(true, 'Manual. Observed: the edit form has no Plantilla section, and the saved sample attachment shows a generated file name instead of the original.');
  });
  test('TC-JP-070: Close marks a post as Filing Closed', async () => {
    test.skip(true, 'Manual. Not tried yet. The Actions menu of a published post has a Close option.');
  });
  test('TC-JP-071: Publish selected publishes several posts at once', async () => {
    test.skip(true, 'Manual. Not tried yet.');
  });
  test('TC-JP-072: Unpublish selected unpublishes several posts at once', async () => {
    test.skip(true, 'Manual. Not tried yet.');
  });
  test('TC-JP-073: the edit form rejects a cleared required field', async () => {
    test.skip(true, 'Manual. Not tried yet.');
  });
  test('TC-JP-074: Back and View on the edit form leave without saving', async () => {
    test.skip(true, 'Manual. Not tried yet.');
  });
});
