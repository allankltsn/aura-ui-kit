import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Icon } from './Icon';
import { iconPaths } from './icons.generated';

describe('Icon', () => {
  it('é decorativo por padrão', () => {
    const { container } = render(<Icon name="home" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('width', '20');
  });

  it('com title vira imagem acessível', () => {
    render(<Icon name="home" title="Início" size={24} />);
    expect(screen.getByRole('img', { name: 'Início' })).toHaveAttribute('width', '24');
  });

  it('usa currentColor para herdar a cor do texto', () => {
    const { container } = render(<Icon name="eye" />);
    expect(container.querySelector('svg')).toHaveAttribute('stroke', 'currentColor');
  });

  it('todo ícone tem conteúdo', () => {
    for (const [name, inner] of Object.entries(iconPaths)) {
      expect(inner.length, name).toBeGreaterThan(0);
    }
  });

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Icon name="home" title="Início" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
