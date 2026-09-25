import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, 'static-site');
const games = ['pelican-bike', 'cf-transport-ship', 'qq-speed'];

// Each existing build produces a self-contained HTML file.
for (const game of games) {
  const cwd = join(root, game);
  execFileSync('node', ['build.mjs'], { cwd, stdio: 'inherit' });
}

rmSync(output, { recursive: true, force: true });
mkdirSync(output);
copyFileSync(join(root, 'static-index.html'), join(output, 'index.html'));
for (const game of games) {
  mkdirSync(join(output, game));
  copyFileSync(join(root, game, 'dist', 'index.html'), join(output, game, 'index.html'));
}
console.log(`Static site ready: ${output}`);
