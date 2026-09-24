# Aura Fit UI Kit — Spec

Data: 2026-09-24 · Status: rascunho para revisão

## 1. Objetivo

UI Kit web do Aura Fit, fiel à marca. Na `main` ele roda como site showcase. Numa branch separada ele é publicado como pacote npm para o `apps/web` do personal.

**Fontes de verdade:** os mockups (`assets/mockups`), o design kit (`assets/AuraFit-auth-design-kit`, `assets/aurafit-icons`, `assets/aurafit-mockup`) e a stack em `docs/README.md`. As práticas de código e design vêm dos agentes `frontend-web` e `ui-designer`.

**A pasta `mobile/` não é base do desenvolvimento.** Ela é o registro de como o projeto estava antes, e o código dela não segue a stack. Mesmo assim, o que for tecnicamente correto pode ser reaproveitado, sempre por escolha e revisão, nunca por cópia em bloco:
- **Reaproveitar:** tudo de marca e visual (wordmarks, ícones de marca, cores, paleta, aparência dos componentes e das telas, `paths.ts` dos ícones), porque o visual está aprovado. Também servem lógica pura sem dependência de React Native (por exemplo a matemática do LineChart e o `cn.ts`) e as telas como referência de UX.
- **Reescrever:** qualquer código que dependa de React Native, NativeWind, Expo Router ou `react-native-svg`. O markup vira HTML semântico e o estilo vira Tailwind 3.4.
- **Descartar:** `mockData`, auth, guards, `secureStorage`, configuração de build, `package.json` e o que o relatório `docs/RELATORIO-ANALISE-MOBILE.md` apontou como defeito (contraste, alvos de toque, larguras fixas e valores hardcoded).

Onde o `mobile/` e o design kit em `assets/` divergirem, vale o que estiver aprovado visualmente nos mockups.

## 2. Escopo

**Dentro:**
- Componentes React 18 em HTML semântico, estilizados só com Tailwind 3.4.
- Tokens de marca, partindo de `assets/AuraFit-auth-design-kit/tokens` e conferidos contra `mobile/` (cores, tipografia Inter, raios, sombras, espaçamento em grade de 8px), expostos como preset Tailwind e variáveis CSS.
- Ícones de `assets/aurafit-icons` e wordmarks de `brand/`.
- Site showcase: uma página por componente e uma por tela dos mockups.
- Tema claro e escuro.

**Fora:**
- React Native, Expo e NativeWind. O kit é só web.
- Auth, guards de rota, RBAC, CSP/HSTS, camada de dados (Orval, TanStack Query, MSW), react-hook-form e Zod. O kit é só apresentação. Isso pertence ao app consumidor, e não faz sentido dentro de uma biblioteca de componentes.
- Monorepo e pacote de tokens separado.

## 3. Stack

Vite 5, React 18, TypeScript 5.6 em modo `strict`, Tailwind 3.4 (PostCSS, Autoprefixer), Vitest 2 com jsdom, Testing Library (react, jest-dom, user-event), Inter self-hosted (`@fontsource`), pnpm 9. `react-router-dom 6` apenas no showcase, com as rotas numa única configuração e páginas em `React.lazy`.

Sem CSS-in-JS. `clsx` e `tailwind-merge@^2` para compor classes. Componentes sem UI de terceiros: modal com `<dialog>`, tabelas com `<table>`, gráfico em SVG próprio.

## 4. Estrutura (pacote único)

```
src/
  tokens/        preset Tailwind, CSS vars, tema claro/escuro
  icons/         Icon + mapa de paths gerado dos SVGs de assets/aurafit-icons
  components/    um diretório por componente (tsx, teste, tipos)
  hooks/         lógica reutilizável (ex.: foco, dismiss por Esc)
  layouts/       AuthLayout, DashboardShell
  index.ts       exports nomeados (tree-shaking)
showcase/        app Vite: router, páginas de componentes e de telas
```

**Convenções (frontend-web):**
- Componentes funcionais com hooks. Os do kit são apresentacionais: recebem props e callbacks e não guardam dados de servidor. Estado de UI (aberto/fechado, aba ativa) fica local, com opção controlada e não controlada.
- Lógica reutilizável vai para hooks customizados.
- Props estendem os atributos nativos do elemento, `className` é repassada, e `forwardRef` é usado em inputs e botões.
- Classes utilitárias em linha. Só se extrai uma classe reutilizável quando o padrão se repete 3 vezes ou mais.
- Nomes descritivos pelo propósito: `Button`, `Card`, `Badge`.

## 5. Componentes

**Conjunto mínimo primeiro** (ui-designer: nada de super-design antecipado): Button, Input, Card, Dialog, Alert, Badge, Spinner. O resto entra conforme os mockups pedem.

**Depois, por demanda dos mockups:**
- **Formulário:** AuthField, Checkbox, Radio, Switch, Segmented (seletor de perfil no cadastro).
- **Feedback:** Toast, Skeleton, EmptyState, ProgressBar, ProgressRing.
- **Navegação:** Tabs, Stepper, Breadcrumb, Pagination, Sidebar, AppHeader.
- **Dados:** Avatar, Chip, KPICard, LineChart, DataTable (tabela de permissões).
- **Base:** Icon, Logo, layouts AuthLayout e DashboardShell.

Cada componente confirma seu uso num mockup antes de ser criado. O que não aparecer nos mockups não é construído.

