import { cn } from './cn';

describe('cn', () => {
  it('junta classes e ignora valores falsos', () => {
    const hidden = false as boolean;
    expect(cn('a', hidden && 'b', undefined, 'c')).toBe('a c');
  });

  it('resolve conflitos do Tailwind mantendo a última', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('não confunde tamanhos de fonte customizados com cores de texto', () => {
    expect(cn('text-body', 'text-primary')).toBe('text-body text-primary');
    expect(cn('text-body', 'text-caption')).toBe('text-caption');
  });
});
