import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const snackSrcDir = path.join(repoRoot, 'apps/web/public/snack-src');

await rm(snackSrcDir, { recursive: true, force: true });
await mkdir(path.join(snackSrcDir, 'formatted-number-input'), {
  recursive: true,
});

await cp(
  path.join(repoRoot, 'apps/web/snack/App.js'),
  path.join(snackSrcDir, 'App.js')
);

await cp(
  path.join(repoRoot, 'packages/core/src'),
  path.join(snackSrcDir, 'formatted-number-input/src'),
  { recursive: true }
);
