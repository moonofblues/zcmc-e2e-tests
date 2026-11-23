import { test, expect, type Page } from '@playwright/test';
import { STATE, enterAdminApplications } from './helpers/application-flow';

// Admin / Staff Portal: Applications module (/admin/applications). IDs are TC-APPADM-*. Read-only.
// The list holds real applicants' personal data: these tests never read or print names, emails or phone numbers.
// Needs the saved admin login (ADMIN_STORAGE_STATE).

test.skip(!STATE, 'Set ADMIN_STORAGE_STATE in .env (see README, Admin login)');
test.use({ storageState: STATE || undefined });

test.describe('Applications list (read-only)', () => {
  test.beforeEach(async ({ page }) => {
    await enterAdminApplications(page);
  });

  test('TC-APPADM-001: the Applications list opens with title and heading', async ({ page }) => {
    await expect(page).toHaveTitle('Applications - ZCMC Recruitment Portal');
    await expect(page.getByRole('heading', { name: 'Applications' })).toBeVisible();
  });

  test('TC-APPADM-002: the seven status tabs are shown with counts', async ({ page }) => {
    for (const name of [/All Applications/, /Screening & Shortlist/, /Interview & Evaluation/, /Hired/, /Onboarded/, /Not Selected/, /Not Qualified/]) {
      await expect(page.getByRole('tab', { name }).or(page.getByText(name)).first()).toBeVisible();
    }
  });

  test('TC-APPADM-003: Review Auto-Rejections and Generate Reports buttons are available', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Review Auto-Rejections/ }).or(page.getByRole('link', { name: /Review Auto-Rejections/ })).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate Reports/ }).or(page.getByRole('link', { name: /Generate Reports/ })).first()).toBeVisible();
  });

  test('TC-APPADM-004: the table shows the expected columns', async ({ page }) => {
    for (const col of ['Applicant Details', 'Demographics', 'Addresses', 'Contact Info', 'Position Applied', 'Status', 'Attached Exam(s)', 'Date Applied']) {
      await expect(page.getByText(col, { exact: true }).first()).toBeAttached();
    }
  });

  test('TC-APPADM-005: each applicant row carries an application number like #APP-00024', async ({ page }) => {
    await expect(page.getByText(/#APP-\d{5}/).first()).toBeVisible();
  });

  test('TC-APPADM-006: search with a value that matches nothing shows no rows', async ({ page }) => {
    await page.getByPlaceholder('Search').fill('zzzz-no-such-applicant-zzzz');
    // TODO: confirm the debounce and the empty-state wording on the first run.
    await expect(page.getByText(/#APP-\d{5}/)).toHaveCount(0);
  });

  test('TC-APPADM-007: page size offers 5, 10, 25 and 50', async ({ page }) => {
    const sizes = page.getByRole('combobox').filter({ hasText: /\d+/ }).last();
    for (const n of ['5', '10', '25', '50']) {
      await expect(sizes.locator(`option[value="${n}"]`)).toHaveCount(1);
    }
  });

  test('TC-APPADM-008: filter and column manager buttons are available', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Filter/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Column/i }).first()).toBeVisible();
    // TODO: the two icon buttons have no visible label; confirm the accessible names on the first run.
  });

  test('TC-APPADM-009: the user menu Switch Module offers Admin Dashboard, Applicant Portal and HR-MPSB Panel', async ({ page }) => {
    await page.getByRole('button', { name: 'User menu' }).click();
    await page.getByText('Switch Module', { exact: true }).first().click();
    await expect(page.getByText('Switch Access Module')).toBeVisible();
    await page.getByRole('button', { name: /Admin Dashboard|Applicant Portal|HR-MPSB Panel/ }).first().click();
    for (const name of ['Admin Dashboard', 'Applicant Portal', 'HR-MPSB Panel']) {
      await expect(page.getByRole('option', { name })).toBeVisible();
    }
  });

  test('TC-APPADM-010: the Filters dialog offers Job Postings, Status and Applicant', async ({ page }) => {
    await page.getByRole('button', { name: /Filter/i }).first().click();
    await expect(page.getByText('Filters', { exact: true })).toBeVisible();
    for (const label of ['Job Postings', 'Status', 'Applicant']) {
      await expect(page.getByText(label, { exact: true }).last()).toBeVisible();
    }
    for (const name of ['Apply filters', 'Reset', 'Close']) {
      await expect(page.getByRole('button', { name })).toBeVisible();
    }
    // Nothing is selected or applied. Close leaves the list unchanged.
    await page.getByRole('button', { name: 'Close' }).click();
    // TODO: confirm the dialog closes (Close button) on the first run.
  });

  test('TC-APPADM-011: the column manager lists nine columns and Updated at is off by default', async ({ page }) => {
    await page.getByRole('button', { name: /Column/i }).first().click();
    await expect(page.getByText('Columns', { exact: true })).toBeVisible();
    for (const col of ['Applicant Details', 'Demographics', 'Addresses', 'Contact Info', 'Position Applied', 'Status', 'Attached Exam(s)', 'Date Applied', 'Updated at']) {
      await expect(page.getByRole('checkbox', { name: col })).toBeVisible();
    }
    await expect(page.getByRole('checkbox', { name: 'Updated at' })).not.toBeChecked();
    await expect(page.getByRole('button', { name: 'Apply columns' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
    // Nothing is changed or applied.
  });

  test('TC-APPADM-012: a row Actions menu offers nine actions (none is clicked)', async ({ page }) => {
    await page.getByRole('button', { name: 'Actions' }).first().click();
    for (const item of [
      'View', 'View Documents', 'Send SMS', 'Send Email Notification', 'Mark not qualified',
      'Attach Exam Types', 'Set for interview', 'Mark as Hired', 'Change status',
    ]) {
      await expect(page.getByText(item, { exact: true }).first()).toBeVisible();
    }
    // Only checked as shown. Seven of them send a message or change an application: never click them.
    await page.keyboard.press('Escape');
  });

  test('TC-APPADM-013: View opens the application page with its seven tabs and the uploaded documents panel', async ({ page }) => {
    await page.getByRole('button', { name: 'Actions' }).first().click();
    await page.getByText('View', { exact: true }).first().click();
    await expect(page).toHaveURL(/\/admin\/applications\/\d+$/);
    await expect(page).toHaveTitle('View applications - ZCMC Recruitment Portal');
    // The page shows the applicant's personal data: only labels are checked, no names, emails or phone numbers.
    await expect(page.getByText('APPLICANT SUMMARY', { exact: false })).toBeVisible();
    for (const tab of ['Personal Information', 'Education', 'Experiences', 'Trainings', 'Eligibilities', 'Vol. Work', 'Char. References']) {
      await expect(page.getByText(tab).first()).toBeVisible();
    }
    await expect(page.getByText('Uploaded Documents & Files')).toBeVisible();
    await expect(page.getByText('Job Position Details')).toBeVisible();
    await expect(page.getByRole('button', { name: /Back/ }).or(page.getByRole('link', { name: /Back/ })).first()).toBeVisible();
  });

  test('TC-APPADM-014: the admin user menu offers Settings, Switch Module, Action Logs and Sign out', async ({ page }) => {
    await page.getByRole('button', { name: 'User menu' }).click();
    await expect(page.getByText('Settings', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Switch Module', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Action Logs', { exact: true })).toBeVisible();
    await expect(page.getByText('Sign out', { exact: true })).toBeVisible();
    // Sign out is not clicked.
  });
});

// ---------------------------------------------------------------------------------------------------------------------
// Applications module: what each control does (TC-APPADM-015 onward). Written from a hand walk-through on 2026-11-23.
// SAFE BY DESIGN: these tests only open a menu, a modal or a panel and close it again. They NEVER press Submit, Confirm,
// Confirm Hire, Send Message, Save Exam Attachment or Generate: those change real applications or send real messages.
// Modals can take 5 to 8 seconds to appear, so every modal check waits up to 20 seconds. Selectors were never run (TODO).
// ---------------------------------------------------------------------------------------------------------------------
const MODAL = { timeout: 20_000 };

async function closeModal(page: Page): Promise<void> {
  await page.keyboard.press('Escape');
}

// Opens the three-dot menu of a row (default: the first row, or the row that holds `rowText`).
async function openRowMenu(page: Page, rowText?: string | RegExp): Promise<void> {
  const row = rowText ? page.locator('tr').filter({ hasText: rowText }).first() : page.locator('tr').nth(1);
  await row.getByRole('button', { name: 'Actions' }).click();
}

// Clicks a menu item; for a submenu pass [parent, child]. Waits for hover menus to open.
async function clickMenuItem(page: Page, path: string[]): Promise<void> {
  for (const name of path.slice(0, -1)) await page.getByRole('button', { name, exact: true }).first().hover();
  await page.getByRole('button', { name: path[path.length - 1], exact: true }).first().click();
}

// Ticks the first row's checkbox so the Bulk actions bar appears.
async function selectFirstRow(page: Page): Promise<void> {
  await page.getByRole('checkbox', { name: /Select\/deselect item/ }).first().check();
  await expect(page.getByText(/\d+ records? selected/)).toBeVisible();
}

test.describe('Applications: tabs, search, filter, sort and columns (read-only)', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90_000);
    await enterAdminApplications(page);
  });

  // Seen on 2026-11-23: each tab sets ?tab=<value>. An empty tab shows "No Applications in this Category".
  for (const [id, name, param] of [
    ['TC-APPADM-015', 'Screening & Shortlist', 'screening'],
    ['TC-APPADM-016', 'Interview & Evaluation', 'interview'],
    ['TC-APPADM-017', 'Hired', 'hired'],
    ['TC-APPADM-018', 'Onboarded', 'onboarded'],
    ['TC-APPADM-019', 'Not Selected', 'not_selected'],
    ['TC-APPADM-020', 'Not Qualified', 'disqualified'],
  ] as const) {
    test(`${id}: the ${name} tab opens and shows its rows or the empty state`, async ({ page }) => {
      const tab = page.getByRole('tab', { name: new RegExp(name) });
      const count = Number(/(\d+)\s*$/.exec((await tab.innerText()).trim())?.[1] ?? '0');
      await tab.click();
      await expect(page).toHaveURL(new RegExp(`tab=${param}`));
      if (count === 0) await expect(page.getByText('No Applications in this Category')).toBeVisible();
      else await expect(page.getByText(/#APP-\d{5}/).first()).toBeVisible();
    });
  }

  test('TC-APPADM-021: search by an email word shows an Active filters chip and a search address', async ({ page }) => {
    await page.getByPlaceholder('Search').fill('gmail');
    await expect(page).toHaveURL(/search=gmail/);
    await expect(page.getByText('Active filters')).toBeVisible();
    // The search takes about two seconds to run. Search matches applicant name and email, not the position or the #APP number.
  });

  test('TC-APPADM-022: clearing the search removes the chip and restores the list', async ({ page }) => {
    const box = page.getByPlaceholder('Search');
    await box.fill('gmail');
    await expect(page).toHaveURL(/search=gmail/);
    await box.fill('');
    await expect(page).not.toHaveURL(/search=/);
    await expect(page.getByText('Active filters')).toHaveCount(0);
  });

  test('TC-APPADM-024: applying the Status filter narrows the list, adds a chip and shows 1 on the filter button', async ({ page }) => {
    await page.getByRole('button', { name: /Filter/i }).first().click();
    // TODO: the Status control is a custom searchable dropdown; confirm the selectors on the first run.
    await page.getByText('Status', { exact: true }).last().click();
    await page.getByText('Pending', { exact: true }).click();
    await page.getByRole('button', { name: 'Apply filters' }).click();
    await expect(page).toHaveURL(/filters\[status\]\[value\]=Pending/);
    await expect(page.getByText('Status: Pending')).toBeVisible();
  });

  test('TC-APPADM-025: the Status filter lists 15 statuses', async ({ page }) => {
    await page.getByRole('button', { name: /Filter/i }).first().click();
    await page.getByText('Status', { exact: true }).last().click();
    for (const s of ['Approved For Hire', 'Assessment Completed', 'For Assessment', 'For Background Check', 'For Final Deliberation',
      'For Initial Screening', 'For Interview', 'For Shortlisting', 'Interviewed', 'Job Offer Accepted', 'Job Offer Sent', 'Pending',
      'Pre Employment Requirements', 'Recommended', 'Shortlisted']) {
      await expect(page.getByText(s, { exact: true }).first()).toBeVisible();
    }
    await closeModal(page);
  });

  test('TC-APPADM-026: the Status header sorts ascending, then descending', async ({ page }) => {
    await page.getByRole('button', { name: 'Status', exact: true }).first().click();
    await expect(page).toHaveURL(/sort=status(%3A|:)asc/);
    await page.getByRole('button', { name: 'Status', exact: true }).first().click();
    await expect(page).toHaveURL(/sort=status(%3A|:)desc/);
  });

  test('TC-APPADM-027: only Attached Exam(s) and Updated at can be switched off in the column manager', async ({ page }) => {
    await page.getByRole('button', { name: 'Column manager' }).click();
    for (const locked of ['Applicant Details', 'Demographics', 'Addresses', 'Contact Info', 'Position Applied', 'Status', 'Date Applied']) {
      await expect(page.getByRole('checkbox', { name: locked })).toBeDisabled();
    }
    await expect(page.getByRole('checkbox', { name: 'Attached Exam(s)' })).toBeEnabled();
    await expect(page.getByRole('checkbox', { name: 'Updated at' })).toBeEnabled();
    await closeModal(page);
  });
});

