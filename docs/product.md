# PROJETO AURA-FIT — Documento de Escopo

> Documento-fonte de escopo do projeto **aura-fit**, um SaaS de gestão para
> Personal Trainers e Consultoria Online de Fitness. Serve de base para a
> criação de specs em `.kiro/specs/`. Cada módulo/serviço descrito aqui vira
> uma ou mais specs próprias.
>
> Inspiração de negócio: Master Training App (MTApp).

---

## 1. Visão Geral

O aura-fit é uma plataforma multi-tenant que permite ao personal trainer gerir
alunos, prescrever treinos, cobrar assinaturas e usar IA para acelerar a
prescrição. O produto tem três pilares:

1. **Gestão e Prescrição de Treinos** — dashboard web para o personal e app
   mobile para o aluno.
2. **Infraestrutura Financeira SaaS** — cobrança recorrente via Stripe (planos,
   assinaturas, webhooks, portal do cliente).
3. **Camada Nativa de IA** — automação de prescrição e assistência ao personal
   via agentes (framework agno).

### Personas
- **Personal Trainer (tenant)** — cria e gere alunos, monta treinos, define
  metodologia, acompanha evolução, gere a própria assinatura no SaaS.
- **Aluno (usuário do tenant)** — consome treinos no app, registra cargas/reps,
  usa cronômetro de descanso, conversa com o personal.
- **Admin da plataforma** — gestão de planos SaaS, base global de exercícios,
  observabilidade.

---

## 2. Arquitetura — Microsserviços

O sistema é composto por serviços com **responsabilidade única**, comunicando-se
principalmente por **REST síncrono**. Comunicação **assíncrona** (filas) é usada
apenas para trabalho em background e propagação de eventos, tendo o **Redis**
como broker (via RQ/arq/Celery). Não há broker dedicado (RabbitMQ/Kafka) nesta
fase — é um ponto de evolução caso o volume de eventos justifique.

> A definição detalhada de fronteiras, contratos, comunicação e estrutura de
> pastas está na skill **`microservices-architecture`**
> (`.kiro/skills/microservices-architecture/SKILL.md`). Este documento descreve
> o *o quê*; a skill descreve o *como*.

### 2.1 Serviços (fronteiras grossas por capacidade de negócio)

| Serviço | Responsabilidade | Database próprio |
|---|---|---|
| `identity-service` | Autenticação, autorização, tenants (personais), usuários (alunos), sessões, RBAC | `aura_identity` |
| `training-service` | Alunos, anamnese, treinos, exercícios do tenant, logs de execução, cálculo de volume | `aura_training` |
| `billing-service` | Integração Stripe: planos SaaS, assinaturas, webhooks, travas de limite | `aura_billing` |
| `ai-service` | Agentes agno, prompt-to-workout, RAG de metodologia, embeddings | `aura_ai` |
| `media-service` | Upload de mídia (fotos de evolução, vídeos de exercício), signed URLs S3 | `aura_media` |

- **Borda:** um **BFF/API Gateway** expõe uma API unificada ao frontend e
  roteia para os serviços internos. Autenticação validada na borda.
- **Regra de dados:** um container PostgreSQL, **um database por serviço**.
  **Nenhuma foreign key cruza fronteira de serviço.** Referências entre serviços
  guardam apenas o ID (ex.: `training` guarda `tenant_id`/`student_user_id`
  emitidos pelo `identity`).
- **Base global de exercícios** (`ExerciseBase`, `MuscleGroup`): pertence ao
  `training-service` como dado de domínio compartilhado somente-leitura entre
  tenants.

### 2.2 Comunicação
- **Síncrona (principal):** REST/HTTP entre serviços e do BFF para os serviços.
  Contratos versionados (`/api/v1/...`). Timeouts explícitos, retry com backoff.
