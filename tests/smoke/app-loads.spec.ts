import { test, expect } from '@playwright/test';
import { openTerminal, openDevTools } from '../support/helpers';

test('terminal page loads', async ({ page }) => {
  await openTerminal(page);
  await expect(page).toHaveURL(/sandbox-pr\.zcmc\.online\/terminal/);
});

test('developer tools drawer opens with the user switcher', async ({ page }) => {
  await openTerminal(page);
  await openDevTools(page);
  await expect(page.getByPlaceholder('Employee ID')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add/Switch Session' })).toBeVisible();
});
