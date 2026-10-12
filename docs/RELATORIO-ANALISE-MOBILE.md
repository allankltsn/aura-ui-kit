# Relatório de análise do `mobile/` contra os requisitos do README

Data: 2026-09-24
Escopo: pasta `mobile/` (UI kit) comparada com a stack descrita no `README.md` (web do personal, mobile do aluno, pacotes compartilhados).
Método: cinco agentes especialistas, todos em **modo somente leitura**: `frontend-mobile`, `ui-designer`, `security`, `qa` e `frontend-web`. Nada no projeto foi alterado.

> **Limitação importante.** Nenhum agente conseguiu rodar `typecheck`, `lint` ou testes: `node` não está no PATH do shell e não existe `node_modules` em `mobile/`. Tudo abaixo é **análise estática**. Não há evidência de que o projeto compila. Cada agente indicou quais arquivos leu por completo e quais viu só por busca ou cabeçalho (ver seção 10).

---

## 1. Resumo executivo

O `mobile/` é um **UI kit navegável**, não o app do aluno descrito no README. Ele não atende à stack alvo nem como aplicação: não tem auth, API, testes nem monorepo, e as 14 telas de dados leem `mockData`. O valor dele está no **design system** (tokens, ícones, marca e layout do dashboard). O código dos componentes quase não se reaproveita, porque tudo depende de NativeWind.

| Pergunta | Resposta curta |
|---|---|
| Atende aos requisitos do README? | **Não.** 6 de 16 requisitos divergem, 5 estão ausentes. |
| Há algo reaproveitável? | **Sim**: tokens, ícones, marca, layout do dashboard e telas como referência de UX. |
| Serve para a web? | **Mais do que para o mobile.** O kit já é Tailwind 3.4, mesma base da web alvo. |
| Está pronto para produção? | **Não.** Sem auth, sem guards, sem testes, sucessos falsos na UI. |
| Maior risco? | Falta de guard de rota e de papel (RBAC) e login fora do padrão PKCE. |

```mermaid
flowchart LR
    A["mobile/ (UI kit)<br/>Expo 57 · RN 0.86 · React 19<br/>NativeWind · mockData"] --> B{"O que fazer?"}
    B -->|"Reaproveitar"| C["Tokens · ícones · marca<br/>layout do dashboard<br/>telas como referência"]
    B -->|"Reescrever"| D["Componentes de UI<br/>estilo NativeWind → StyleSheet (mobile)<br/>ou HTML semântico (web)"]
    B -->|"Construir do zero"| E["Auth PKCE/Keycloak<br/>camada de dados (Orval)<br/>guards RBAC · testes"]
    B -->|"Descartar"| F["mockData · public/*<br/>package.json · global.css"]
```

---

## 2. Estado atual contra a stack do README

### 2.1 Matriz de requisitos (16 linhas)

| Requisito do README | Estado | Evidência |
|---|---|---|
| Expo ~52 | Diverge | `expo ~57.0.24` |
| React Native 0.76.3 | Diverge | `react-native 0.86.3` |
| React 18.3.1 | Diverge | `react 19.2.3` |
| Expo Router ~4 | Diverge | `expo-router ^57.0.22` |
| TypeScript 5.9 | Diverge | `typescript ~6.0.3` |
| Sem NativeWind por enquanto | Diverge | `nativewind ^4.2.7`; `babel.config.js:4`, `metro.config.js:2,6` |
| expo-linking | Atende (versão diverge) | `^57.0.10` |
| react-native-screens | Atende | `^4.28.0` |
| react-native-safe-area-context | Atende | `^5.10.0`, usado em `app/_layout.tsx:8` |
| Zod | Atende, com ressalva | `zod ^4.6.5`; alvo é Zod 3 |
| expo-secure-store | Presente, sem uso | `secureStorage.ts` nunca é importado |
| expo-auth-session (PKCE) | Ausente | não está no `package.json` |
| TanStack Query 5 | Ausente | sem `QueryClientProvider` |
| Jest, jest-expo, RNTL, MSW | Ausente | nenhum teste, nenhum script `test` |
| `@aura/schemas`, `@aura/contracts`, `@aura/authz` | Ausente | nenhum import |
| pnpm, Turborepo, `apps/mobile` | Ausente | app em `mobile/`, `package-lock.json` (npm) |

