import { createRef } from 'react';
import { axe } from 'vitest-axe';
import { renderUi } from '@/test/render';
import { Button } from './Button';

describe('Button', () => {
  it('clicks with mouse and keyboard and defaults to type button', async () => {
    const onClick = vi.fn();
    const { user, getByRole } = renderUi(<Button onClick={onClick}>Entrar</Button>);
    const button = getByRole('button', { name: 'Entrar' });
    expect(button).toHaveAttribute('type', 'button');
    await user.click(button);
    button.focus();
    await user.keyboard('{Enter} ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('blocks disabled and loading clicks while preserving the accessible name', async () => {
    const onClick = vi.fn();
    const { user, getByRole, rerender } = renderUi(
      <Button disabled onClick={onClick}>
        Salvar
      </Button>,
    );
    await user.click(getByRole('button'));
    rerender(
      <Button loading onClick={onClick}>
        Salvar
      </Button>,
    );
    const button = getByRole('button', { name: 'Salvar' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards ref, className and uses a real 44px minimum target', () => {
    const ref = createRef<HTMLButtonElement>();
    const { getByRole } = renderUi(
      <Button ref={ref} size="sm" className="extra">
        Ok
      </Button>,
    );
    const button = getByRole('button');
    expect(ref.current).toBe(button);
    expect(button).toHaveClass('extra', 'min-h-11', 'min-w-11');
  });

  it('uses semantic danger text and has no accessibility violations', async () => {
    const { container, getByRole } = renderUi(
      <Button variant="danger" leftIcon="plus">
        Novo
      </Button>,
    );
    expect(getByRole('button')).toHaveClass('bg-danger', 'text-on-danger');
    expect(await axe(container)).toHaveNoViolations();
  });
});
