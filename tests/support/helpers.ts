import { Page, expect } from '@playwright/test';

/** Open the sandbox kiosk page (no login needed). */
export async function openTerminal(page: Page) {
  await page.goto('/terminal');
  // The page first shows "Detecting Terminal Configuration..."; the sandbox can be slow.
  await expect(page.getByText('PR Document Receiver')).toBeVisible({ timeout: 30_000 });
}

/** Open the Developer Tools drawer via the small ◀ tab on the right edge. */
export async function openDevTools(page: Page) {
  await page.getByText('◀').click();
  await expect(page.getByText('User Switcher', { exact: false })).toBeVisible();
}

/**
 * Switch to a saved user in the User Switcher (on /terminal), wait for the
 * sign-in to finish, then go to the main app.
 * Saved sessions come from .auth/state.json (see .auth/README.md).
 */
export async function loginAs(page: Page, label: string) {
  await openTerminal(page);
  await openDevTools(page);
  const authenticated = page.waitForResponse((r) => r.url().includes('/api/v1/authenticate'));
  // After signing in, the app reloads the page by itself (a new document request for /terminal).
  const reloaded = page
    .waitForResponse(
      (r) => r.request().resourceType() === 'document' && new URL(r.url()).pathname === '/terminal',
      { timeout: 60_000 },
    )
    .catch(() => undefined);

  await page.getByText(label, { exact: true }).click();
  await authenticated;

  // Let the app finish its own reload/redirect first. Navigating while it does that cancels
  // our navigation (net::ERR_ABORTED). Switching users takes a while on the sandbox.
  await reloaded;
  await page.waitForLoadState('load');
  await page.waitForURL(/\/dashboard/, { timeout: 10_000 }).catch(() => {});
  if (!/\/dashboard/.test(page.url())) {
    await page.goto('/dashboard'); // the app stayed on /terminal: go to the dashboard ourselves
  }
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 60_000 });
}

/** Open the Purchase Requisition page from the hamburger menu. */
export async function openPurchaseRequisition(page: Page) {
  await page.goto('/requests');
  await expect(page.getByRole('button', { name: 'File new request' })).toBeVisible();
}
