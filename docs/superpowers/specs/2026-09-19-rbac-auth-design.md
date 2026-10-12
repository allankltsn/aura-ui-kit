# aura-fit — Entrega 1: Autenticação + RBAC (design)

Data: 2026-09-19 · Status: aguardando revisão

Fontes: `docs/product.md` (escopo de negócio, referência de domínio) e mockups em `docs/assets/`
(design system, dashboard/alunos/treinos/IA/calendário e fluxo de auth/RBAC).

> **Divergência do `product.md`:** a stack de backend passa de Python/FastAPI para TypeScript/NestJS.
> As fronteiras de serviço, o database por serviço e o `tenant_id` continuam valendo.

## 1. Decisões

| Tema | Decisão |
|---|---|
| Topologia | Microsserviços desde o início: BFF + `identity-service` nesta entrega |
| Backend | NestJS + Prisma + PostgreSQL, Redis, OpenTelemetry |
| Contrato de API | REST + OpenAPI gerado dos schemas Zod (`zod-to-openapi`; Swagger UI só em dev) → Orval (hooks TanStack Query) |
| Auth | Keycloak atrás de `IdentityProviderPort` (Adapter); troca de provedor só reimplementa o adapter |
| Autorização | Fonte de verdade no `identity-service`; BFF resolve e cacheia (Redis); sem claims customizados no token |
| RBAC | Papéis de sistema fixos (`personal`, `aluno`, `admin`) + permissões no banco; checagem por permissão |
| Monorepo | pnpm + Turborepo |
| Front | Web: Vite + React · Mobile: Expo + React Native |

## 2. Estrutura do monorepo

```
apps/
  bff/               único ponto público; valida JWT, resolve contexto, roteia
  identity-service/  NestJS + Prisma (db aura_identity)
  web/               Vite + React
  mobile/            Expo + React Native
packages/
  contracts/         OpenAPI por serviço + clientes Orval
  schemas/           Zod compartilhado (web + mobile)
  authz/             catálogo tipado de permissões (recurso:ação)
  observability/     setup OTel reutilizável
  config/            tsconfig / eslint
docker-compose.yml    raiz: postgres, redis, keycloak, otel-collector, apps
infra/               configs (keycloak realm, otel, postgres init)
```

Fluxo: front → BFF (REST) → identity-service. Só o identity-service fala com o Keycloak.
`correlation_id` propagado entre serviços. S3 não entra nesta entrega.

## 3. Modelo do identity-service

- `User` (UUID): `external_id` (sub do Keycloak), e-mail, nome, telefone, status, `email_verified`,
  `terms_accepted_at`, `terms_version`. Sem senha no nosso banco.
- `Tenant` (UUID): personal dono da conta (nome, slug, status).
- `Membership` (UUID): `user_id`, `tenant_id` (nulo para admin da plataforma), `role_id`, status.
  Um usuário pode ter várias memberships; é o "perfil" da tela de seleção.
- `Role` (int, sistema), `Permission` (int, `recurso:ação`), `RolePermission`.
- `Invite` (UUID): código de convite do personal para alunos (expiração, uso único).
- `AuditLog`: login, troca de perfil, mudança de permissão, ações admin.

PKs conforme `product.md` §4 (UUID nas transacionais, inteiro nas de configuração).

Regras:
- Cadastro público cria apenas **Personal** (novo tenant). **Aluno** entra por convite.
- **Admin não se auto-cadastra** (a aba "Admin" do mockup de cadastro é removida); criado por seed/CLI.
- `tenant_id` nunca vem do cliente; deriva da membership ativa.

Porta `IdentityProviderPort`: criar usuário, autenticar, iniciar/finalizar login social, enviar verificação,
reset de senha, revogar sessões. Implementações: `KeycloakAdapter` e `InMemoryIdentityProvider` (testes).

## 4. Fluxos de autenticação

- **Login e-mail/senha:** `POST /auth/login`; access token ~10 min + refresh. Web: refresh em cookie
  `HttpOnly; Secure; SameSite=Lax`, access token só em memória. Mobile: SecureStore.
