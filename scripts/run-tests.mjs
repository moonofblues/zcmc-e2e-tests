// Runs Playwright and keeps every run's results in its own folder:
//   results/<YYYY-MM-DD_HH-mm-ss>/report/        HTML report (open with: npm run report)
//   results/<YYYY-MM-DD_HH-mm-ss>/artifacts/     screenshots, videos and traces of failed tests
//   results/<YYYY-MM-DD_HH-mm-ss>/results.json   machine-readable results
//   results/<YYYY-MM-DD_HH-mm-ss>/console.log    what was printed in the terminal
// Any extra arguments are passed on to Playwright, e.g. `npm test -- tests/custodian --headed`.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const pad = (n) => String(n).padStart(2, '0');
const d = new Date();
const runId =
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_` +
  `${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;

const runDir = path.join('results', runId);
fs.mkdirSync(runDir, { recursive: true });
const log = fs.createWriteStream(path.join(runDir, 'console.log'));

const cli = createRequire(import.meta.url).resolve('@playwright/test/cli');
const child = spawn(process.execPath, [cli, 'test', ...process.argv.slice(2)], {
  env: { ...process.env, RUN_ID: runId },
  stdio: ['inherit', 'pipe', 'pipe'],
});

child.stdout.on('data', (chunk) => { process.stdout.write(chunk); log.write(chunk); });
child.stderr.on('data', (chunk) => { process.stderr.write(chunk); log.write(chunk); });

child.on('close', (code) => {
  log.end();
  fs.writeFileSync(path.join('results', 'latest.txt'), runId);
  console.log(`\nResults of this run are saved in: ${runDir}`);
  console.log('Open its report with: npm run report');
  process.exit(code ?? 1);
});