- **Assíncrona (filas):** Redis como broker para tarefas em background:
  - Recalcular volume semanal por grupo muscular após mutação de treino.
  - Processar webhooks Stripe fora do ciclo request/response.
  - Gerar embeddings de metodologia no `ai-service`.
  - Processar upload/transcodificação de mídia.
- **Eventos de domínio:** publicados em filas Redis; consumidores idempotentes.

---

## 3. Stack Tecnológica

### Backend (cada serviço)
- **Python 3.11+**, **FastAPI**, arquitetura limpa (camadas domínio /
  aplicação / infra / interface).
- **SQLAlchemy 2.0** (`Mapped` / `mapped_column`) + **Alembic** por serviço
  (migrações isoladas por database).
- **PostgreSQL** como banco principal; **pgvector** habilitado para o
  `ai-service` (embeddings/RAG).
- **Redis** para cache e como broker de filas.
- **AWS Lambda Powertools** (Logger, Tracer, Metrics) para observabilidade.

### IA (ai-service)
- **agno** como framework de agentes (Agent, Team, Workflow, Tools).
- **AgentOS (agentos)** como runtime/servidor dos agentes.
- **Ollama** como provider de LLM **local em desenvolvimento**.
- **Provider de LLM atrás de um adapter** (design pattern Adapter/Port) para
  trocar Ollama ↔ Bedrock ↔ outro provider sem alterar a lógica de agente.
  Provider de produção **em análise** (Bedrock é candidato — ver steering
  `07-agentes-agno.md`).
- **pgvector** como vector store para RAG (metodologias do personal, base de
  exercícios).
- **Langfuse** para observabilidade/tracing das execuções de LLM.

### Observabilidade
- **OpenTelemetry (OTel Collector)** para traces/metrics/logs dos serviços.
- **Langfuse** especificamente para o ciclo de vida das chamadas de LLM.
- Logs estruturados JSON com `correlation_id` propagado entre serviços.

### Gateway de Pagamento
- **Stripe API** — assinaturas, webhooks, portal do cliente.

### Frontend (multiplataforma)
- **React Native + Expo** (Expo Router) em **TypeScript**.
- **NativeWind** (Tailwind) para UI unificada Web / Android / iOS.

### Orquestração local
- **Docker Compose** entrega: `postgres` (com pgvector), `redis`,
  `otel-collector`, `ollama`, `agentos`, `langfuse`.

---

## 4. Regras de Modelagem de Banco (Primary Keys)

Estratégia híbrida de PKs, aplicada **dentro do database de cada serviço**:

- **Tabelas de alta escala (transacionais):** `UUIDv4` (gerado no PostgreSQL via
  `gen_random_uuid()` ou no `server_default`).
  - Ex.: `User`, `Student`, `Workout`, `ExerciseLog`, `AIMetrics`,
    `PaymentTransaction`.
- **Tabelas de configuração (baixo volume/domínio):** inteiro sequencial
  (`BigInteger` / Identity).
  - Ex.: `SaaSPlan`, `ExerciseBase`, `MuscleGroup`.

Multi-tenancy: isolamento rígido por `tenant_id` (ID do personal) em toda tabela
transacional. `tenant_id` é emitido pelo `identity-service` e propagado.

---

## 5. Módulos Funcionais

### Módulo 1 — Core de Treinos & Alunos (`training-service` + frontend)
- Multi-tenant com isolamento rígido por `tenant_id`.
- **Web (personal):** painel desktop — tabelas densas, gráficos de evolução,
  gestor de anamnese, upload de fotos via signed URLs (delegado ao
  `media-service`).
- **Mobile (aluno):** lista fluida de exercícios, anotação de cargas/reps,
  cronômetro de descanso em segundo plano (nativo) com fallback web.
- **Presets de treino** e **cálculo assíncrono de volume semanal** por grupo
  muscular, disparado por fila sempre que o plano sofrer mutação.
- Base global de exercícios com vídeos de execução.

