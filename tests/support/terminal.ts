import { Page, expect } from '@playwright/test';

/** The terminal lets a user act on up to 4 requests at once. */
export const MAX_SELECTION = 4;

export type TerminalPanel = 'submission' | 'receiving';

/**
 * The Petty Cash tab on /terminal has two panels side by side:
 * "Submission of Petty Cash to OMCC Terminal" (left) and "Receiving of Petty Cash from OMCC Terminal" (right).
 * Their Employee ID inputs have name="employeeId"; the hidden Developer Tools field does not,
 * so it can never be mistaken for a panel.
 */
export function terminalPanel(page: Page, which: TerminalPanel) {
  const i = which === 'submission' ? 0 : 1;
  return {
    employeeId: page.locator('input[name="employeeId"]').nth(i),
    search: page.getByRole('button', { name: 'Search' }).nth(i),
    proceedWithPin: page.getByRole('button', { name: 'Proceed with PIN' }).nth(i),
  };
}

/** Open /terminal on the Petty Cash tab and wait until both panels are ready. */
export async function openPettyCashTerminal(page: Page) {
  await page.goto('/terminal');
  await page.getByRole('tab', { name: 'Petty Cash' }).click();
  await expect(page.locator('input[name="employeeId"]')).toHaveCount(2);
}

/** Type the employee ID into a panel and press Search. The "Select Transactions" dialog then opens by itself. */
export async function searchEmployee(page: Page, which: TerminalPanel, employeeId: string) {
  const panel = terminalPanel(page, which);
  await panel.employeeId.click();
  await panel.employeeId.fill(employeeId);
  await panel.search.click();
}

/**
 * In the "Select Transactions" dialog: only one listed -> select it; several listed ->
 * select 2 to MAX_SELECTION of them (the one in `include` first, if given), then Confirm.
 * Returns how many were selected, or 0 when nothing is listed.
 */
export async function selectTransactions(page: Page, include?: string): Promise<number> {
  const allRows = page.getByRole('row').filter({ hasText: /\b\d{10}\b/ }); // rows with a transaction code
  await allRows.first().waitFor({ timeout: 15_000 }).catch(() => {});
  const available = await allRows.count();
  if (available === 0) return 0;

  const toSelect = available === 1 ? 1 : Math.min(available, MAX_SELECTION);
  let selected = 0;
  if (include) {
    const own = page.getByRole('row', { name: include });
    await expect(own, `transaction ${include} is listed`).toBeVisible();
    await own.getByRole('checkbox').check();
    selected++;
  }
  for (let i = 0; i < available && selected < toSelect; i++) {
    const box = allRows.nth(i).getByRole('checkbox');
    if (!(await box.isChecked())) {
      await box.check();
      selected++;
    }
  }
  await page.getByRole('button', { name: `Confirm Selection (${toSelect})` }).click();
  return toSelect;
}

/** Authorization step: type the PIN, Authorize, and wait for the terminal's success message. */
export async function authorizeWithPin(page: Page, pin: string) {
  await page.getByRole('textbox', { name: 'Authorization PIN' }).fill(pin);
  await page.getByRole('button', { name: 'Authorize' }).click();
  await expect(page.getByText(/successfully processed/i).first()).toBeVisible({ timeout: 30_000 });
}
