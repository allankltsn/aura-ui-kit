import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { useControllableState } from '@/hooks';

export interface SwitchProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'onClick' | 'role' | 'type' | 'children' | 'aria-checked' | 'aria-label'
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, defaultChecked = false, onCheckedChange, label, disabled, className, ...rest },
  ref,
) {
  const [on, setOn] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => setOn(!on)}
      className={cn(
        'relative inline-flex h-11 w-14 shrink-0 items-center justify-center rounded-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      <span
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors',
          on ? 'bg-primary' : 'bg-faint',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-elev-1 ring-1 ring-surface transition-transform motion-reduce:transition-none',
            on ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </span>
    </button>
  );
});