- **Google/Apple:** Authorization Code + PKCE via Keycloak (identity broker); mobile com `expo-auth-session`.
- **Cadastro:** Personal → `User` + `Tenant` + `Membership` em transação; Aluno → código de convite.
  Aceite dos termos obrigatório e versionado.
- **Verificação de e-mail:** link do Keycloak; acesso limitado até verificar; reenvio com rate limit.
- **Esqueci a senha:** resposta sempre genérica; link expira em 15 min.
- **Seleção de perfil:** `POST /auth/select-membership` quando há mais de uma membership.
- **Sessão:** refresh com rotação e detecção de reuso (reuso revoga a família); logout revoga no Keycloak;
  tela de sessão expirada.
- **Abuso:** rate limit e lockout progressivo por IP/e-mail (Redis); auditoria em todos os passos.

## 5. Autorização

1. BFF valida o JWT do Keycloak (JWKS; `iss`, `aud`, `exp`).
2. Resolve o contexto do `sub` + membership ativa no identity-service; cache Redis com TTL curto e
   invalidação por evento (mudança de permissão, suspensão).
3. Injeta contexto interno **assinado** (`user_id`, `tenant_id`, `membership_id`, `role`, `permissions[]`).
   Serviços internos não são públicos e só confiam em contexto com assinatura válida.
4. `@RequirePermission('students:read')` nos serviços; toda query transacional filtra por `tenant_id`.
5. 401 para sessão inválida; 403 estruturado para acesso negado (o front mostra a tela do mockup).

O catálogo de permissões vive em `packages/authz`. Seed mapeia os 3 papéis. A tela admin edita
`RolePermission` e dispara a invalidação de cache.

## 6. Requisitos de segurança

Aplicam-se a BFF, identity-service e a todo serviço futuro.

### 6.1 Transporte, headers e CORS
- **TLS:** obrigatório em produção; terminação no proxy/ingress, TLS ≥ 1.2. Redirecionamento HTTP→HTTPS
  (respeitando `X-Forwarded-Proto` com `trust proxy` configurado explicitamente) e HSTS
  (`max-age` ≥ 1 ano, `includeSubDomains`).
