import { test, expect } from '@playwright/test';

test.describe('Landing page (/)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-LAND-001: page loads with the correct title', async ({ page }) => {
    await expect(page).toHaveTitle('ZCMC Job Portal');
  });

  test('TC-LAND-002: hero section shows heading and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Build Our Future with ZCMC' })).toBeVisible();
    await expect(page.getByText('Zamboanga City Medical Center').first()).toBeVisible();
    await expect(
      page.getByText('Join the Zamboanga City Medical Center and make a difference in healthcare excellence'),
    ).toBeVisible();
  });

  test('TC-LAND-003: Open Positions section is displayed', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Open Positions' })).toBeVisible();
    await expect(
      page.getByText('Explore exciting career opportunities at Zamboanga City Medical Center'),
    ).toBeVisible();
  });

  test('TC-LAND-004: Why Join ZCMC section shows all six benefit cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Why Join ZCMC?' })).toBeVisible();
    for (const benefit of [
      'Healthcare Coverage',
      'Professional Development',
      'Career Growth',
      'Meaningful Work',
      'Team Environment',
      'Additional Benefits',
    ]) {
      await expect(page.getByText(benefit, { exact: true })).toBeVisible();
    }
  });

  test('TC-LAND-005: call-to-action section is displayed', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Ready to Start Your Journey?' })).toBeVisible();
    await expect(page.getByText("Apply now and become part of ZCMC's dedicated team")).toBeVisible();
  });

  test('TC-LAND-006: footer shows address, contact details and copyright', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toContainText('Dr. Evangelista St., Sta. Catalina, Zamboanga City, 7000');
    await expect(footer).toContainText('062 9912934');
    await expect(footer).toContainText('mc-chief@zcmc.doh.gov.ph');
    await expect(footer).toContainText('Zamboanga City Medical Center. All rights reserved.');
  });

  test('TC-LAND-007: no browser console errors and no failed requests on load', async ({ page }) => {
    const consoleErrors: string[] = [];
    const failed: string[] = [];
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
    page.on('requestfailed', (r) => failed.push(r.url()));
    await page.goto('/', { waitUntil: 'networkidle' });
    expect(consoleErrors, `Console errors: ${consoleErrors.join(' | ')}`).toEqual([]);
    expect(failed, `Failed requests: ${failed.join(' | ')}`).toEqual([]);
  });

  test('TC-LAND-008: all images load (no broken images)', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const broken = await page.$$eval('img', (imgs) =>
      imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
    );
    expect(broken, `Broken images: ${broken.join(', ')}`).toEqual([]);
  });

  test('TC-LAND-009: layout has no horizontal scroll on a phone-size screen', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});
