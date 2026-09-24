import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('rest não sobrescreve props de segurança', () => {
    const { container } = render(
      <Icon
        name="home"
        aria-hidden={false}
        role="button"
        focusable="true"
        fill="red"
        stroke="red"
        viewBox="0 0 1 1"
        dangerouslySetInnerHTML={{ __html: '<script/>' }}
      />,
    );
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg.innerHTML).toBe(
      render(<Icon name="home" />).container.querySelector('svg')!.innerHTML,
    );
    expect(svg.querySelector('script')).toBeNull();
  });

  it('mescla className e repassa data-*, id, style e onClick', async () => {
    const onClick = vi.fn();
    const { container } = render(
      <Icon name="home" className="text-primary" data-testid="ic" id="i1" onClick={onClick} />,
    );
    const svg = screen.getByTestId('ic');
    expect(svg).toHaveClass('shrink-0', 'text-primary');
    expect(svg).toHaveAttribute('id', 'i1');
    await userEvent.click(container.querySelector('svg')!);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Icon name="home" title="Início" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
