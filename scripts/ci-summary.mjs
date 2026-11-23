// Writes a pass/fail/skip table (and the failed tests) to the GitHub job summary.
import { readFileSync, appendFileSync, existsSync } from 'node:fs';

const file = process.argv[2] ?? 'ci-results.json';
const out = process.env.GITHUB_STEP_SUMMARY;
if (!existsSync(file)) {
  console.log(`No ${file}, nothing to summarize.`);
  process.exit(0);
}

const counts = { passed: 0, failed: 0, flaky: 0, skipped: 0 };
const failed = [];

function walk(suite, titles = []) {
  const path = suite.title ? [...titles, suite.title] : titles;
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests ?? []) {
      const status = t.status; // expected | unexpected | flaky | skipped
      if (status === 'expected') counts.passed++;
      else if (status === 'unexpected') {
        counts.failed++;
        failed.push(`${path.join(' > ')} > ${spec.title}`);
      } else if (status === 'flaky') counts.flaky++;
      else counts.skipped++;
    }
  }
  for (const s of suite.suites ?? []) walk(s, path);
}

const report = JSON.parse(readFileSync(file, 'utf8'));
for (const s of report.suites ?? []) walk(s);

const total = counts.passed + counts.failed + counts.flaky + counts.skipped;
let md = `## Playwright results\n\n| Total | Passed | Failed | Flaky | Skipped |\n|---|---|---|---|---|\n`;
md += `| ${total} | ${counts.passed} | ${counts.failed} | ${counts.flaky} | ${counts.skipped} |\n`;
if (failed.length) {
  md += `\n### Failed tests\n\n${failed.map((f) => `- ${f}`).join('\n')}\n`;
}
md += `\nThe full HTML report and traces are in the run's Artifacts.\n`;

if (out) appendFileSync(out, md);
else console.log(md);
