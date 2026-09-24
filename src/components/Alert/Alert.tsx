import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from '@/icons';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  onDismiss?: () => void;
}

const tones: Record<NonNullable<AlertProps['tone']>, { box: string; icon: IconName }> = {
  info: { box: 'border-info/30 bg-info-bg text-info-text', icon: 'info' },
  success: { box: 'border-success/30 bg-success-bg text-success-text', icon: 'check-circle' },
  warning: { box: 'border-warning/40 bg-warning-bg text-warning-text', icon: 'warning' },
  danger: { box: 'border-danger/30 bg-danger-bg text-danger-text', icon: 'x-circle' },
};

export function Alert({
  tone = 'info',
  title,
  onDismiss,
  className,
  children,
  ...rest
}: AlertProps) {
  const urgent = tone === 'danger' || tone === 'warning';
  return (
    <div
      role={urgent ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 rounded-md border p-3 text-body',
        tones[tone].box,
        className,
      )}
      {...rest}
    >
      <Icon name={tones[tone].icon} size={18} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        {title ? <p className="text-body-medium font-semibold">{title}</p> : null}
        <div>{children}</div>
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar aviso"
          className="-m-2 grid h-11 w-11 place-items-center rounded-sm hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text"
        >
          <Icon name="close" size={16} />
        </button>
      ) : null}
    </div>
  );
}
