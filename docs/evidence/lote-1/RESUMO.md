# Lote 1 (Tasks 1 a 3): resumo do QA, reverificação pós-correção

HEAD verificado: `a33dd0c` (`git rev-parse --short HEAD`), branch `feat/ui-kit`. Todos os números foram medidos nesta execução.
Relatório anterior (HEAD `5fcaa31`) preservado como histórico em `qa-relatorio.md`.

## Verificações

| Verificação | Comando | Resultado medido | Prova |
|---|---|---|---|
| Tipos | `pnpm typecheck` | saída 0 | `resultado-testes.txt` |
| Lint | `pnpm lint` | saída 0 | `resultado-testes.txt` |
| Testes | `pnpm exec vitest run --reporter=verbose` | 8 arquivos, 81 testes: 81 passaram, 0 falharam, 0 ignorados | `resultado-testes.txt`, `.json` |
| Build | `pnpm build` | saída 0 | `resultado-testes.txt` |
| Formatação | `pnpm format:check` | saída 0 | `resultado-testes.txt` |
| Contraste WCAG | `node docs/evidence/lote-1/scripts/medir-contraste.mjs` | 27 pares do teste x 2 temas + extras: 63 verificações, 0 falhas | `contraste.txt` |
| Acessibilidade axe | vitest-axe (teste descartável) | 0 violações: Icon 83 (com e sem title), Logo 3 variantes, GoogleIcon, AppleIcon | `a11y-axe.txt` |
| Geradores idempotentes | `pnpm tokens`/`pnpm icons` x2 | sha256 iguais, `git status -- src scripts` vazio | `determinismo.txt` |
| CRLF | converter para CRLF e rodar testes de sync | 4 de 4 passam; restaurado sem diff | `reverificacao.txt` |
| Clone limpo `autocrlf=true` | clone + `pnpm install --frozen-lockfile` + `pnpm test` | arquivos `w/lf`; 8 arquivos, 81 testes passaram | `crlf-clone.txt` |
| Sync de tokens detecta adulteração | editar `tokens.css` | falha; `git checkout` restaura e passa | `adulteracao-sync-tokens.txt` |
| Sync de ícones detecta adulteração | editar `icons.generated.ts` | falha; `pnpm icons` restaura e passa | `adulteracao-icons.txt` |
| Spread do Icon | 5 tentativas adversariais | nenhuma sobrescreve `aria-hidden`, `role`, HTML, `viewBox` | `qa-adversarial-icon-spread-saida.txt` |
| `.gitattributes` vs PNG | `git ls-files --eol` | PNG `i/-text w/-text`, sem modificação | `determinismo.txt` |
| Preset Tailwind | `tailwindcss -i showcase/index.css ...` | classes com `rgb(var(--color-...) / ...)` | `tailwind-saida.txt` |
| Higiene do Git | `git ls-files \| grep ...` | vazio; `src/__qa__` não existe | `versionados.txt` |

Não há UI navegável (showcase é só um `<h1>`); sem capturas de tela.

## Achados

Corrigidos (com prova, ver `qa-relatorio.md`, seção "Reverificação pós-correção"):
- Media: CRLF com `core.autocrlf=true` quebrava o teste de sync (agora `.gitattributes` + teste normaliza CRLF).
- Media: `warning` claro 2,20:1 (agora `#b7791f` = 3,64:1; escuro 9,22:1).
- Baixa: sem teste de sync dos ícones (agora `scripts/build-icons.test.ts`).
- Baixa: `{...rest}` sobrescrevia props de acessibilidade/HTML no `Icon` (agora vem primeiro).

Deferidos: `size` 0/negativo/NaN e mínimo 20 do Logo não impostos; nome de ícone inexistente por cast renderiza svg vazio.
Aceito: `Logo` `on-dark` com `text-white` fixo (17,93:1).
Novo, Info: `children` forçado por cast em `Icon` agora lança erro do React. Nenhum achado aberto Critico, Alto ou Medio.

## Pendências para o usuário decidir

1. Dark primary `#b1111b` para `#d0202b` (hover `#d8323c`, press `#b1111b`). Razão sobre `#1f1f1f`: antes 2,33:1 (falha), depois 3,08:1 (passa), remedido em `contraste.txt`. Aceita o vermelho mais claro no escuro?
2. O Prettier rodou uma vez em `.claude/agents/*.md` e `.serena/project*.yml` (gitignorados; só whitespace/Markdown; não reversível via Git). Por favor confira.
3. `README.md` da raiz está deletado no working tree desde antes da sessão; não foi tocado.
4. `warning` claro mudou de `#e2a400` para `#b7791f` por causa do contraste (2,20 para 3,64). Aprove a cor.
5. `src/__qa__`: não existe (criado e removido nos testes descartáveis; os códigos estão em `*.test.tsx.txt` nesta pasta). Nada a decidir; confirme se quer manter esses `.txt` como evidência.
