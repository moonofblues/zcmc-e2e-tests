import { test, expect } from '@playwright/test';
import { closeSuccessDialog, processFirstRequestInQueue } from '../support/queue';

const PIN = process.env.TEST_USER_PIN; // same PIN as the end user, like the other offices

// Cash Operations is the last office. It processes a request, then completes it to end the transaction.
// Works on requests Accounting already processed (they appear in Cash Operations' queue).
test.describe('Cash Operations: process, then complete a request', () => {
  test.skip(!PIN, 'Set TEST_USER_PIN in e2e/.env');

  test('process (FS-CO, Received), then complete (timeline ends with "Transaction ended")', async ({ page }) => {
    // 1. Process: success shown, and the newest timeline entry is "FS-CO (You)" with the Received pill.
    //    The request stays in the queue until it is completed, so the queue count is not checked.
    const code = await processFirstRequestInQueue(page, {
      user: 'Cash Operation',
      office: 'FS-CO',
      pin: PIN!,
      leavesQueue: false,
    });
    test.skip(code === undefined, 'Cash Operations has nothing in the queue. Run the accounting process test first.');

    // 2. Complete the same request from its Manage page.
    await page.goto(`/transactions/manage/${code}`);
    await expect(page.getByText('Management timeline')).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: 'Complete' }).click();
    await page.getByRole('textbox', { name: 'Remarks' }).fill('Completed by automated test');
    await page.getByRole('textbox', { name: 'Authorization PIN *' }).fill(PIN!);
    await page.getByRole('button', { name: 'Confirm' }).click();
    await closeSuccessDialog(page);

    // 3. The last process on the timeline is "Transaction ended", after the FS-CO entry.
    await page.goto(`/transactions/manage/${code}`);
    await expect(page.getByText('Management timeline')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText('Transaction ended').first()).toBeVisible({ timeout: 30_000 });
    // Only look at the timeline itself: the page text continues with the Developer Tools panel,
    // whose JSON also mentions "FS-CO".
    const text = await page.locator('body').innerText();
    const from = text.indexOf('Management timeline');
    const to = text.indexOf('Developer Tools');
    const lines = text.slice(from, to > from ? to : undefined).split('\n').map((l) => l.trim());
    const fsCoEntry = lines.findLastIndex((l) => /^FS-CO \(.+\)$/.test(l)); // header like "FS-CO (You)"
    const ended = lines.findLastIndex((l) => l.includes('Transaction ended'));
    expect(fsCoEntry, 'the timeline has an FS-CO entry').toBeGreaterThanOrEqual(0);
    expect(ended, '"Transaction ended" comes after the FS-CO entry').toBeGreaterThan(fsCoEntry);
  });
});
