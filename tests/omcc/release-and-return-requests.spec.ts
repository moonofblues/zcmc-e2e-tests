import { test, expect, Page } from '@playwright/test';
import { loginAs } from '../support/helpers';

const OMCC_USER = 'OMCC Kim Herbero';
const OMCC_OFFICE = 'Office of Medical Center Chief';
const SEARCH = 'Search by transaction code, requester, details...';

/** OMCC "Manage Requests" list: find the request by transaction code. */
async function findInManageRequests(page: Page, code: string) {
  await page.goto('/transactions');
  await page.getByPlaceholder(SEARCH).fill(code);
  const row = page.getByRole('row', { name: code });
  await expect(row, `request ${code} is in the OMCC list`).toBeVisible();
  return row;
}

/** Open the request's details page from its row's action button. */
async function openRequest(page: Page, code: string) {
  const row = await findInManageRequests(page, code);
  await row.getByRole('button').last().click();
  await expect(page).toHaveURL(new RegExp(`/transactions/manage/${code}`));
  await expect(page.getByText('Management timeline')).toBeVisible();
}

/** Close the "Successfully transitioned to next step" dialog and wait until it is gone. */
async function closeSuccessDialog(page: Page) {
  const dialog = page.getByRole('dialog').filter({ hasText: 'Successfully transitioned to next step' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Close' }).click();
  await expect(dialog).toBeHidden();
}

/**
 * Pick an existing request that was submitted at the terminal and is waiting for the OMCC
 * (status "Submitted" in the Manage Requests list). Returns undefined when there is none.
 */
async function findSubmittedRequest(page: Page): Promise<string | undefined> {
  await page.goto('/transactions');
  await page.getByPlaceholder(SEARCH).waitFor();
  // No \b around the code: the cells' text runs together ("2610167862Larry Gabriel...").
  const submitted = page.getByRole('row').filter({ hasText: /\d{10}/ }).filter({ hasText: 'Submitted' });
  await submitted.first().waitFor({ timeout: 30_000 }).catch(() => {}); // the sandbox can be slow to draw the table
  if ((await submitted.count()) === 0) return undefined;
  return (await submitted.first().innerText()).match(/\d{10}/)![0];
}

// Uses requests already submitted at the terminal; the terminal submission test creates them.
test.describe('OMCC: manage a submitted petty cash request', () => {
  let code: string;

  test.beforeEach(async ({ page }) => {
    await loginAs(page, OMCC_USER);
    const found = await findSubmittedRequest(page);
    test.skip(!found, 'No submitted requests for the OMCC. Run the terminal submission test first.');
    code = found!;

    // Before OMCC acts: the list shows it as Submitted, sitting in the OMCC office.
    const row = await findInManageRequests(page, code);
    await expect(row).toContainText('Submitted');
    await expect(row).toContainText(OMCC_OFFICE);
  });

  test('release: timeline shows released by OMCC, still in the OMCC office', async ({ page }) => {
    await openRequest(page, code);
    await page.getByRole('button', { name: 'Release', exact: true }).click();
    await page.getByRole('textbox', { name: 'Remarks' }).fill('Released by automated test');
    await page.getByRole('button', { name: 'Confirm' }).click();
    await closeSuccessDialog(page);

    // Details page timeline.
    await expect(page.getByText('Released By OMCC')).toBeVisible();

    // Manage Requests list: Released, and the document is still in the OMCC office.
    const row = await findInManageRequests(page, code);
    await expect(row).toContainText('Released');
    await expect(row).toContainText(OMCC_OFFICE);
  });

  test('return: timeline shows returned, current office is Return to the Requester', async ({ page }) => {
    await openRequest(page, code);
    await page.getByRole('button', { name: 'Return', exact: true }).click();
    await page.getByRole('combobox', { name: 'Select reason(s) *' }).click();
    await page.getByRole('option', { name: 'Lacks attachments' }).click();
    await page.getByRole('textbox', { name: 'Remarks *' }).fill('Lacking');
    await page.getByRole('button', { name: 'Confirm' }).click();
    await closeSuccessDialog(page);

    // Details page timeline, including the remarks the OMCC wrote.
    await expect(page.getByText('Return to the Requester').first()).toBeVisible();
    await page.getByText('See remarks').click();
    const remarks = page.getByRole('dialog').filter({ hasText: 'Lacking' });
    await expect(remarks).toBeVisible();
    await remarks.getByRole('button', { name: 'Close' }).click();
    await expect(remarks).toBeHidden();

    // Manage Requests list: Returned, with Current Office "Return to the Requester".
    const row = await findInManageRequests(page, code);
    await expect(row).toContainText('Returned');
    await expect(row).toContainText('Return to the Requester');
  });
});
