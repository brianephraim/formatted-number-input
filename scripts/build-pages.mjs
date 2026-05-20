import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const run = (args) => {
  const result = spawnSync('npm', args, {
    cwd: repoRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const generatedSnackSrcDir = path.join(repoRoot, 'apps/web/public/snack-src');

await rm(generatedSnackSrcDir, {
  recursive: true,
  force: true,
});
await mkdir(path.join(repoRoot, 'apps/web/public'), { recursive: true });

try {
  run(['run', 'prepare:snack-src']);
  run(['-w', '@demo/web', 'run', 'build']);
} finally {
  await rm(generatedSnackSrcDir, {
    recursive: true,
    force: true,
  });
}