- **Headers (helmet, conjunto completo):** `Strict-Transport-Security`, `Content-Security-Policy`
  restritiva (APIs: `default-src 'none'; frame-ancestors 'none'`; web: política própria sem `unsafe-inline`),
  `X-Content-Type-Options: nosniff`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`,
  `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`; remover `X-Powered-By`.
- **Host confiável:** middleware com allowlist de `Host` (equivalente ao TrustedHost); host fora da lista → 400/421.
  Lista vem de configuração por ambiente.
- **CORS:** allowlist explícita de origens por ambiente, sem `*` com credenciais, métodos e headers
  mínimos, `credentials` só para as origens web.

### 6.2 Erros sem vazamento
- Filtro global de exceções: resposta padronizada `{ code, message, correlationId }`; sem stack trace,
  mensagens de ORM/SQL, caminhos internos ou versões.
- Erros de autenticação genéricos (mesma resposta para e-mail inexistente e senha errada; reset sempre genérico).
- Detalhes técnicos apenas em log estruturado, com `correlation_id`; segredos e PII redigidos dos logs.
- Validação (Zod/class-validator) devolve erros por campo sem ecoar valores sensíveis.

### 6.3 CSRF
- Endpoints autenticados só por `Authorization: Bearer` (access token em memória) não são vulneráveis a CSRF.
- **Aplica-se** aos endpoints que usam o cookie de refresh no web (`/auth/refresh`, `/auth/logout`):
  `SameSite=Lax` + verificação de `Origin`/`Referer` contra a allowlist + token anti-CSRF (double-submit)
  em operações que mudam estado. Mobile não usa cookies, então não se aplica.

### 6.4 Arquivos estáticos e rotas de debug
- APIs não servem arquivos estáticos. O web (build Vite) é servido por CDN/Nginx só a partir do diretório
  `dist`, sem listagem de diretório, com permissões somente-leitura.
- **Nunca** servir `.env`, `.git`, `*.map` de produção com código sensível, configs, `docker-compose`
  ou lockfiles; regras de bloqueio no servidor estático, e `.dockerignore` excluindo esses itens da imagem.
- Sem rotas de debug/dev em produção: Swagger/OpenAPI UI, endpoints de teste e seeds só habilitados quando
  `NODE_ENV !== 'production'` (a UI do Swagger desligada em prod; o JSON do contrato só em CI/build).
  Falha de boot se variáveis obrigatórias faltarem ou se flags de debug estiverem ativas em produção.
- Segredos só via variáveis de ambiente/secret manager, nunca no repositório (`.gitignore` já cobre `.env`).

### 6.5 Dependências e supply chain
- Lockfile (`pnpm-lock.yaml`) versionado e instalação com `--frozen-lockfile` no CI.
- Scan em todo PR: `pnpm audit` e SCA (Dependabot/Renovate + OSV/Snyk); falha o build em severidade
  alta/crítica sem exceção documentada.
- Scan de segredos (gitleaks) no pre-commit e no CI; scan de imagem (Trivy) nas imagens Docker.
- Restringir scripts de instalação (`pnpm` com `onlyBuiltDependencies`), pinning de versões, SBOM
  (CycloneDX) gerado no build, e revisão de novas dependências.
- Imagens base mínimas e pinadas por digest, execução como usuário não-root.

## 7. Escopo

**Dentro:** BFF; identity-service (Prisma, migrações, seed); porta + KeycloakAdapter + fake; RBAC; auditoria;
Otel; docker-compose (postgres, redis, keycloak, otel-collector); `contracts` e `schemas`; requisitos do §6.

- Web: login, cadastro, esqueci/link enviado, verificar e-mail, selecionar perfil, sessão expirada,
  acesso negado, 404, meu perfil, termos, tela admin de permissões, shell autenticado com rotas por permissão.
- Mobile: login, cadastro (aluno por convite), esqueci senha, verificar e-mail, selecionar perfil,
  sessão expirada, token no SecureStore.

**Fora (entregas futuras):** login social com Apple e outros provedores (Google entra na Task 19, com o código já preparado para novos provedores; Apple não iniciado, a verificar depois); funções customizadas por tenant, MFA, foto de perfil (media-service),
tela de manutenção, dashboard e demais módulos.

**Roadmap posterior:** `training-service` → `media-service` → `billing-service` (Stripe) → `ai-service`
→ agenda/calendário e chat/notificações.

## 8. Testes

- Unitários nos casos de uso (com `InMemoryIdentityProvider`).
- Integração com Postgres e Redis (Testcontainers).
- Smoke e2e contra o Keycloak real do compose.
- Obrigatórios: isolamento entre tenants, rotação/reuso de refresh, negação por permissão ausente,
  ausência de vazamento em respostas de erro, headers/CORS/Host por ambiente, CSRF no refresh,
  Swagger e rotas de debug indisponíveis com `NODE_ENV=production`.

## 9. Execução local via docker-compose (requisito)

A implementação deve ser **gerada, executada e testada localmente via docker-compose**, sem exigir Node/pnpm
instalados no host.

- `docker-compose.yml` (raiz) sobe: `postgres`, `redis`, `keycloak` (com realm importado), `otel-collector`,
  `identity-service`, `bff` e `web`. Cada app NestJS/Vite tem `Dockerfile` multi-stage (`dev` com hot-reload
  e volume; `prod` mínimo, não-root, pinado por digest).
- Comandos de desenvolvimento, migrações, geração Orval, lint e testes rodam **dentro de containers**
  (`docker compose run --rm <serviço> pnpm ...`), expostos por scripts em `Makefile`/`scripts/`.
- Testes de integração usam os serviços do próprio compose (postgres/redis/keycloak), não Testcontainers no host.
- O compose de desenvolvimento nunca é usado em produção; `NODE_ENV=production` só nas imagens `prod`.
- Segredos locais em `.env` (ignorado pelo git) a partir de `.env.example`; nada de segredo em imagem.
- Mobile (Expo) roda o bundler em container (`expo start --tunnel`/LAN); build nativo fica fora do compose.
