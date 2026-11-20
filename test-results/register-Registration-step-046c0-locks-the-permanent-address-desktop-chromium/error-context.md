# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: register.spec.ts >> Registration steps 2-7 (stops before Finish Registration) >> TC-REG-014: "Same as residential address" copies and locks the permanent address
- Location: tests\register.spec.ts:237:3

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for getByText('Same as residential address')
    - locator resolved to <label for="_r_2r_" class="MuiCheckbox-label css-1fjtzvx">Same as residential address</label>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <input id="_r_2r_" type="checkbox" aria-checked="false" class="MuiCheckbox-input css-1jj0cvj"/> from <span class="MuiCheckbox-checkbox css-n110n">…</span> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <input id="_r_2r_" type="checkbox" aria-checked="false" class="MuiCheckbox-input css-1jj0cvj"/> from <span class="MuiCheckbox-checkbox css-n110n">…</span> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    29 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <input id="_r_2r_" type="checkbox" aria-checked="false" class="MuiCheckbox-input css-1jj0cvj"/> from <span class="MuiCheckbox-checkbox css-n110n">…</span> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- main [ref=e4]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e10]:
        - heading "Applicant Registration" [level=3] [ref=e11]
        - generic [ref=e12]: Zamboanga City Medical Center • Recruitment Portal
      - generic [ref=e13]:
        - generic [ref=e14]: Step 2 of 7
        - generic [ref=e16]:
          - text: Already registered?
          - link "Login" [ref=e17] [cursor=pointer]:
            - /url: /login
    - generic [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e20]: Address Details
        - generic [ref=e21]: 29% Completed
      - progressbar [ref=e22]
    - list [ref=e24]:
      - listitem [ref=e25] [cursor=pointer]:
        - paragraph [ref=e30]: Profile
      - listitem [ref=e31]:
        - paragraph [ref=e36]: Address
      - listitem [ref=e37]:
        - paragraph [ref=e42]: Education
      - listitem [ref=e43]:
        - paragraph [ref=e48]: Eligibility
      - listitem [ref=e49]:
        - paragraph [ref=e54]: Experience
      - listitem [ref=e55]:
        - paragraph [ref=e60]: References
      - listitem [ref=e61]:
        - paragraph [ref=e66]: IPCR
    - separator [ref=e67]
    - generic [ref=e70]:
      - generic [ref=e71]:
        - paragraph [ref=e72]: Residential Address
        - generic [ref=e76]:
          - generic [ref=e78]:
            - generic [ref=e79]:
              - text: House / Block / Lot No.
              - generic [aria-hidden] [ref=e80]: "*"
            - textbox "House / Block / Lot No." [ref=e82]:
              - /placeholder: e.g., House No. 123 / Blk 4 Lot 5
              - text: Blk 4 Lot 5
          - generic [ref=e84]:
            - generic [ref=e85]:
              - text: Street
              - generic [aria-hidden] [ref=e86]: "*"
            - textbox "Street" [ref=e88]:
              - /placeholder: e.g., Main Street / Rizal St.
              - text: Rizal St.
          - generic [ref=e90]:
            - generic [ref=e91]: Subdivision / Village
            - textbox "Subdivision / Village" [ref=e93]:
              - /placeholder: e.g., Villa Maria (Optional)
          - generic [ref=e95]:
            - generic [ref=e96]:
              - text: City / Municipality
              - generic [aria-hidden] [ref=e97]: "*"
            - generic [ref=e98]:
              - combobox "City / Municipality" [ref=e100]: Zamboanga City (Zamboanga Del Sur)
              - button "Open" [ref=e101] [cursor=pointer]
          - generic [ref=e105]:
            - generic [ref=e106]:
              - text: Barangay
              - generic [aria-hidden] [ref=e107]: "*"
            - generic [ref=e108]:
              - combobox "Barangay" [ref=e110]: Arena Blanco
              - button "Open" [ref=e111] [cursor=pointer]
          - generic [ref=e115]:
            - generic [ref=e116]:
              - text: Province
              - generic [aria-hidden] [ref=e117]: "*"
            - textbox "Province" [ref=e119]: Zamboanga Del Sur
          - generic [ref=e121]:
            - generic [ref=e122]:
              - text: Zip Code
              - generic [aria-hidden] [ref=e123]: "*"
            - textbox "Zip Code" [ref=e125]:
              - /placeholder: e.g., 7000
              - text: "7000"
          - generic [ref=e127]:
            - generic [ref=e128]:
              - text: Telephone / Contact No.
              - generic [aria-hidden] [ref=e129]: "*"
            - textbox "Telephone / Contact No." [active] [ref=e131]:
              - /placeholder: Telephone or contact number
              - text: "09123456789"
      - generic [ref=e132]:
        - generic [ref=e133]:
          - paragraph [ref=e134]: Permanent Address
          - generic [ref=e140]:
            - checkbox "Same as residential address" [ref=e143] [cursor=pointer]
            - generic [ref=e144]: Same as residential address
        - generic [ref=e145]:
          - generic [ref=e147]:
            - generic [ref=e148]:
              - text: House / Block / Lot No.
              - generic [aria-hidden] [ref=e149]: "*"
            - textbox "House / Block / Lot No." [ref=e151]:
              - /placeholder: e.g., House No. 123 / Blk 4 Lot 5
          - generic [ref=e153]:
            - generic [ref=e154]:
              - text: Street
              - generic [aria-hidden] [ref=e155]: "*"
            - textbox "Street" [ref=e157]:
              - /placeholder: e.g., Main Street / Rizal St.
          - generic [ref=e159]:
            - generic [ref=e160]: Subdivision / Village
            - textbox "Subdivision / Village" [ref=e162]:
              - /placeholder: e.g., Villa Maria (Optional)
          - generic [ref=e164]:
            - generic [ref=e165]:
              - text: City / Municipality
              - generic [aria-hidden] [ref=e166]: "*"
            - generic [ref=e167]:
              - combobox "City / Municipality" [ref=e169]
              - button "Open" [ref=e170] [cursor=pointer]
          - generic [ref=e174]:
            - generic [ref=e175]:
              - text: Barangay
              - generic [aria-hidden] [ref=e176]: "*"
            - generic [ref=e177]:
              - combobox "Barangay" [ref=e179]
              - button "Open" [ref=e180] [cursor=pointer]
          - generic [ref=e184]:
            - generic [ref=e185]:
              - text: Province
              - generic [aria-hidden] [ref=e186]: "*"
            - textbox "Province" [ref=e188]
          - generic [ref=e190]:
            - generic [ref=e191]:
              - text: Zip Code
              - generic [aria-hidden] [ref=e192]: "*"
            - textbox "Zip Code" [ref=e194]:
              - /placeholder: e.g., 7000
          - generic [ref=e196]:
            - generic [ref=e197]:
              - text: Telephone / Contact No.
              - generic [aria-hidden] [ref=e198]: "*"
            - textbox "Telephone / Contact No." [ref=e200]:
              - /placeholder: Telephone or contact number
    - separator [ref=e201]
    - generic [ref=e202]:
      - button "Back" [ref=e203] [cursor=pointer]
      - generic [ref=e207]: Step 2 of 7
      - button "Next Step" [ref=e208] [cursor=pointer]
  - generic [ref=e212]:
    - text: Currently employed in ZCMC?
    - generic [ref=e213] [cursor=pointer]: Click here to sync UMIS Account
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | 
  3   | // Applicant registration (/register): 7-step wizard (Profile, Address, Education, Eligibility, Experience,
  4   | // References, IPCR). Finishing it opens a Registration Prompt, then a Legal Affirmation, then /verify.
  5   | //   Part A  checks the Step 1 form only.
  6   | //   Part B  walks through Steps 2-7 with test data and stops before Finish Registration (no account is created).
  7   | //   Part C  submits the registration. It creates a real account on the live system, so it needs
  8   | //           RUN_FULL_REGISTRATION=1 and a NEW TEST_EMAIL every time (an email can be registered only once).
  9   | 
  10  | const MOBILE = process.env.TEST_MOBILE ?? '09123456789';
  11  | const EMAIL = process.env.TEST_EMAIL ?? 'zcmc.pwtest01@mailinator.com';
  12  | const PASSWORD = process.env.TEST_PASSWORD ?? 'ChangeMe#2026!';
  13  | 
  14  | const isValid = (page: Page, placeholder: string) =>
  15  |   page.getByPlaceholder(placeholder).evaluate((el) => (el as HTMLInputElement).checkValidity());
  16  | 
  17  | // MUI Joy select: click the button, then pick an option of the open list.
  18  | async function pickOption(page: Page, buttonText: string, optionText?: string) {
  19  |   await page.locator('button', { hasText: buttonText }).first().click();
  20  |   const list = page.locator('ul.MuiSelect-listbox.Mui-expanded li');
  21  |   if (optionText) await list.filter({ hasText: optionText }).first().click();
  22  |   else await list.first().click();
  23  | }
  24  | 
  25  | // Field labels render with a required marker ("Sex *"), so match the label text with an optional asterisk.
  26  | const labelOf = (label: string) => new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}\\s*\\*?$`);
  27  | 
  28  | // An email can be registered only once and the site checks it on Step 1, so the walk-through uses a new one each time.
  29  | const freshEmail = () => `zcmc.pw${Date.now()}@mailinator.com`;
  30  | 
  31  | const stepText = (page: Page, n: number) => page.getByText(`Step ${n} of 7`).first();
  32  | const next = (page: Page) => page.getByRole('button', { name: 'Next Step' }).click();
  33  | 
  34  | async function fillStep1(page: Page, email = freshEmail()) {
  35  |   await page.getByPlaceholder('First name').fill('Testfirst');
  36  |   await page.getByPlaceholder('Middle name').fill('Testmiddle');
  37  |   await page.getByPlaceholder('Last name').fill('Testlast');
  38  |   await page.locator('input[type=date]').fill('1995-05-15');
  39  |   await page.getByPlaceholder('City/Municipality, Province').fill('Zamboanga City, Zamboanga del Sur');
  40  |   await page.getByPlaceholder('e.g., Filipino').fill('Filipino');
  41  |   await page.getByPlaceholder('09XXXXXXXXX').fill(MOBILE);
  42  |   await page.getByPlaceholder('name@example.com').fill(email);
  43  |   await page.getByPlaceholder('Create password').fill(PASSWORD);
  44  |   for (const label of ['Select sex...', 'Select civil status...', 'Select Blood Type', 'Select religion...']) {
  45  |     await pickOption(page, label);
  46  |   }
  47  |   // Sexual Orientation and Specific Membership both start as 'Select...'.
  48  |   // Membership must be 'None': 'PWD' adds a required 'Type of Disability' field.
  49  |   await pickOption(page, 'Select...');
  50  |   await pickOption(page, 'Select...', 'None');
  51  |   await pickOption(page, 'Select ethnicity...');
  52  | }
  53  | 
  54  | async function fillStep2(page: Page) {
  55  |   await page.getByPlaceholder('e.g., House No. 123 / Blk 4 Lot 5').first().fill('Blk 4 Lot 5');
  56  |   await page.getByPlaceholder('e.g., Main Street / Rizal St.').first().fill('Rizal St.');
  57  |   await page.getByPlaceholder('Select City / Municipality...').first().fill('Zamboanga City');
  58  |   await page.getByRole('option', { name: 'Zamboanga City (Zamboanga Del Sur)' }).click();
  59  |   await page.getByPlaceholder('Select Barangay...').first().click();
  60  |   await page.getByRole('option').first().click();
  61  |   await page.getByPlaceholder('Telephone or contact number').first().fill('09123456789');
> 62  |   await page.getByText('Same as residential address').click();
      |                                                       ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  63  | }
  64  | 
  65  | async function fillStep3(page: Page) {
  66  |   await page.getByRole('button', { name: 'Add Education Entry' }).click();
  67  |   await pickOption(page, 'Select Level', 'College');
  68  |   await page.getByPlaceholder('e.g., Zamboanga City State Polytechnic College').fill('Test University');
  69  |   await page.getByPlaceholder('e.g., Bachelor of Science in Nursing').fill('Bachelor of Science in Nursing');
  70  |   await page.locator('button', { hasText: 'Select year' }).first().click();
  71  |   await page.locator('ul.MuiSelect-listbox.Mui-expanded li', { hasText: '2021' }).first().click();
  72  |   await page.locator('button', { hasText: 'Select year' }).first().click();
  73  |   await page.locator('ul.MuiSelect-listbox.Mui-expanded li', { hasText: '2025' }).first().click();
  74  | }
  75  | 
  76  | async function fillStep4(page: Page) {
  77  |   await page.getByRole('button', { name: 'Add Eligibility Entry' }).click();
  78  |   await pickOption(page, 'Select eligibility...', 'Career Service Professional');
  79  |   await page.getByPlaceholder('e.g., 85.5').fill('85.5');
  80  |   const dates = page.locator('input[type=date]');
  81  |   await dates.nth(0).fill('2024-03-10');
  82  |   await page.getByPlaceholder('City / Location').fill('Zamboanga City');
  83  |   await dates.nth(1).fill('2024-05-10');
  84  | }
  85  | 
  86  | async function fillStep5(page: Page) {
  87  |   await page.getByRole('button', { name: 'Add Experience Entry' }).click();
  88  |   const dates = page.locator('input[type=date]');
  89  |   await dates.nth(0).fill('2022-01-10');
  90  |   await dates.nth(1).fill('2024-12-20');
  91  |   await page.getByPlaceholder('e.g., Nurse II, Administrative Officer I').fill('Staff Nurse');
  92  |   await page.getByPlaceholder('Company or agency name').fill('Test Hospital');
  93  |   await page.getByPlaceholder('e.g., Permanent, Contractual, Job Order').fill('Contractual');
  94  | }
  95  | 
  96  | async function fillStep6(page: Page) {
  97  |   await page.getByRole('button', { name: 'Add Reference Entry' }).click();
  98  |   await page.getByPlaceholder('e.g., Dr. Juan Dela Cruz').fill('Dr. Test Reference');
  99  |   await page.getByPlaceholder('e.g., Department Head').fill('Department Head');
  100 |   await page.getByPlaceholder('email@example.com').fill('zcmc.pwref01@mailinator.com');
  101 |   await page.getByPlaceholder('Mobile / Phone number').fill('09123456780');
  102 |   await page.getByPlaceholder('Complete office address').fill('Test Hospital, Zamboanga City');
  103 |   await pickOption(page, 'Select type...', 'Supervisor');
  104 | }
  105 | 
  106 | const fillers = [fillStep1, fillStep2, fillStep3, fillStep4, fillStep5, fillStep6];
  107 | 
  108 | // Opens /register, fills and passes every step before `step`, and leaves the wizard on `step`.
  109 | // Returns the email that was used on Step 1.
  110 | async function goToStep(page: Page, step: number, email = freshEmail()) {
  111 |   await page.goto('/register');
  112 |   for (let s = 1; s < step; s++) {
  113 |     if (s === 1) await fillStep1(page, email);
  114 |     else await fillers[s - 1](page);
  115 |     await next(page);
  116 |     await expect(stepText(page, s + 1)).toBeVisible();
  117 |   }
  118 |   return email;
  119 | }
  120 | 
  121 | // ---------- Part A: Step 1 form checks (no account is created) ----------
  122 | test.describe('Registration form checks (no account is created)', () => {
  123 |   test.beforeEach(async ({ page }) => {
  124 |     await page.goto('/register');
  125 |   });
  126 | 
  127 |   test('TC-REG-001: page loads on Step 1 of 7 with all seven steps in the stepper', async ({ page }) => {
  128 |     await expect(page.getByRole('heading', { name: 'Applicant Registration' })).toBeVisible();
  129 |     await expect(page.getByText('Step 1 of 7').first()).toBeVisible();
  130 |     await expect(page.getByText('14% Completed')).toBeVisible();
  131 |     for (const step of ['Profile', 'Address', 'Education', 'Eligibility', 'Experience', 'References', 'IPCR']) {
  132 |       await expect(page.getByText(step, { exact: true })).toBeVisible();
  133 |     }
  134 |   });
  135 | 
  136 |   test('TC-REG-002: Step 1 shows all personal information fields', async ({ page }) => {
  137 |     await expect(page.getByPlaceholder('First name')).toBeVisible();
  138 |     await expect(page.getByPlaceholder('Middle name')).toBeVisible();
  139 |     await expect(page.getByPlaceholder('Last name')).toBeVisible();
  140 |     await expect(page.getByPlaceholder('e.g., Jr., III (Optional)')).toBeVisible();
  141 |     await expect(page.locator('input[type=date]')).toBeVisible();
  142 |     await expect(page.getByPlaceholder('City/Municipality, Province')).toBeVisible();
  143 |     for (const label of ['Sex', 'Date of Birth', 'Civil Status', 'Place of Birth']) {
  144 |       await expect(page.getByText(labelOf(label)).first()).toBeVisible();
  145 |     }
  146 |   });
  147 | 
  148 |   test('TC-REG-003: Step 1 shows demographics and account fields', async ({ page }) => {
  149 |     for (const label of [
  150 |       'Blood Type',
  151 |       'Religion',
  152 |       'Sexual Orientation',
  153 |       'Specific Membership',
  154 |       'Ethnicity / Ethnolinguistic Group',
  155 |       'Citizenship',
  156 |       'Mobile Phone Number',
  157 |       'Email Address',
  158 |       'Password',
  159 |     ]) {
  160 |       await expect(page.getByText(labelOf(label)).first()).toBeVisible();
  161 |     }
  162 |     await expect(page.getByPlaceholder('e.g., Filipino')).toBeVisible();
```