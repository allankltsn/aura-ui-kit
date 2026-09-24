# Relatório QA adversarial, Lote 1 (Tasks 1 a 3)

Base: branch `feat/ui-kit`, HEAD `5fcaa31`. Tudo abaixo foi executado nesta sessão. O código dos testes
descartáveis está em `qa-adversarial.test.tsx.txt` e a saída bruta em `qa-adversarial-saida.txt`
(12 testes, 12 passaram). Os testes só imprimem o comportamento observado; as asserções duras estão
marcadas em cada cenário.

## Achados

| # | Severidade | Resumo | Onde |
|---|---|---|---|
| 1 | Media | Em checkout no Windows com `core.autocrlf=true` (padrão do Git for Windows), `tokens.css` e `icons.generated.ts` viram CRLF e o teste de sync `src/tokens/tokens.css está em dia` FALHA. Reproduzido neste repo. | `scripts/tokens-css.test.ts:18-21`, ausência de `.gitattributes` |
| 2 | Media | Token `warning` do tema claro (`#e2a400`) sobre `surface` `#ffffff` mede 2,20:1, abaixo dos 3:1 exigidos para ícone/componente. | `src/tokens/tokens.json:22` |
| 3 | Baixa | `icons.generated.ts` não tem teste de sincronia: adulterar um ícone à mão não quebra nenhum teste. | `scripts/` (não existe teste equivalente ao de tokens) |
| 4 | Baixa | `Icon` espalha `{...rest}` por último: `aria-hidden={false}` sem `title` gera ícone sem nome exposto; `title` + `aria-hidden` gera `role="img"` dentro de `aria-hidden="true"`; `role` e `dangerouslySetInnerHTML` podem ser sobrescritos. | `src/icons/Icon.tsx:31` |
| 5 | Baixa | `Icon`, `GoogleIcon`, `AppleIcon` e `Logo` aceitam `size` 0, negativo e NaN sem erro (Logo ignora silenciosamente negativo/NaN e o mínimo da marca, 20, não é imposto). Nome de ícone inexistente forçado por cast renderiza um `<svg>` vazio sem erro. | `Icon.tsx`, `SocialIcon.tsx`, `Logo.tsx` |
| 6 | Info | `Logo` variante `on-dark` usa `text-white` fixo, não um token. Funciona hoje (o painel escuro é `#171717`, 17,93:1), mas não acompanha mudanças de tokens. | `src/components/Logo/Logo.tsx:14` |

## Cenários

### (a) `cn`: PASSOU
Tentei: nulos, objetos, arrays aninhados, duplicadas, tamanho de fonte customizado vs cor.
Asserções duras (5) passaram. Saída real:

- `cn(null, undefined, false, 0, '', 'a')` => `a`
- `cn({a:true,b:false,c:1})` => `a c`
- arrays aninhados => `a b c d e`
- `cn('p-2 p-2 flex flex')` => `p-2 flex`; `cn('p-2','p-4')` => `p-4`
- `text-body text-primary` => mantém os dois; `text-caption text-ink` => mantém os dois
- `text-primary text-body` (ordem inversa) => mantém os dois
- `text-button text-on-primary` => mantém os dois
- `text-body`, `text-heading-lg` => `text-heading-lg` (mesmo grupo, ganha o último); `text-button`, `text-caption` => `text-caption`
- `text-primary`, `text-ink` => `text-ink` (mesmo grupo de cor)
- `text-label text-accent-text text-sm` => `text-accent-text text-sm` (`text-sm` é do grupo tamanho e substitui `text-label`, comportamento esperado do tailwind-merge)
- `cn()` => string vazia

### (b) `Icon`: PASSOU com ACHADO 4 e 5 (Baixa)
- Nome inexistente por cast: não lança; renderiza `<svg ... aria-hidden="true"></svg>` vazio (ACHADO 5).
- `size` 0, -5, 12.5, NaN: aceitos, viram atributos `width`/`height` literais `0`, `-5`, `12.5`, `NaN`; React emite
  warning "Received NaN for the `width` attribute" (ACHADO 5).
- `title=""`: `aria-hidden="true"`, `role` ausente, `aria-label=""` (tratado como decorativo, correto; o `aria-label` vazio é inócuo).
- `title="Buscar"`: `role="img"`, `aria-label="Buscar"`, sem `aria-hidden`.
- `className="shrink-0 text-primary shrink-0"` => `text-primary shrink-0` (deduplicado). `data-foo` e `onClick` repassados (clique disparou 1 vez; asserção dura passou).
- Sobrescrita por props (comportamento documentado, ACHADO 4):
  - `aria-hidden={false}` sem title => `aria-hidden="false"`, ícone sem nome acessível.
  - `title="X"` + `aria-hidden` => `aria-hidden="true"` e `role="img"` juntos (contraditório).
  - `role="button"` sem title => `role="button"` com `aria-hidden="true"`.
  - `dangerouslySetInnerHTML` via props (o tipo `SVGProps` permite; só `children` foi omitido) substitui o conteúdo.
  - `stroke`, `strokeWidth`, `viewBox` sobrescritos livremente (`viewBox` vira `0 0 5 5`).

