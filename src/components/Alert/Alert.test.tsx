import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Alert } from './Alert';

describe('Alert', () => {
  it('uses the right live region role for each tone', () => {
    const { rerender } = render(<Alert tone="danger">Falha</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Falha');
    rerender(<Alert tone="success">Salvo</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent('Salvo');
  });

  it('shows title and a keyboard accessible dismiss button only when requested', async () => {
    const onDismiss = vi.fn();
    const { rerender, container } = render(<Alert title="Atenção">Texto</Alert>);
    expect(screen.getByText('Atenção')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(
      <Alert title="Atenção" onDismiss={onDismiss}>
        Texto
      </Alert>,
    );
    const button = screen.getByRole('button', { name: 'Fechar aviso' });
    button.focus();
    await userEvent.keyboard('{Enter}');
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(await axe(container)).toHaveNoViolations();
  });
});
