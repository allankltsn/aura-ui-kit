import { axe } from 'vitest-axe';
import { renderUi } from '@/test/render';
import { Checkbox, Radio } from './Checkbox';

describe('Checkbox', () => {
  it('alterna por clique no rótulo e por Espaço', async () => {
    const { user, getByRole, getByText } = renderUi(<Checkbox label="Li e aceito os termos" />);
    const box = getByRole('checkbox', { name: 'Li e aceito os termos' });
    await user.click(getByText('Li e aceito os termos'));
    expect(box).toBeChecked();
    box.focus();
    await user.keyboard(' ');
    expect(box).not.toBeChecked();
  });

  it('descrição e erro ficam associados', () => {
    const { getByRole } = renderUi(<Checkbox label="Termos" description="Obrigatório" invalid />);
    const box = getByRole('checkbox');
    expect(box).toHaveAccessibleDescription('Obrigatório');
    expect(box).toHaveAttribute('aria-invalid', 'true');
  });

  it('a área clicável tem pelo menos 44px de altura', () => {
    const { getByText } = renderUi(<Checkbox label="Termos" />);
    expect(getByText('Termos').closest('label')).toHaveClass('min-h-11');
  });

  it('não tem violações de acessibilidade', async () => {
    const { container } = renderUi(<Checkbox label="Termos" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Radio', () => {
  it('seleciona uma opção do grupo e navega com as setas', async () => {
    const { user, getAllByRole } = renderUi(
      <div role="radiogroup" aria-label="Perfil">
        <Radio name="p" value="a" label="Personal" defaultChecked />
        <Radio name="p" value="b" label="Aluno" />
      </div>,
    );
    const [a, b] = getAllByRole('radio');
    a!.focus();
    await user.keyboard('{ArrowDown}');
    expect(b).toBeChecked();
    expect(a).not.toBeChecked();
  });
});
