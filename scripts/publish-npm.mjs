#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { execSync } from 'node:child_process';

const PACKAGE_WORKSPACE = 'formatted-number-input';

function run(command) {
  execSync(command, { stdio: 'inherit' });
}

function runCapture(command) {
  return execSync(command, { encoding: 'utf8' }).trim();
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const rl = createInterface({ input, output });

  try {
    const currentVersion = runCapture(`npm -w ${PACKAGE_WORKSPACE} pkg get version`).replace(/"/g, '');
    console.log(`\nCurrent version: ${currentVersion}`);

    const bumpAnswer = (await rl.question('Bump version before publish? (y/N): ')).trim().toLowerCase();

    if (bumpAnswer === 'y' || bumpAnswer === 'yes') {
      const degree = (await rl.question('Select bump type [patch|minor|major|custom]: ')).trim().toLowerCase();

      if (degree === 'patch' || degree === 'minor' || degree === 'major') {
        run(`npm -w ${PACKAGE_WORKSPACE} version ${degree} --no-git-tag-version`);
      } else if (degree === 'custom') {
        const customVersion = (await rl.question('Enter exact version (e.g. 0.2.0): ')).trim();
        if (!customVersion) throw new Error('Custom version is required.');
        run(`npm -w ${PACKAGE_WORKSPACE} version ${customVersion} --no-git-tag-version`);
      } else {
        throw new Error('Invalid bump type. Use patch, minor, major, or custom.');
      }
    }

    const nextVersion = runCapture(`npm -w ${PACKAGE_WORKSPACE} pkg get version`).replace(/"/g, '');
    console.log(`\nPublishing ${PACKAGE_WORKSPACE}@${nextVersion}${dryRun ? ' (dry-run)' : ''}...`);

    const otp = (await rl.question('OTP (leave blank to skip): ')).trim();
    const otpArg = otp ? ` --otp ${otp}` : '';
    const dryArg = dryRun ? ' --dry-run' : '';

    run(`npm -w ${PACKAGE_WORKSPACE} publish${dryArg}${otpArg}`);

    console.log('\nPublish step complete.');
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error(`\nError: ${err.message}`);
  process.exit(1);
});
