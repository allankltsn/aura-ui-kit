import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('announces loading and forwards span attributes', async () => {
    const { container } = render(<Spinner label="Salvando" data-testid="spinner" />);
    expect(screen.getByRole('status', { name: 'Salvando' })).toHaveAttribute(
      'data-testid',
      'spinner',
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('uses the default label', () => {
    render(<Spinner />);
    expect(screen.getByRole('status', { name: 'Carregando' })).toBeInTheDocument();
  });
});
