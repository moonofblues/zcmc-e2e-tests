import { defineConfig, devices } from '@playwright/test';

// Load .env (test email/password etc.) if present. Node 22+.
try {
  process.loadEnvFile();
} catch {
  /* no .env file, defaults apply */
}

export default defineConfig({
  testDir: './tests',
  // Live system: run one test at a time, never in parallel.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  // In CI also annotate failures on GitHub and write JSON for the job summary.
  reporter: process.env.CI
    ? [
        ['github'],
        ['list'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'ci-results.json' }],
      ]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://recruitment.zcmc.online',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
