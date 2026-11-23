import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
  test('app responds and renders a page', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveTitle(/.+/);
  });
});
