import { test, expect } from '@playwright/test';
import { PATHS, STATE, enterApplicantPortal, totalApplications } from './helpers/application-flow';

// Applicant Portal pages other than Apply Now. IDs are TC-APPPORTAL-*. Read-only.
// Needs the saved login (ADMIN_STORAGE_STATE); the helper switches the account to the Applicant Portal module.

test.skip(!STATE, 'Set ADMIN_STORAGE_STATE in .env (see README, Admin login)');
test.use({ storageState: STATE || undefined });

test.describe('Applicant Portal', () => {
  test('TC-APPPORTAL-001: the sidebar lists Apply Now, Track Applications, My Files and Account Settings', async ({ page }) => {
    await enterApplicantPortal(page, PATHS.portalApply);
    // The applicant portal has a top menu bar, not a sidebar (seen 2026-11-23).
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

  test('TC-APPPORTAL-006: My Files shows the document hub, the three info cards and the files table', async ({ page }) => {
    await enterApplicantPortal(page, PATHS.portalFiles);
    await expect(page).toHaveURL(/\/portal\/my-files$/);
    await expect(page).toHaveTitle('My Files - ZCMC Recruitment Portal');
    await expect(page.getByText('My Submitted Documents')).toBeVisible();
    for (const label of ['DOCUMENT REPOSITORY', 'SUPPORTED FORMATS', 'UPDATES & EDITS']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(page.getByText('PDF, PNG, JPG')).toBeVisible();
    await expect(page.getByText('Max 5MB per file')).toBeVisible();
    // Table columns. Per row there are Update File, View File and Download buttons; they are not clicked.
    for (const col of ['File Name', 'File Type', 'File Size', 'Application Details', 'Last Updated']) {
      await expect(page.getByText(col, { exact: true }).first()).toBeAttached();
    }
    await expect(page.getByPlaceholder('Search').first()).toBeVisible();
  });

  test('TC-APPPORTAL-007: Account Settings shows the profile card and the Google Authenticator card', async ({ page }) => {
    await enterApplicantPortal(page, PATHS.portalSettings);
    await expect(page).toHaveURL(/\/portal\/account-settings$/);
    await expect(page).toHaveTitle('Account Settings - ZCMC Recruitment Portal');
    // The profile card holds the account's name and email: they are not read or printed here.
    await expect(page.getByText('UMIS VERIFIED PROFILE')).toBeVisible();
    await expect(page.getByText('Google Authenticator (TOTP 2FA)')).toBeVisible();
    await expect(page.getByRole('button', { name: /Set Up Google Authenticator/ })).toBeVisible();
    // The Set Up button is not clicked.
  });

  // Defect seen by hand on 2026-11-23: JavaScript source text (newWin.document ...) is shown at the bottom of the portal pages.
  // Same defect as TC-APPLY-008 on /portal/apply-now. test.fail until it is fixed.
  for (const [id, label, path] of [
    ['TC-APPPORTAL-008', 'My Files', PATHS.portalFiles],
    ['TC-APPPORTAL-009', 'Account Settings', PATHS.portalSettings],
  ] as const) {
    test(`${id}: no raw script text is shown on ${label}`, async ({ page }) => {
      test.fail(true, 'Open defect: raw JavaScript text is shown under the page content');
      await enterApplicantPortal(page, path);
      await expect(page.locator('body')).not.toContainText('newWin.document');
    });
  }

  test('TC-APPPORTAL-010: the applicant user menu offers Security & Account Settings, Switch Module and Sign out', async ({ page }) => {
    await enterApplicantPortal(page, PATHS.portalApply);
    await page.getByRole('button', { name: 'User menu' }).click();
    await expect(page.getByRole('link', { name: 'Security & Account Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Switch Module' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
    // Sign out is not clicked.
  });
});
