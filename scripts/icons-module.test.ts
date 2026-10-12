// @ts-expect-error módulo .mjs sem tipos
import { extractInner, buildIconsModule } from './icons-module.mjs';

const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M1 1"/><circle cx="12" cy="12" r="3"/></svg>';

describe('extractInner', () => {
  it('devolve só o miolo do SVG', () => {
    expect(extractInner(svg)).toBe('<path d="M1 1"/><circle cx="12" cy="12" r="3"/>');
  });

  it('lança erro para arquivo sem <svg>', () => {
    expect(() => extractInner('<div/>')).toThrow(/svg/);
  });
});

describe('buildIconsModule', () => {
  it('gera o módulo com nomes ordenados e o tipo IconName', () => {
    const out: string = buildIconsModule({ b: '<path/>', a: '<circle/>' });
    expect(out.indexOf("'a'")).toBeLessThan(out.indexOf("'b'"));
    expect(out).toContain('export type IconName = keyof typeof iconPaths;');
  });
});
