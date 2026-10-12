/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events -- clique no backdrop; o teclado fecha via Esc (evento cancel) */
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Icon } from '@/icons';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
}

export function Dialog({ open, onClose, title, description, footer, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();
  const closeRequested = useRef(false);

  const requestClose = () => {
    if (closeRequested.current) return;
    closeRequested.current = true;
    // Só dedupe eventos do mesmo tick (Esc dispara cancel e keydown); pedidos posteriores passam.
    setTimeout(() => {
      closeRequested.current = false;
    }, 0);
    onClose();
  };

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      closeRequested.current = false;
      trigger.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
      trigger.current?.focus();
      trigger.current = null;
    }
  }, [open]);

  // Ao desmontar aberto, o foco volta ao gatilho.
  useEffect(
    () => () => {
      trigger.current?.focus();
    },
    [],
  );

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      // Clique no backdrop: o teclado já fecha via Esc (evento cancel).
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-line bg-surface p-0 text-ink shadow-elev-3 backdrop:bg-black/50"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-heading-sm">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Fechar"
            onClick={requestClose}
            className="-m-2 grid h-11 w-11 shrink-0 place-items-center rounded-sm text-muted hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text"
          >
            <Icon name="close" size={18} />
          </button>
        </div>
        {description ? (
          <p id={descId} className="mt-2 text-body text-muted">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-4">{children}</div> : null}
        {footer ? <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div> : null}
      </div>
    </dialog>
  );
}
