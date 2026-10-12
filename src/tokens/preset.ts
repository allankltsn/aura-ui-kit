import type { Config } from 'tailwindcss';
import tokens from './tokens.json';

const colors = Object.fromEntries(
  Object.keys(tokens.color.light).map((name) => [
    name,
    `rgb(var(--color-${name}) / <alpha-value>)`,
  ]),
);

type FontSize = [string, { lineHeight: string; fontWeight: string }];

const fontSize: Record<string, FontSize> = Object.fromEntries(
  Object.entries(tokens.typography).map(([name, [size, line, weight]]) => [
    name,
    [`${size}px`, { lineHeight: `${line}px`, fontWeight: String(weight) }],
  ]),
);

const preset = {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      colors,
      fontSize,
      borderRadius: tokens.radius,
      boxShadow: tokens.shadow,
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
} satisfies Config;

export default preset;
