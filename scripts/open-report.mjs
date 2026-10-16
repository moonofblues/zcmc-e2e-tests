// Opens the HTML report of a run. With no argument it opens the latest run.
//   npm run report                          latest run
//   npm run report -- 2026-10-16_16-30-05   a specific earlier run
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

let runId = process.argv[2];
if (!runId) {
  try {
    runId = fs.readFileSync(path.join('results', 'latest.txt'), 'utf8').trim();
  } catch {
    console.error('No runs found yet. Run the tests first: npm test');
    process.exit(1);
  }
}

const report = path.join('results', runId, 'report');
if (!fs.existsSync(report)) {
  const runs = fs.existsSync('results') ? fs.readdirSync('results').filter((n) => n !== 'latest.txt') : [];
  console.error(`No report for run "${runId}". Available runs:\n  ${runs.join('\n  ') || '(none)'}`);
  process.exit(1);
}

console.log(`Opening report of run ${runId}`);
const cli = createRequire(import.meta.url).resolve('@playwright/test/cli');
spawn(process.execPath, [cli, 'show-report', report], { stdio: 'inherit' });
