import type { Config } from 'tailwindcss';
import preset from './src/tokens/preset';

export default {
  presets: [preset],
  content: ['./index.html', './src/**/*.{ts,tsx}', './showcase/**/*.{ts,tsx}'],
} satisfies Config;