```mermaid
pie showData
    title Requisitos do README (16 linhas da matriz)
    "Atende (4)" : 4
    "Presente, sem uso (1)" : 1
    "Diverge (6)" : 6
    "Ausente (5)" : 5
```

### 2.2 Arquitetura: alvo contra o que existe

```mermaid
flowchart TB
    subgraph ALVO["Alvo (README)"]
        direction TB
        W["apps/web<br/>Vite · React 18 · Tailwind 3.4"]
        M["apps/mobile<br/>Expo 52 · RN 0.76 · sem NativeWind"]
        P["packages/<br/>@aura/schemas · @aura/contracts · @aura/authz"]
        BFF["BFF + Keycloak 26<br/>Authorization Code + PKCE"]
        W --> P
        M --> P
        P --> BFF
    end
    subgraph ATUAL["Atual (mobile/)"]
        direction TB
        K["mobile/ (raiz do repo, npm)<br/>Expo 57 · RN 0.86 · React 19 · NativeWind"]
        MD["lib/mockData.ts"]
        K --> MD
    end
    ALVO ~~~ ATUAL
```

### 2.3 O que o app contém e o que falta

```mermaid
flowchart LR
    subgraph EXISTE["Existe"]
        U1["28 componentes de UI"]
        U2["~30 telas: auth, aluno,<br/>dashboard do personal, legal, erro"]
        U3["Tokens, 34 ícones, marca"]
        U4["Headers de segurança web<br/>(CSP, HSTS)"]
    end
    subgraph FALTA["Falta"]
        F1["Auth real (PKCE)"]
        F2["Camada de dados (Orval + TanStack)"]
        F3["Guards de rota e papel (RBAC)"]
        F4["Testes"]
        F5["Monorepo e pacotes @aura/*"]
    end
    EXISTE -.->|"protótipo visual"| FALTA
```

### 2.4 Divergência de escopo

O README define `apps/mobile` como **mobile do aluno**. O kit traz também o **dashboard do personal** (`app/(dashboard)/`), que é uma segunda aplicação embutida, pensada para tablet e desktop.

```mermaid
flowchart TB
    R["app/_layout.tsx (sem guard)"] --> AUTH["(auth)<br/>login · signup · forgot · select-role"]
    R --> APP["(app)<br/>Aluno: tabs, treino, exercício"]
    R --> DASH["(dashboard)<br/>Personal: home, alunos,<br/>finanças, permissões, perfil"]
    R --> LEG["(legal) termos · privacidade"]
    R --> ERR["access-denied · session-expired<br/>maintenance · not-found"]
    DASH -. "fora do escopo do app do aluno" .-> X["Destino a decidir:<br/>apps/web ou guard por papel"]
```

---

## 3. Segurança

O app ainda é protótipo, então não há vazamento de token, segredo no código nem injeção. Os achados são de **controle de acesso ausente**, que precisa existir antes de ligar dados reais.

### 3.1 Achados por severidade (8 achados)

```mermaid
pie showData
    title Segurança: achados por severidade
    "High (2)" : 2
    "Medium (2)" : 2
    "Low (4)" : 4
```

| Sev. | Achado | Onde |
|---|---|---|
| High | Sem guard de rota nem de papel. Qualquer pessoa abre `/students`, `/finance`, `/permissions` por deep link. O papel vem do mock, e `select-role` deixa o usuário escolher o papel no cliente. | `app/index.tsx:4-5`, `(dashboard)/_layout.tsx:25-79`, `app/_layout.tsx:49-54` |
| High | IDOR latente nas rotas com id. Sem risco hoje (mock), mas o backend precisa checar posse ao ligar a API. | `students/[id]`, `workout/[id]`, `exercise/[id]` |
| Medium | Login e social login sem implementação. Risco de implementar depois com senha coletada no app, fora do modelo Authorization Code + PKCE. "Lembrar de mim" não tem efeito. | `login.tsx:17-22, 99-104` |
| Medium | CSP web com `connect-src 'self'`, sem prever BFF ou Keycloak. Está triplicada (meta, `_headers`, `vercel.json`). | `public/index.html`, `_headers`, `vercel.json` |
| Low | `openExternalUrl` loga a URL completa em `__DEV__`. | `openExternalUrl.ts:25-27` |
| Low | `openExternalUrl` permite `tel:` e `mailto:`. | `openExternalUrl.ts:3, 19-24` |
| Low | Scheme `aurafit://` não é exclusivo. Faltam `intentFilters` e `associatedDomains` para OAuth. | `app.json:4` |
| Low | Versões incomuns (expo 57, typescript 6, zod 4) que o agente não conseguiu confirmar. `npm audit` não foi rodado. | `package.json` |

