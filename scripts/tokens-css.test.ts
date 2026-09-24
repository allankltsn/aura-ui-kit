import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tokens from '../src/tokens/tokens.json';
// @ts-expect-error módulo .mjs sem tipos
import { renderTokensCss } from './tokens-css.mjs';

describe('renderTokensCss', () => {
  const css: string = renderTokensCss(tokens);

  it('converte hex em canais RGB para suportar opacidade', () => {
    expect(css).toContain('--color-primary: 177 17 27;');
  });

  it('gera o tema escuro sob .dark', () => {
    expect(css).toMatch(/\.dark\s*{[^}]*--color-bg: 20 20 20;/);
  });

  it('src/tokens/tokens.css está em dia com tokens.json', () => {
    const file = resolve(dirname(fileURLToPath(import.meta.url)), '../src/tokens/tokens.css');
    const onDisk = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    expect(onDisk).toBe(css);
  });
});
