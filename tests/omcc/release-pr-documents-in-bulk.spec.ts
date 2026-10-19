import { test, expect, Page } from '@playwright/test';
import { loginAs } from '../support/helpers';

const OMCC_USER = 'OMCC Kim Herbero';
const SEARCH = 'Search by transaction code, requester, details...';
const BULK_COUNT = 2; // the bulk release is tested with exactly 2 petty cash requests

/** Manage Requests -> "Release PR Document" opens the "Release Purchase Request" dialog. */
async function openReleaseDialog(page: Page) {
  await page.goto('/transactions');
  await page.getByRole('button', { name: 'Release PR Document' }).click();
  const dialog = page.getByRole('dialog', { name: 'Release Purchase Request' });
  await expect(dialog).toBeVisible();
  return dialog;
}

// Uses requests already submitted at the terminal and waiting for the OMCC (same pool as the
// single Release test); the terminal submission test creates them. Released requests are then
// the ones the end user receives in tests/terminal.
test.describe('OMCC: release PR documents in bulk', () => {
  test('releases 2 petty cash requests at once; they become Released', async ({ page }) => {
    await loginAs(page, OMCC_USER);
    const dialog = await openReleaseDialog(page);

    // The dialog lists the requests that can be released. Take the first two.
    const rows = dialog.getByRole('row').filter({ hasText: /\d{10}/ });
    await rows.first().waitFor({ timeout: 30_000 }).catch(() => {}); // the sandbox can be slow to draw the table
    test.skip((await rows.count()) < BULK_COUNT, `Need at least ${BULK_COUNT} requests to release. Run the terminal submission test first.`);

    const codes: string[] = [];
    for (let i = 0; i < BULK_COUNT; i++) {
      const row = rows.nth(i);
      codes.push((await row.innerText()).match(/\d{10}/)![0]);
      await row.getByRole('checkbox').check();
    }

    await dialog.getByRole('button', { name: 'Confirm' }).click();

    // Success confirmation, then close it.
    const success = page.getByRole('dialog').filter({ hasText: /success/i });
    await expect(success).toBeVisible();
    await success.getByRole('button', { name: 'Close' }).click();
    await expect(success).toBeHidden();

    // The two requests are no longer offered for release.
    const reopened = await openReleaseDialog(page);
    for (const code of codes) {
      await expect(reopened.getByRole('row', { name: code })).toHaveCount(0);
    }
    await page.keyboard.press('Escape');

    // Manage Requests list: both are now Released.
    for (const code of codes) {
      await page.goto('/transactions');
      await page.getByPlaceholder(SEARCH).fill(code);
      const row = page.getByRole('row', { name: code });
      await expect(row, `request ${code} is in the Manage Requests list`).toBeVisible({ timeout: 30_000 });
      await expect(row).toContainText('Released');
    }
  });
});
