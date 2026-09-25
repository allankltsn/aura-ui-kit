# aura-fit

## Stack frontend do Aura Fit

O código de frontend ainda não existe na `main`. O que segue vem da documentação: o [product.md](docs/product.md), o [spec RBAC/auth](docs/superpowers/specs/2026-09-19-rbac-auth-design.md) e o [plano RBAC/auth](docs/superpowers/plans/2026-09-19-rbac-auth.md). Na worktree `rbac-auth` só há `apps/identity-service` e `packages/`, sem `apps/web` nem `apps/mobile`.

Há uma divergência entre os documentos:
- O `product.md` descreve um frontend único com Expo Router e NativeWind (Tailwind), rodando em web, Android e iOS.
- O spec e o plano RBAC/auth, que são mais recentes, definem dois apps separados: web em Vite + React e mobile em Expo. Vale tratar esses dois como a decisão vigente.

### Web do personal (`apps/web`)
- **Base:** Vite 5, React 18 e TypeScript 5.6.
- **Roteamento:** react-router-dom 6.
- **Estado de servidor:** TanStack Query 5.
- **Formulários e validação:** react-hook-form com `@hookform/resolvers` e Zod 3.
- **Estilo:** Tailwind CSS 3.4, com PostCSS e Autoprefixer.
- **Testes:** Vitest 2 com jsdom, Testing Library (react, jest-dom, user-event) e MSW 2 para mock de API.
- **Build:** sem source maps em produção, servido por CDN ou Nginx.

### Mobile do aluno (`apps/mobile`)
- **Base:** Expo ~52, React Native 0.76.3 e React 18.3.1.
- **Roteamento:** Expo Router ~4, mais `expo-linking`.
- **Navegação:** `react-native-screens` e `react-native-safe-area-context`.
- **Armazenamento de tokens:** `expo-secure-store`.
- **Login social:** `expo-auth-session` (Google/Apple via Keycloak, com PKCE).
- **Estado de servidor:** TanStack Query 5.
- **Tema:** `src/theme.ts` com cores próprias (primary `#b1111b`) e componentes finos em `src/ui/*`, sem NativeWind por enquanto.
- **Testes:** Jest 29 com `jest-expo`, `@testing-library/react-native` e MSW.
- **Build nativo:** fora do Docker Compose. O bundler roda em container com `expo start --tunnel` ou LAN.

### Compartilhado entre web e mobile (`packages/`)
- **`@aura/schemas`:** schemas Zod.
- **`@aura/contracts`:** cliente de API gerado com Orval. Ele parte do OpenAPI, que sai dos schemas Zod via `zod-to-openapi`, e gera hooks do TanStack Query. Usa Axios com interceptor de refresh.
- **`@aura/authz`:** regras de autorização (RBAC) compartilhadas.

### Tooling do monorepo
- pnpm 9, Turborepo 2, TypeScript 5.9, Docker Compose e Dockerfile multi-stage por app.

O login do frontend passa pelo BFF e pelo Keycloak 26, com Authorization Code + PKCE.