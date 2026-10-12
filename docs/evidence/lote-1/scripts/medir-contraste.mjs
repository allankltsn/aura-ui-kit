// Mede razões de contraste WCAG 2.x. Reimplementa a fórmula de src/tokens/contrast.ts (mesma matemática)
// e LÊ os pares direto de src/tokens/contrast.test.ts, sem transcrever à mão.
import { readFileSync } from 'node:fs';
const root = new URL('../../../../', import.meta.url);
const tokens = JSON.parse(readFileSync(new URL('src/tokens/tokens.json', root), 'utf8'));
const testSrc = readFileSync(new URL('src/tokens/contrast.test.ts', root), 'utf8');

const ch = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = (hex) => { const n = parseInt(hex.replace('#', ''), 16); return 0.2126 * ch((n >> 16) & 255) + 0.7152 * ch((n >> 8) & 255) + 0.0722 * ch(n & 255); };
const ratio = (a, b) => { const [h, l] = [lum(a), lum(b)].sort((x, y) => y - x); return (h + 0.05) / (l + 0.05); };

const pairs = [...testSrc.matchAll(/\['([a-z0-9-]+)', '([a-z0-9-]+)', ([0-9.]+)\]/g)].map((m) => [m[1], m[2], Number(m[3])]);
const extra = [
  ['muted', 'surface', 4.5], ['on-primary', 'primary-press', 4.5], ['ink', 'primary-soft', 4.5],
  ['warning', 'surface', 3], ['line-strong', 'surface', null],
];
let fails = 0, total = 0, tot = { test: 0, extra: 0 };
function table(title, list, origin) {
  console.log(`\n### ${title}\n`);
  console.log('| Tema | Par (fg / bg) | fg | bg | Razão | Mínimo | Resultado |');
  console.log('|---|---|---|---|---|---|---|');
  for (const theme of ['light', 'dark']) for (const [fg, bg, min] of list) {
    const c = tokens.color[theme]; const r = ratio(c[fg], c[bg]);
    const res = min === null ? 'informativo' : r >= min ? 'PASSA' : (fails++, 'FALHA (ACHADO)');
    if (min !== null) total++; tot[origin]++;
    console.log(`| ${theme} | ${fg} / ${bg} | ${c[fg]} | ${c[bg]} | ${r.toFixed(2)} | ${min ?? '-'} | ${res} |`);
  }
}
console.log(`Pares lidos de contrast.test.ts: ${pairs.length}`);
table('Pares do teste src/tokens/contrast.test.ts', pairs, 'test');
table('Pares extras (próximos lotes)', extra, 'extra');
console.log('\n### Texto branco sobre painel escuro\n');
console.log('| Par | fg | bg | Razão | Mínimo | Resultado |\n|---|---|---|---|---|---|');
const w = ratio('#ffffff', '#171717'); console.log(`| branco / neutral-900 | #ffffff | #171717 | ${w.toFixed(2)} | 4.5 | ${w >= 4.5 ? 'PASSA' : (fails++, 'FALHA (ACHADO)')} |`); total++;
console.log('\n### Dark primary: antes x depois (item de pendência)\n');
console.log('| Par | fg | bg | Razão | Mínimo | Resultado |\n|---|---|---|---|---|---|');
for (const [n, p] of [['antes (#b1111b)', '#b1111b'], ['depois (#d0202b, tokens.json)', tokens.color.dark.primary]]) {
  const r = ratio(p, tokens.color.dark.surface); console.log(`| dark primary ${n} / surface ${tokens.color.dark.surface} | ${p} | ${tokens.color.dark.surface} | ${r.toFixed(2)} | 3 | ${r >= 3 ? 'PASSA' : 'FALHA'} |`);
}
console.log(`\nTotal de verificações com mínimo: ${total}; falhas: ${fails}`);
process.exitCode = fails ? 1 : 0;
