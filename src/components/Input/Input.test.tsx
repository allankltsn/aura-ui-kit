import { createRef } from 'react';
import { axe } from 'vitest-axe';
import { renderUi } from '@/test/render';
import { Input } from './Input';
import { TextField } from './TextField';

describe('Input', () => {
  it('aceita digitação e repassa ref', async () => {
    const ref = createRef<HTMLInputElement>();
    const { user, getByRole } = renderUi(<Input ref={ref} aria-label="Nome" />);
    await user.type(getByRole('textbox'), 'Maria');
    expect(ref.current).toHaveValue('Maria');
  });

  it('invalid marca aria-invalid', () => {
    const { getByRole } = renderUi(<Input aria-label="Nome" invalid />);
    expect(getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('revealable alterna a visibilidade da senha pelo botão', async () => {
    const { user, getByLabelText, getByRole } = renderUi(
      <Input type="password" revealable aria-label="Senha" />,
    );
    const input = getByLabelText('Senha');
    expect(input).toHaveAttribute('type', 'password');
    await user.click(getByRole('button', { name: 'Mostrar senha' }));
    expect(input).toHaveAttribute('type', 'text');
    expect(getByRole('button', { name: 'Ocultar senha' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('e-mail longo não estoura o contêiner', () => {
    const { getByRole } = renderUi(
      <Input aria-label="E-mail" defaultValue={'a'.repeat(200) + '@exemplo.com'} />,
    );
    expect(getByRole('textbox')).toHaveClass('min-w-0', 'w-full');
  });
});

describe('TextField', () => {
  it('associa label, dica e erro ao campo', () => {
    const { getByLabelText } = renderUi(
      <TextField label="E-mail" hint="Use o e-mail de cadastro" error="E-mail inválido" />,
    );
    const input = getByLabelText('E-mail');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Use o e-mail de cadastro E-mail inválido');
  });

  it('erro aparece com ícone e texto, não só com cor', () => {
    const { getByText } = renderUi(<TextField label="E-mail" error="E-mail inválido" />);
    expect(getByText('E-mail inválido').parentElement!.querySelector('svg')).toBeInTheDocument();
  });

  it('required mostra indicador acessível', () => {
    const { getByLabelText } = renderUi(<TextField label="Nome" required />);
    expect(getByLabelText(/Nome/)).toBeRequired();
  });

  it('não tem violações de acessibilidade', async () => {
    const { container } = renderUi(
      <TextField label="Senha" type="password" revealable hint="Mínimo 8 caracteres" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('TextField (aria-describedby do consumidor)', () => {
  it('mantém hint e erro junto do aria-describedby externo', () => {
    const { getByLabelText } = renderUi(
      <TextField label="L" hint="dica" error="ruim" aria-describedby="externo" />,
    );
    const described = getByLabelText('L').getAttribute('aria-describedby') ?? '';
    expect(described.split(' ')).toContain('externo');
    expect(getByLabelText('L')).toHaveAccessibleDescription(/dica.*ruim/);
  });
});
