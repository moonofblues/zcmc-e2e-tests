import { BrowserContext, Page, expect } from '@playwright/test';
import { PDFParse } from 'pdf-parse';
import path from 'path';
import { openPurchaseRequisition } from './helpers';

export const PETTY_CASH_CSV = path.resolve(__dirname, '../../fixtures/petty-cash.csv');
export const API = 'https://sandbox-prapi.zcmc.online/api/v1';

/**
 * End User flow: File new request -> Petty Cash -> upload CSV -> category -> Proceed
 * -> confirm guidelines -> File request. Leaves the "successfully submitted" modal open.
 * Returns the new petty cash request id (from the import API response).
 */
export async function filePettyCash(page: Page, category: 'Dietary' | 'Pharmacy'): Promise<number> {
  await openPurchaseRequisition(page);
  await page.getByRole('button', { name: 'File new request' }).click();

  // The card's radio input sits on top of its label, so click the card by position.
  const card = page.getByText('Petty Cash', { exact: true }).last();
  await expect(card).toBeVisible();
  const box = (await card.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.locator('input[value="petty_cash"]')).toBeChecked();
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByText('Submit a Petty Cash Import')).toBeVisible();
  await page.locator('input[type=file]').setInputFiles(PETTY_CASH_CSV);
  await page.getByText('Select category').locator('xpath=following::*[@role="combobox"][1]').click();
  await page.getByRole('option', { name: category }).click();
  await page.getByRole('button', { name: 'Proceed' }).click();

  // Compliance guidelines: tick all four boxes, then file.
  const boxes = page.getByRole('checkbox');
  await expect(boxes).toHaveCount(4);
  for (let i = 0; i < 4; i++) await boxes.nth(i).check({ force: true });

  const imported = page.waitForResponse((r) => r.url().includes('/petty-cash/import'), { timeout: 90_000 });
  await page.getByRole('button', { name: 'File request' }).click();
  const body = await (await imported).json();

  // Filing can take a while on the sandbox.
  await expect(page.getByText('Petty cash successfully submitted').last()).toBeVisible({ timeout: 90_000 });
  return body.data.id as number;
}

/** Download the printed petty cash report (PDF) for a request and return its text. */
export async function readReportText(context: BrowserContext, requestId: number): Promise<string> {
  const res = await context.request.get(`${API}/generate-pc-report?id=${requestId}`);
  expect(res.ok()).toBeTruthy();
  const parser = new PDFParse({ data: await res.body() });
  const { text } = await parser.getText();
  await parser.destroy();
  return text.replace(/\s+/g, ' ');
}

/** Sandbox end user (Larry Gabriel S. Año, PACU) whose Employee ID and PIN are used at the OMCC terminal. */
export const TERMINAL_EMPLOYEE_ID = process.env.TEST_USER_EMPLOYEE_ID;
export const TERMINAL_PIN = process.env.TEST_USER_PIN;