**O que já está adequado:** `secureStorage` usa secure-store no nativo e memória na web, sem `localStorage`. CSP restritiva, HSTS de 2 anos, `X-Frame-Options: DENY`. Sem `eval`, `dangerouslySetInnerHTML` ou WebView. Sem segredos hardcoded.

### 3.2 Fluxo de login: como está e como precisa ficar

```mermaid
sequenceDiagram
    participant U as Usuário
    participant A as App (Expo)
    participant B as Browser do sistema
    participant K as Keycloak 26
    participant BFF as BFF
    Note over A: Hoje: tela coleta a senha e termina em TODO
    U->>A: Toca "Entrar" ou "Google/Apple"
    A->>B: Abre auth URL (S256, state, nonce)
    B->>K: Authorization Code + PKCE (kc_idp_hint para social)
    K-->>B: Redirect com code
    B-->>A: aurafit:// ou App/Universal Link
    A->>BFF: Troca code + code_verifier
    BFF-->>A: Sessão
    A->>A: Guarda tokens no secure-store
    Note over A: Guard lê o papel das claims validadas no servidor (@aura/authz)
```

---

## 4. QA adversarial

**Veredito: não está pronto para produção.** Cobertura de testes: **zero** (nenhum `*.test.*`, sem Jest, sem MSW, sem script `test`).

### 4.1 Blocos de achados por severidade (10 blocos)

```mermaid
pie showData
    title QA: blocos de achados por severidade
    "Crítico (2)" : 2
    "Alto (2)" : 2
    "Médio (4)" : 4
    "Baixo (2)" : 2
```

| Sev. | Achado |
|---|---|
| Crítico | Auth e sessão inexistentes. `secureStorage` e `openExternalUrl` são código morto. |
| Crítico | 14 arquivos leem `mockData`. Não há fetch, `useQuery`, loading ou erro. **Sucessos falsos**: `students/new.tsx:43-50` mostra "Aluno cadastrado" sem salvar, `forgot-password.tsx:18` mostra "Link enviado" sem enviar, o chat descarta a mensagem (`chat.tsx:65`). |
| Alto | Parâmetro inválido cai em dado errado: `students/[id].tsx:10` usa `?? students[0]`. "Editar Aluno" abre com formulário vazio. `workout/[id]` mostra o mesmo treino para qualquer id. |
| Alto | Validação: "E-mail ou usuário" usa schema de e-mail (nunca aceita usuário). E-mail sem trim/lowercase. `max()` com mensagem em inglês. Telefone com regex frouxa. Altura e peso sem validação. Signup público oferece papel **Admin** (`signup.tsx:10`). |
| Alto (a confirmar) | `signup.tsx:123-124`: Pressable pai e Checkbox filho podem alternar duas vezes, e o estado volta ao anterior. Precisa confirmar em dispositivo. |
| Médio | Rotas órfãs (`select-role`, `maintenance`, `session-expired`, `access-denied`). Botões sem ação (login social, "Continuar", `onMore`). LGPD e Ajuda desabilitadas em `legalDocs.ts:11-14`. |
| Médio | Sem ErrorBoundary. `KeyboardAvoidingView` com `behavior` indefinido no Android. `LineChart` com largura fixa de 520 estoura em telas de 360px. |
| Médio | Acessibilidade ausente em quase todos os componentes além de Button e Checkbox. |
| Baixo | Faltam `react-native-worklets` (peer do Reanimated 4), react-hook-form, TanStack Query e libs de teste. Sem `try/catch` no `secureStorage`. |

