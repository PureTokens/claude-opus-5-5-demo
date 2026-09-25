import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, 'static-assets');
const games = ['pelican-bike', 'cf-transport-ship', 'qq-speed'];

// Each game is an independent, self-contained static site.
for (const game of games) {
  const cwd = join(root, game);
  execFileSync('node', ['build.mjs'], { cwd, stdio: 'inherit' });
}

rmSync(output, { recursive: true, force: true });
mkdirSync(output);
for (const game of games) {
  const site = join(output, game);
  mkdirSync(site);
  copyFileSync(join(root, game, 'dist', 'index.html'), join(site, 'index.html'));
  execFileSync('zip', ['-q', join(output, `${game}.zip`), 'index.html'], { cwd: site });
}
console.log(`Three independent static sites and ZIP files are ready: ${output}`);
