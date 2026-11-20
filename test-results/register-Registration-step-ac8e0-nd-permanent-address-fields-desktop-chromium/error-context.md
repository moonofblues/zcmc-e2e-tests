# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: register.spec.ts >> Registration steps 2-7 (stops before Finish Registration) >> TC-REG-011: Step 2 shows the residential and permanent address fields
- Location: tests\register.spec.ts:209:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Residential Address')
Expected: visible
Error: strict mode violation: getByText('Residential Address') resolved to 2 elements:
    1) <p class="MuiTypography-root MuiTypography-title-md css-1pso1gj">…</p> aka getByText('Residential Address', { exact: true })
    2) <label for="_r_2r_" class="MuiCheckbox-label css-1fjtzvx">Same as residential address</label> aka getByText('Same as residential address')

Call log:
  - Expect "toBeVisible" getByText('Residential Address') with timeout 10000ms
  - waiting for getByText('Residential Address')

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
          - generic [ref=e84]:
            - generic [ref=e85]:
              - text: Street
              - generic [aria-hidden] [ref=e86]: "*"
            - textbox "Street" [ref=e88]:
              - /placeholder: e.g., Main Street / Rizal St.
          - generic [ref=e90]:
            - generic [ref=e91]: Subdivision / Village
            - textbox "Subdivision / Village" [ref=e93]:
              - /placeholder: e.g., Villa Maria (Optional)
          - generic [ref=e95]:
            - generic [ref=e96]:
              - text: City / Municipality
              - generic [aria-hidden] [ref=e97]: "*"
            - generic [ref=e98]:
              - combobox "City / Municipality" [ref=e100]
              - progressbar [ref=e102]
              - button "Open" [ref=e106] [cursor=pointer]
          - generic [ref=e110]:
            - generic [ref=e111]:
              - text: Barangay
              - generic [aria-hidden] [ref=e112]: "*"
            - generic:
              - generic:
                - combobox "Barangay" [disabled]
              - button "Open" [disabled]
          - generic [ref=e114]:
            - generic [ref=e115]:
              - text: Province
              - generic [aria-hidden] [ref=e116]: "*"
            - textbox "Province" [ref=e118]
          - generic [ref=e120]:
            - generic [ref=e121]:
              - text: Zip Code
              - generic [aria-hidden] [ref=e122]: "*"
            - textbox "Zip Code" [ref=e124]:
              - /placeholder: e.g., 7000
          - generic [ref=e126]:
            - generic [ref=e127]:
              - text: Telephone / Contact No.
              - generic [aria-hidden] [ref=e128]: "*"
            - textbox "Telephone / Contact No." [ref=e130]:
              - /placeholder: Telephone or contact number
      - generic [ref=e131]:
        - generic [ref=e132]:
          - paragraph [ref=e133]: Permanent Address
          - generic [ref=e139]:
            - checkbox "Same as residential address" [ref=e142] [cursor=pointer]
            - generic [ref=e143]: Same as residential address
        - generic [ref=e144]:
          - generic [ref=e146]:
            - generic [ref=e147]:
              - text: House / Block / Lot No.
              - generic [aria-hidden] [ref=e148]: "*"
            - textbox "House / Block / Lot No." [ref=e150]:
              - /placeholder: e.g., House No. 123 / Blk 4 Lot 5
          - generic [ref=e152]:
            - generic [ref=e153]:
              - text: Street
              - generic [aria-hidden] [ref=e154]: "*"
            - textbox "Street" [ref=e156]:
              - /placeholder: e.g., Main Street / Rizal St.
          - generic [ref=e158]:
            - generic [ref=e159]: Subdivision / Village
            - textbox "Subdivision / Village" [ref=e161]:
              - /placeholder: e.g., Villa Maria (Optional)
          - generic [ref=e163]:
            - generic [ref=e164]:
              - text: City / Municipality
              - generic [aria-hidden] [ref=e165]: "*"
            - generic [ref=e166]:
              - combobox "City / Municipality" [ref=e168]
              - progressbar [ref=e170]
              - button "Open" [ref=e174] [cursor=pointer]
          - generic [ref=e178]:
            - generic [ref=e179]:
              - text: Barangay
              - generic [aria-hidden] [ref=e180]: "*"
            - generic:
              - generic:
                - combobox "Barangay" [disabled]
              - button "Open" [disabled]
          - generic [ref=e182]:
            - generic [ref=e183]:
              - text: Province
              - generic [aria-hidden] [ref=e184]: "*"
            - textbox "Province" [ref=e186]
          - generic [ref=e188]:
            - generic [ref=e189]:
              - text: Zip Code
              - generic [aria-hidden] [ref=e190]: "*"
            - textbox "Zip Code" [ref=e192]:
              - /placeholder: e.g., 7000
          - generic [ref=e194]:
            - generic [ref=e195]:
              - text: Telephone / Contact No.
              - generic [aria-hidden] [ref=e196]: "*"
            - textbox "Telephone / Contact No." [ref=e198]:
              - /placeholder: Telephone or contact number
    - separator [ref=e199]
    - generic [ref=e200]:
      - button "Back" [ref=e201] [cursor=pointer]
      - generic [ref=e205]: Step 2 of 7
      - button "Next Step" [active] [ref=e206] [cursor=pointer]
  - generic [ref=e210]:
    - text: Currently employed in ZCMC?
    - generic [ref=e211] [cursor=pointer]: Click here to sync UMIS Account
