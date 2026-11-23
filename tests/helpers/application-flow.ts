import { expect, type Locator, type Page } from '@playwright/test';

// Shared helpers for the application flow tests (apply, applicant portal, HR applications, end-to-end journey).
//
// One saved login (ADMIN_STORAGE_STATE) covers both sides: the account has an Admin Dashboard module and an
// Applicant Portal module, switched from the user menu (Switch Module). The module is kept in the SERVER session,
// so never open the applicant and the admin side in two browser contexts that share the same saved login at once:
// use one page and switch module between the phases.

export const STATE = process.env.ADMIN_STORAGE_STATE;
export const JOB_TITLE = process.env.E2E_JOB_TITLE || 'ATTORNEY I';
// Email of the signed-in account. Used to find its application in the HR list.
export const APPLICANT_EMAIL = process.env.E2E_APPLICANT_EMAIL;
export const JOURNEY = process.env.RUN_APPLICATION_JOURNEY === '1';
export const DUMMY_PDF = 'tests/fixtures/dummy-application-letter.pdf';

export type PortalModule = 'Admin Dashboard' | 'Applicant Portal' | 'HR-MPSB Panel';

export const PATHS = {
  jobs: '/jobs',
  portalApply: '/portal/apply-now',
  portalTrack: '/portal/track-applications',
  portalFiles: '/portal/my-files',
  portalSettings: '/portal/account-settings',
  adminApplications: '/admin/applications',
  hrMpsb: '/hRMPSBportal/applicant-info',
} as const;

// Where the site lands right after a module switch (seen by hand on 2026-11-23).
const MODULE_LANDING: Record<PortalModule, RegExp> = {
  'Admin Dashboard': /\/admin\//,
  'Applicant Portal': /\/portal\//,
  'HR-MPSB Panel': /\/hRMPSBportal\//,
};

// Opens the user menu > Switch Module dialog and switches to `target`.
// The admin menu reads Settings / Switch Module / Action Logs / Sign out; the applicant menu reads Security & Account Settings / Switch Module / Sign out.
// The switch takes several seconds, so this waits for the new module's page before returning.
// TODO: the dropdown and option selectors come from a screenshot walk-through and were never run.
export async function switchModule(page: Page, target: PortalModule): Promise<void> {
  await page.getByRole('button', { name: 'User menu' }).click();
  await page.getByText('Switch Module', { exact: true }).first().click();
  await expect(page.getByText('Switch Access Module')).toBeVisible();
  await page.getByRole('button', { name: /Admin Dashboard|Applicant Portal|HR-MPSB Panel/ }).first().click();
  await page.getByRole('option', { name: target }).click();
  await page.getByRole('button', { name: 'Switch Module' }).last().click();
  await page.waitForURL(MODULE_LANDING[target], { timeout: 30_000 });
}

// Goes to `path` of a module. If the page for that module does not show `marker`, switches module and tries again.
// Confirmed by hand on 2026-11-23: opening an /admin URL while the Applicant Portal module is active redirects to
// /portal/apply-now, so the module has to be switched first (this function does that).
export async function enterModule(page: Page, target: PortalModule, path: string, marker: Locator): Promise<void> {
  await page.goto(path);
  const there = await marker.waitFor({ state: 'visible', timeout: 5_000 }).then(() => true, () => false);
  if (!there) {
    await switchModule(page, target);
    await page.goto(path);
  }
  await expect(marker).toBeVisible();
}

export function enterApplicantPortal(page: Page, path: string = PATHS.portalApply): Promise<void> {
  return enterModule(page, 'Applicant Portal', path, page.getByText('ZCMC RECRUITMENT PORTAL').or(page.getByText('APPLICATION STATUS DASHBOARD')).first());
}

export function enterAdminApplications(page: Page): Promise<void> {
  return enterModule(page, 'Admin Dashboard', PATHS.adminApplications, page.getByRole('heading', { name: 'Applications' }));
}

export function enterHrMpsb(page: Page): Promise<void> {
  return enterModule(page, 'HR-MPSB Panel', PATHS.hrMpsb, page.getByRole('heading', { name: 'Applications Lists' }));
}

// "N jobs found" on /jobs.
export async function publicJobCount(page: Page): Promise<number> {
  const text = await page.getByText(/\d+ jobs? found/i).first().innerText();
  return Number(/(\d+)/.exec(text)?.[1] ?? 0);
}

// From /jobs, opens the details page of the job card whose text contains `title`.
export async function openPublicJobDetails(page: Page, title: string): Promise<void> {
  await page.goto(PATHS.jobs);
  const card = page.getByText(title, { exact: true }).first();
  await expect(card).toBeVisible();
  // The card has a "View Details" button. The details address holds an encrypted token, so it cannot be typed.
  await page.getByRole('button', { name: 'View Details' }).first().click();
  await expect(page).toHaveURL(/\/job-details\//);
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
}

// Total Applications number on /portal/track-applications.
export async function totalApplications(page: Page): Promise<number> {
  const text = await page.locator('main').innerText();
  const match = /(\d+)\s*Total Applications/i.exec(text);
  if (!match) throw new Error('Total Applications count not found on the Track Applications page');
  return Number(match[1]);
}