### 4.2 Onde a ausência de guard deixa cada rota

```mermaid
flowchart LR
    U(("Qualquer<br/>usuário")) --> I["/ → redireciona para login"]
    U ==>|"deep link ou URL"| D1["/home"]
    U ==>|"deep link ou URL"| D2["/students · /students/id"]
    U ==>|"deep link ou URL"| D3["/finance"]
    U ==>|"deep link ou URL"| D4["/permissions"]
    style D1 fill:#fbe8e9,stroke:#b1111b
    style D2 fill:#fbe8e9,stroke:#b1111b
    style D3 fill:#fbe8e9,stroke:#b1111b
    style D4 fill:#fbe8e9,stroke:#b1111b
```

---

## 5. Design system: o que é reaproveitável

### 5.1 Mapa de reaproveitamento

| Item | Mobile alvo (Expo 52, sem NativeWind) | Web alvo (Vite + Tailwind 3.4) |
|---|---|---|
| Paleta, semânticas, avatar tones | Direto | Direto |
| `#b1111b` (primary) | Consistente em todos os arquivos | Consistente |
| Valores de dark mode | Direto (dados) | Direto (dados) |
| Ícones (`paths.ts`, 34) | Direto (dados puros) | Direto, `<svg>` com `currentColor` |
| SVGs de marca, favicon | Direto | Direto |
| Tailwind config | Descartar | Vira preset (sem o preset do NativeWind) |
| `cn.ts` (clsx + tailwind-merge) | Descartar | Direto |
| Componentes de UI | Só como **especificação** | Classes copiam; markup é reescrito |
| Layout do dashboard | Não se aplica | Boa base |
| Telas do personal | Não se aplica | Referência de UX |
| Telas do aluno (`app/(app)`) | Referência de UX | Descartar |
| `mockData`, `public/*`, `package.json`, `global.css` | Descartar | Descartar |

### 5.2 Componentes de UI para a web (25 avaliados pelo agente frontend-web)

```mermaid
pie showData
    title Componentes de UI: decisão para a web
    "Com adaptação (17)" : 17
    "Direto (4)" : 4
    "Reescrever (2)" : 2
    "Descartar (2)" : 2
```

| Decisão | Componentes |
|---|---|
| Direto (4) | StatusBadge/Tag, KPICard, EmptyState, matemática do LineChart |
| Com adaptação (17) | Button, Input, AuthField, Checkbox/Radio, Switch, Tabs, Segmented, Toast, Alert, Avatar, Card, Chip, Stepper, ProgressBar, ProgressRing, Skeleton, ExerciseLibraryCard |
| Reescrever (2) | ConfirmModal (Radix Dialog ou `<dialog>`), DataTable (`<table>` semântica) |
| Descartar (2) | PlanCard, ExerciseRow (fluxo do aluno) |

### 5.3 Problemas de qualidade do design system

**Contraste** (razões calculadas, não medidas em tela). A linha tracejada é o mínimo AA para texto normal (4,5:1).

```mermaid
xychart-beta
    title "Razão de contraste (mínimo AA = 4,5)"
    x-axis ["primary/branco", "faint/branco", "branco/success"]
    y-axis "Razão" 0 --> 8
    bar [7, 3.3, 3.2]
```

| Problema | Detalhe |
|---|---|
| `faint` `#8d8d8d` sobre branco | ~3,3:1. Falha em AA. Usado em placeholder e texto desabilitado. |
| Branco sobre `success` `#22a45d` | ~3,2:1. Para texto, usar `success.text` `#137a3d`. |
| `warning` `#e2a400` | Não serve como cor de texto. Usar `warning.text` `#855800`. |
| `danger` = `primary` | Mesmo hex `#b1111b`. Confunde marca com erro. |
| `lineHeight` de h1 a h4 | Igual ao `fontSize` (100%). Tende a cortar acentos em português. Recomendado 1,15 a 1,25. |
| Alvos de toque | Button sm/md (32/40), Input sm/md e Checkbox/Radio (34 a 38) ficam abaixo de 44pt. |
| Dark mode | **Especificado nos tokens, não implementado**: nenhum componente usa `dark:`. |
| Cores fixas | Hex hardcoded no spinner do Button, no padrão do Icon, no LineChart e no Avatar. |
| Acessibilidade | Sem `accessibilityLabel` nos componentes lidos. Presença do Avatar e erro versus foco do Input dependem só de cor. Sem estado de foco. |

