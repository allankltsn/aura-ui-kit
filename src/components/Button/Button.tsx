import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from '@/icons';
import { Spinner } from '../Spinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: IconName;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-press',
  outline: 'border border-faint bg-surface text-ink hover:bg-surface-2 active:bg-line',
  ghost: 'text-ink hover:bg-surface-2 active:bg-line',
  danger: 'bg-danger text-on-danger hover:opacity-90 active:opacity-80',
} as const;

const sizes = {
  sm: 'min-h-11 min-w-11 px-3',
  md: 'min-h-11 min-w-11 px-4',
  lg: 'min-h-12 min-w-11 px-6',
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    fullWidth,
    className,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-sm text-button transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span aria-hidden="true" className="inline-flex">
          <Spinner size={16} />
        </span>
      ) : leftIcon ? (
        <Icon name={leftIcon} size={16} />
      ) : null}
      {children}
    </button>
  );
});
