function rgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

function block(selector, colors) {
  const lines = Object.entries(colors).map(([k, v]) => `  --color-${k}: ${rgb(v)};`);
  return `${selector} {\n${lines.join('\n')}\n}\n`;
}

export function renderTokensCss(tokens) {
  return (
    '/* Gerado por scripts/build-tokens-css.mjs a partir de tokens.json. Não edite. */\n' +
    block(':root', tokens.color.light) +
    '\n' +
    block('.dark', tokens.color.dark)
  );
}