### 5.4 Pacote compartilhado proposto: `packages/ui-tokens`

Somente dados TypeScript, sem React, RN nem Tailwind como dependência.

```mermaid
flowchart TB
    T["packages/ui-tokens<br/>colors · spacing · radius · shadows<br/>typography (sem família) · avatar · icons/paths"]
    T -->|"gera preset + CSS vars"| WEB["apps/web<br/>tailwind.config + .dark"]
    T -->|"reexporta"| MOB["apps/mobile<br/>src/theme.ts + mapa peso→família Inter<br/>+ sombras iOS/Android"]
    T -->|"assets"| BR["assets/brand/*.svg"]
    TST["Teste de contraste (Vitest)<br/>falha abaixo de 4,5:1"] -.-> T
```

Regras: a web usa o preset com `darkMode: 'class'` e variáveis CSS; o mobile mapeia peso para `Inter_600SemiBold`; um teste de contraste impede a regressão do `faint`.

---

## 6. Reaproveitamento para a web (`apps/web`)

### 6.1 Zod 4 → Zod 3 (schemas do `validation.ts`)

| Linha | Kit (Zod 4) | Alvo (Zod 3) |
|---|---|---|
| 10 | `z.email('msg')` | `z.string().email('msg')` |
| 42 | `z.literal(true, { error })` | `z.literal(true, { errorMap })` ou `z.boolean().refine(...)` |
| 57 | `getFieldErrors<T extends z.ZodType>` | Funciona; com react-hook-form + `zodResolver` deixa de ser necessário |
| demais | `.trim()`, `.regex`, `.min/.max`, `.refine`, `z.infer` | Compatíveis |

O regex interno de e-mail difere entre as versões. Os testes precisam ser ajustados.

### 6.2 Tradução dos primitivos

| Original (RN) | Web |
|---|---|
| `View` / `Text` | `div`, `section`, `span`, `p`, `h1`..`h4` |
| `Pressable` | `<button type="button">` ou `Link` |
| `TextInput` | `<input>` / `<textarea>` com `forwardRef` |
| `Modal` | Radix Dialog ou `<dialog>` (focus trap, Esc) |
| `expo-router` | react-router-dom 6 (`useNavigate`, `useLocation`, `useParams`, `Outlet`) |
| `react-native-svg` | `<svg>` DOM |
| `reanimated` | Transições CSS, `animate-pulse` |
| `useResponsive` | Classes `lg:` do Tailwind |
| `secureStorage` | BFF com cookie httpOnly |
| `mockData` | Orval (`@aura/contracts`) + MSW |
| `useState` + Zod manual | react-hook-form + `zodResolver` |

### 6.3 Ordem de migração para a web

```mermaid
flowchart TD
    S1["1. Schemas Zod → @aura/schemas (Zod 3)"] --> S2["2. packages/ui-tokens<br/>tokens · preset · ícones · marca"]
    S2 --> S3["3. Fundação do apps/web<br/>Vite · Tailwind · Inter · ThemeProvider<br/>router · QueryClient · MSW"]
    S3 --> S4["4. Átomos<br/>Icon · Button · Input · Checkbox<br/>Badge · Avatar · Card · Alert"]
    S4 --> S5["5. Compostos<br/>Dialog · Toast · Tabs · Chip<br/>Progress · LineChart · KPICard"]
    S5 --> S6["6. Shell do dashboard<br/>Sidebar · TopBar · Breadcrumb<br/>drawer acessível · skip link"]
    S6 --> S7["7. DataTable + Pagination semânticos<br/>(peça mais cara)"]
    S7 --> S8["8. Telas do personal<br/>com hooks Orval, loading e erro"]
    S8 --> S9["9. Rotas de estado e auth via BFF"]
    S9 --> S10["10. Avaliar consumir o pacote no mobile"]
```

