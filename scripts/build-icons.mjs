import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { buildIconsModule, extractInner } from './icons-module.mjs';

const dir = new URL('../assets/aurafit-icons/svg/', import.meta.url);
const icons = {};
for (const file of readdirSync(dir).filter((f) => f.endsWith('.svg'))) {
  icons[basename(file, '.svg')] = extractInner(readFileSync(new URL(file, dir), 'utf8'));
}
writeFileSync(new URL('../src/icons/icons.generated.ts', import.meta.url), buildIconsModule(icons));
console.log(`${Object.keys(icons).length} ícones gerados`);
