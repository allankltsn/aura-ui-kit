# Lote 1 (Tasks 1 a 3): resumo do QA

HEAD verificado: `5fcaa31`, branch `feat/ui-kit`. Todos os números abaixo foram medidos por comandos executados nesta sessão.

## Verificações

| Verificação | Comando | Resultado medido | Prova |
|---|---|---|---|
| Tipos | `pnpm typecheck` | saída 0 | `resultado-testes.txt` |
| Lint | `pnpm lint` | saída 0 | `resultado-testes.txt` |
| Testes | `pnpm exec vitest run --reporter=verbose` | 7 arquivos, 72 testes: 72 passaram, 0 falharam, 0 ignorados | `resultado-testes.txt`, `resultado-testes.json` (numTotalTests 72, numPassedTests 72, numFailedTests 0) |
| Build | `pnpm build` | saída 0 | `resultado-testes.txt` |
| Formatação | `pnpm format:check` | saída 0 | `resultado-testes.txt` |
| Contraste WCAG | `node docs/evidence/lote-1/scripts/medir-contraste.mjs` | 24 pares do teste x 2 temas passam; 56 de 57 verificações passam; 1 falha (ACHADO 2) | `contraste.txt` |
| Acessibilidade axe | vitest-axe | 0 violações em Icon (83 ícones, com e sem title), Logo (3 variantes), GoogleIcon, AppleIcon | `a11y-axe.txt` |
| Geradores determinísticos | `pnpm icons && pnpm tokens` x2 | sha256 iguais e `git diff` vazio | `determinismo.txt` |
| Teste de sync detecta adulteração | editar `tokens.css` | falha como esperado; ver ACHADO 1 sobre restaurar | `adulteracao-sync-tokens.txt` |
| Preset Tailwind | `tailwindcss -i showcase/index.css ...` | classes existem com `rgb(var(--color-...) / ...)` | `tailwind-saida.txt` |
| Higiene do Git | `git ls-files \| grep ...` | vazio (nada de mobile, .claude, .serena, .codex, stackdump) | `versionados.txt` |
| Cenários adversariais | 12 testes descartáveis | 12 passaram; ver achados | `qa-relatorio.md`, `qa-adversarial-saida.txt` |

Não há UI navegável neste lote (o showcase é só um `<h1>`); não há capturas de tela.

## Achados

Detalhes e reprodução em `qa-relatorio.md`.

- Media: checkout no Windows com `core.autocrlf=true` regrava `tokens.css` e `icons.generated.ts` em CRLF e o teste de sync falha. Reproduzido aqui: `git checkout -- src/tokens/tokens.css` deixou o teste falhando. Prova em `adulteracao-sync-tokens.txt` e `crlf-clone.txt`. Ref: `scripts/tokens-css.test.ts:18-21`, sem `.gitattributes`.
- Media: `warning` claro `#e2a400` sobre `#ffffff` = 2,20:1, abaixo de 3:1. Ref: `src/tokens/tokens.json:22`.
- Baixa: sem teste de sincronia para `src/icons/icons.generated.ts` (adulterar não quebra nada). Prova em `adulteracao-icons.txt`.
- Baixa: `{...rest}` no fim de `Icon` permite sobrescrever `aria-hidden`, `role` e `dangerouslySetInnerHTML`. Ref: `src/icons/Icon.tsx:31`.
- Baixa: `size` 0, negativo e NaN aceitos em `Icon`, `GoogleIcon`, `AppleIcon` e `Logo` (mínimo 20 do Logo não é imposto); nome de ícone inexistente por cast renderiza svg vazio. Ref: `Icon.tsx`, `SocialIcon.tsx`, `Logo.tsx`.
- Info: `Logo` `on-dark` usa `text-white` fixo em vez de token. Ref: `src/components/Logo/Logo.tsx:14`.

Nenhum achado Critico ou Alto.

## Pendências do lote para o usuário decidir

1. Cor primária no tema escuro mudou de `#b1111b` para `#d0202b` (hover `#d8323c`, press `#b1111b`) para atingir 3:1 de componente sobre a superfície escura `#1f1f1f`. Razão medida: antes 2,33:1 (falha), depois 3,08:1 (passa). Em `contraste.txt`, seção "Dark primary: antes x depois". Decida se aceita esse vermelho mais claro no tema escuro.
2. O implementador da Task 2 rodou o Prettier uma vez em arquivos ignorados pelo Git do usuário (`.claude/agents/*.md` e `.serena/project*.yml`). Foi só espaço em branco e Markdown, e não dá para reverter via Git. Por favor confira esses arquivos. (Informação repassada a mim; eu não toquei neles.)
3. O `README.md` da raiz aparece como deletado no working tree desde antes desta sessão e não foi tocado por mim (no HEAD ele tem 13 bytes).

## Arquivos deixados no working tree sem commitar

`src/__qa__/` foi removido depois de copiar o código para `qa-adversarial.test.tsx.txt`. Nenhuma alteração pendente em `src/` ou `scripts/`.
