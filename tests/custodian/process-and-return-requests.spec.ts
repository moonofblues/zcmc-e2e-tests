import { test, expect, Page } from '@playwright/test';
import { loginAs } from '../support/helpers';

const CUSTODIAN_USER = 'Custodian Dietary';
const PIN = process.env.TEST_USER_PIN; // the custodian uses the same PIN as the end user
const SEARCH = 'Search by transaction code, requester, details...';

/** Close the "Successfully ..." dialog and wait until it is gone. */
async function closeSuccessDialog(page: Page) {
  const dialog = page.getByRole('dialog').filter({ hasText: /Successfully/i });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Close' }).click();
  await expect(dialog).toBeHidden();
}

/**
 * Custodian Requests page -> filter "currently needing action" -> open the first request.
 * Returns its transaction code, or undefined when nothing needs action.
 */
async function openFirstRequestNeedingAction(page: Page): Promise<string | undefined> {
  await expect(page.getByText(/Welcome back/).first()).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button').first().click(); // hamburger menu
  await page.getByRole('dialog').locator('a').filter({ hasText: 'Custodian Requests' }).click();

  await page.getByLabel('Click to filter transactions currently needing action').click();
  const rows = page.getByRole('row').filter({ hasText: /\d{10}/ });
  await rows.first().waitFor({ timeout: 30_000 }).catch(() => {}); // the sandbox can be slow to draw the table
  if ((await rows.count()) === 0) return undefined;

  const first = rows.first();
  const code = (await first.innerText()).match(/\d{10}/)![0];
  await first.locator('td:nth-child(9) .MuiIconButton-root').click(); // the row's action button
  await expect(page.getByText(new RegExp(`#${code}`)).first()).toBeVisible();
  return code;
}

/**
 * Manage Requests page -> open the first request the custodian has already processed
 * (Current Office "Custodian"; requests already returned read "Return to Requester by Custodian").
 * Only a processed request has the Return button. Returns its code, or undefined when there is none.
 */
async function openFirstProcessedRequest(page: Page): Promise<string | undefined> {
  await page.goto('/transactions');
  const rows = page
    .getByRole('row')
    .filter({ hasText: /\d{10}/ })
    .filter({ hasText: 'Custodian' })
    .filter({ hasNotText: /Return/ });
  await rows.first().waitFor({ timeout: 30_000 }).catch(() => {}); // the sandbox can be slow to draw the table
  if ((await rows.count()) === 0) return undefined;

  const first = rows.first();
  const code = (await first.innerText()).match(/\d{10}/)![0];
  await first.getByRole('button').last().click(); // the row's action button
  await expect(page).toHaveURL(new RegExp(`/transactions/manage/${code}`));
  await expect(page.getByText('Management timeline')).toBeVisible();
  return code;
}

/** The last status word on the request's timeline (Created, Submitted, Released, Received or Returned). */
async function latestTimelineStatus(page: Page): Promise<string | undefined> {
  const text = await page.locator('body').innerText();
  const from = text.indexOf('Management timeline');
  const to = text.indexOf('Developer Tools');
  const timeline = text.slice(from, to > from ? to : undefined);
  const statuses = [...timeline.matchAll(/\b(Created|Submitted|Released|Received|Returned)\b/g)].map((m) => m[1]);
  return statuses.at(-1);
}

/** Open the request's Manage page and check that the latest timeline update is `status`. */
async function expectLatestTimelineStatus(page: Page, code: string, status: 'Received' | 'Returned') {
  await page.goto(`/transactions/manage/${code}`);
  await expect(page.getByText('Management timeline')).toBeVisible({ timeout: 30_000 });
  await expect
    .poll(() => latestTimelineStatus(page), { message: `latest timeline update of ${code}` })
    .toBe(status);
}

/** Manage Requests list: the "Current Office" of a request. */
async function expectCurrentOffice(page: Page, code: string, office: string) {
  await page.goto('/transactions');
  await page.getByPlaceholder(SEARCH).fill(code);
  const row = page.getByRole('row', { name: code });
  await expect(row, `request ${code} is in the Manage Requests list`).toBeVisible({ timeout: 30_000 });
  await expect(row).toContainText(office);
}

// Uses requests already received by the end user at the terminal (they appear in the Custodian's queue).
test.describe('Custodian: manage a request that needs action', () => {
  test.skip(!PIN, 'Set TEST_USER_PIN in e2e/.env');

  test.beforeEach(async ({ page }) => {
    await loginAs(page, CUSTODIAN_USER);
  });

  test('process: control number, remarks and PIN; latest timeline update is Received', async ({ page }) => {
    const code = await openFirstRequestNeedingAction(page);
    test.skip(!code, 'Nothing needs the custodian\'s action. Run the receiving test first.');

    await page.getByRole('button', { name: 'Process' }).click();
    // A unique control number each run, in the same shape as the sandbox ones (PR-PCF-<year>-<n>).
    const controlNumber = `PR-PCF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    await page.getByRole('textbox', { name: 'Control Number' }).fill(controlNumber);
    await page.getByRole('textbox', { name: 'Remarks' }).fill('Processed by automated test');
    await page.getByRole('textbox', { name: 'Authorization PIN *' }).fill(PIN!);
    await page.getByRole('button', { name: 'Confirm' }).click();
    await closeSuccessDialog(page);

    await expectLatestTimelineStatus(page, code!, 'Received');
    await expectCurrentOffice(page, code!, 'Custodian');
  });

  // Returns a request the custodian already processed, so it must run after the process test above.
  test('return: reason, remarks and PIN; latest timeline update is Returned', async ({ page }) => {
    const code = await openFirstProcessedRequest(page);
    test.skip(!code, 'No processed request to return. Run the process test first.');

    await page.getByRole('button', { name: 'Return', exact: true }).click();
    await page.getByRole('combobox', { name: 'Select reason(s) *' }).click();
    await page.getByRole('option', { name: 'Non-compliance to PPMP' }).click();
    await page.getByRole('textbox', { name: 'Remarks *' }).fill('Returned by automated test');
    await page.getByRole('textbox', { name: 'Authorization PIN *' }).fill(PIN!);
    await page.getByRole('button', { name: 'Confirm' }).click();
    await closeSuccessDialog(page);

    await expectLatestTimelineStatus(page, code!, 'Returned');
    await expectCurrentOffice(page, code!, 'Return to Requester by Custodian');
  });
});
