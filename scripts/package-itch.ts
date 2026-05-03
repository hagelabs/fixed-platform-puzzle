import { execSync } from 'node:child_process';
import { mkdirSync, existsSync, cpSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');
const templateData = resolve(root, 'marketing', 'TemplateData');
const outDir = resolve(root, 'submission');
const outZip = resolve(outDir, 'itch-build.zip');

console.log('[itch] running production build (target=itch, no SDK)...');
execSync('npx webpack --config webpack.config.js --mode production --env target=itch', {
  stdio: 'inherit',
  cwd: root,
});

if (!existsSync(distDir)) {
  console.error('[itch] dist/ missing after build');
  process.exit(1);
}

console.log('[itch] copying TemplateData/logo.png into dist/...');
const dstTemplate = resolve(distDir, 'TemplateData');
mkdirSync(dstTemplate, { recursive: true });
if (existsSync(templateData)) {
  cpSync(templateData, dstTemplate, { recursive: true });
} else {
  console.warn('[itch] marketing/TemplateData missing; skipping logo copy');
}

mkdirSync(outDir, { recursive: true });
if (existsSync(outZip)) rmSync(outZip);

console.log('[itch] zipping dist/ → submission/itch-build.zip...');
execSync(`cd "${distDir}" && zip -qr "${outZip}" .`, { stdio: 'inherit' });

execSync(`ls -lh "${outZip}"`, { stdio: 'inherit' });
console.log('[itch] done. Upload itch-build.zip to itch.io and check "This file will be played in the browser".');
