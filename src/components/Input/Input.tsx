import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/icons';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  /** Só faz efeito com type="password". */
  revealable?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, revealable, type = 'text', className, ...rest },
  ref,
) {
  const [shown, setShown] = useState(false);
  const canReveal = revealable && type === 'password';
  return (
    <div className="relative">
      <input
        ref={ref}
        type={canReveal && shown ? 'text' : type}
        aria-invalid={invalid || undefined}
        className={cn(
          'h-11 w-full min-w-0 rounded-sm border bg-surface px-3 text-body text-ink placeholder:text-faint',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text',
          invalid ? 'border-danger' : 'border-faint',
          'disabled:cursor-not-allowed disabled:bg-surface-2 disabled:opacity-60',
          canReveal && 'pr-12',
          className,
        )}
        {...rest}
      />
      {canReveal ? (
        <button
          type="button"
          aria-label={shown ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={shown}
          onClick={() => setShown((s) => !s)}
          className="absolute right-0 top-0 grid h-11 w-11 place-items-center text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text"
        >
          <Icon name={shown ? 'eye-off' : 'eye'} size={18} />
        </button>
      ) : null}
    </div>
  );
});
