import { test, expect, type Page } from '@playwright/test';

// Applicant registration (/register): 7-step wizard (Profile, Address, Education, Eligibility, Experience,
// References, IPCR). Finishing it opens a Registration Prompt, then a Legal Affirmation, then /verify.
//   Part A  checks the Step 1 form only.
//   Part B  walks through Steps 2-7 with test data and stops before Finish Registration (no account is created).
//   Part C  submits the registration. It creates a real account on the live system, so it needs
//           RUN_FULL_REGISTRATION=1 and a NEW TEST_EMAIL every time (an email can be registered only once).

const MOBILE = process.env.TEST_MOBILE ?? '09123456789';
const EMAIL = process.env.TEST_EMAIL ?? 'zcmc.pwtest01@mailinator.com';
const PASSWORD = process.env.TEST_PASSWORD ?? 'ChangeMe#2026!';

const isValid = (page: Page, placeholder: string) =>
  page.getByPlaceholder(placeholder).evaluate((el) => (el as HTMLInputElement).checkValidity());

// MUI Joy select: click the button, then pick an option of the open list.
async function pickOption(page: Page, buttonText: string, optionText?: string) {
  await page.locator('button', { hasText: buttonText }).first().click();
  const list = page.locator('ul.MuiSelect-listbox.Mui-expanded li');
  if (optionText) await list.filter({ hasText: optionText }).first().click();
  else await list.first().click();
}