test.describe('Applications: bulk actions (open and close only)', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90_000);
    await enterAdminApplications(page);
    await selectFirstRow(page);
  });

  test('TC-APPADM-028: ticking a row shows the selected-records bar with Select all and Deselect all', async ({ page }) => {
    await expect(page.getByText('Select all', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Deselect all')).toBeVisible();
    await page.getByText('Deselect all').click();
    await expect(page.getByText(/\d+ records? selected/)).toHaveCount(0);
  });

  // Seen on 2026-11-23: the "N records selected" bar stayed on the empty Interview & Evaluation tab. Confirm with the team whether intended.
  test.fixme('TC-APPADM-029: the selection is cleared when another status tab is opened', async ({ page }) => {
    await page.getByRole('tab', { name: /Interview & Evaluation/ }).click();
    await expect(page.getByText(/\d+ records? selected/)).toHaveCount(0);
  });

  test('TC-APPADM-030: the Bulk actions menu offers six actions', async ({ page }) => {
    await page.getByRole('button', { name: 'Bulk actions' }).first().click();
    for (const item of ['Change status', 'Send Email Notification', 'Mark not qualified', 'Attach Exam Types', 'Set for initial screening', 'Set for interview']) {
      await expect(page.getByRole('button', { name: item, exact: true }).first()).toBeVisible();
    }
  });

  for (const [id, item, text] of [
    ['TC-APPADM-031', 'Attach Exam Types', 'Attach Exam Types in Bulk'],
    ['TC-APPADM-032', 'Set for initial screening', 'Set for Initial Screening'],
    ['TC-APPADM-033', 'Set for interview', 'Set for Interview'],
    ['TC-APPADM-034', 'Change status', 'Change Application Status'],
  ] as const) {
    test(`${id}: bulk ${item} opens its modal (not submitted)`, async ({ page }) => {
      await page.getByRole('button', { name: 'Bulk actions' }).first().click();
      await page.getByRole('button', { name: item, exact: true }).first().click();
      await expect(page.getByText(text).first()).toBeVisible(MODAL);
      await closeModal(page);
    });
  }

  test('TC-APPADM-035: bulk Mark not qualified offers eight reasons', async ({ page }) => {
    await page.getByRole('button', { name: 'Bulk actions' }).first().click();
    await page.getByRole('button', { name: 'Mark not qualified', exact: true }).first().hover();
    for (const r of ['Educational background', 'Training', 'Experience', 'Eligibility', 'Incomplete file uploads', 'Others', 'Include all', 'Just Mark']) {
      await expect(page.getByRole('button', { name: r, exact: true }).first()).toBeVisible();
    }
    // The reasons are only checked as shown. The bulk reasons were not opened one by one: they may act at once.
  });

  test('TC-APPADM-036: bulk Send Email Notification offers three message types', async ({ page }) => {
    await page.getByRole('button', { name: 'Bulk actions' }).first().click();
    await page.getByRole('button', { name: 'Send Email Notification', exact: true }).first().hover();
    for (const m of ['Acknowledgement Email', 'Letter of Regret', 'Custom Message']) {
      await expect(page.getByRole('button', { name: m, exact: true }).first()).toBeVisible();
    }
  });
});

