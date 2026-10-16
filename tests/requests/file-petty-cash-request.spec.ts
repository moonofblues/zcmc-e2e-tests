import { test, expect } from '@playwright/test';
import fs from 'fs';
import { loginAs } from '../support/helpers';
import { PETTY_CASH_CSV, filePettyCash, readReportText } from '../support/petty-cash';

const USER = 'End User ABAA'; // Larry Gabriel S. Año, PACU

/** Split one CSV line, honouring "quoted, values". */
function parseCsvLine(line: string): string[] {
  return [...line.matchAll(/("([^"]*)"|[^,]*)(,|$)/g)].slice(0, -1).map((m) => m[2] ?? m[1]);
}

/** Read the fixture: PR number (line 2) and the item rows (below the header row). */
function readCsv() {
  const lines = fs.readFileSync(PETTY_CASH_CSV, 'utf8').split(/\r?\n/);
  const prNo = parseCsvLine(lines[1])[0].trim();
  const headerAt = lines.findIndex((l) => l.startsWith('Textbox99'));
  const items = lines
    .slice(headerAt + 1)
    .map(parseCsvLine)
    .filter((c) => /^\d+$/.test(c[0]))
    .map(([no, unit, desc, qty, price, total]) => ({
      no, unit, desc: desc.trim(), qty, price, total,
    }));
  return { prNo, items };
}

test.describe('Petty cash request (End User)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, USER);
  });

  test('files a new petty cash request from a CSV (Dietary)', async ({ page }) => {
    await filePettyCash(page, 'Dietary');
    await expect(page.getByText('Import successful').last()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Print' })).toBeVisible();
  });

  test('print shows the items from the uploaded CSV', async ({ page, context }) => {
    // The print popup would call window.print()/close(); neutralise both.
    await context.addInitScript(() => {
      window.print = () => {};
      window.close = () => {};
    });
    const requestId = await filePettyCash(page, 'Dietary');

    // Print opens a popup that fetches the PDF from the API.
    const reportRequest = context.waitForEvent('request', {
      predicate: (r) => r.url().includes('/generate-pc-report'),
    });
    await page.getByRole('button', { name: 'Print' }).click();
    expect((await reportRequest).url()).toContain(`id=${requestId}`);

    // Read the report PDF itself and compare it with the CSV that was uploaded.
    const pdf = await readReportText(context, requestId);
    const { prNo, items } = readCsv();
    expect(items.length).toBeGreaterThan(0);
    expect(pdf).toContain('PETTY CASH REQUEST');
    expect(pdf).toContain(`Petty Cash PR No.: ${prNo}`);
    for (const it of items) {
      expect(pdf, `item ${it.no}`).toContain(
        `${it.no} ${it.unit} ${it.desc} ${it.qty} ${it.price} ${it.total}`,
      );
    }
  });
});
