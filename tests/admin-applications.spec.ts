import { test, expect } from '@playwright/test';
import { STATE, enterAdminApplications } from './helpers/application-flow';

// Admin / Staff Portal: Applications module (/admin/applications). IDs are TC-APPADM-*. Read-only.
// The list holds real applicants' personal data: these tests never read or print names, emails or phone numbers.
// Needs the saved admin login (ADMIN_STORAGE_STATE).

test.skip(!STATE, 'Set ADMIN_STORAGE_STATE in .env (see README, Admin login)');
test.use({ storageState: STATE || undefined });

test.describe('Applications list (read-only)', () => {
  test.beforeEach(async ({ page }) => {
    await enterAdminApplications(page);
  });

  test('TC-APPADM-001: the Applications list opens with title and heading', async ({ page }) => {
    await expect(page).toHaveTitle('Applications - ZCMC Recruitment Portal');
    await expect(page.getByRole('heading', { name: 'Applications' })).toBeVisible();
  });

  test('TC-APPADM-002: the seven status tabs are shown with counts', async ({ page }) => {
    for (const name of [/All Applications/, /Screening & Shortlist/, /Interview & Evaluation/, /Hired/, /Onboarded/, /Not Selected/, /Not Qualified/]) {
      await expect(page.getByRole('tab', { name }).or(page.getByText(name)).first()).toBeVisible();
    }
  });

  test('TC-APPADM-003: Review Auto-Rejections and Generate Reports buttons are available', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Review Auto-Rejections/ }).or(page.getByRole('link', { name: /Review Auto-Rejections/ })).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate Reports/ }).or(page.getByRole('link', { name: /Generate Reports/ })).first()).toBeVisible();
  });

  test('TC-APPADM-004: the table shows the expected columns', async ({ page }) => {
    for (const col of ['Applicant Details', 'Demographics', 'Addresses', 'Contact Info', 'Position Applied', 'Status', 'Attached Exam(s)', 'Date Applied']) {
      await expect(page.getByText(col, { exact: true }).first()).toBeAttached();
    }
  });

  test('TC-APPADM-005: each applicant row carries an application number like #APP-00024', async ({ page }) => {
    await expect(page.getByText(/#APP-\d{5}/).first()).toBeVisible();
  });

  test('TC-APPADM-006: search with a value that matches nothing shows no rows', async ({ page }) => {
    await page.getByPlaceholder('Search').fill('zzzz-no-such-applicant-zzzz');
    // TODO: confirm the debounce and the empty-state wording on the first run.
    await expect(page.getByText(/#APP-\d{5}/)).toHaveCount(0);
  });

  test('TC-APPADM-007: page size offers 5, 10, 25 and 50', async ({ page }) => {
    const sizes = page.getByRole('combobox').filter({ hasText: /\d+/ }).last();
    for (const n of ['5', '10', '25', '50']) {
      await expect(sizes.locator(`option[value="${n}"]`)).toHaveCount(1);
    }
  });

  test('TC-APPADM-008: filter and column manager buttons are available', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Filter/ }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Column manager/ }).first()).toBeVisible();
    // TODO: confirm the accessible names; the icons had no visible label on the first look.
  });

  test('TC-APPADM-009: the user menu Switch Module offers Admin Dashboard, Applicant Portal and HR-MPSB Panel', async ({ page }) => {
    await page.getByRole('button', { name: 'User menu' }).click();
    await page.getByText('Switch Module', { exact: true }).first().click();
    await expect(page.getByText('Switch Access Module')).toBeVisible();
    await page.getByRole('button', { name: /Admin Dashboard|Applicant Portal|HR-MPSB Panel/ }).first().click();
    for (const name of ['Admin Dashboard', 'Applicant Portal', 'HR-MPSB Panel']) {
      await expect(page.getByRole('option', { name })).toBeVisible();
    }
  });
});
