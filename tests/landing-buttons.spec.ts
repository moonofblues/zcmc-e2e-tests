import { test, expect } from '@playwright/test';

// Landing page buttons and links. Order follows the page: hero, Open Positions, call to action, header, footer.
// External links (About Us / Contact Us on zcmc.doh.gov.ph) are only checked by href, never opened.

const jobsUrl = /\/jobs\/?$/i;

test.describe('Landing page buttons and links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-BTN-001: "Join ZCMC" button leads to the job list', async ({ page }) => {
    const btn = page.getByRole('button', { name: 'Join ZCMC' });
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
    await btn.click();
    await expect(page).toHaveURL(jobsUrl);
    await expect(page.getByRole('heading', { level: 1, name: 'Browse Open Positions' })).toBeVisible();
  });

  test('TC-BTN-002: hero "Browse Jobs" button leads to the job list', async ({ page }) => {
    const btn = page.getByRole('button', { name: 'Browse Jobs' }).first();
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(page).toHaveURL(jobsUrl);
    await expect(page.getByRole('heading', { level: 1, name: 'Browse Open Positions' })).toBeVisible();
  });

  test('TC-BTN-003: "View All Open Positions" button leads to the job list', async ({ page }) => {
    const btn = page.getByRole('button', { name: 'View All Open Positions' });
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(page).toHaveURL(jobsUrl);
  });

  test('TC-BTN-004: hero "About ZCMC" button opens the ZCMC profile page', async ({ page }) => {
    const btn = page.getByRole('button', { name: 'About ZCMC' });
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
    // The destination is external. It may open in the same tab or in a new one.
    const [popup] = await Promise.all([
      page.waitForEvent('popup', { timeout: 5000 }).catch(() => null),
      btn.click(),
    ]);
    const target = popup ?? page;
    await target.waitForURL(/zcmc\.doh\.gov\.ph\/profile/, { timeout: 15000 });
  });

  test('TC-BTN-005: header "Home" link returns to the landing page', async ({ page }) => {
    await page.goto('/jobs');
    await page.getByRole('link', { name: 'Home', exact: true }).first().click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Build Our Future with ZCMC' })).toBeVisible();
  });

  test('TC-BTN-006: header "Jobs" link opens the job list', async ({ page }) => {
    await page.getByRole('link', { name: 'Jobs', exact: true }).first().click();
    await expect(page).toHaveURL(jobsUrl);
  });

  test('TC-BTN-007: header "Login" link opens the login page', async ({ page }) => {
    await page.getByRole('link', { name: 'Login', exact: true }).first().click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  });

  test('TC-BTN-008: footer "Browse Jobs" link opens the job list', async ({ page }) => {
    await page.locator('footer').getByRole('link', { name: 'Browse Jobs' }).click();
    await expect(page).toHaveURL(jobsUrl);
  });

  test('TC-BTN-009: footer "About Us" and "Contact Us" links point to the ZCMC DOH site', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: 'About Us' })).toHaveAttribute(
      'href',
      'https://zcmc.doh.gov.ph/profile/',
    );
    await expect(footer.getByRole('link', { name: 'Contact Us' })).toHaveAttribute(
      'href',
      'https://zcmc.doh.gov.ph/about-us/',
    );
  });
});
