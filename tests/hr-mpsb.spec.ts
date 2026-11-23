import { test, expect } from '@playwright/test';
import { STATE, enterHrMpsb } from './helpers/application-flow';

// HR-MPSB Panel (/hRMPSBportal/applicant-info). IDs are TC-MPSB-*. Read-only.
// Needs the saved login (ADMIN_STORAGE_STATE); the helper switches the account to the HR-MPSB Panel module.
// Seen by hand on 2026-11-23: one sidebar item (Applications Lists) and a Published Postings table.

test.skip(!STATE, 'Set ADMIN_STORAGE_STATE in .env (see README, Admin login)');
test.use({ storageState: STATE || undefined });

test.describe('HR-MPSB Panel (read-only)', () => {
  test.beforeEach(async ({ page }) => {
    await enterHrMpsb(page);
  });

  test('TC-MPSB-001: the panel opens on Applications Lists with its sidebar item', async ({ page }) => {
    await expect(page).toHaveURL(/\/hRMPSBportal\/applicant-info$/);
    await expect(page).toHaveTitle('Applications Lists - ZCMC Recruitment Portal');
    await expect(page.getByRole('heading', { name: 'Applications Lists' })).toBeVisible();
    await expect(page.getByText('Report on the documentary review')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Applications Lists' }).first()).toBeVisible();
  });

  test('TC-MPSB-002: the Published Postings table has its columns, toolbar and Generate RDR button', async ({ page }) => {
    await expect(page.getByText('Published Postings')).toBeVisible();
    for (const col of ['Job Position', 'Place of Assignment', 'Applicants Count', 'Interview Date']) {
      await expect(page.getByText(col, { exact: true }).first()).toBeVisible();
    }
    await expect(page.getByPlaceholder('Search').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Filter/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Column/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate RDR/ })).toBeVisible();
    // Generate RDR is not clicked (it makes a report).
    // TODO: confirm the accessible names of the two icon buttons on the first run.
  });

  test('TC-MPSB-003: with no published postings the table shows an empty state', async ({ page }) => {
    // On 2026-11-23 the panel showed "No published job posts" although ATTORNEY I is published on the public site.
    // Skipped when the panel does list a posting.
    const empty = page.getByText('No published job posts');
    test.skip(!(await empty.isVisible()), 'The panel lists at least one published posting');
    await expect(empty).toBeVisible();
    await expect(page.getByText('Per page')).toBeVisible();
  });
});
