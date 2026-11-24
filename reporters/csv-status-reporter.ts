import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// Fills the Status and Actual results columns of the test case CSVs from a Playwright run.
// Rows are matched by the TC-XXX-nnn ID at the start of the test title.
//
// Default: writes the updated copies to test-results/csv-status/ and leaves test-cases/ untouched.
// UPDATE_CSV=1: writes the updated CSVs in place in test-cases/.
//
// It never changes Bug Status, Severity or Notes. Skipped tests leave their row untouched,
// so a partial run does not wipe the results of other rows.

const ID_PATTERN = /\bTC-[A-Z]+-\d+\b/;
const CASES_DIR = path.resolve('test-cases');
const OUT_DIR = path.resolve('test-results', 'csv-status');
const ANSI = /\u001b\[[0-9;]*m/g;

interface Cell {
  value: string;
  quoted: boolean;
}

interface Outcome {
  status: 'Passed' | 'Failed';
  actual: string;
}

function parseCsv(text: string): Cell[][] {
  const rows: Cell[][] = [];
  let row: Cell[] = [];
  let value = '';
  let quoted = false;
  let inQuotes = false;
  let i = 0;
  const endCell = (): void => {
    row.push({ value, quoted });
    value = '';
    quoted = false;
  };
  const endRow = (): void => {
    endCell();
    rows.push(row);
    row = [];
  };
  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          value += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      value += ch;
      i++;
    } else if (ch === '"') {
      inQuotes = true;
      quoted = true;
      i++;
    } else if (ch === ',') {
      endCell();
      i++;
    } else if (ch === '\r') {
      i++;
    } else if (ch === '\n') {
      endRow();
      i++;
    } else {
      value += ch;
      i++;
    }
  }
  if (value !== '' || quoted || row.length > 0) endRow();
  return rows;
}

function serializeCell(cell: Cell): string {
  if (cell.quoted || /[",\r\n]/.test(cell.value)) {
    return `"${cell.value.replace(/"/g, '""')}"`;
  }
  return cell.value;
}

function firstLine(message: string | undefined): string {
  const clean = (message ?? '').replace(ANSI, '').trim();
  const line = clean.split(/\r?\n/).find((l) => l.trim() !== '') ?? 'Test failed';
  return line.length > 300 ? `${line.slice(0, 297)}...` : line;
}

class CsvStatusReporter implements Reporter {
  private readonly outcomes = new Map<string, Outcome>();

  printsToStdio(): boolean {
    return false;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const id = test.title.match(ID_PATTERN)?.[0];
    if (!id || result.status === 'skipped') return;

    const passed = result.status === test.expectedStatus;
    const previous = this.outcomes.get(id);
    // A later attempt replaces an earlier one. If two tests share an ID, a failure wins.
    if (passed && previous?.status === 'Failed' && result.retry === 0) return;

    this.outcomes.set(
      id,
      passed
        ? { status: 'Passed', actual: '' }
        : { status: 'Failed', actual: firstLine(result.error?.message) },
    );
  }

  onEnd(): void {
    if (this.outcomes.size === 0 || !existsSync(CASES_DIR)) return;

    const inPlace = process.env.UPDATE_CSV === '1';
    const outDir = inPlace ? CASES_DIR : OUT_DIR;
    const unmatched = new Set(this.outcomes.keys());
    const lines: string[] = [];

    for (const file of readdirSync(CASES_DIR).filter((f) => f.toLowerCase().endsWith('.csv'))) {
      const raw = readFileSync(path.join(CASES_DIR, file), 'utf8').replace(/^﻿/, '');
      const eol = raw.includes('\r\n') ? '\r\n' : '\n';
      const rows = parseCsv(raw);
      const header = rows[0]?.map((c) => c.value.trim());
      if (!header) continue;

      const idCol = header.indexOf('Test case ID');
      const statusCol = header.indexOf('Status');
      const actualCol = header.indexOf('Actual results');
      if (idCol < 0 || statusCol < 0 || actualCol < 0) continue;

      let updated = 0;
      for (const row of rows.slice(1)) {
        const id = row[idCol]?.value.trim();
        const outcome = id ? this.outcomes.get(id) : undefined;
        if (!id || !outcome) continue;

        while (row.length <= Math.max(statusCol, actualCol)) row.push({ value: '', quoted: false });
        const before = row[statusCol].value.trim();

        if (outcome.status === 'Passed') {
          // A row that failed or was blocked before and now passes is a retest.
          // Actual results is left as it was, so the tester can read the old failure and clear it.
          const retested = before === 'Failed' || before === 'Blocked' || before === '[Retested] Passed';
          row[statusCol].value = retested ? '[Retested] Passed' : 'Passed';
        } else {
          row[statusCol].value = 'Failed';
          row[actualCol].value = outcome.actual;
        }
        unmatched.delete(id);
        updated++;
      }

      if (updated === 0) continue;
      mkdirSync(outDir, { recursive: true });
      const text = `﻿${rows.map((r) => r.map(serializeCell).join(',')).join(eol)}${eol}`;
      writeFileSync(path.join(outDir, file), text, 'utf8');
      lines.push(`  ${file}: ${updated} row(s) updated`);
    }

    console.log(`\nCSV status (${inPlace ? 'written in place to test-cases/' : 'written to test-results/csv-status/'}):`);
    console.log(lines.length > 0 ? lines.join('\n') : '  no matching rows found');
    if (unmatched.size > 0) {
      console.log(`  IDs not found in any CSV: ${[...unmatched].join(', ')}`);
    }
  }
}

export default CsvStatusReporter;
