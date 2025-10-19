#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const sourceDir = path.join(projectRoot, 'local-test');
const outputDir = path.join(projectRoot, 'static', 'ui');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyFile(sourceName, targetName) {
  const source = path.join(sourceDir, sourceName);
  const target = path.join(outputDir, targetName);
  await fs.copyFile(source, target);
  console.log(`Copied ${sourceName} -> ${path.relative(projectRoot, target)}`);
}

async function main() {
  await fs.rm(outputDir, { recursive: true, force: true });
  await ensureDir(outputDir);

  await copyFile('index-v2.html', 'index.html');
  await copyFile('app-v2.js', 'app-v2.js');
  await copyFile('styles.css', 'styles.css');
  await copyFile('d3.min.js', 'd3.min.js');
  await copyFile('cytoscape.min.js', 'cytoscape.min.js');

  console.log('\nForge UI build ready at static/ui/');
  console.log('Deploy with: forge deploy');
}

main().catch((err) => {
  console.error('Failed to build Forge UI from local-test/index-v2.html');
  console.error(err);
  process.exit(1);
});
