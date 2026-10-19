import { Page, expect } from '@playwright/test';
import { loginAs } from './helpers';

/** "In my queue": the card that filters the list to requests currently needing this user's action. */
function queueCard(page: Page) {
  return page.getByLabel('Click to filter transactions currently needing action');
}

/** The number shown on the queue card. */
async function queueCount(page: Page): Promise<number> {
  const heading = queueCard(page).getByRole('heading').filter({ hasText: /^\d+$/ }).first();
  return parseInt(await heading.innerText(), 10);
}

/** Close the "Successfully ..." dialog and wait until it is gone. */
export async function closeSuccessDialog(page: Page) {
  const dialog = page.getByRole('dialog').filter({ hasText: /success/i });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Close' }).click();
  await expect(dialog).toBeHidden();
}

/**
 * The newest timeline entry. Entries start with a header line like "Budget (You)" or
 * "OMCC (Larry Gabriel S. Año)"; the last header is the latest office that acted.
 * `lines` are the entry's own lines (header, status pill, workflow step, ...).
 */
export async function latestTimelineEntry(page: Page): Promise<{ office: string; lines: string[] } | undefined> {
  const text = await page.locator('body').innerText();
  const from = text.indexOf('Management timeline');
  const to = text.indexOf('Developer Tools');
  const lines = text.slice(from, to > from ? to : undefined).split('\n').map((l) => l.trim());
  const isHeader = (l: string) => /^(.+?) \(.+\)$/.test(l);
  const last = lines.map(isHeader).lastIndexOf(true);
  if (last === -1) return undefined;
  return { office: lines[last].match(/^(.+?) \(.+\)$/)![1], lines: lines.slice(last) };
}

/**
 * For offices that work from "in my queue" (Budget, Accounting): log in as `user`, process the
 * first request in the queue (remarks + PIN, no control number), then check that
 *  - the success modal appeared,
 *  - the request left the queue (count dropped by 1), unless `leavesQueue` is false
 *    (Cash Operations: the request stays in the queue until it is completed),
 *  - the newest timeline entry is `office`'s, with the Received pill.
 * Returns the transaction code, or undefined (and does nothing) when the queue is empty.
 */
export async function processFirstRequestInQueue(
  page: Page,
  opts: { user: string; office: string; pin: string; leavesQueue?: boolean },
): Promise<string | undefined> {
  await loginAs(page, opts.user);
  await page.goto('/transactions');
  await expect(queueCard(page)).toBeVisible({ timeout: 30_000 });
  const before = await queueCount(page);
  if (before === 0) return undefined;

  // Open the first request in the queue.
  await queueCard(page).click();
  const rows = page.getByRole('row').filter({ hasText: /\d{10}/ });
  await rows.first().waitFor({ timeout: 30_000 });
  const row = rows.first();
  const code = (await row.innerText()).match(/\d{10}/)![0];
  await row.getByRole('button').last().click(); // the row's action button
  await expect(page).toHaveURL(new RegExp(`/transactions/manage/${code}`));

  // Process it.
  await page.getByRole('button', { name: 'Process' }).click();
  await page.getByRole('textbox', { name: 'Remarks' }).fill('Processed by automated test');
  await page.getByRole('textbox', { name: 'Authorization PIN *' }).fill(opts.pin);
  await page.getByRole('button', { name: 'Confirm' }).click();
  await closeSuccessDialog(page);

  // It is no longer in the user's queue.
  if (opts.leavesQueue ?? true) {
    await page.goto('/transactions');
    await expect(queueCard(page)).toBeVisible({ timeout: 30_000 });
    await expect
      .poll(() => queueCount(page), { message: 'queue count after processing', timeout: 30_000 })
      .toBe(before - 1);
  }

  // The timeline's newest entry is this office's, with the Received pill.
  await page.goto(`/transactions/manage/${code}`);
  await expect(page.getByText('Management timeline')).toBeVisible({ timeout: 30_000 });
  await expect
    .poll(async () => (await latestTimelineEntry(page))?.office, {
      message: `latest office on the timeline of ${code}`,
    })
    .toBe(opts.office);
  expect((await latestTimelineEntry(page))!.lines).toContain('Received');

  return code;
}
