import { forwardRef, useId } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/icons';
import { Input, type InputProps } from './Input';

export interface TextFieldProps extends InputProps {
  label: string;
  hint?: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, required, id, className, 'aria-describedby': externalDescribedBy, ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id ?? auto;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId, externalDescribedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={inputId} className="text-label text-ink">
        {label}
        {required ? <span className="text-accent-text"> *</span> : null}
      </label>
      <Input
        ref={ref}
        id={inputId}
        required={required}
        invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...rest}
      />
      {hint ? (
        <p id={hintId} className="text-caption text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="flex items-center gap-1 text-caption text-danger-text">
          <Icon name="warning" size={12} />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
});