### (c) 83 ícones: PASSOU
Loop com `Icon` sem e com `title`. Medido: total 83, `viewBox` diferente de `0 0 24 24`: 0, ícones sem filhos: 0,
violações axe sem title: 0, com title: 0. Tempo do loop completo (166 renders + 166 axe): 4817 ms na primeira
execução e 6340 ms na segunda (variação de máquina); só o axe do loop sem title: 2420 ms.

### (d) `Logo`: PASSOU com ACHADO 5 e 6
- `size` 0 => `font-size: 0px`; 20 => `20px`; 64 => `64px`; 27.5 => `27.5px`; -10 e NaN => atributo `style` ausente (React descarta valor inválido, sem erro).
- Três variantes: em cada uma, 1 elemento com nome acessível `aura-fit` (`getAllByRole('img',{name:'aura-fit'})` = 1), 1 elemento com
  `aria-label`, 3 filhos `aria-hidden` (aura, hífen, fit), axe 0.
- Hífen: `on-light` => `text-primary`; `on-dark` => `text-primary`; `on-red` => `text-on-primary`. Raiz: `text-ink`, `text-white`, `text-on-primary`.
- `className="text-primary"` sobre `on-light` substitui `text-ink` na raiz (cn resolve o conflito, esperado).

### (e) `GoogleIcon` / `AppleIcon`: PASSOU com ACHADO 5
`aria-hidden="true"` em todos os casos; `viewBox` `0 0 18 18`; tamanho padrão 18; `size` 24 => 24; `size` 0 e -3 aceitos como `0`/`-3`. axe 0 em ambos.

### (f) Geradores e sync: PASSOU (determinismo) com ACHADO 1 e 3
Provas em `determinismo.txt`, `adulteracao-sync-tokens.txt`, `adulteracao-icons.txt`, `crlf-clone.txt`.
- `pnpm icons` e `pnpm tokens` duas vezes: sha256 idêntico antes, após a 1a e após a 2a execução
  (`icons.generated.ts` = `2bb5932e...ced8d4`, `tokens.css` = `af99c8f6...bac95e8`), `git diff --stat -- src scripts` vazio.
- Adulteração de `tokens.css` (`--color-primary: 177 17 27` para `177 17 28`): o teste de sync FALHOU com diff mostrando exatamente a linha (saída completa em `adulteracao-sync-tokens.txt`).
- Restaurar com `git checkout -- src/tokens/tokens.css` NÃO fez o teste voltar a passar: o Git regravou o arquivo com CRLF
  (`core.autocrlf=true`) e o teste falhou de novo com todas as linhas diferentes. Isso é o ACHADO 1. Só depois de `pnpm tokens` (que grava LF)
  o teste voltou a passar (3 de 3). Confirmado também com um clone limpo com `core.autocrlf=true` (`crlf-clone.txt`):
  arquivos `w/crlf`, e `tokens.css do clone === gerado ? false`.
  Correção sugerida (fora do meu escopo): `.gitattributes` com `* text=auto eol=lf` ou `*.css text eol=lf`, ou o teste normalizar `\r\n`.
- Adulteração de `icons.generated.ts` (path de `arrow-left` trocado): a suíte inteira passou (8 arquivos, 84 testes, incluindo os meus), ou seja, nada detecta (ACHADO 3). Restaurado com `pnpm icons`.

### (g) Tokens: PASSOU
Asserções duras: light e dark têm as mesmas 27 chaves na mesma ordem; nenhum valor fora de `#rrggbb`; `tokens.css` tem 54 declarações `--color-` (27 x 2).
Contraste: ver `contraste.txt`. Todos os 24 pares do teste passam nos dois temas. Nos pares extras, o único que falha é `warning`/`surface` no claro
(2,20 contra mínimo 3), ACHADO 2. Pares de texto (`muted`, `faint`, `ink`, `*-text`) passam com 4,5 ou mais nos dois temas.

### (h) Preset Tailwind: PASSOU
Gerado com `pnpm exec tailwindcss -i showcase/index.css -o <tmp>/out.css --content <tmp>/t.html` (`tailwind-saida.txt`). Trechos reais:
`.bg-primary` => `background-color: rgb(var(--color-primary) / var(--tw-bg-opacity, 1))`; `.bg-primary/50` => `rgb(var(--color-primary) / 0.5)`;
`.text-on-primary`, `.text-muted` idem; `.rounded-lg` => `12px`; `.shadow-elev-2` => `0 4px 14px rgb(31 31 31 / 0.09)`;
`.text-heading-lg` => `26px / 34px / 700`; `.dark\:bg-surface:is(.dark *)` => `rgb(var(--color-surface) / ...)`. `:root` e `.dark` presentes com os canais RGB (`--color-primary: 177 17 27` e `208 32 43`).

