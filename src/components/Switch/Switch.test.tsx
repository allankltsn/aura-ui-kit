import { axe } from 'vitest-axe';
import { renderUi } from '@/test/render';
import { Switch } from './Switch';

describe('Switch', () => {
  it('não controlado alterna e avisa', async () => {
    const onCheckedChange = vi.fn();
    const { user, getByRole } = renderUi(
      <Switch label="Notificações" onCheckedChange={onCheckedChange} />,
    );
    const sw = getByRole('switch', { name: 'Notificações' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
    await user.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('controlado só muda quando o pai muda', async () => {
    const { user, getByRole, rerender } = renderUi(<Switch label="N" checked={false} />);
    await user.click(getByRole('switch'));
    expect(getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    rerender(<Switch label="N" checked />);
    expect(getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('alterna por teclado e respeita disabled', async () => {
    const { user, getByRole } = renderUi(<Switch label="N" />);
    getByRole('switch').focus();
    await user.keyboard('{Enter}');
    expect(getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('desabilitado não alterna e passa no axe', async () => {
    const { user, getByRole, container } = renderUi(<Switch label="N" disabled />);
    await user.click(getByRole('switch'));
    expect(getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    expect(await axe(container)).toHaveNoViolations();
  });
});
