import { defineConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Load .env (git-ignored) with the sandbox test user, if present.
try { process.loadEnvFile(path.resolve(__dirname, '.env')); } catch {}

// Optional: browser data exported from a real browser (saved User Switcher sessions).
// See .auth/README.md. It holds credentials, so it is git-ignored and must never be shared.
const storageState = path.resolve(__dirname, '.auth/state.json');

// Every run gets its own results folder so earlier runs are never overwritten.
// `npm test` (scripts/run-tests.mjs) sets RUN_ID; plain `npx playwright test` reuses "adhoc".
const runDir = `results/${process.env.RUN_ID ?? 'adhoc'}`;

export default defineConfig({
  testDir: './tests',
  timeout: 150_000, // filing a request on the sandbox can be slow
  workers: 1,       // tests share one sandbox user, so run them one at a time
  outputDir: `${runDir}/artifacts`,
  reporter: [
    ['list'],
    ['html', { outputFolder: `${runDir}/report`, open: 'never' }],
    ['json', { outputFile: `${runDir}/results.json` }],
  ],
  use: {
    baseURL: 'https://sandbox-pr.zcmc.online',
    storageState: fs.existsSync(storageState) ? storageState : undefined,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
});
