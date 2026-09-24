import { useId } from 'react';
import { cn } from '@/lib/cn';
import { useControllableState } from '@/hooks';

export interface SegmentedProps<T extends string> {
  options: Array<{ value: T; label: string }>;
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  'aria-label': string;
  className?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  defaultValue,
  onValueChange,
  className,
  'aria-label': ariaLabel,
}: SegmentedProps<T>) {
  const name = useId();
  const [current, setCurrent] = useControllableState<T>({
    value,
    defaultValue: (defaultValue ?? options[0]?.value) as T,
    onChange: onValueChange,
  });

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('flex gap-1 rounded-md bg-surface-2 p-1', className)}
    >
      {options.map((opt) => (
        <label key={opt.value} className="relative min-w-0 flex-1">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={current === opt.value}
            onChange={() => setCurrent(opt.value)}
            className="peer sr-only"
          />
          <span
            className={cn(
              'flex min-h-11 cursor-pointer items-center justify-center truncate rounded-sm px-3 text-button text-muted transition-colors',
              'peer-checked:bg-primary peer-checked:text-on-primary',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-accent-text peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-2',
            )}
          >
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
}
