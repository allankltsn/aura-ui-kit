import tokens from './tokens.json';
import { contrastRatio } from './contrast';

type Theme = keyof typeof tokens.color;

const PAIRS: Array<[string, string, number]> = [
  ['ink', 'bg', 4.5],
  ['ink', 'surface', 4.5],
  ['ink', 'surface-2', 4.5],
  ['muted', 'bg', 4.5],
  ['muted', 'surface', 4.5],
  ['muted', 'surface-2', 4.5],
  ['faint', 'bg', 4.5],
  ['faint', 'surface', 4.5],
  ['faint', 'surface-2', 4.5],
  ['on-primary', 'primary', 4.5],
  ['on-primary', 'primary-hover', 4.5],
  ['on-danger', 'danger', 4.5],
  ['accent-text', 'danger-bg', 3],
  ['accent-text', 'warning-bg', 3],
  ['accent-text', 'success-bg', 3],
  ['accent-text', 'info-bg', 3],
  ['accent-text', 'surface-2', 3],
  ['accent-text', 'surface', 4.5],
  ['accent-text', 'bg', 4.5],
  ['accent-text', 'primary-soft', 4.5],
  ['success-text', 'success-bg', 4.5],
  ['warning-text', 'warning-bg', 4.5],
  ['danger-text', 'danger-bg', 4.5],
  ['info-text', 'info-bg', 4.5],
  ['success-text', 'surface', 4.5],
  ['danger-text', 'surface', 4.5],
  ['info-text', 'surface', 4.5],
  // componentes e ícones: 3:1
  ['primary', 'surface', 3],
  ['success', 'surface', 3],
  ['danger', 'surface', 3],
  ['warning', 'surface', 3],
  ['on-primary', 'primary-press', 4.5],
  ['ink', 'primary-soft', 4.5],
];

describe('contraste dos tokens (WCAG AA)', () => {
  for (const theme of Object.keys(tokens.color) as Theme[]) {
    describe(theme, () => {
      const c = tokens.color[theme] as Record<string, string>;
      it.each(PAIRS)('%s sobre %s >= %f', (fg, bg, min) => {
        const ratio = contrastRatio(c[fg]!, c[bg]!);
        expect(
          ratio,
          `${fg} ${c[fg]} sobre ${bg} ${c[bg]} = ${ratio.toFixed(2)}`,
        ).toBeGreaterThanOrEqual(min);
      });
    });
  }

  it('danger não reaproveita o hex da marca', () => {
    expect(tokens.color.light.danger).not.toBe(tokens.color.light.primary);
  });

  it('light e dark têm as mesmas chaves', () => {
    expect(Object.keys(tokens.color.dark).sort()).toEqual(Object.keys(tokens.color.light).sort());
  });
});