### Módulo 2 — Motor de IA (`ai-service`)
- **Prompt-to-Workout via streaming (SSE):** geração do treino pela LLM em tempo
  real; payload final é JSON estruturado validado por Pydantic para persistir no
  `training-service`.
- **IA contextual por estilo:** injeta como few-shot as metodologias/histórico
  do personal (recuperados via RAG/pgvector) para personalizar o estilo.
- **Agentes agno** rodando em AgentOS; provider de LLM via adapter.
- **Guardrails e validação** de entrada/saída dos agentes; nunca confiar em
  dado bruto do modelo antes de persistir.

### Módulo 3 — Infraestrutura SaaS & Stripe (`billing-service`)
- Planos SaaS (Starter, Pro, Master) com **travas dinâmicas** por limite de
  alunos ativos e de requisições mensais de IA.
- **Webhooks seguros** `/api/v1/webhooks/stripe` (assíncrono) para
  `customer.subscription.deleted`, `invoice.payment_succeeded`,
  `invoice.payment_failed` — automatizando ativação, aviso de inadimplência e
  bloqueio de acesso.
- Verificação de assinatura de webhook; processamento idempotente via fila.

### Módulo 4 — Identidade & Acesso (`identity-service`)
- Cadastro/login de personais e alunos, emissão e validação de tokens.
- RBAC (personal, aluno, admin) e isolamento de tenant.
- Fonte de verdade de `tenant_id` e `user_id`.

### Módulo 5 — Mídia (`media-service`)
- Signed URLs pré-assinadas para upload/download S3 (fotos, vídeos).
- Processamento assíncrono de mídia (validação, thumbnails).

---

## 6. Entregáveis de Planejamento (a gerar como specs)

Cada item vira uma spec numerada em `.kiro/specs/` (ver steering
`14-nomenclatura-specs.md`). Ordem sugerida de execução:

1. **Setup de infra local** — docker-compose (postgres+pgvector, redis, otel,
   ollama, agentos, langfuse) e esqueleto do monorepo de APIs.
2. **`identity-service`** — modelos, auth, tenants, RBAC, migrações Alembic.
3. **`training-service`** — alunos, anamnese, treinos, exercícios, logs, volume.
4. **`billing-service`** — Stripe SDK, planos, assinaturas, webhooks, travas.
5. **`ai-service`** — agno + agentos, adapter de LLM, RAG/pgvector, SSE,
   Langfuse.
6. **`media-service`** — signed URLs S3, processamento assíncrono.
7. **BFF/API Gateway** — API unificada e roteamento.
8. **Frontend** — Expo Router + NativeWind (web + mobile), telas responsivas.

Artefatos técnicos de referência (podem virar docs em `docs/`):
- `ARCHITECTURE.md` — diretórios, modelagem SQLAlchemy 2.0 + Pydantic, config
  Alembic por serviço, estratégias NativeWind (flex-col mobile → flex-row web).
- `ROADMAP.md` — sprints seguindo a ordem das specs acima.

---

## 7. Trade-offs e Riscos Assumidos (explícitos)

- **Microsserviços em estágio inicial** aumentam custo operacional (deploy,
  consistência distribuída, sagas). Mitigação: fronteiras grossas (5 serviços),
  não um serviço por entidade.
- **Redis como broker** é pragmático, mas tem garantias mais fracas que um
  broker dedicado. Reavaliar (RabbitMQ/Kafka/NATS) se o volume de eventos ou a
  necessidade de entrega garantida crescer.
- **Um Postgres com database por serviço** facilita dev, mas não é isolamento
  físico real. Migrar para instâncias separadas ao escalar.
- **Provider de LLM em análise para produção.** O adapter mitiga o lock-in;
  validar custo/latência de Ollama self-hosted vs Bedrock antes de fixar.
- **Consistência entre serviços é eventual** onde houver fila. Handlers devem
  ser idempotentes e tolerar reprocessamento.
