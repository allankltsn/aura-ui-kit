import { readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-expect-error módulo .mjs sem tipos
import { buildIconsModule, extractInner } from './icons-module.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const lf = (s: string) => s.replace(/\r\n/g, '\n');

describe('icons.generated.ts', () => {
  it('está em dia com assets/aurafit-icons/svg', () => {
    const dir = resolve(root, 'assets/aurafit-icons/svg');
    const icons: Record<string, string> = {};
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.svg'))) {
      icons[basename(file, '.svg')] = extractInner(lf(readFileSync(resolve(dir, file), 'utf8')));
    }
    const onDisk = lf(readFileSync(resolve(root, 'src/icons/icons.generated.ts'), 'utf8'));
    expect(Object.keys(icons).length).toBeGreaterThan(0);
    expect(onDisk).toBe(buildIconsModule(icons));
  });
});
