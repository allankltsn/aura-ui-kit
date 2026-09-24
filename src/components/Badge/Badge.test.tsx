import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders default and semantic tones with native attributes', () => {
    const { rerender } = render(<Badge data-testid="badge">Rascunho</Badge>);
    expect(screen.getByTestId('badge')).toHaveClass('bg-surface-2');
    rerender(
      <Badge tone="success" data-testid="badge">
        Ativa
      </Badge>,
    );
    expect(screen.getByText('Ativa')).toHaveClass('bg-success-bg', 'text-success-text');
  });

  it('renders an icon and has no accessibility violations', async () => {
    const { container } = render(
      <Badge tone="danger" icon="warning">
        Falhou
      </Badge>,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
