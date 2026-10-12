export function extractInner(svg) {
  const match = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!match) throw new Error('arquivo sem <svg>');
  return match[1].trim();
}

export function buildIconsModule(icons) {
  const entries = Object.keys(icons)
    .sort()
    .map((name) => `  '${name}': ${JSON.stringify(icons[name])},`);
  return (
    '// Gerado por scripts/build-icons.mjs a partir de assets/aurafit-icons/svg. Não edite.\n' +
    `export const iconPaths = {\n${entries.join('\n')}\n} as const;\n\n` +
    'export type IconName = keyof typeof iconPaths;\n'
  );
}
