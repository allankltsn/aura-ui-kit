# Como repetir os testes do Lote 1

Tudo em Git Bash, na raiz do repositório (`E:\allan\aura-ui-kit`), branch `feat/ui-kit`, HEAD `a33dd0c`.

1. Instalar dependências: `pnpm install --frozen-lockfile` (num clone limpo levou 1m29s medido).
2. Rodar os 5 comandos, um por vez (todos saem com código 0):
   - `pnpm typecheck`, `pnpm lint`
   - `pnpm exec vitest run --reporter=verbose`: esperado `Test Files 8 passed (8)` e `Tests 81 passed (81)`.
   - `pnpm build` termina com `built in ...`.
   - `pnpm format:check`: "All matched files use Prettier code style!".
3. Geradores determinísticos: `pnpm icons && pnpm tokens && git status --short -- src scripts` (esperado vazio).
   Hashes: `sha256sum src/icons/icons.generated.ts src/tokens/tokens.css` (valores em `determinismo.txt`).
4. Tailwind: veja `tailwind-saida.txt` (comando na primeira linha; troque `<tmp>` por pasta fora do repo).
5. Contraste: `node docs/evidence/lote-1/scripts/medir-contraste.mjs`. Esperado: `Total de verificações com mínimo: 63; falhas: 0`, exit 0.
6. Teste de sync detecta adulteração: edite um número em `src/tokens/tokens.css`, rode `pnpm exec vitest run scripts/tokens-css.test.ts` (1 falha). Restaurar: `git checkout -- src/tokens/tokens.css` (agora funciona) ou `pnpm tokens`.
7. Reproduzir o teste de CRLF (ACHADO 1): `sed -i 's/$/\r/' src/tokens/tokens.css src/icons/icons.generated.ts`,
   depois `pnpm exec vitest run scripts/tokens-css.test.ts scripts/build-icons.test.ts` (esperado: 4 passam mesmo com CRLF no disco),
   restaurar com `pnpm tokens && pnpm icons` e conferir `git status --short -- src scripts` vazio.
   Clone limpo: `git clone -c core.autocrlf=true . <pasta fora do repo> && cd <pasta> && pnpm install --frozen-lockfile && pnpm test`.
8. Teste de sync dos ícones (ACHADO 3): troque um path em `src/icons/icons.generated.ts`, rode `pnpm exec vitest run scripts/build-icons.test.ts` (1 falha), restaure com `pnpm icons`.
9. Icon e spread (ACHADO 4): `pnpm exec vitest run src/icons/Icon.test.tsx` (7 testes, inclui "rest não sobrescreve props de segurança").
   Tentativas extras: `qa-adversarial-icon-spread.test.tsx.txt` (copiar para `src/__qa__/*.test.tsx`, rodar e apagar a pasta).
10. Acessibilidade: axe automatizado; teste em `qa-axe.test.tsx.txt` (mesmo procedimento) e resultado em `a11y-axe.txt`.
    Não há interface navegável neste lote (showcase é só um `<h1>`).
