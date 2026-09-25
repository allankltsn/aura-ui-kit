# Monorepo e empacotamento beta de @allankltsn/ui

Data: 2026-09-25

## Objetivo

Separar o repositório em dois produtos independentes, para que um não afete o outro:

- **Pacote** `@allankltsn/ui`: instalável do npm público.
- **Showcase**: app que o usuário roda manualmente e abre num localhost.

Cada um tem `package.json`, README e regra de licença próprios.

## Decisões (do usuário)

- Nome do pacote: `@allankltsn/ui` (provisório, para evitar problemas com o escopo `@aurafit`).
- Monorepo pnpm workspace.
- Licença MIT apenas para o pacote. O showcase é privado e não leva licença.
- Registro: npm público.
- Estilos: CSS compilado (`styles.css`) mais o preset do Tailwind.
- `mobile/` fica fora do escopo e do workspace.

## Estrutura

```
/                     raiz: pnpm-workspace.yaml, package.json (privado, orquestra),
                      eslint/prettier/tsconfig base, README geral
├─ packages/ui/       @allankltsn/ui
│  ├─ src/            componentes, hooks, ícones, tokens, lib
│  ├─ scripts/        geradores de tokens e ícones (+ testes)
│  ├─ package.json    versão beta, exports, files, peerDependencies
│  ├─ LICENSE         MIT
│  └─ README.md       instalação e uso
├─ apps/showcase/     app de demonstração (privado)
│  ├─ index.html, src/ (o atual showcase/)
│  ├─ e2e/            Playwright + axe (testa o app rodando)
│  ├─ package.json    depende de @allankltsn/ui via workspace:*
│  └─ README.md       como rodar
├─ mobile/            intocado
└─ docs/
```

## Pacote (`packages/ui`)

- **Build de biblioteca** (Vite em modo `lib`, ou tsup): saída ESM em `dist/`, `.d.ts` gerados, `react`, `react-dom` e `react/jsx-runtime` como externos.
- **`package.json`:** remove `private`, versão `0.1.0-beta.0`, `type: module`, `sideEffects: ["**/*.css"]`, `files: ["dist"]` (mais README e LICENSE, incluídos automaticamente), `publishConfig: { access: "public" }`.
- **`exports`:**
  - `.` → JS e tipos (`Button`, `Input`, `Dialog` etc., como named exports).
  - `./styles.css` → CSS compilado com os tokens e as utilities usadas pelos componentes.
  - `./preset` → preset do Tailwind (`tokens.json` embutido).
- **Dependências:** `clsx` e `tailwind-merge` em `dependencies`. `react` e `react-dom` (`^18`) em `peerDependencies`. Ferramentas de teste e build ficam em `devDependencies`.
- **Fonte:** o pacote não empacota a Inter. O README informa a fonte esperada, e o showcase a carrega via `@fontsource/inter`.

## Showcase (`apps/showcase`)

- Mantém o app atual, agora importando de `@allankltsn/ui` (build do workspace), não de caminhos relativos em `src/`.
- Scripts: `dev` (Vite, porta 5173), `build`, `e2e`.
- O Playwright sobe o dev server do próprio app.

## Raiz

- Scripts que delegam por filtro: `pnpm dev` (showcase), `pnpm build` (pacote e showcase), `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm e2e`.
- Configs comuns de ESLint, Prettier e TypeScript base ficam na raiz e são estendidas pelos pacotes.

## Testes

- Testes de unidade (Vitest + jsdom) permanecem no pacote, ao lado do código.
- E2E (Playwright + axe) vai para o showcase.
- Separação de `pnpm test` e camada de browser (`vitest --browser`) e Cypress ficam para a próxima sprint.

## Critérios de aceite

1. `pnpm install` na raiz funciona e vincula o workspace.
2. `pnpm typecheck`, `pnpm lint`, `pnpm test` e `pnpm format:check` passam, com os mesmos 141 testes.
3. `pnpm build` gera `packages/ui/dist` com JS, `.d.ts` e `styles.css`.
4. `pnpm dev` abre o showcase em `localhost:5173` consumindo `@allankltsn/ui`.
5. `pnpm e2e` passa no showcase.
6. **Prova de instalação:** `pnpm pack` em `packages/ui`, instalação do `.tgz` num projeto React vazio fora do repo, e `import { Button } from '@allankltsn/ui'` mais `import '@allankltsn/ui/styles.css'` compilam e renderizam.
7. O pacote tem LICENSE (MIT) e README. O showcase tem README e é privado.

## Fora do escopo

- Publicação de fato no npm (exige login e a decisão do usuário).
- CI de publicação (`.github/workflows`), a decidir depois da prova de instalação.
- `mobile/`.
- SSR e Next.js: só se verifica depois do build existir.

## Riscos

- O escopo `@allankltsn` precisa ser do seu usuário no npm. Isso não foi confirmado (não há login aqui).
- Mover arquivos pode quebrar imports com o alias `@/`, os caminhos de `scripts/` e as configs. A verificação é rodar todos os comandos dos critérios acima depois de cada etapa.
- O CSS compilado precisa incluir só as classes usadas pelos componentes, sem depender do `content` do consumidor.
