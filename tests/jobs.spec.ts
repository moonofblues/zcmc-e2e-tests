import { test, expect, type Page } from '@playwright/test';

// Job browsing (/jobs). Read-only. Job-card tests skip themselves while the portal has no posted jobs.

const countText = (page: Page) => page.getByText(/\d+ jobs? found/i);

async function jobCount(page: Page): Promise<number> {
  const text = await countText(page).first().innerText();
  return Number(/(\d+)/.exec(text)?.[1] ?? 0);
}

test.describe('Browse jobs (/jobs)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/jobs');
  });

  test('TC-JOB-001: page loads with heading and search section', async ({ page }) => {
    await expect(page).toHaveTitle('ZCMC Job Portal');
    await expect(page.getByRole('heading', { level: 1, name: 'Browse Open Positions' })).toBeVisible();
    await expect(page.getByText('Search & Filter Jobs')).toBeVisible();
    await expect(page.getByText('Available Positions')).toBeVisible();
  });

  test('TC-JOB-002: keyword box, employment type filter, Search and Clear Filters are present', async ({ page }) => {
    await expect(page.getByPlaceholder('e.g. Medical Officer, Nurse, Administrative Aide')).toBeVisible();
    await expect(page.getByText('Employment Type')).toBeVisible();
    await expect(page.getByRole('combobox').or(page.getByRole('button', { name: 'All Types' })).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clear Filters' })).toBeVisible();
  });

  test('TC-JOB-003: result count is shown', async ({ page }) => {
    await expect(countText(page).first()).toBeVisible();
  });

  test('TC-JOB-004: searching for a keyword that does not exist shows the empty state', async ({ page }) => {
    await page.getByPlaceholder('e.g. Medical Officer, Nurse, Administrative Aide').fill('zzzz-no-such-job-zzzz');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText('No matching jobs found')).toBeVisible();
    await expect(page.getByText(/^0 jobs? found/i)).toBeVisible();
  });

  test('TC-JOB-005: Clear Filters resets the keyword box', async ({ page }) => {
    const keyword = page.getByPlaceholder('e.g. Medical Officer, Nurse, Administrative Aide');
    await keyword.fill('Nurse');
    await page.getByRole('button', { name: 'Clear Filters' }).first().click();
    await expect(keyword).toHaveValue('');
  });

  test('TC-JOB-006: header and footer navigation are present', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Home', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login', exact: true }).first()).toBeVisible();
    await expect(page.locator('footer')).toContainText('Zamboanga City Medical Center');
  });

  test('TC-JOB-007: posted jobs are listed and match the count', async ({ page }) => {
    const n = await jobCount(page);
    test.skip(n === 0, 'No jobs are currently posted on the live portal');
    expect(n).toBeGreaterThan(0);
    // TODO: once jobs exist, confirm the job-card selector and assert the number of cards equals n.
  });

  test('TC-JOB-008: searching by an existing job title returns matching jobs', async ({ page }) => {
    const n = await jobCount(page);
    test.skip(n === 0, 'No jobs are currently posted on the live portal');
    // TODO: read the first job title from the list, search for it, and assert it is still listed.
  });

  test('TC-JOB-009: opening a job shows its details', async ({ page }) => {
    const n = await jobCount(page);
    test.skip(n === 0, 'No jobs are currently posted on the live portal');
    // TODO: click the first job, assert the details page (title, description, requirements, apply button).
  });
});
