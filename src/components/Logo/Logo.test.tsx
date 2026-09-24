import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Logo } from './Logo';

describe('Logo', () => {
  it('tem nome acessível único, sem ler as partes do wordmark', () => {
    render(<Logo />);
    expect(screen.getByRole('img', { name: 'aura-fit' })).toBeInTheDocument();
  });

  it('só o hífen é vermelho sobre fundo claro', () => {
    const { container } = render(<Logo variant="on-light" />);
    expect(container.querySelector('[data-part="hyphen"]')).toHaveClass('text-primary');
  });

  it('sobre vermelho o wordmark inteiro fica branco', () => {
    const { container } = render(<Logo variant="on-red" />);
    expect(container.querySelector('[data-part="hyphen"]')).toHaveClass('text-on-primary');
  });

  it('aplica o tamanho em px e não tem violações de acessibilidade', async () => {
    const { container } = render(<Logo size={40} />);
    expect(screen.getByRole('img')).toHaveStyle({ fontSize: '40px' });
    expect(await axe(container)).toHaveNoViolations();
  });
});
