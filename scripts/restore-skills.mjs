// Restores the Claude Code skills listed in skills-lock.json into .agents/skills and links them from .claude/skills.
// The skill folders are not stored in this repo (they are large). The lock file pins the source repo and commit of each one.
//
//   node scripts/restore-skills.mjs               restore all skills (re-downloads)
//   node scripts/restore-skills.mjs --if-missing  do nothing when every skill is already there (used by the SessionStart hook)
//
// Needs git on the PATH and access to github.com. Run it from the project root.

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const ifMissing = process.argv.includes('--if-missing');
const lock = JSON.parse(readFileSync('skills-lock.json', 'utf8'));
const names = Object.keys(lock.skills);

const agentsDir = resolve('.agents', 'skills');
const claudeDir = resolve('.claude', 'skills');

const missing = names.filter((n) => !existsSync(join(agentsDir, n, 'SKILL.md')));
if (ifMissing && missing.length === 0) process.exit(0);

const todo = ifMissing ? missing : names;
console.log(`Restoring ${todo.length} skill(s) from skills-lock.json ...`);

// Group by source repo and commit so each one is cloned once.
const groups = new Map();
for (const n of todo) {
  const { source, commit, skillPath } = lock.skills[n];
  const key = `${source}@${commit}`;
  if (!groups.has(key)) groups.set(key, { source, commit, skills: [] });
  groups.get(key).skills.push({ name: n, dir: dirname(skillPath) });
}

mkdirSync(agentsDir, { recursive: true });
mkdirSync(claudeDir, { recursive: true });

for (const { source, commit, skills } of groups.values()) {
  const tmp = mkdtempSync(join(tmpdir(), 'skills-'));
  try {
    execFileSync('git', ['clone', '--quiet', '--no-checkout', `https://github.com/${source}.git`, tmp], { stdio: 'inherit' });
    execFileSync('git', ['-C', tmp, 'checkout', '--quiet', commit], { stdio: 'inherit' });
    for (const { name, dir } of skills) {
      const target = join(agentsDir, name);
      rmSync(target, { recursive: true, force: true });
      cpSync(join(tmp, dir), target, { recursive: true });
      linkOrCopy(target, join(claudeDir, name));
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}
console.log('Done. Restart Claude Code if it was already open.');

// .claude/skills/<name> points at .agents/skills/<name>. A junction needs no admin rights on Windows; fall back to a copy.
function linkOrCopy(target, link) {
  try {
    if (lstatSync(link, { throwIfNoEntry: false })) rmSync(link, { recursive: true, force: true });
    symlinkSync(target, link, 'junction');
  } catch {
    cpSync(target, link, { recursive: true });
  }
}
