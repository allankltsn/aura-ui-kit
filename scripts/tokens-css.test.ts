import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
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
    const onDisk = readFileSync(resolve(process.cwd(), 'src/tokens/tokens.css'), 'utf8');
    expect(onDisk).toBe(css);
  });
});