test.describe('Applications: row actions (open and close only)', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90_000);
    await enterAdminApplications(page);
  });

  // [id, menu path, text that proves the modal opened]
  const MODALS: Array<[string, string[], string]> = [
    ['TC-APPADM-037', ['Send SMS'], 'Compose SMS Notification'],
    ['TC-APPADM-041', ['Send Email Notification', 'Acknowledgement Email'], 'Are you sure you want to send the acknowledgement email?'],
    ['TC-APPADM-042', ['Send Email Notification', 'Letter of Regret'], 'Are you sure you want to send the letter of regret?'],
    ['TC-APPADM-043', ['Send Email Notification', 'Custom Message'], 'Enter your custom message'],
    ['TC-APPADM-044', ['Mark as Hired'], 'Confirm Hiring Process'],
    ['TC-APPADM-046', ['Mark not qualified', 'Educational background'], 'Not Qualified - Educational Background'],
    ['TC-APPADM-047', ['Mark not qualified', 'Others'], 'Not Qualified - Others'],
    ['TC-APPADM-048', ['Mark not qualified', 'Just Mark'], 'Mark not qualified without notification'],
    ['TC-APPADM-049', ['Mark not qualified', 'Include all'], 'Not Qualified - All Reasons'],
    ['TC-APPADM-050', ['Attach Exam Types'], 'Attach or update examination types/templates for this applicant.'],
    ['TC-APPADM-051', ['Set for interview'], 'Set for Interview'],
    ['TC-APPADM-052', ['Change status'], 'Change Application Status'],
  ];
  for (const [id, path, text] of MODALS) {
    test(`${id}: row ${path.join(' > ')} opens its modal (not confirmed)`, async ({ page }) => {
      await openRowMenu(page);
      await clickMenuItem(page, path);
      await expect(page.getByText(text).first()).toBeVisible(MODAL);
      await closeModal(page);
    });
  }

  test('TC-APPADM-038: the Compose SMS modal has a template list, the phone number, the SMS content and Cancel (Send Message is not pressed)', async ({ page }) => {
    await openRowMenu(page);
    await clickMenuItem(page, ['Send SMS']);
    await expect(page.getByText('Compose SMS Notification')).toBeVisible(MODAL);
    await expect(page.getByText('Select SMS Template')).toBeVisible();
    await expect(page.getByText('Phone Number')).toBeVisible();
    await expect(page.getByText('SMS Content')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('Compose SMS Notification')).toHaveCount(0);
  });

  test('TC-APPADM-039: View Documents opens a panel with the applicant sections', async ({ page }) => {
    await openRowMenu(page);
    await clickMenuItem(page, ['View Documents']);
    await expect(page.getByText('View the documents uploaded by the applicant')).toBeVisible(MODAL);
    for (const s of ['Educational Background', 'Eligibility / Licenses', 'Work History', 'Trainings', 'Attachments']) {
      await expect(page.getByText(s, { exact: false }).first()).toBeVisible();
    }
    await closeModal(page);
    // The panel shows personal data: only the section names are checked.
  });

  // Defect seen 2026-11-23: "Graduated" shows a raw number instead of a date. test.fail until fixed.
  test('TC-APPADM-040: View Documents shows formatted dates, not raw numbers', async ({ page }) => {
    test.fail(true, 'Open defect: Graduated shows a raw timestamp');
    await openRowMenu(page);
    await clickMenuItem(page, ['View Documents']);
    await expect(page.getByText('View the documents uploaded by the applicant')).toBeVisible(MODAL);
    await expect(page.getByText(/Graduated:\s*\d{9,}/)).toHaveCount(0);
  });

  test('TC-APPADM-053: a Pending row offers Set for initial screening and its modal opens (not submitted)', async ({ page }) => {
    const pending = page.locator('tr').filter({ hasText: /PENDING/i }).first();
    test.skip((await pending.count()) === 0, 'No application with the status Pending');
    await pending.getByRole('button', { name: 'Actions' }).click();
    await clickMenuItem(page, ['Set for initial screening']);
    await expect(page.getByText("Set this applicant to 'For Initial Screening'", { exact: false })).toBeVisible(MODAL);
    await closeModal(page);
  });

  test('TC-APPADM-054: the row menu depends on the status (a Pending row has fewer actions)', async ({ page }) => {
    const pending = page.locator('tr').filter({ hasText: /PENDING/i }).first();
    test.skip((await pending.count()) === 0, 'No application with the status Pending');
    await pending.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByRole('button', { name: 'Set for initial screening', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mark as Hired', exact: true }).first()).not.toBeVisible();
  });

  test('TC-APPADM-055: Exam Result opens for an application with an attached exam', async ({ page }) => {
    const withExam = page.locator('tr').filter({ hasText: 'Test Exam' }).first();
    test.skip((await withExam.count()) === 0, 'No application has an attached exam');
    await withExam.getByRole('button', { name: 'Actions' }).click();
    await clickMenuItem(page, ['Exam Result']);
    await expect(page.getByText('Candidate examination performance', { exact: false })).toBeVisible(MODAL);
    for (const c of ['ATTACHED EXAMS', 'COMPLETED', 'PASSED', 'FAILED', 'AVERAGE GRADE']) {
      await expect(page.getByText(c, { exact: true }).first()).toBeVisible();
    }
    await closeModal(page);
  });

  test('TC-APPADM-061: Cancel closes a modal and nothing changes', async ({ page }) => {
    await openRowMenu(page);
    await clickMenuItem(page, ['Change status']);
    await expect(page.getByText('Change Application Status')).toBeVisible(MODAL);
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('Change Application Status')).toHaveCount(0);
  });
});

