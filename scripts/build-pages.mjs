import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const docsPublicSnackSrcDir = path.join(
  repoRoot,
  'apps/docs/public/snack-src'
);
const docsDistDir = path.join(repoRoot, 'apps/docs/.vitepress/dist');
const webDistDir = path.join(repoRoot, 'apps/web/dist');

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

await rm(docsPublicSnackSrcDir, { recursive: true, force: true });
await mkdir(
  path.join(docsPublicSnackSrcDir, 'formatted-number-input'),
  { recursive: true }
);

await cp(
  path.join(repoRoot, 'apps/docs/.vitepress/theme/snacks/formatted-number-input/App.js'),
  path.join(docsPublicSnackSrcDir, 'App.js')
);

await cp(
  path.join(repoRoot, 'packages/core/src'),
  path.join(docsPublicSnackSrcDir, 'formatted-number-input/src'),
  { recursive: true }
);

run(['-w', '@demo/docs', 'run', 'build']);
run(['-w', '@demo/web', 'run', 'build']);

await rm(path.join(docsDistDir, 'web'), { recursive: true, force: true });
await rm(path.join(docsDistDir, 'web-standalone'), {
  recursive: true,
  force: true,
});
await cp(webDistDir, path.join(docsDistDir, 'web-standalone'), {
  recursive: true,
});