```

# Test source

```ts
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
  163 |     await expect(page.getByPlaceholder('09XXXXXXXXX')).toBeVisible();
  164 |     await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
  165 |     await expect(page.getByPlaceholder('Create password')).toBeVisible();
  166 |   });
  167 | 
  168 |   test('TC-REG-004: empty Step 1 cannot proceed to Step 2', async ({ page }) => {
  169 |     await page.getByRole('button', { name: 'Next Step' }).click();
  170 |     await expect(page.getByText('Step 1 of 7').first()).toBeVisible();
  171 |     expect(await isValid(page, 'First name')).toBe(false);
  172 |   });
  173 | 
  174 |   test('TC-REG-005: invalid email format is rejected', async ({ page }) => {
  175 |     await page.getByPlaceholder('name@example.com').fill('not-an-email');
  176 |     expect(await isValid(page, 'name@example.com')).toBe(false);
  177 |   });
  178 | 
  179 |   test('TC-REG-006: password field hides the typed characters', async ({ page }) => {
  180 |     await expect(page.getByPlaceholder('Create password')).toHaveAttribute('type', 'password');
  181 |   });
  182 | 
  183 |   test('TC-REG-007: "Already registered? Login" link opens the login page', async ({ page }) => {
  184 |     await page.getByRole('link', { name: 'Login' }).first().click();
  185 |     await expect(page).toHaveURL(/\/login$/);
  186 |   });
  187 | 
  188 |   test('TC-REG-008: "Click here to sync UMIS Account" is shown for ZCMC employees', async ({ page }) => {
  189 |     await expect(page.getByText('Currently employed in ZCMC?')).toBeVisible();
  190 |     await expect(page.getByText('Click here to sync UMIS Account')).toBeVisible();
  191 |   });
  192 | 
  193 |   test('TC-REG-009: dropdown options are loaded (selection-templates API is not empty)', async ({ request }) => {
  194 |     const res = await request.get('/api/selection-templates');
  195 |     expect(res.ok()).toBe(true);
  196 |     const data = await res.json();
  197 |     expect(Array.isArray(data) ? data.length : Object.keys(data).length).toBeGreaterThan(0);
  198 |   });
  199 | });
  200 | 
  201 | // ---------- Part B: Steps 2-7 (walks through the wizard, never clicks Finish Registration) ----------
  202 | // Step 1 is filled with test data and submitted with Next Step. The site may save a draft at that point.
  203 | test.describe('Registration steps 2-7 (stops before Finish Registration)', () => {
  204 |   test('TC-REG-010: applicant completes Step 1 and proceeds to Step 2', async ({ page }) => {
  205 |     await goToStep(page, 2);
  206 |     await expect(stepText(page, 2)).toBeVisible();
  207 |   });
  208 | 
  209 |   test('TC-REG-011: Step 2 shows the residential and permanent address fields', async ({ page }) => {
  210 |     await goToStep(page, 2);
  211 |     await expect(page.getByText('29% Completed')).toBeVisible();
> 212 |     await expect(page.getByText('Residential Address')).toBeVisible();
      |                                                         ^ Error: expect(locator).toBeVisible() failed
  213 |     await expect(page.getByText('Permanent Address')).toBeVisible();
  214 |     await expect(page.getByPlaceholder('e.g., House No. 123 / Blk 4 Lot 5')).toHaveCount(2);
  215 |     await expect(page.getByPlaceholder('e.g., Main Street / Rizal St.')).toHaveCount(2);
  216 |     await expect(page.getByPlaceholder('Province')).toHaveCount(2);
  217 |     await expect(page.getByPlaceholder('e.g., 7000')).toHaveCount(2);
  218 |     await expect(page.getByPlaceholder('Telephone or contact number')).toHaveCount(2);
  219 |   });
  220 | 
  221 |   test('TC-REG-012: empty Step 2 cannot proceed to Step 3', async ({ page }) => {
  222 |     await goToStep(page, 2);
  223 |     await next(page);
  224 |     await expect(stepText(page, 2)).toBeVisible();
  225 |   });
  226 | 
  227 |   test('TC-REG-013: choosing a city loads the barangays and fills Province and Zip Code', async ({ page }) => {
  228 |     await goToStep(page, 2);
  229 |     await page.getByPlaceholder('Select City / Municipality...').first().fill('Zamboanga City');
  230 |     await page.getByRole('option', { name: 'Zamboanga City (Zamboanga Del Sur)' }).click();
  231 |     await expect(page.getByPlaceholder('Province').first()).toHaveValue('Zamboanga Del Sur');
  232 |     await expect(page.getByPlaceholder('e.g., 7000').first()).toHaveValue('7000');
  233 |     await page.getByPlaceholder('Select Barangay...').first().click();
  234 |     await expect(page.getByRole('option', { name: 'Arena Blanco' })).toBeVisible();
  235 |   });
  236 | 
  237 |   test('TC-REG-014: "Same as residential address" copies and locks the permanent address', async ({ page }) => {
  238 |     await goToStep(page, 2);
  239 |     await fillStep2(page);
  240 |     await expect(page.getByPlaceholder('e.g., House No. 123 / Blk 4 Lot 5').nth(1)).toHaveValue('Blk 4 Lot 5');
  241 |     await expect(page.getByPlaceholder('e.g., House No. 123 / Blk 4 Lot 5').nth(1)).toBeDisabled();
  242 |     await expect(page.getByPlaceholder('e.g., Main Street / Rizal St.').nth(1)).toBeDisabled();
  243 |   });
  244 | 
  245 |   test('TC-REG-015: Back keeps the data entered on the previous step', async ({ page }) => {
  246 |     const email = await goToStep(page, 2);
  247 |     await page.getByRole('button', { name: 'Back' }).click();
  248 |     await expect(stepText(page, 1)).toBeVisible();
  249 |     await expect(page.getByPlaceholder('First name')).toHaveValue('Testfirst');
  250 |     await expect(page.getByPlaceholder('name@example.com')).toHaveValue(email);
  251 |   });
  252 | 
  253 |   test('TC-REG-016: Step 3 starts empty and Add Education Entry shows the education fields', async ({ page }) => {
  254 |     await goToStep(page, 3);
  255 |     await expect(page.getByText('43% Completed')).toBeVisible();
  256 |     await expect(page.getByText('No educational entries added yet')).toBeVisible();
  257 |     await page.getByRole('button', { name: 'Add Education Entry' }).click();
  258 |     await expect(page.getByText('Education Entry #1')).toBeVisible();
  259 |     for (const label of ['Education Level', 'School / Institution Name', 'Degree / Course', 'Year From', 'Year To']) {
  260 |       await expect(page.getByText(labelOf(label)).first()).toBeVisible();
  261 |     }
  262 |     await expect(page.getByPlaceholder('e.g., Cum Laude (Optional)')).toBeVisible();
  263 |     await page.locator('button', { hasText: 'Select Level' }).click();
  264 |     for (const level of ['Elementary', 'Secondary', 'Vocational/Trade Course', 'College', 'Graduate Studies']) {
  265 |       await expect(page.getByRole('option', { name: level })).toBeVisible();
  266 |     }
  267 |   });
  268 | 
  269 |   test('TC-REG-017: empty education entry cannot proceed', async ({ page }) => {
  270 |     await goToStep(page, 3);
  271 |     await page.getByRole('button', { name: 'Add Education Entry' }).click();
  272 |     await next(page);
  273 |     await expect(stepText(page, 3)).toBeVisible();
  274 |   });
  275 | 
  276 |   test('TC-REG-018: Year To earlier than Year From is rejected', async ({ page }) => {
  277 |     await goToStep(page, 3);
  278 |     await page.getByRole('button', { name: 'Add Education Entry' }).click();
  279 |     await pickOption(page, 'Select Level', 'College');
  280 |     await page.getByPlaceholder('e.g., Zamboanga City State Polytechnic College').fill('Test University');
  281 |     await page.getByPlaceholder('e.g., Bachelor of Science in Nursing').fill('Bachelor of Science in Nursing');
  282 |     await page.locator('button', { hasText: 'Select year' }).first().click();
  283 |     await page.locator('ul.MuiSelect-listbox.Mui-expanded li', { hasText: '2025' }).first().click();
  284 |     await page.locator('button', { hasText: 'Select year' }).first().click();
  285 |     await page.locator('ul.MuiSelect-listbox.Mui-expanded li', { hasText: '2021' }).first().click();
  286 |     await next(page);
  287 |     // Expected behavior still to be confirmed. This assumes the site blocks the range.
  288 |     await expect(stepText(page, 3)).toBeVisible();
  289 |   });
  290 | 
  291 |   test('TC-REG-019: an education entry can be removed', async ({ page }) => {
  292 |     await goToStep(page, 3);
  293 |     await page.getByRole('button', { name: 'Add Education Entry' }).click();
  294 |     await expect(page.getByText('Education Entry #1')).toBeVisible();
  295 |     // The delete button is the only button with no text on the page (it only shows an icon).
  296 |     await page.getByRole('button').filter({ hasNotText: /./ }).first().click();
  297 |     await expect(page.getByText('No educational entries added yet')).toBeVisible();
  298 |   });
  299 | 
  300 |   test('TC-REG-020: Step 4 Add Eligibility Entry shows the eligibility fields', async ({ page }) => {
  301 |     await goToStep(page, 4);
  302 |     await expect(page.getByText('57% Completed')).toBeVisible();
  303 |     await expect(page.getByText('No eligibility entries added yet')).toBeVisible();
  304 |     await page.getByRole('button', { name: 'Add Eligibility Entry' }).click();
  305 |     await expect(page.getByText('Eligibility Entry #1')).toBeVisible();
  306 |     await expect(page.getByText('Civil Service Eligibility / License Title')).toBeVisible();
  307 |     await expect(page.getByPlaceholder('e.g., 85.5')).toBeVisible();
  308 |     await expect(page.getByPlaceholder('City / Location')).toBeVisible();
  309 |     await expect(page.locator('input[type=date]')).toHaveCount(3);
  310 |   });
  311 | 
  312 |   test('TC-REG-021: empty eligibility entry cannot proceed', async ({ page }) => {
```