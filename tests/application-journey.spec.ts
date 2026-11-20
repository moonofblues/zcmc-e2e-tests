import { test, expect, type Page } from '@playwright/test';
import {
  APPLICANT_EMAIL, DUMMY_PDF, JOB_TITLE, JOURNEY, PATHS, STATE,
  enterAdminApplications, enterApplicantPortal, openPublicJobDetails, totalApplications,
} from './helpers/application-flow';

// Full journey: apply for a job, check the applicant portal, check HR admin. IDs are TC-E2E-*.
//
// CREATES A REAL APPLICATION on the live site and is skipped unless RUN_APPLICATION_JOURNEY=1.
// Also needs ADMIN_STORAGE_STATE and E2E_APPLICANT_EMAIL (the email of that account, to find its row in HR).
// One page, one saved login: the account's module is switched between the phases (see helpers/application-flow.ts).
//
// BLOCKED on 2026-11-20, both tests are test.fixme until fixed:
//   TC-E2E-001 starts in the portal: Proceed to Application opens /portal/application?record=... = 404.
//   TC-E2E-002 starts on the main page: Apply Now on the public job details page is disabled.
// The upload and submit selectors (marked TODO) have never been seen, because the upload step cannot be reached.

test.skip(!JOURNEY || !STATE || !APPLICANT_EMAIL, 'Set RUN_APPLICATION_JOURNEY=1, ADMIN_STORAGE_STATE and E2E_APPLICANT_EMAIL (creates a real application)');
test.use({ storageState: STATE || undefined });

async function uploadAndSubmit(page: Page): Promise<void> {
  // TODO: selectors for the upload step were never seen. Confirm: the file input, the Submit button, the success message.
  await page.locator('input[type="file"]').first().setInputFiles(DUMMY_PDF);
  await page.getByRole('button', { name: /submit/i }).click();
  await expect(page.getByText(/submitted|success/i).first()).toBeVisible();
}

async function verifyAfterSubmit(page: Page, before: number): Promise<void> {
  await test.step('applicant portal: the application is listed', async () => {
    await enterApplicantPortal(page, PATHS.portalTrack);
    expect(await totalApplications(page)).toBe(before + 1);
    await expect(page.getByRole('row').filter({ hasText: JOB_TITLE }).first()).toBeVisible();
  });

  await test.step('HR admin: the application was saved', async () => {
    await enterAdminApplications(page);
    await page.getByPlaceholder('Search').fill(APPLICANT_EMAIL!);
    const row = page.getByRole('row').filter({ hasText: JOB_TITLE }).filter({ hasText: /#APP-\d{5}/ }).first();
    await expect(row).toBeVisible();
    // TODO: the first status of a new application is unknown (existing rows show PENDING and FOR INITIAL SCREENING).
    await expect(row).toContainText(/PENDING|FOR INITIAL SCREENING/);
  });

  // TODO: cleanup. HR admin has no obvious delete for an application. Confirm with the team how test
  // applications are removed. Until then they stay in HR data: tag this run in the test report.
  test.info().annotations.push({ type: 'cleanup', description: 'The test application stays in HR admin. Remove it by hand.' });
}

test.describe('Application journey (creates a real application)', () => {
  test.fixme('TC-E2E-001: apply from the portal, see it in the applicant portal, see it saved in HR admin', async ({ page }) => {
    let before = 0;

    await test.step('applicant portal: note how many applications the account has', async () => {
      await enterApplicantPortal(page, PATHS.portalTrack);
      before = await totalApplications(page);
    });

    await test.step('applicant portal: apply for the job', async () => {
      await enterApplicantPortal(page, PATHS.portalApply);
      await page.getByRole('row').filter({ hasText: JOB_TITLE }).getByRole('button', { name: 'Apply Now' }).click();
      await page.getByRole('button', { name: 'Proceed to Application' }).click();
      await expect(page).toHaveURL(/\/portal\/application/);
    });

    await test.step('upload the required document and submit', () => uploadAndSubmit(page));
    await verifyAfterSubmit(page, before);
  });

  test.fixme('TC-E2E-002: apply from the main page (/jobs), see it in the applicant portal, see it saved in HR admin', async ({ page }) => {
    let before = 0;

    await test.step('applicant portal: note how many applications the account has', async () => {
      await enterApplicantPortal(page, PATHS.portalTrack);
      before = await totalApplications(page);
    });

    await test.step('main page: open the job and click Apply Now', async () => {
      await openPublicJobDetails(page, JOB_TITLE);
      const apply = page.getByRole('button', { name: 'Apply Now' });
      await expect(apply).toBeEnabled(); // BLOCKED: the button is disabled on the public page
      await apply.click();
      await page.getByRole('button', { name: 'Proceed to Application' }).click();
    });

    await test.step('upload the required document and submit', () => uploadAndSubmit(page));
    await verifyAfterSubmit(page, before);
  });
});
