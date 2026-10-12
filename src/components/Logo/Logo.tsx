import { cn } from '@/lib/cn';

export type LogoVariant = 'on-light' | 'on-dark' | 'on-red';

export interface LogoProps {
  /** Tamanho da fonte em px. Escala da marca: 64, 40, 28, 20 (20 é o mínimo legível). */
  size?: number;
  variant?: LogoVariant;
  className?: string;
}

const word: Record<LogoVariant, string> = {
  'on-light': 'text-ink',
  'on-dark': 'text-white',
  'on-red': 'text-on-primary',
};

const hyphen: Record<LogoVariant, string> = {
  'on-light': 'text-primary',
  'on-dark': 'text-primary',
  'on-red': 'text-on-primary',
};

export function Logo({ size = 28, variant = 'on-light', className }: LogoProps) {
  return (
    <span
      role="img"
      aria-label="aura-fit"
      className={cn(
        'inline-flex items-baseline font-bold leading-none tracking-[-0.045em]',
        word[variant],
        className,
      )}
      style={{ fontSize: size }}
    >
      <span aria-hidden="true">aura</span>
      <span aria-hidden="true" data-part="hyphen" className={hyphen[variant]}>
        -
      </span>
      <span aria-hidden="true">fit</span>
    </span>
  );
}