## 6. Telas do showcase (dos mockups)

Login, cadastro, recuperar senha, link enviado, verificar e-mail, 404, manutenção, acesso negado, sessão expirada, selecionar perfil, termos de uso, meu perfil e gerenciamento de permissões (RBAC). Usam dados estáticos, sem chamadas reais, e não entram no pacote npm.

## 7. Design e acessibilidade (ui-designer)

- **Contraste:** WCAG AA, 4,5:1 para texto normal e 3:1 para texto grande. Um teste automatizado valida os pares de cor dos tokens.
- **Paleta:** primária `#b1111b`, neutros e semânticas (success, warning, error, info), cada uma com estados hover, active e disabled. Erro não reutiliza o hex da marca.
- **Tipografia:** escala Inter do design kit (`docs/typography.md`), com entrelinha adequada a acentos em português.
- **Alvos interativos:** no mínimo 44×44px.
- **Cor nunca é o único sinal:** erro, sucesso e seleção também usam ícone, texto ou forma.
- **Teclado e foco:** todo elemento interativo é acessível por teclado, com foco visível e ARIA correto. O Dialog prende o foco e fecha com Esc.
- **Responsivo:** classes de breakpoint do Tailwind, sem larguras fixas.
- **Dark mode:** classe `.dark` com CSS variables, sem hex literais nos componentes.
- **Elevação e raios:** 2 a 3 níveis de sombra e 3 raios (sm, md, lg).

Cada componente tem no showcase a documentação visual: estados (default, hover, active, disabled, loading), tamanhos, regras de espaçamento e quando usar ou não usar.

## 8. Publicação e branches

Decisão (recomendação do `architect`, aprovada): uma única branch, sem `npm-publish` divergente, para evitar conflitos recorrentes em `package.json` e `vite.config` e um pacote defasado do showcase. Isso substitui o pedido inicial de configurar a publicação em outra branch.

- **Um `package.json`** com `exports`, `files: ["dist"]` e `peerDependencies` de react e react-dom. Traz `"private": true` como trava contra publicação acidental, removida só na etapa de release.
- **Dois configs Vite:** `vite.config.ts` para o showcase e `vite.lib.config.ts` para o modo biblioteca (ESM + `.d.ts`), com o script `build:lib`. O showcase nunca entra no pacote.
- **Exports explícitos:** `.` (componentes), `./preset` (preset Tailwind) e `./styles.css` (CSS dos tokens).
- **Release:** por tag `v*` a partir da `main`, versionada com `pnpm version` (sem Changesets, por ser um pacote único), e `pnpm publish` para o **GitHub Packages** (privado), pacote `@allankltsn/ui`. O `.npmrc` mapeia `@allankltsn:registry`, com token no CI e no `apps/web`.
- **Fluxo de trabalho:** as mudanças de código e o setup de publicação vão em branches de feature curtas, mescladas na `main`. Não há branch de longa duração.
- **Para o consumidor** (documentado no README): registrar o preset no Tailwind e apontar o `content` para `node_modules/@allankltsn/ui`, senão as classes são purgadas. Inter via `@fontsource` fica no consumidor.
- O escopo `@allankltsn` é o dono do repositório `allankltsn/aura-ui-kit`, exigência do GitHub Packages.

## 9. Testes e qualidade

- `vitest-axe` em cada componente, cobrindo os estados principais.
- Vitest + Testing Library por componente. Testam interações e resultados, não detalhes de implementação: renderização, variantes, teclado, `aria-*`, estados desabilitado e erro.
- Para cada mudança de comportamento, teste novo ou atualizado.
- `tsc --noEmit`, ESLint e Prettier passam antes de qualquer tarefa ser dada como concluída.
- Cada componente e cada tela do showcase é conferido com teclado e leitor de tela antes de ser marcado como pronto.

## 10. Execução

`writing-plans` gera o plano a partir deste spec. `ui-designer` define tokens, aparência e critérios de acessibilidade. `frontend-web` implementa componentes, showcase e testes. `qa` revisa antes de concluir. `security` só entra para a revisão de dependências (`pnpm audit`), porque o kit não tem superfície de ataque relevante.

## 11. Suposições a confirmar

Decididas com base nas recomendações de `frontend-web`, `ui-designer` e `architect`:

1. **Pacote único, não monorepo.** `src/tokens/` fica sem imports de React, com um arquivo único de tokens como fonte. O preset Tailwind e as CSS vars são derivados dele. Se o mobile precisar dos mesmos valores no futuro, extrai-se um pacote nesse momento.
2. **Showcase próprio em Vite, não Storybook.** A checagem de acessibilidade automatizada vem de `vitest-axe` nos testes de cada componente. O `showcase/` ganha deploy de preview para revisão dos designers. Storybook só é reavaliado se outras equipes passarem a consumir o kit.
3. **Pacote `@allankltsn/ui` no GitHub Packages (privado)**, publicado da `main` por tag (seção 8).
4. **Node 22 LTS**, fixado em `.node-version` e `engines >=22`, compatível com Vite 5, Vitest 2 e pnpm 9. O Node 22.22.2 já está instalado via nvm-windows e funciona no PowerShell (o shell Bash da ferramenta não o encontra). O pnpm 9 entra via corepack, com `"packageManager": "pnpm@9.x"` no `package.json`. A versão precisa ser alinhada com a do `apps/web`.
