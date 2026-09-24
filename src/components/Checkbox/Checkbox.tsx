import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  description?: string;
  invalid?: boolean;
}

function makeChoice(type: 'checkbox' | 'radio', displayName: string) {
  const Choice = forwardRef<HTMLInputElement, ChoiceProps>(function Choice(
    { label, description, invalid, id, className, ...rest },
    ref,
  ) {
    const auto = useId();
    const inputId = id ?? auto;
    const descId = description ? `${inputId}-desc` : undefined;
    return (
      <label
        htmlFor={inputId}
        className={cn('flex min-h-11 cursor-pointer items-start gap-3 py-2', className)}
      >
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={invalid || undefined}
          aria-describedby={descId}
          className={cn(
            'mt-0.5 h-5 w-5 shrink-0 accent-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
            invalid && 'outline outline-2 outline-danger',
          )}
          {...rest}
        />
        <span className="min-w-0 text-body text-ink">
          {label}
          {description ? (
            <span id={descId} className="block text-caption text-muted">
              {description}
            </span>
          ) : null}
        </span>
      </label>
    );
  });
  Choice.displayName = displayName;
  return Choice;
}

export const Checkbox = makeChoice('checkbox', 'Checkbox');
export const Radio = makeChoice('radio', 'Radio');
export type CheckboxProps = ChoiceProps;
export type RadioProps = ChoiceProps;
