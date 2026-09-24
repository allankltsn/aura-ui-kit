import type { SVGProps } from 'react';
import { cn } from '@/lib/cn';
import { iconPaths, type IconName } from './icons.generated';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'name'> {
  name: IconName;
  size?: number;
  /** Quando informado, o ícone vira uma imagem acessível; sem ele fica oculto para leitores de tela. */
  title?: string;
}

export function Icon({ name, size = 20, title, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      className={cn('shrink-0', className)}
      // O conteúdo vem de assets/aurafit-icons/svg, gerado em build (confiável, sem entrada do usuário).
      dangerouslySetInnerHTML={{ __html: iconPaths[name] }}
      {...rest}
    />
  );
}