### 6.4 Riscos específicos da web

| Risco | Mitigação |
|---|---|
| Dark mode por `class` não funciona: cores dark são chaves separadas e há hex literais em SVGs | CSS variables (`--surface`) trocadas por `.dark`, `currentColor`, script inline antes do paint |
| `fontFamily` aponta para nomes `Inter_*`, e as chaves `medium/semibold/bold` colidem com as utilities de peso | Self-host de Inter (`@fontsource`), remover essas chaves do preset web. A CSP já permite `font-src 'self'` |
| Tentação de usar `react-native-web` | Não usar: sem HTML semântico, a11y limitada, incompatível com React 18 |
| `tailwind-merge` 3 (relatado pelo agente como voltado ao Tailwind 4) | Fixar `tailwind-merge@^2` na web |
| Larguras fixas (`LineChart` 520, cards de 150px, sidebar inline) | `viewBox`, grid responsivo |
| Kit sem nenhum teste | Vitest + Testing Library + MSW nos componentes novos, começando por Dialog, Tabs, DataTable |

---

## 7. Esforço para chegar à stack alvo (mobile)

Estimativa grosseira do agente de conformidade, para **1 dev experiente**. Total: **27 a 42 dias úteis (5 a 8 semanas)**. Sem verificação em iOS/Android e sem rodar tsc, lint ou testes.

| Etapa | Dias |
|---|---|
| Alinhar versões (downgrade Expo, React, Reanimated, RNGH, new arch) | 2 a 4 |
| Remover NativeWind e migrar para `theme.ts` + StyleSheet + `src/ui/*` | 8 a 12 |
| Monorepo pnpm/Turborepo + pacotes compartilhados (esqueleto) | 2 a 3 |
| Auth (auth-session, PKCE, Keycloak, secure-store, refresh) | 4 a 6 |
| Guards de rota e papel (`@aura/authz`), destino do dashboard | 2 a 3 |
| TanStack Query + Orval no lugar de `mockData` | 4 a 6 |
| react-hook-form nos formulários | 1 a 2 |
| Testes (Jest, jest-expo, RNTL, MSW) e acessibilidade | 4 a 6 |

Gráfico com o ponto médio de cada faixa (em dias):

```mermaid
xychart-beta
    title "Esforço por etapa (dias, ponto médio da faixa)"
    x-axis ["Versões", "NativeWind", "Monorepo", "Auth", "Guards", "Dados", "RHF", "Testes"]
    y-axis "Dias úteis" 0 --> 12
    bar [3, 10, 2.5, 5, 2.5, 5, 1.5, 5]
```

Duas decisões reduzem esse esforço: manter o SDK 57 e atualizar o README economiza cerca de 2 a 4 dias; manter o NativeWind (mudando a regra do projeto) economiza os 8 a 12 dias da migração de estilo.

---

## 8. Decisões que precisam do dono do projeto

```mermaid
flowchart TD
    D1{"Stack do mobile"}
    D1 -->|"Manter Expo 57"| D1A["Atualizar README<br/>economiza 2 a 4 dias"]
    D1 -->|"Downgrade para Expo 52"| D1B["Reanimated ~3.16 · RNGH ~2.20<br/>rever new arch"]
    D2{"NativeWind"}
    D2 -->|"Manter"| D2A["Mudar a regra do README<br/>economiza 8 a 12 dias"]
    D2 -->|"Migrar para StyleSheet"| D2B["Reescrever ~28 componentes<br/>e 30+ telas"]
    D3{"Dashboard do personal"}
    D3 -->|"Sai do app do aluno"| D3A["Vai para apps/web<br/>(reaproveita a base)"]
    D3 -->|"Fica no mobile"| D3B["Exige guard por papel<br/>via @aura/authz"]
    D4{"Login social"}
    D4 -->|"Google + Apple"| D4A["Keycloak com kc_idp_hint<br/>Apple exigido pela App Store"]
    D4 -->|"Só e-mail e senha"| D4B["Fluxo PKCE via browser<br/>sem tela nativa de senha"]
```

---

## 9. Plano recomendado