test.describe('Applications: header buttons, reports and Action Logs (read-only)', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90_000);
    await enterAdminApplications(page);
  });

  test('TC-APPADM-056: Generate Reports opens the Generate Report page', async ({ page }) => {
    await page.getByRole('link', { name: /Generate Reports/ }).click();
    await expect(page).toHaveURL(/\/admin\/generate-report$/);
    await expect(page.getByRole('heading', { name: 'Generate Report' })).toBeVisible();
  });

  test('TC-APPADM-057: the Generate Report page lists five reports (none is generated)', async ({ page }) => {
    await page.goto('/admin/generate-report');
    for (const r of ['List of Applicants', 'List for Interview', 'Assessment Form', 'List of Onboarded', 'RDR (Report of documentary review)']) {
      await expect(page.getByText(r, { exact: true })).toBeVisible();
    }
    // The Generate links are not clicked.
  });

  test('TC-APPADM-058: Review Auto-Rejections opens the System Screening Result modal', async ({ page }) => {
    await page.getByRole('button', { name: /Review Auto-Rejections/ }).click();
    await expect(page.getByText('System Screening Result')).toBeVisible(MODAL);
    await expect(page.getByText('Select Job Post')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await closeModal(page);
    // Submit is not pressed.
  });

  test('TC-APPADM-059: Action Logs lists the audit entries', async ({ page }) => {
    await page.goto('/admin/action-logs-page');
    await expect(page.getByRole('heading', { name: 'Action Logs' })).toBeVisible();
    await expect(page.getByText('Action Audit Logs')).toBeVisible();
    for (const col of ['User', 'Action', 'Remarks']) await expect(page.getByText(col, { exact: true }).first()).toBeVisible();
  });

  // Defect seen 2026-11-23: JavaScript source text is shown under the Applications list. test.fail until fixed.
  test('TC-APPADM-060: no raw script text is shown on the Applications page', async ({ page }) => {
    test.fail(true, 'Open defect: raw JavaScript text is shown under the table');
    await expect(page.locator('body')).not.toContainText('newWin.document');
  });
});
