# Como testar o lote 2

Use `pnpm` (ou `node C:/Users/Allan/AppData/Local/node/corepack/v1/pnpm/9.15.9/bin/pnpm.cjs <cmd>`).

1. `pnpm typecheck && pnpm lint && pnpm test && pnpm build` (esperado: exit 0; 19 arquivos, 139 testes).
2. Reproduzir os defeitos do QA: copie `qa-adversarial.test.tsx.txt` para `src/qa-tmp/qa.test.tsx` e rode `pnpm exec vitest run src/qa-tmp` (esperado hoje: 5 falhas, D1 a D4 e contraste escuro). Apague a pasta depois.
3. `pnpm dev` ainda NAO tem showcase (Lote 4); nao ha rota para ver os componentes.

Teclado a conferir quando houver showcase: Tab/Shift+Tab, Enter/Espaco em Button e Switch, setas em Segmented e Radio, Esc e clique no fundo no Dialog, foco voltando ao botao que abriu, tema escuro (classe/atributo do tema).
