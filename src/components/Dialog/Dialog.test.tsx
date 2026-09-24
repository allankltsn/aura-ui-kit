import { fireEvent, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { renderUi } from '@/test/render';
import { Dialog } from './Dialog';
import { ConfirmDialog } from './ConfirmDialog';

describe('Dialog', () => {
  it('fechado não é exposto', () => {
    renderUi(<Dialog open={false} onClose={() => {}} title="Título" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('aberto expõe título e descrição acessíveis', () => {
    renderUi(
      <Dialog
        open
        onClose={() => {}}
        title="Excluir aluno"
        description="Essa ação é definitiva."
      />,
    );
    const dialog = screen.getByRole('dialog', { name: 'Excluir aluno' });
    expect(dialog).toHaveAccessibleDescription('Essa ação é definitiva.');
  });

  it('Esc (evento cancel) chama onClose uma vez', () => {
    const onClose = vi.fn();
    renderUi(<Dialog open onClose={onClose} title="T" />);
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clique no backdrop fecha, clique no conteúdo não', async () => {
    const onClose = vi.fn();
    const { user } = renderUi(
      <Dialog open onClose={onClose} title="T">
        Corpo
      </Dialog>,
    );
    await user.click(screen.getByText('Corpo'));
    expect(onClose).not.toHaveBeenCalled();
    await user.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('o botão de fechar chama onClose e a prop open=false não dispara onClose de novo', async () => {
    const onClose = vi.fn();
    const { user, rerender } = renderUi(<Dialog open onClose={onClose} title="T" />);
    await user.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    rerender(<Dialog open={false} onClose={onClose} title="T" />);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('devolve o foco ao gatilho ao fechar', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    const { rerender } = renderUi(<Dialog open onClose={() => {}} title="T" />);
    rerender(<Dialog open={false} onClose={() => {}} title="T" />);
    expect(trigger).toHaveFocus();
    trigger.remove();
  });

  it('não tem violações de acessibilidade', async () => {
    const { container } = renderUi(
      <Dialog
        open
        onClose={() => {}}
        title="T"
        description="D"
        footer={<button type="button">Ok</button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Dialog (fechamento)', () => {
  it('pedidos repetidos de fechamento na mesma abertura chamam onClose uma vez', () => {
    const onClose = vi.fn();
    renderUi(<Dialog open onClose={onClose} title="T" />);
    const dialog = screen.getByRole('dialog');
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('devolve o foco ao gatilho quando desmonta aberto', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    const { unmount } = renderUi(<Dialog open onClose={() => {}} title="T" />);
    unmount();
    expect(trigger).toHaveFocus();
    trigger.remove();
  });
});

describe('ConfirmDialog', () => {
  it('confirma e cancela', async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    const { user } = renderUi(
      <ConfirmDialog
        open
        onClose={onClose}
        onConfirm={onConfirm}
        title="Excluir?"
        confirmLabel="Excluir"
        tone="danger"
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
