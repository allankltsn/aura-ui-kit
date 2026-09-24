# Como repetir os testes do Lote 1

Tudo em Git Bash, na raiz do repositório (`E:\allan\aura-ui-kit`), branch `feat/ui-kit`.

1. Instalar dependências: `pnpm install`. (Não medi este passo; as dependências já estavam instaladas nesta sessão.)
2. Rodar os 5 comandos, um por vez. Resultado medido em cada um: código de saída 0.
   - `pnpm typecheck` sem erros.
   - `pnpm lint` sem avisos.
   - `pnpm exec vitest run --reporter=verbose` lista cada teste. Esperado: `Test Files 7 passed (7)` e `Tests 72 passed (72)`.
   - `pnpm build` termina com `built in ...` (gera `dist/`, ignorado pelo Git).
   - `pnpm format:check` termina com "All matched files use Prettier code style!".
3. Geradores determinísticos: `pnpm icons && pnpm tokens && git status --short -- src scripts`.
   Esperado: `83 ícones gerados`, `tokens.css atualizado` e nenhuma linha ` M` para `src/` ou `scripts/`.
   Para conferir por hash: `sha256sum src/icons/icons.generated.ts src/tokens/tokens.css`. Medido:
   `2bb5932ee407d8c732ca410649d49e04993921bdca5cc9ac4cbe05b64eced8d4` e `af99c8f6be0b22e19fdedea0fd7e9f4b3d7f142b62489ed8dc672cb07bac95e8`.
4. Ver o Tailwind gerando classes (troque `<tmp>` por uma pasta fora do repositório):
   ```
   echo '<div class="bg-primary text-on-primary text-muted rounded-lg shadow-elev-2 text-heading-lg dark:bg-surface"></div>' > <tmp>/t.html
   pnpm exec tailwindcss -i showcase/index.css -o <tmp>/out.css --content <tmp>/t.html
   grep -F -A3 '.bg-primary {' <tmp>/out.css
   ```
   Esperado: `background-color: rgb(var(--color-primary) / var(--tw-bg-opacity, 1));`, `.rounded-lg` com `12px`, `.text-heading-lg` com `26px`.
5. Conferir os pares de contraste: `node docs/evidence/lote-1/scripts/medir-contraste.mjs`.
   Esperado: tabelas em Markdown; termina com `Total de verificações com mínimo: 57; falhas: 1` e código de saída 1.
   A única falha é o ACHADO 2 (`warning`/`surface` no tema claro = 2,20, mínimo 3). Todo o resto passa.
6. Repetir a prova de adulteração do teste de sync: `pnpm tokens`, edite um número em `src/tokens/tokens.css`, rode
   `pnpm exec vitest run scripts/tokens-css.test.ts` (esperado: 1 falha). Para restaurar, rode `pnpm tokens` (NÃO use `git checkout`, veja o ACHADO 1: no Windows ele regrava o arquivo com CRLF e o teste continua falhando).
7. Acessibilidade: não há interface navegável neste lote (o showcase é só um `<h1>`). A prova é o axe automatizado em `a11y-axe.txt`.
