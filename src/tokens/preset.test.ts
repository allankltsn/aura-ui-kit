import preset from './preset';

describe('preset Tailwind', () => {
  const ext = preset.theme.extend as Record<string, Record<string, unknown>>;

  it('usa dark mode por classe', () => {
    expect(preset.darkMode).toBe('class');
  });

  it('mapeia cores para variáveis CSS com suporte a opacidade', () => {
    expect(ext.colors!.primary).toBe('rgb(var(--color-primary) / <alpha-value>)');
    expect(ext.colors!['surface-2']).toBe('rgb(var(--color-surface-2) / <alpha-value>)');
  });

  it('gera a escala tipográfica a partir dos tokens', () => {
    expect(ext.fontSize!.display).toEqual(['32px', { lineHeight: '40px', fontWeight: '700' }]);
    expect(ext.fontSize!.caption).toEqual(['11px', { lineHeight: '16px', fontWeight: '400' }]);
  });

  it('expõe raios e sombras', () => {
    expect(ext.borderRadius!.lg).toBe('12px');
    expect(ext.boxShadow!['elev-2']).toContain('14px');
  });
});