// Field labels render with a required marker ("Sex *"), so match the label text with an optional asterisk.
const labelOf = (label: string) => new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}\\s*\\*?$`);

// An email can be registered only once and the site checks it on Step 1, so the walk-through uses a new one each time.
const freshEmail = () => `zcmc.pw${Date.now()}@mailinator.com`;

const stepText = (page: Page, n: number) => page.getByText(`Step ${n} of 7`).first();
const next = (page: Page) => page.getByRole('button', { name: 'Next Step' }).click();

async function fillStep1(page: Page, email = freshEmail()) {
  await page.getByPlaceholder('First name').fill('Testfirst');
  await page.getByPlaceholder('Middle name').fill('Testmiddle');
  await page.getByPlaceholder('Last name').fill('Testlast');
  await page.locator('input[type=date]').fill('1995-05-15');
  await page.getByPlaceholder('City/Municipality, Province').fill('Zamboanga City, Zamboanga del Sur');
  await page.getByPlaceholder('e.g., Filipino').fill('Filipino');
  await page.getByPlaceholder('09XXXXXXXXX').fill(MOBILE);
  await page.getByPlaceholder('name@example.com').fill(email);
  await page.getByPlaceholder('Create password').fill(PASSWORD);
  for (const label of ['Select sex...', 'Select civil status...', 'Select Blood Type', 'Select religion...']) {
    await pickOption(page, label);
  }
  // Sexual Orientation and Specific Membership both start as 'Select...'.
  // Membership must be 'None': 'PWD' adds a required 'Type of Disability' field.
  await pickOption(page, 'Select...');
  await pickOption(page, 'Select...', 'None');
  await pickOption(page, 'Select ethnicity...');
}

async function fillStep2(page: Page) {
  await page.getByPlaceholder('e.g., House No. 123 / Blk 4 Lot 5').first().fill('Blk 4 Lot 5');
  await page.getByPlaceholder('e.g., Main Street / Rizal St.').first().fill('Rizal St.');
  await page.getByPlaceholder('Select City / Municipality...').first().fill('Zamboanga City');
  await page.getByRole('option', { name: 'Zamboanga City (Zamboanga Del Sur)' }).click();
  await page.getByPlaceholder('Select Barangay...').first().click();
  await page.getByRole('option').first().click();
  await page.getByPlaceholder('Telephone or contact number').first().fill('09123456789');
  // The checkbox input covers its label, so click the checkbox itself.
  await page.getByRole('checkbox', { name: 'Same as residential address' }).check();
}

async function fillStep3(page: Page) {
  await page.getByRole('button', { name: 'Add Education Entry' }).click();
  await pickOption(page, 'Select Level', 'College');
  await page.getByPlaceholder('e.g., Zamboanga City State Polytechnic College').fill('Test University');
  await page.getByPlaceholder('e.g., Bachelor of Science in Nursing').fill('Bachelor of Science in Nursing');
  await page.locator('button', { hasText: 'Select year' }).first().click();
  await page.locator('ul.MuiSelect-listbox.Mui-expanded li', { hasText: '2021' }).first().click();
  await page.locator('button', { hasText: 'Select year' }).first().click();
  await page.locator('ul.MuiSelect-listbox.Mui-expanded li', { hasText: '2025' }).first().click();
}

async function fillStep4(page: Page) {
  await page.getByRole('button', { name: 'Add Eligibility Entry' }).click();
  await pickOption(page, 'Select eligibility...', 'Career Service Professional');
  await page.getByPlaceholder('e.g., 85.5').fill('85.5');
  const dates = page.locator('input[type=date]');
  await dates.nth(0).fill('2024-03-10');
  await page.getByPlaceholder('City / Location').fill('Zamboanga City');
  await dates.nth(1).fill('2024-05-10');
}

async function fillStep5(page: Page) {
  await page.getByRole('button', { name: 'Add Experience Entry' }).click();
  const dates = page.locator('input[type=date]');
  await dates.nth(0).fill('2022-01-10');
  await dates.nth(1).fill('2024-12-20');
  await page.getByPlaceholder('e.g., Nurse II, Administrative Officer I').fill('Staff Nurse');
  await page.getByPlaceholder('Company or agency name').fill('Test Hospital');
  await page.getByPlaceholder('e.g., Permanent, Contractual, Job Order').fill('Contractual');
}

async function fillStep6(page: Page) {
  await page.getByRole('button', { name: 'Add Reference Entry' }).click();
  await page.getByPlaceholder('e.g., Dr. Juan Dela Cruz').fill('Dr. Test Reference');
  await page.getByPlaceholder('e.g., Department Head').fill('Department Head');
  await page.getByPlaceholder('email@example.com').fill('zcmc.pwref01@mailinator.com');
  await page.getByPlaceholder('Mobile / Phone number').fill('09123456780');
  await page.getByPlaceholder('Complete office address').fill('Test Hospital, Zamboanga City');
  await pickOption(page, 'Select type...', 'Supervisor');
}

const fillers = [fillStep1, fillStep2, fillStep3, fillStep4, fillStep5, fillStep6];

// Opens /register, fills and passes every step before `step`, and leaves the wizard on `step`.
// Returns the email that was used on Step 1.
async function goToStep(page: Page, step: number, email = freshEmail()) {
  await page.goto('/register');
  for (let s = 1; s < step; s++) {
    if (s === 1) await fillStep1(page, email);
    else await fillers[s - 1](page);
    await next(page);
    await expect(stepText(page, s + 1)).toBeVisible();
  }
  return email;
}

// ---------- Part A: Step 1 form checks (no account is created) ----------
test.describe('Registration form checks (no account is created)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('TC-REG-001: page loads on Step 1 of 7 with all seven steps in the stepper', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Applicant Registration' })).toBeVisible();
    await expect(page.getByText('Step 1 of 7').first()).toBeVisible();
    await expect(page.getByText('14% Completed')).toBeVisible();
    for (const step of ['Profile', 'Address', 'Education', 'Eligibility', 'Experience', 'References', 'IPCR']) {
      await expect(page.getByText(step, { exact: true })).toBeVisible();
    }
  });

  test('TC-REG-002: Step 1 shows all personal information fields', async ({ page }) => {
    await expect(page.getByPlaceholder('First name')).toBeVisible();
    await expect(page.getByPlaceholder('Middle name')).toBeVisible();
    await expect(page.getByPlaceholder('Last name')).toBeVisible();
    await expect(page.getByPlaceholder('e.g., Jr., III (Optional)')).toBeVisible();
    await expect(page.locator('input[type=date]')).toBeVisible();
    await expect(page.getByPlaceholder('City/Municipality, Province')).toBeVisible();
    for (const label of ['Sex', 'Date of Birth', 'Civil Status', 'Place of Birth']) {
      await expect(page.getByText(labelOf(label)).first()).toBeVisible();
    }
  });

  test('TC-REG-003: Step 1 shows demographics and account fields', async ({ page }) => {
    for (const label of [
      'Blood Type',
      'Religion',
      'Sexual Orientation',
      'Specific Membership',
      'Ethnicity / Ethnolinguistic Group',
      'Citizenship',
      'Mobile Phone Number',
      'Email Address',
      'Password',
    ]) {
      await expect(page.getByText(labelOf(label)).first()).toBeVisible();
    }
    await expect(page.getByPlaceholder('e.g., Filipino')).toBeVisible();
    await expect(page.getByPlaceholder('09XXXXXXXXX')).toBeVisible();
    await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('Create password')).toBeVisible();
  });

  test('TC-REG-004: empty Step 1 cannot proceed to Step 2', async ({ page }) => {
    await page.getByRole('button', { name: 'Next Step' }).click();
    await expect(page.getByText('Step 1 of 7').first()).toBeVisible();
    expect(await isValid(page, 'First name')).toBe(false);
  });

  test('TC-REG-005: invalid email format is rejected', async ({ page }) => {
    await page.getByPlaceholder('name@example.com').fill('not-an-email');
    expect(await isValid(page, 'name@example.com')).toBe(false);
  });

  test('TC-REG-006: password field hides the typed characters', async ({ page }) => {
    await expect(page.getByPlaceholder('Create password')).toHaveAttribute('type', 'password');
  });

  test('TC-REG-007: "Already registered? Login" link opens the login page', async ({ page }) => {
    await page.getByRole('link', { name: 'Login' }).first().click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('TC-REG-008: "Click here to sync UMIS Account" is shown for ZCMC employees', async ({ page }) => {
    await expect(page.getByText('Currently employed in ZCMC?')).toBeVisible();
    await expect(page.getByText('Click here to sync UMIS Account')).toBeVisible();
  });

  test('TC-REG-009: dropdown options are loaded (selection-templates API is not empty)', async ({ request }) => {
    const res = await request.get('/api/selection-templates');
    expect(res.ok()).toBe(true);
    const data = await res.json();
    expect(Array.isArray(data) ? data.length : Object.keys(data).length).toBeGreaterThan(0);
  });
});

// ---------- Part B: Steps 2-7 (walks through the wizard, never clicks Finish Registration) ----------
// Step 1 is filled with test data and submitted with Next Step. The site may save a draft at that point.
test.describe('Registration steps 2-7 (stops before Finish Registration)', () => {
  test('TC-REG-010: applicant completes Step 1 and proceeds to Step 2', async ({ page }) => {
    await goToStep(page, 2);
    await expect(stepText(page, 2)).toBeVisible();
  });

  test('TC-REG-011: Step 2 shows the residential and permanent address fields', async ({ page }) => {
    await goToStep(page, 2);
    await expect(page.getByText('29% Completed')).toBeVisible();
    await expect(page.getByText('Residential Address', { exact: true })).toBeVisible();
    await expect(page.getByText('Permanent Address', { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('e.g., House No. 123 / Blk 4 Lot 5')).toHaveCount(2);
    await expect(page.getByPlaceholder('e.g., Main Street / Rizal St.')).toHaveCount(2);
    await expect(page.getByPlaceholder('Province')).toHaveCount(2);
    await expect(page.getByPlaceholder('e.g., 7000')).toHaveCount(2);
    await expect(page.getByPlaceholder('Telephone or contact number')).toHaveCount(2);
  });

  test('TC-REG-012: empty Step 2 cannot proceed to Step 3', async ({ page }) => {
    await goToStep(page, 2);
    await next(page);
    await expect(stepText(page, 2)).toBeVisible();
  });

  test('TC-REG-013: choosing a city loads the barangays and fills Province and Zip Code', async ({ page }) => {
    await goToStep(page, 2);
    await page.getByPlaceholder('Select City / Municipality...').first().fill('Zamboanga City');
    await page.getByRole('option', { name: 'Zamboanga City (Zamboanga Del Sur)' }).click();
    await expect(page.getByPlaceholder('Province').first()).toHaveValue('Zamboanga Del Sur');
    await expect(page.getByPlaceholder('e.g., 7000').first()).toHaveValue('7000');
    await page.getByPlaceholder('Select Barangay...').first().click();
    await expect(page.getByRole('option', { name: 'Arena Blanco' })).toBeVisible();
  });

  test('TC-REG-014: "Same as residential address" copies and locks the permanent address', async ({ page }) => {
    await goToStep(page, 2);
    await fillStep2(page);
    await expect(page.getByPlaceholder('e.g., House No. 123 / Blk 4 Lot 5').nth(1)).toHaveValue('Blk 4 Lot 5');
    await expect(page.getByPlaceholder('e.g., House No. 123 / Blk 4 Lot 5').nth(1)).toBeDisabled();
    await expect(page.getByPlaceholder('e.g., Main Street / Rizal St.').nth(1)).toBeDisabled();
  });

  test('TC-REG-015: Back keeps the data entered on the previous step', async ({ page }) => {
    const email = await goToStep(page, 2);
    await page.getByRole('button', { name: 'Back' }).click();
    await expect(stepText(page, 1)).toBeVisible();
    await expect(page.getByPlaceholder('First name')).toHaveValue('Testfirst');
    await expect(page.getByPlaceholder('name@example.com')).toHaveValue(email);
  });

  test('TC-REG-016: Step 3 starts empty and Add Education Entry shows the education fields', async ({ page }) => {
    await goToStep(page, 3);
    await expect(page.getByText('43% Completed')).toBeVisible();
    await expect(page.getByText('No educational entries added yet')).toBeVisible();
    await page.getByRole('button', { name: 'Add Education Entry' }).click();
    await expect(page.getByText('Education Entry #1')).toBeVisible();
    for (const label of ['Education Level', 'School / Institution Name', 'Degree / Course', 'Year From', 'Year To']) {
      await expect(page.getByText(labelOf(label)).first()).toBeVisible();
    }
    await expect(page.getByPlaceholder('e.g., Cum Laude (Optional)')).toBeVisible();
    await page.locator('button', { hasText: 'Select Level' }).click();
    for (const level of ['Elementary', 'Secondary', 'Vocational/Trade Course', 'College', 'Graduate Studies']) {
      await expect(page.getByRole('option', { name: level })).toBeVisible();
    }
  });

  test('TC-REG-017: empty education entry cannot proceed', async ({ page }) => {
    await goToStep(page, 3);
    await page.getByRole('button', { name: 'Add Education Entry' }).click();
    await next(page);
    await expect(stepText(page, 3)).toBeVisible();
  });

  test('TC-REG-018: Year To earlier than Year From is rejected', async ({ page }) => {
    await goToStep(page, 3);
    await page.getByRole('button', { name: 'Add Education Entry' }).click();
    await pickOption(page, 'Select Level', 'College');
    await page.getByPlaceholder('e.g., Zamboanga City State Polytechnic College').fill('Test University');
    await page.getByPlaceholder('e.g., Bachelor of Science in Nursing').fill('Bachelor of Science in Nursing');
    await page.locator('button', { hasText: 'Select year' }).first().click();
    await page.locator('ul.MuiSelect-listbox.Mui-expanded li', { hasText: '2025' }).first().click();
    await page.locator('button', { hasText: 'Select year' }).first().click();
    await page.locator('ul.MuiSelect-listbox.Mui-expanded li', { hasText: '2021' }).first().click();
    await next(page);
    // Expected behavior still to be confirmed. This assumes the site blocks the range.
    await expect(stepText(page, 3)).toBeVisible();
  });

  test('TC-REG-019: an education entry can be removed', async ({ page }) => {
    await goToStep(page, 3);
    await page.getByRole('button', { name: 'Add Education Entry' }).click();
    await expect(page.getByText('Education Entry #1')).toBeVisible();
    // The delete button is the only button with no text on the page (it only shows an icon).
    await page.getByRole('button').filter({ hasNotText: /./ }).first().click();
    await expect(page.getByText('No educational entries added yet')).toBeVisible();
  });

  test('TC-REG-020: Step 4 Add Eligibility Entry shows the eligibility fields', async ({ page }) => {
    await goToStep(page, 4);
    await expect(page.getByText('57% Completed')).toBeVisible();
    await expect(page.getByText('No eligibility entries added yet')).toBeVisible();
    await page.getByRole('button', { name: 'Add Eligibility Entry' }).click();
    await expect(page.getByText('Eligibility Entry #1')).toBeVisible();
    await expect(page.getByText('Civil Service Eligibility / License Title')).toBeVisible();
    await expect(page.getByPlaceholder('e.g., 85.5')).toBeVisible();
    await expect(page.getByPlaceholder('City / Location')).toBeVisible();
    await expect(page.locator('input[type=date]')).toHaveCount(3);
  });

  test('TC-REG-021: empty eligibility entry cannot proceed', async ({ page }) => {
    await goToStep(page, 4);
    await page.getByRole('button', { name: 'Add Eligibility Entry' }).click();
    await next(page);
    await expect(stepText(page, 4)).toBeVisible();
  });

  test('TC-REG-022: Step 5 Add Experience Entry shows the work experience fields', async ({ page }) => {
    await goToStep(page, 5);
    await expect(page.getByText('71% Completed')).toBeVisible();
    await expect(page.getByText('No work experience added yet')).toBeVisible();
    await page.getByRole('button', { name: 'Add Experience Entry' }).click();
    await expect(page.getByText('Experience Entry #1')).toBeVisible();
    await expect(page.getByText('Currently Employed here (Present)')).toBeVisible();
    await expect(page.getByPlaceholder('e.g., Nurse II, Administrative Officer I')).toBeVisible();
    await expect(page.getByPlaceholder('Company or agency name')).toBeVisible();
    await expect(page.getByPlaceholder('e.g., Permanent, Contractual, Job Order')).toBeVisible();
    await expect(page.getByText('Government Service?')).toBeVisible();
    await expect(page.getByText('No (Private)')).toBeVisible();
  });

  test('TC-REG-023: Currently Employed here removes the need for an end date', async ({ page }) => {
    await goToStep(page, 5);
    await page.getByRole('button', { name: 'Add Experience Entry' }).click();
    // Same as the Step 2 checkbox: the hidden input covers its label, so use the checkbox itself.
    await page.getByRole('checkbox', { name: /Currently Employed here/ }).check();
    // Behavior to confirm: this assumes the end date is disabled.
    await expect(page.locator('input[type=date]').nth(1)).toBeDisabled();
  });

  test('TC-REG-024: empty experience entry cannot proceed', async ({ page }) => {
    await goToStep(page, 5);
    await page.getByRole('button', { name: 'Add Experience Entry' }).click();
    await next(page);
    await expect(stepText(page, 5)).toBeVisible();
  });

  test('TC-REG-025: Step 6 Add Reference Entry shows the reference fields', async ({ page }) => {
    await goToStep(page, 6);
    await expect(page.getByText('86% Completed')).toBeVisible();
    await expect(page.getByText('No character references added yet')).toBeVisible();
    await page.getByRole('button', { name: 'Add Reference Entry' }).click();
    await expect(page.getByPlaceholder('e.g., Dr. Juan Dela Cruz')).toBeVisible();
    await expect(page.getByPlaceholder('e.g., Department Head')).toBeVisible();
    await expect(page.getByPlaceholder('email@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('Mobile / Phone number')).toBeVisible();
    await expect(page.getByPlaceholder('Complete office address')).toBeVisible();
    await page.locator('button', { hasText: 'Select type...' }).click();
    for (const type of ['Supervisor', 'Subordinate', 'Peer']) {
      await expect(page.getByRole('option', { name: type })).toBeVisible();
    }
  });

  test('TC-REG-026: reference with an invalid email is rejected', async ({ page }) => {
    await goToStep(page, 6);
    await fillStep6(page);
    await page.getByPlaceholder('email@example.com').fill('not-an-email');
    await next(page);
    await expect(stepText(page, 6)).toBeVisible();
  });

  test('TC-REG-027: Step 7 shows the IPCR rating field and it can be left blank', async ({ page }) => {
    await goToStep(page, 7);
    await expect(page.getByText('100% Completed')).toBeVisible();
    await expect(page.getByText('Latest IPCR Numerical Rating (1.00 – 5.00)')).toBeVisible();
    await expect(page.getByPlaceholder('e.g., 4.50')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Finish Registration' })).toBeEnabled();
  });

  test('TC-REG-028: IPCR rating outside 1.00 to 5.00 is rejected', async ({ page }) => {
    await goToStep(page, 7);
    for (const bad of ['0.5', '5.5']) {
      await page.getByPlaceholder('e.g., 4.50').fill(bad);
      await page.getByRole('button', { name: 'Finish Registration' }).click();
      // Give the dialog time to open, otherwise "no dialog" would pass before it appears.
      await page.waitForTimeout(1500);
      // Behavior to confirm: this assumes the Registration Prompt does not open for an invalid rating.
      await expect(page.getByRole('alertdialog')).toHaveCount(0);
    }
  });

  test('TC-REG-029: progress bar follows the current step', async ({ page }) => {
    const progress = ['14%', '29%', '43%', '57%', '71%', '86%', '100%'];
    await page.goto('/register');
    await expect(page.getByText(`${progress[0]} Completed`)).toBeVisible();
    for (let s = 1; s < 7; s++) {
      if (s === 1) await fillStep1(page);
      else await fillers[s - 1](page);
      await next(page);
      await expect(page.getByText(`${progress[s]} Completed`)).toBeVisible();
    }
  });

  test('TC-REG-030: Finish Registration opens the Registration Prompt', async ({ page }) => {
    await goToStep(page, 7);
    await page.getByRole('button', { name: 'Finish Registration' }).click();
    const dialog = page.getByRole('alertdialog');
    await expect(dialog.getByText('Registration Prompt')).toBeVisible();
    for (const tab of ['Credentials', 'Security', 'Recovery']) {
      await expect(dialog.getByRole('tab', { name: tab })).toBeVisible();
    }
    // Cancel: no account is created.
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('alertdialog')).toHaveCount(0);
  });
});

// ---------- Part C: final submit (creates a real account on the live system) ----------
async function openLegalAffirmation(page: Page) {
  await page.getByRole('button', { name: 'Finish Registration' }).click();
  const prompt = page.getByRole('alertdialog');
  await expect(prompt.getByText('Registration Prompt')).toBeVisible();
  // The prompt has three tabs. Click Next until the last tab shows 'I Understand, Continue'.
  for (let i = 0; i < 3; i++) {
    const done = prompt.getByRole('button', { name: 'I Understand, Continue' });
    if (await done.isVisible()) break;
    await prompt.getByRole('button', { name: 'Next' }).click();
  }
  await prompt.getByRole('button', { name: 'I Understand, Continue' }).click();
  await expect(page.getByRole('alertdialog').getByText('Legal Affirmation')).toBeVisible();
}

test.describe('Full registration (creates a real account on the live system)', () => {
  test.skip(process.env.RUN_FULL_REGISTRATION !== '1', 'Set RUN_FULL_REGISTRATION=1 to run these tests');

  test('TC-REG-031: Legal Affirmation requires the sworn statement before finalizing', async ({ page }) => {
    await goToStep(page, 7);
    await openLegalAffirmation(page);
    const dialog = page.getByRole('alertdialog');
    await expect(dialog.getByText(/permanent\s+lifetime ban/i)).toBeVisible();
    const confirm = dialog.getByRole('button', { name: 'Confirm & Finalize' });
    await expect(confirm).toBeDisabled();
    await expect(dialog.getByText('Email Address')).toBeVisible();
    await expect(dialog.getByText('Mobile Number')).toBeVisible();
    await dialog.getByRole('checkbox').check();
    await expect(confirm).toBeEnabled();
    // Cancel: no account is created.
    await dialog.getByRole('button', { name: 'Cancel' }).click();
  });

  test('TC-REG-032: submitting the registration opens the verification page', async ({ page }) => {
    await goToStep(page, 7, EMAIL); // TEST_EMAIL must be a new address, so its Mailinator inbox can be checked
    await openLegalAffirmation(page);
    const dialog = page.getByRole('alertdialog');
    await dialog.getByRole('checkbox').check();
    await dialog.getByRole('button', { name: 'Confirm & Finalize' }).click();
    await expect(page).toHaveURL(/\/verify/);
    // Known defect on 2026-11-20: /verify is blank. This assertion is expected to fail until it is fixed.
    await expect(page.locator('body')).not.toBeEmpty();
    await expect(page.getByText(/verif/i).first()).toBeVisible();
  });

  test('TC-REG-033: a verification message is sent to the email address', async () => {
    test.skip(true, 'Manual: check the public Mailinator inbox of TEST_EMAIL after TC-REG-032.');
  });

});

// ---------- Step 1 checks that need no final submit ----------
test.describe('Registration Step 1: duplicate email and conditional fields (no account is created)', () => {
  test('TC-REG-034: an email that is already registered is rejected on Step 1', async ({ page }) => {
    // zcmc.pwtest01@mailinator.com was registered on 2026-11-20 during the manual run. Override with TEST_EXISTING_EMAIL.
    const existing = process.env.TEST_EXISTING_EMAIL || 'zcmc.pwtest01@mailinator.com';
    await page.goto('/register');
    await fillStep1(page, existing);
    await expect(page.getByText('This email address is already registered.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next Step' })).toBeDisabled();
  });

  test('TC-REG-035: Specific Membership PWD requires a Type of Disability', async ({ page }) => {
    await page.goto('/register');
    await fillStep1(page);
    // fillStep1 chose 'None' for Specific Membership. Change it to PWD.
    await page.getByRole('combobox', { name: 'Specific Membership' }).click();
    await page.getByRole('option', { name: 'PWD (Person with Disability)' }).click();
    await expect(page.getByText(labelOf('Type of Disability'))).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next Step' })).toBeDisabled();
  });
});