### (i) Higiene do Git: PASSOU
`git ls-files | grep -Ei "mobile|\.claude|\.serena|\.codex|stackdump"` => vazio (saída e tamanhos de todos os arquivos em `versionados.txt`).
Maior arquivo versionado fora de assets/docs/lockfile: `src/icons/icons.generated.ts`, 8009 bytes.

## Regressão
Suíte completa antes dos testes descartáveis: 7 arquivos, 72 testes passaram, 0 falharam (`resultado-testes.txt`, `resultado-testes.json`).
Typecheck, lint, build e format:check saíram com código 0.

---

# Reverificação pós-correção (HEAD `a33dd0c`)

O texto acima é o relatório original (HEAD `5fcaa31`) e fica como histórico. Tudo abaixo foi executado
na reverificação, no HEAD `a33dd0c`. Provas: `reverificacao.txt`, `crlf-clone.txt`, `adulteracao-*.txt`,
`contraste.txt`, `determinismo.txt`, `qa-adversarial-icon-spread-saida.txt`.

Suíte completa: typecheck, lint, build, format:check saem com 0; vitest 8 arquivos, 81 testes, 81 passaram, 0 falharam (`resultado-testes.*`).

| # | Achado | Situação | Prova medida agora |
|---|---|---|---|
| 1 | autocrlf / sync de tokens | CORRIGIDO | Com `tokens.css` e `icons.generated.ts` em CRLF no disco (`w/crlf`), `tokens-css.test.ts` + `build-icons.test.ts`: 4 de 4 passam. Restaurado com `pnpm tokens`/`pnpm icons`, `git status -- src scripts` vazio. `git ls-files --eol`: `i/lf w/lf attr/text eol=lf` nos dois. Clone limpo com `core.autocrlf=true` (HEAD a33dd0c): arquivos `w/lf`, `pnpm install --frozen-lockfile` 1m29s, `pnpm test` 8 arquivos, 81 testes passaram (`crlf-clone.txt`). `git checkout -- src/tokens/tokens.css` agora volta a passar (`adulteracao-sync-tokens.txt`). |
| 2 | warning claro 2,20:1 | CORRIGIDO | Antes (histórico) `#e2a400`/`#ffffff` = 2,20. Agora `#b7791f`/`#ffffff` = 3,64 (mín. 3); escuro `#f1b93a`/`#1f1f1f` = 9,22. Alert/Toast ainda não existem, então só o token é verificado. Também passam os novos pares `on-primary/primary-press` (11,03 claro, 7,08 escuro) e `ink/primary-soft` (13,99 e 13,48). Script: 63 verificações, 0 falhas. |
| 3 | sem sync de ícones | CORRIGIDO | Novo `scripts/build-icons.test.ts`. Path de `arrow-left` adulterado: teste FALHA (1 failed); `pnpm icons` restaura e PASSA (`adulteracao-icons.txt`). |
| 4 | spread do Icon | CORRIGIDO | `{...rest}` agora vem primeiro; 7 testes de `Icon.test.tsx` passam. Extras meus: `aria-hidden={false} role="button"` sem title => `aria-hidden="true"`, sem `role`; `title="X" aria-hidden role="button"` => sem `aria-hidden`, `role="img"`; `dangerouslySetInnerHTML` malicioso via cast: conteúdo do ícone preservado, sem `script` nem `onerror`; `viewBox`/`stroke`/`focusable` não sobrescrevem (`0 0 24 24`, `currentColor`, `false`). Detalhe novo (Info): `children` forçado por cast agora LANÇA erro do React ("Can only set one of `children` or `props.dangerouslySetInnerHTML`") em vez de ser ignorado; o tipo já omite `children`, então só afeta quem usa cast. |
| 5 | size 0/negativo/NaN, Logo mínimo 20 | DEFERIDO (não alterado, comportamento inalterado) | Não retestado como defeito; segue no backlog. |
| 6 | Logo `on-dark` com `text-white` | ACEITO | Sem mudança; painel escuro segue a 17,93:1 (`contraste.txt`). |

Cenários novos sobre o que foi mexido:
- `.gitattributes` não corrompe PNG: `git ls-files --eol` dos PNGs `01-login.png` e `03-recuperar-senha.png` => `i/-text w/-text attr/text=auto` (binário detectado, sem conversão) e `git status` de `assets/AuraFit-auth-design-kit` vazio (`determinismo.txt`).
- `tokens.css` idempotente: sha256 igual antes, após a 1ª e após a 2ª execução de `pnpm tokens` (`ecd2a814...4132`); `icons.generated.ts` idem (`2bb5932e...ced8d4`, igual ao lote anterior).
- axe: 0 violações em Icon (83, com e sem title), Logo (3 variantes), GoogleIcon, AppleIcon (`a11y-axe.txt`).

Nenhum achado novo Crítico, Alto ou Médio. Único item novo: Info sobre `children` via cast lançar erro.
