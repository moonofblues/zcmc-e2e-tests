import { test, expect } from '@playwright/test';
import { JOB_TITLE, PATHS, STATE, enterApplicantPortal, openPublicJobDetails, publicJobCount } from './helpers/application-flow';

// Applying for a job. IDs are TC-APPLY-*.
//   Public part (/jobs and the job details page): no login needed, read-only.
//   Portal part (/portal/apply-now): needs the saved login (ADMIN_STORAGE_STATE) switched to the Applicant Portal module.
// Nothing here creates an application. The cases that would go further are Blocked by defects found on 2026-11-20
// and are written as test.fixme so they are ready to switch on when the developers fix them.

test.describe('Public job details (/jobs > View Details), read-only', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PATHS.jobs);
    test.skip((await publicJobCount(page)) === 0, 'No jobs are currently posted on the live portal');
  });

  test('TC-APPLY-001: View Details on a job card opens the job details page', async ({ page }) => {
    await openPublicJobDetails(page, JOB_TITLE);
    await expect(page.getByText('OPEN', { exact: true })).toBeVisible();
    for (const label of ['Employment Type', 'Salary Grade', 'Monthly Salary', 'Place of Assignment', 'Published Date', 'Submission Deadline']) {
      await expect(page.getByText(label, { exact: false }).first()).toBeVisible();
    }
    await expect(page.getByRole('button', { name: 'Back to Jobs' })).toBeVisible();
  });

  test('TC-APPLY-002: job details list the qualifications and the file requirements', async ({ page }) => {
    await openPublicJobDetails(page, JOB_TITLE);
    await expect(page.getByText('Job Qualifications')).toBeVisible();
    await expect(page.getByText('File Requirements')).toBeVisible();
    await expect(page.getByText('Applications with incomplete documents will not be processed', { exact: false })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Apply Now' })).toBeVisible();
  });

  // BLOCKED 2026-11-20: on the public details page Apply Now is greyed out and disabled, both for the Admin and the
  // Applicant Portal module of a signed-in account. No message explains why. Switch this on when it is fixed.
  test.fixme('TC-APPLY-003: Apply Now on the public job details page starts an application for a signed-in applicant', async ({ page }) => {
    test.skip(!STATE, 'Needs ADMIN_STORAGE_STATE');
    await enterApplicantPortal(page, PATHS.portalApply);
    await openPublicJobDetails(page, JOB_TITLE);
    const apply = page.getByRole('button', { name: 'Apply Now' });
    await expect(apply).toBeEnabled();
    await apply.click();
    await expect(page.getByText('Confirm Application')).toBeVisible();
  });
});

test.describe('Portal Apply Now page (/portal/apply-now)', () => {
  test.skip(!STATE, 'Set ADMIN_STORAGE_STATE in .env (see README, Admin login)');
  test.use({ storageState: STATE || undefined });

  test.beforeEach(async ({ page }) => {
    await enterApplicantPortal(page, PATHS.portalApply);
  });

  test('TC-APPLY-004: the page lists the open vacancies with View and Apply Now', async ({ page }) => {
    await expect(page.getByText('Open Job Positions')).toBeVisible();
    await expect(page.getByText(/\d+ Active Vacanc/i)).toBeVisible();
    await expect(page.getByText('Application Table')).toBeVisible();
    for (const col of ['JOB POSITION', 'SUBMISSION DEADLINE', 'MONTHLY SALARY', 'ASSIGNMENT', 'EMPLOYMENT TYPE']) {
      await expect(page.getByText(col, { exact: true })).toBeAttached();
    }
    const row = page.getByRole('row').filter({ hasText: JOB_TITLE });
    await expect(row.getByRole('button', { name: 'View' })).toBeVisible();
    await expect(row.getByRole('button', { name: 'Apply Now' })).toBeVisible();
  });

  test('TC-APPLY-005: Apply Now asks for confirmation and Cancel creates no application', async ({ page }) => {
    const row = page.getByRole('row').filter({ hasText: JOB_TITLE });
    await row.getByRole('button', { name: 'Apply Now' }).click();
    await expect(page.getByText('Confirm Application')).toBeVisible();
    await expect(page.getByText('You will be directed to upload the required documents.', { exact: false })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Proceed to Application' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('Confirm Application')).toBeHidden();
    await expect(page).toHaveURL(/\/portal\/apply-now$/);
  });

  // BLOCKED 2026-11-20: Proceed to Application opens /portal/application?record=... which answers
  // "404 Resource Not Found". The upload step never appears. Could be a misconfigured test job: re-test with a real job.
  test.fixme('TC-APPLY-006: Proceed to Application opens the document upload step', async ({ page }) => {
    const row = page.getByRole('row').filter({ hasText: JOB_TITLE });
    await row.getByRole('button', { name: 'Apply Now' }).click();
    await page.getByRole('button', { name: 'Proceed to Application' }).click();
    await expect(page).toHaveURL(/\/portal\/application/);
    await expect(page.getByText('Resource Not Found')).toHaveCount(0);
    // TODO: assert the upload step (the file requirement name, a file input, a Submit button) once it can be seen.
  });

  // BLOCKED by TC-APPLY-006. Creates a real application: run only with RUN_APPLICATION_JOURNEY=1 once unblocked.
  test.fixme('TC-APPLY-007: a required document can be uploaded and the application submitted', async () => {
    // TODO: write after TC-APPLY-006 is unblocked. See TC-E2E-001 in application-journey.spec.ts.
  });

  // DEFECT 2026-11-20: raw JavaScript text ("... response = await fetch(fileUrl ...") shows under the table.
  // test.fail keeps the suite green while the defect exists and goes red when it is fixed (then remove test.fail).
  test('TC-APPLY-008: no raw script text is shown on the page', async ({ page }) => {
    test.fail(true, 'Open defect: raw JavaScript text is displayed under the table');
    await expect(page.locator('main')).not.toContainText('newWin.document');
    await expect(page.locator('body')).not.toContainText('response.blob()');
  });
});
