import { readFileSync, writeFileSync } from 'node:fs';
import { renderTokensCss } from './tokens-css.mjs';

const tokens = JSON.parse(
  readFileSync(new URL('../src/tokens/tokens.json', import.meta.url), 'utf8'),
);
writeFileSync(new URL('../src/tokens/tokens.css', import.meta.url), renderTokensCss(tokens));
console.log('tokens.css atualizado');
