import { test, expect } from '@playwright/test';

// Login (/login). Runs last. Only one wrong-credentials attempt is made, with a fake account.

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('TC-LOGIN-001: page loads with the login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
    await expect(page.getByText('Zamboanga City Medical Center • Recruitment Portal')).toBeVisible();
    await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
    await expect(page.getByText('Remember me')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
  });

  test('TC-LOGIN-002: password field hides the typed characters', async ({ page }) => {
    await expect(page.getByPlaceholder('Enter your password')).toHaveAttribute('type', 'password');
  });

  test('TC-LOGIN-003: alternative sign-in options are shown', async ({ page }) => {
    await expect(page.getByText('OR CONTINUE WITH')).toBeVisible();
    await expect(page.getByText('ZCMC UMIS')).toBeVisible();
    await expect(page.getByText('Google Account')).toBeVisible();
  });

  test('TC-LOGIN-004: "Forgot password?" opens the password reset page', async ({ page }) => {
    await page.getByRole('link', { name: 'Forgot password?' }).click();
    await expect(page).toHaveURL(/\/forgot-password$/);
  });

  test('TC-LOGIN-005: "Register now" opens the registration page', async ({ page }) => {
    await page.getByRole('link', { name: 'Register now' }).click();
    await expect(page).toHaveURL(/\/register$/);
  });

  test('TC-LOGIN-006: "Back to Home" returns to the landing page', async ({ page }) => {
    await page.getByRole('link', { name: 'Back to Home' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('TC-LOGIN-007: empty form cannot be submitted', async ({ page }) => {
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/\/login$/);
    const valid = await page.getByPlaceholder('name@example.com').evaluate((el) => (el as HTMLInputElement).checkValidity());
    expect(valid).toBe(false);
  });

  test('TC-LOGIN-008: wrong credentials are rejected with an error', async ({ page }) => {
    await page.getByPlaceholder('name@example.com').fill('no.such.user.pwtest@mailinator.com');
    await page.getByPlaceholder('Enter your password').fill('WrongPassword#123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/\/login$/);
    // TODO: confirm the exact error message wording on the live site and assert it here.
    await expect(page.getByText(/credentials|incorrect|invalid|do not match|failed/i)).toBeVisible();
  });
});

// Portal Gateway (shown after a successful login). These tests sign in once per test on the live system
// with an existing account from .env. They skip themselves when the credentials are not set.
//   TEST_LOGIN_EMAIL / TEST_LOGIN_PASSWORD   account with access to the portals under test
//   TEST_APPLICANT_ONLY_EMAIL / _PASSWORD    optional: an applicant-only account for TC-LOGIN-015
const LOGIN_EMAIL = process.env.TEST_LOGIN_EMAIL;
const LOGIN_PASSWORD = process.env.TEST_LOGIN_PASSWORD;

async function login(page: import('@playwright/test').Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByPlaceholder('name@example.com').fill(email);
  await page.getByPlaceholder('Enter your password').fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByText('Portal Gateway')).toBeVisible();
}

test.describe('Portal Gateway (needs an existing account)', () => {
  test.skip(!LOGIN_EMAIL || !LOGIN_PASSWORD, 'Set TEST_LOGIN_EMAIL and TEST_LOGIN_PASSWORD in .env');

  test.beforeEach(async ({ page }) => {
    await login(page, LOGIN_EMAIL!, LOGIN_PASSWORD!);
  });

  test('TC-LOGIN-009: valid login opens the Portal Gateway', async ({ page }) => {
    await expect(page.getByText('Select your destination portal to proceed to your account.')).toBeVisible();
  });

  test('TC-LOGIN-010: Portal Gateway lists the three portals', async ({ page }) => {
    await expect(page.getByText('Applicant Portal')).toBeVisible();
    await expect(page.getByText('Browse job openings, apply, and track status')).toBeVisible();
    await expect(page.getByText('Admin / Staff Portal')).toBeVisible();
    await expect(page.getByText('Manage system, job applications & recruitment')).toBeVisible();
    await expect(page.getByText('HRMPSB Board Portal')).toBeVisible();
    await expect(page.getByText('Merit selection deliberations & candidate evaluations')).toBeVisible();
    await expect(page.getByText('Zamboanga City Medical Center © 2026')).toBeVisible();
  });

  test('TC-LOGIN-011: "Back to login" returns to the login page', async ({ page }) => {
    await page.getByText('Back to login').click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('TC-LOGIN-012: Applicant Portal opens the applicant side', async ({ page }) => {
    await page.getByText('Applicant Portal').click();
    // TODO: assert the destination address once it is known.
    await expect(page.getByText('Portal Gateway')).toBeHidden();
  });

  test('TC-LOGIN-013: Admin / Staff Portal opens for an account with staff access', async ({ page }) => {
    await page.getByText('Admin / Staff Portal').click();
    // TODO: assert the destination address once it is known. Needs an account with the staff role.
    await expect(page.getByText('Portal Gateway')).toBeHidden();
  });

  test('TC-LOGIN-014: HRMPSB Board Portal opens for an account with board access', async ({ page }) => {
    await page.getByText('HRMPSB Board Portal').click();
    // TODO: assert the destination address once it is known. Needs an account with the board role.
    await expect(page.getByText('Portal Gateway')).toBeHidden();
  });
});

test.describe('Portal access by role (needs an applicant-only account)', () => {
  const email = process.env.TEST_APPLICANT_ONLY_EMAIL;
  const password = process.env.TEST_APPLICANT_ONLY_PASSWORD;
  test.skip(!email || !password, 'Set TEST_APPLICANT_ONLY_EMAIL and TEST_APPLICANT_ONLY_PASSWORD in .env');

  test('TC-LOGIN-015: an account without access to a portal cannot open it', async ({ page }) => {
    await login(page, email!, password!);
    for (const portal of ['Admin / Staff Portal', 'HRMPSB Board Portal']) {
      await page.getByText(portal).click();
      // Behavior to confirm: this assumes access is denied with a message or a redirect back to the gateway.
      await expect(page.getByText(/not authorized|access denied|no access|permission|Portal Gateway/i).first()).toBeVisible();
      await page.goto('/login');
      await login(page, email!, password!);
    }
  });
});

test('TC-LOGIN-016: a newly registered account can log in', async () => {
  test.skip(true, 'Manual. Blocked: the /verify page is blank (TC-REG-032), so a new account cannot be verified yet.');
});
