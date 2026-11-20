import { test, expect } from '@playwright/test';
import { PATHS, STATE, enterApplicantPortal, totalApplications } from './helpers/application-flow';

// Applicant Portal pages other than Apply Now. IDs are TC-APPPORTAL-*. Read-only.
// Needs the saved login (ADMIN_STORAGE_STATE); the helper switches the account to the Applicant Portal module.

test.skip(!STATE, 'Set ADMIN_STORAGE_STATE in .env (see README, Admin login)');
test.use({ storageState: STATE || undefined });

test.describe('Applicant Portal', () => {
  test('TC-APPPORTAL-001: the sidebar lists Apply Now, Track Applications, My Files and Account Settings', async ({ page }) => {
    await enterApplicantPortal(page, PATHS.portalApply);
    await page.getByRole('button', { name: 'Expand sidebar' }).click();
    for (const [name, path] of [
      ['Apply Now', PATHS.portalApply],
      ['Track Applications', PATHS.portalTrack],
      ['My Files', PATHS.portalFiles],
      ['Account Settings', PATHS.portalSettings],
    ]) {
      await expect(page.getByRole('link', { name }).or(page.locator(`a[href$="${path}"]`)).first()).toBeAttached();
    }
  });

  test('TC-APPPORTAL-002: Track Applications shows the status dashboard and its four counters', async ({ page }) => {
    await enterApplicantPortal(page, PATHS.portalTrack);
    await expect(page.getByText('Track Your Job Applications')).toBeVisible();
    for (const label of ['Total Applications', 'Under Screening / Review', 'Scheduled Interviews', 'Qualified / Hired']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(page.getByText('Track Application Table')).toBeVisible();
  });

  test('TC-APPPORTAL-003: an account with no applications sees the empty state', async ({ page }) => {
    await enterApplicantPortal(page, PATHS.portalTrack);
    test.skip((await totalApplications(page)) > 0, 'This account already has applications');
    await expect(page.getByText('No Application History Found')).toBeVisible();
    await expect(page.getByText('You have not submitted any applications yet.', { exact: false })).toBeVisible();
  });

  test('TC-APPPORTAL-004: Browse Open Positions leads to the Apply Now page', async ({ page }) => {
    await enterApplicantPortal(page, PATHS.portalTrack);
    await page.getByRole('link', { name: 'Browse Open Positions' }).first().click();
    await expect(page).toHaveURL(/\/portal\/apply-now$/);
  });

  test('TC-APPPORTAL-005: Track Applications has a search box and page sizes 5, 10, 25 and 50', async ({ page }) => {
    await enterApplicantPortal(page, PATHS.portalTrack);
    await expect(page.getByRole('searchbox', { name: 'Search' }).or(page.getByPlaceholder('Search')).first()).toBeVisible();
    // TODO: the per-page control is only shown when there are rows; confirm its place once an application exists.
  });

  test('TC-APPPORTAL-006: My Files opens', async ({ page }) => {
    await enterApplicantPortal(page, PATHS.portalFiles);
    await expect(page).toHaveURL(/\/portal\/my-files$/);
    // TODO: assert the page content once it has been looked at.
  });

  test('TC-APPPORTAL-007: Account Settings opens', async ({ page }) => {
    await enterApplicantPortal(page, PATHS.portalSettings);
    await expect(page).toHaveURL(/\/portal\/account-settings$/);
    // TODO: assert the page content once it has been looked at.
  });
});
