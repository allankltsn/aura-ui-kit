import { axe } from 'vitest-axe';
import { renderUi } from '@/test/render';
import { Segmented } from './Segmented';

const options = [
  { value: 'personal', label: 'Personal Trainer' },
  { value: 'aluno', label: 'Aluno' },
  { value: 'admin', label: 'Admin' },
] as const;

describe('Segmented', () => {
  it('seleciona por clique e avisa', async () => {
    const onValueChange = vi.fn();
    const { user, getByRole } = renderUi(
      <Segmented
        aria-label="Perfil"
        options={[...options]}
        defaultValue="personal"
        onValueChange={onValueChange}
      />,
    );
    await user.click(getByRole('radio', { name: 'Aluno' }));
    expect(getByRole('radio', { name: 'Aluno' })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('aluno');
  });

  it('navega com as setas', async () => {
    const { user, getByRole } = renderUi(
      <Segmented aria-label="Perfil" options={[...options]} defaultValue="personal" />,
    );
    getByRole('radio', { name: 'Personal Trainer' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(getByRole('radio', { name: 'Aluno' })).toBeChecked();
  });

  it('modo controlado reflete o value', () => {
    const { getByRole } = renderUi(
      <Segmented aria-label="Perfil" options={[...options]} value="admin" />,
    );
    expect(getByRole('radio', { name: 'Admin' })).toBeChecked();
  });

  it('expõe o grupo com nome acessível e passa no axe', async () => {
    const { getByRole, container } = renderUi(
      <Segmented aria-label="Perfil" options={[...options]} defaultValue="aluno" />,
    );
    expect(getByRole('radiogroup', { name: 'Perfil' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