Priorização qualitativa (impacto contra esforço, avaliação deste relatório, não medida):

```mermaid
quadrantChart
    title Prioridade das ações
    x-axis "Menor esforço" --> "Maior esforço"
    y-axis "Menor impacto" --> "Maior impacto"
    quadrant-1 "Planejar"
    quadrant-2 "Fazer primeiro"
    quadrant-3 "Fazer se sobrar tempo"
    quadrant-4 "Evitar ou adiar"
    "Remover Admin do signup": [0.08, 0.72]
    "Trocar fallback students[0]": [0.12, 0.6]
    "Corrigir faint e danger": [0.15, 0.55]
    "packages/ui-tokens": [0.35, 0.8]
    "Schemas em Zod 3": [0.3, 0.65]
    "Guards de rota e papel": [0.5, 0.95]
    "Auth PKCE Keycloak": [0.7, 0.9]
    "Camada de dados Orval": [0.72, 0.8]
    "Remover NativeWind": [0.9, 0.5]
    "Testes Jest MSW": [0.6, 0.7]
```

Ordem sugerida:

1. **Verificação básica.** Rodar `npm ci`, `npm run typecheck` e `npm run lint` (o que ninguém conseguiu fazer), conferir as versões com `npx expo install --check` e `npm audit`.
2. **Correções rápidas no kit.** Remover "Admin" do signup, trocar o fallback `students[0]` por "não encontrado", corrigir `faint`, `danger` e `lineHeight`, alinhar o `loginSchema` ao rótulo do campo.
3. **Decisões da seção 8.**
4. **`packages/ui-tokens` e schemas em Zod 3.**
5. **Fundação do `apps/web`**, seguindo a ordem da seção 6.3.
6. **Só então o mobile do aluno**: auth, guards, dados e testes.

Conforme o `CLAUDE.md`, o fluxo passa por `superpowers:brainstorming` e `superpowers:writing-plans`, com os agentes `architect`, `ui-designer`, `frontend-web` e `frontend-mobile`. Antes de declarar qualquer parte concluída, `qa` e `security` revisam a mudança.

---

## 10. Cobertura e limites da análise

| Agente | Leu por completo | Só grep ou cabeçalho |
|---|---|---|
| frontend-mobile | `package.json`, layouts, login, `secureStorage`, `mockData` (via grep de uso) | demais telas |
| ui-designer | `tokens.ts`, `tailwind.config.js`, `global.css`, Button, Input, Checkbox, Avatar, Icon, Logo, AuthBackground, README de marca | DataTable, Toast, Switch, Chip, Stepper, Tabs, LineChart, KPICard, PlanCard e outros componentes; navegação; telas; `mockData` |
| security | `secureStorage`, `openExternalUrl`, `validation`, `legalDocs`, `app.json`, `vercel.json`, `_headers`, `index.html`, layouts, login, select-role | as demais telas (grep por padrões sensíveis) |
| qa | `validation`, `secureStorage`, `openExternalUrl`, `legalDocs`, `dashboardNav`, `useResponsive`, layouts, login, signup, forgot-password, select-role, students/new e [id], chat, Button, Checkbox | demais telas e componentes |
| frontend-web | dashboard (`home`, `students/*`, `finance`) e todos os componentes | `profile`, `exercises/index`, `permissions`; não leu `app/(auth)`, `app/(app)`, `mockData`, `legalDocs` |

Limites que valem para o relatório inteiro:

- Não foi executado nenhum comando de build, typecheck, lint ou teste.
- Nada foi testado em iOS, Android ou navegador. O duplo toggle do checkbox de termos precisa de confirmação em dispositivo.
- As versões `expo 57`, `react-native 0.86`, `typescript 6` e `zod 4` não puderam ser confirmadas por conhecimento próprio dos agentes. Elas constam do `package-lock.json`, mas devem ser checadas no registry.
- Razões de contraste foram calculadas, não medidas em tela.
- As estimativas de esforço são grosseiras e assumem 1 dev experiente.
- Os agentes foram interrompidos uma vez pelo encerramento da sessão anterior; quatro deles foram retomados a partir dos transcripts salvos e entregaram relatório final.
