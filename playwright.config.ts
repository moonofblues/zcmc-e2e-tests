import { defineConfig, devices } from '@playwright/test';

// Load .env (BASE_URL, test credentials) if present. Node 22+.
try {
  process.loadEnvFile();
} catch {
  /* no .env file, defaults apply */
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI
    ? [['github'], ['list'], ['html', { open: 'never' }], ['./reporters/csv-status-reporter.ts']]
    : [['list'], ['html', { open: 'never' }], ['./reporters/csv-status-reporter.ts']],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://192.168.36.164:8000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
