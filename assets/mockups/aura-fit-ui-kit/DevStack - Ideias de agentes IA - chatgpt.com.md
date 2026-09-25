---
title: "DevStack - Ideias de agentes IA"
source: "ChatGPT"
url: "https://chatgpt.com/g/g-p-6aace518b78481919781ee5ef1c81284/c/6aacdaa5-63d0-83e9-8e2c-c3f1ae0f81a1"
date_saved: "2026-09-18T11:22:54.867Z"
word_count: "6825"
reading_time: "35 min"
description: "Use o ChatGPT para responder a perguntas, escrever, criar imagens, realizar tarefas e programar — tudo em um só lugar. Comece gratuitamente ou baixe o aplicativo."
---

# DevStack - Ideias de agentes IA

Processou por alguns segundos

Sim. Pelo que já conheço do seu perfil, eu não criaria simplesmente um “agente ChatGPT pessoal”. Você tem **vários fluxos recorrentes de desenvolvimento, AWS, IA, QA, documentação e pesquisa** que podem virar uma pequena “equipe de agentes” trabalhando em conjunto.

Inclusive, para construir esses agentes, você pode usar o plugin **OpenAI Developers** para boas práticas de agentes/MCP e o **Superpowers** para planejamento, desenvolvimento e debugging de código.

## 🧠 Eu montaria uma "AI Engineering Team" para você

A ideia seria ter um **Agente Orquestrador** que recebe algo como:

> “Quero criar uma API para gerenciamento de exercícios.”

E automaticamente chama outros agentes:

```markdown
┌──────────────────┐
                 │   ORQUESTRADOR   │
                 │     "Allan AI"   │
                 └────────┬─────────┘
                          │
     ┌────────────┬───────┼────────┬────────────┐
     ▼            ▼       ▼        ▼            ▼
🏗 Arquiteto   💻 Dev    🧪 QA    ☁️ AWS    📚 Research
     │            │       │        │            │
     └────────────┴───────┼────────┴────────────┘
                          ▼
                    📋 Reviewer
                          │
                          ▼
                    🚀 Deploy
```

E eu vejo **uns 15 agentes muito interessantes para o seu caso**.

---

## 1. 🧠 Agente "CTO pessoal"

Esse provavelmente seria o primeiro que eu criaria.

Você joga uma ideia:

> "Quero transformar meu sistema atual em multi-tenant."

Ele analisa:

-   arquitetura atual

-   código

-   banco

-   AWS

-   autenticação

-   custos

-   segurança

-   impacto nos módulos

-   riscos

-   plano de implementação


E produz:

```markdown
Objetivo
↓
Arquitetura proposta
↓
Alterações necessárias
↓
Impacto no banco
↓
Impacto na API
↓
Impacto no frontend
↓
Infraestrutura AWS
↓
Segurança
↓
Testes
↓
Plano de rollout
```

### Ferramentas

Ele poderia ter acesso a:

-   GitHub

-   filesystem

-   PostgreSQL

-   AWS

-   documentação

-   Jira/Linear

-   Notion


Esse agente seria o **cérebro central**.

---

## 2. 👨💻 Agente "Senior Developer"

Esse combina muito com seu trabalho.

Você fala:

> "Preciso adicionar Swagger nesse módulo."

O agente:

1.  encontra os controllers

2.  encontra DTOs

3.  entende os endpoints

4.  identifica parâmetros

5.  adiciona `@ApiOperation`

6.  adiciona `@ApiProperty`

7.  verifica responses

8.  executa lint

9.  executa testes

10.  mostra diff


Especialmente útil para seu stack:

```markdown
NestJS
TypeScript
MikroORM
PostgreSQL
AWS Lambda
API Gateway
Cognito
S3
Terraform
```

Você poderia literalmente pedir:

> "Implemente essa feature."

E receber:

```markdown
✓ Código alterado
✓ Testes criados
✓ Swagger atualizado
✓ Migration criada
✓ Lint executado
✓ Typecheck executado
✓ Security review
```

---

## 3. 🧪 Agente QA Autônomo

Esse eu considero **muito alinhado ao que você já estava procurando**.

Em vez de simplesmente gerar testes unitários, ele faria:

### Functional testing

```markdown
API
├── happy path
├── edge cases
├── invalid payload
├── authorization
└── concurrency
```

### Security

```markdown
JWT
RBAC
IDOR
SQL injection
XSS
CSRF
rate limiting
privilege escalation
```

### API

```markdown
GET
POST
PUT
PATCH
DELETE
```

### Frontend

```markdown
navigation
forms
validation
responsive
accessibility
error states
```

E depois produziria:

```markdown
QA REPORT

Critical: 1
High: 3
Medium: 7
Low: 4

🔴 POST /users
   IDOR vulnerability

🟠 GET /reports
   Missing authorization check
```

---

## 4. 🔐 Security Agent

Separaria segurança do QA.

Esse agente faria uma espécie de **AppSec automatizado**.

Ele analisaria:

-   código

-   Terraform

-   Docker

-   IAM

-   Cognito

-   API Gateway

-   Lambda

-   S3

-   CloudFront

-   Secrets

-   dependências


E poderia responder:

> "Encontrei um bucket S3 que pode permitir acesso público."

ou:

> "Essa Lambda possui permissões maiores do que precisa."

ou:

> "Esse endpoint permite acesso a recursos de outro usuário."

---

## 5. ☁️ AWS Architect Agent

Esse pode economizar bastante tempo para você.

Você pergunta:

> "Preciso processar 10 milhões de mensagens por dia."

Ele monta:

```markdown
SQS
 ↓
Lambda
 ↓
Step Functions
 ↓
DynamoDB
 ↓
S3
 ↓
CloudFront
```

E calcula:

-   arquitetura

-   custos

-   limites

-   throttling

-   retries

-   DLQ

-   observabilidade

-   IAM

-   escalabilidade


Principalmente interessante porque você trabalha bastante com:

**Lambda + API Gateway + SQS + Step Functions + S3 + CloudFront + Cognito + Bedrock.**

---

## 6. 💰 AWS Cost Agent

Esse seria muito útil.

Você poderia perguntar:

> "Quanto vai custar essa arquitetura?"

O agente analisaria:

```markdown
Lambda
API Gateway
SQS
RDS
S3
CloudFront
Bedrock
CloudWatch
SNS
NAT Gateway
```

E produziria:

```markdown
Estimated monthly cost

Lambda          $XX
API Gateway     $XX
RDS             $XX
S3              $XX
CloudFront      $XX
Bedrock         $XX

TOTAL           $XXX/month
```

E ainda:

> "Se trocar NAT Gateway por VPC Endpoint, a estimativa cai..."

---

## 7. 🤖 Bedrock / AI Agent Architect

Como você está trabalhando com agentes, eu criaria um agente especializado **em criar agentes**.

Você fornece:

> "Preciso de um agente que encontre documentos e gere exercícios."

Ele decide:

```markdown
Agent
├── Tools
├── Knowledge Base
├── Memory
├── Guardrails
├── MCP
├── Prompt
├── Model
└── Evaluation
```

E gera:

-   arquitetura

-   prompt

-   tools

-   schemas

-   workflows

-   código

-   testes


Seria praticamente seu **AI Solutions Architect**.

---

## 8. 🔎 Research Agent

Esse seria excelente para tarefas que hoje você provavelmente faz manualmente.

Exemplo:

> "Quero saber quais ferramentas de QA com IA existem."

Ele pesquisa:

```markdown
GitHub
Reddit
Product Hunt
documentação
papers
blogs
reviews
```

E entrega:

| Ferramenta | API | Frontend | Security | AI | Self-host |
| --- | --- | --- | --- | --- | --- |
| A | ✓ | ✓ | ✓ | ✓ | ✓ |
| B | ✓ | ✓ | — | ✓ | — |

E principalmente:

**fontes + evidências + limitações.**

---

## 9. 📚 Documentation Agent

Esse eu colocaria rodando continuamente.

Ele observa seu código e mantém:

```markdown
README
API docs
Swagger
Architecture docs
ADR
Runbooks
Deployment docs
Environment variables
```

atualizados.

Exemplo:

Você altera:

```markdown
POST /users
```

O agente percebe que mudou e atualiza automaticamente:

```markdown
Swagger
README
API documentation
changelog
```

---

## 10. 📝 "Meeting → Tasks" Agent

Se você usa reuniões, esse pode ser muito bom.

Entrada:

```markdown
transcrição da reunião
```

Saída:

```markdown
Decisões

✓ Migrar autenticação
✓ Criar endpoint X

Tasks

[ ] Backend
[ ] Frontend
[ ] Infrastructure
[ ] QA

Pendências

?
```

E poderia criar automaticamente issues no seu sistema.

---

## 11. 🐛 Incident / SRE Agent

Esse seria integrado ao seu ambiente AWS + observabilidade.

Imagine:

```markdown
CloudWatch
     +
Sentry
     +
Lambda
     +
API Gateway
     ↓
SRE Agent
```

E ele detecta:

> "A taxa de 500 aumentou 340% nos últimos 20 minutos."

Depois:

```markdown
Investigação
↓
Logs
↓
Stack traces
↓
Deploy recente
↓
Commit relacionado
↓
Hipótese
↓
Correção sugerida
```

Com Sentry conectado, isso fica ainda mais interessante.

---

## 12. 🚀 DevOps Agent

Você poderia dizer:

> "Faça deploy da versão atual."

Ele poderia:

```markdown
git status
↓
test
↓
lint
↓
build
↓
docker build
↓
security scan
↓
push
↓
deploy
↓
health check
↓
monitor
```

E se falhar:

```markdown
Deploy FAILED

Reason:
Container health check failed.

Likely cause:
Environment variable missing.

Suggested fix:
...
```

---

## 13. 🏗️ Terraform Agent

Outro que combina muito com seu trabalho.

Você:

> "Preciso de uma API Gateway + Lambda + Cognito + CloudWatch."

Ele gera:

```markdown
terraform/
├── modules/
│   ├── lambda
│   ├── api-gateway
│   ├── cognito
│   └── monitoring
│
├── environments/
│   ├── dev
│   ├── staging
│   └── prod
```

E ainda faz:

```markdown
terraform validate
terraform plan
security analysis
cost analysis
```

---

## 14. 📊 Power BI / Data Agent

Pelo seu interesse em tornar Power BI mais acessível para usuários não técnicos, eu criaria um agente especificamente para isso.

Usuário:

> "Quero saber quanto vendemos em Brasília no último trimestre."

Agente:

```markdown
interpreta pergunta
       ↓
descobre dataset
       ↓
identifica medidas
       ↓
gera consulta
       ↓
executa
       ↓
explica resultado
```

E poderia responder:

> "O relatório correto é X."

Isso pode virar inclusive **um produto**.

---

## 15. 🏋️ Exercise Content Agent

Esse conversa diretamente com o produto que você estava desenhando.

Imagine cadastrar:

> "Agachamento búlgaro."

O agente automaticamente busca:

```markdown
Agachamento búlgaro
│
├── descrição
├── músculos
├── execução
├── erros comuns
├── contraindicações
├── progressões
├── regressões
├── nível
├── equipamentos
├── volume recomendado
├── artigos científicos
├── referências
└── vídeo demonstrativo
```

E depois outro agente revisa o conteúdo.

Você poderia ter:

```markdown
Research Agent
       ↓
Exercise Agent
       ↓
Scientific Reviewer
       ↓
Video Agent
       ↓
Content Editor
       ↓
QA
       ↓
Publish
```

Isso é praticamente uma **linha de produção de conteúdo baseada em IA**.

---

## ⭐ Mas eu faria algo ainda mais interessante

Em vez de 15 agentes independentes, criaria uma arquitetura de **Agentes Especialistas + Orquestrador**.

## Seu "AI Operating System"

```markdown
┌─────────────────────┐
                      │    ORCHESTRATOR      │
                      │                     │
                      │  Intent + Planning  │
                      └──────────┬──────────┘
                                 │
       ┌─────────────────────────┼──────────────────────────┐
       │                         │                          │
       ▼                         ▼                          ▼
  DEVELOPMENT                INFRASTRUCTURE             KNOWLEDGE
       │                         │                          │
 ┌─────┼─────┐             ┌─────┼─────┐             ┌─────┼─────┐
 ▼     ▼     ▼             ▼     ▼     ▼             ▼     ▼     ▼
Dev    QA  Security       AWS Terraform SRE       Research Docs  Data
```

E o grande diferencial:

### Todos compartilhariam um contexto comum.

Por exemplo:

```markdown
Project
├── architecture
├── repository
├── database
├── infrastructure
├── requirements
├── decisions
├── tests
├── incidents
└── documentation
```

Então o QA sabe o que o Dev fez.

O AWS Agent sabe qual arquitetura o Architect definiu.

O Security Agent sabe quais endpoints existem.

O Documentation Agent sabe quais mudanças aconteceram.

---

## 🔥 E tem uma ideia que acho particularmente interessante para você

## "AI Developer Command Center"

Uma interface única:

```markdown
╭─────────────────────────────────────────────╮
│             ALLAN AI COMMAND CENTER         │
├─────────────────────────────────────────────┤
│                                             │
│  What do you want to do?                    │
│                                             │
│  > Implement feature X                      │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  🤖 Planning                                │
│  ████████████████░░░ 80%                    │
│                                             │
│  ✓ Architecture                             │
│  ✓ Database                                 │
│  ✓ Backend                                  │
│  ◉ QA                                       │
│  ○ Security                                 │
│  ○ Deploy                                   │
│                                             │
╰─────────────────────────────────────────────╯
```

Você fala naturalmente:

> **"Adicione autenticação Google nessa API."**

E ele transforma isso em um workflow:

```markdown
UNDERSTAND
    ↓
PLAN
    ↓
ARCHITECT
    ↓
CODE
    ↓
TEST
    ↓
SECURITY
    ↓
REVIEW
    ↓
DEPLOY
    ↓
MONITOR
```

Isso seria muito mais poderoso para você do que simplesmente ter vários bots separados.

### Stack que eu usaria no seu caso

```markdown
Frontend
React / Next.js
        │
        ▼
Orchestrator
Agno / LangGraph
        │
 ┌──────┼────────┐
 ▼      ▼        ▼
Agents  MCP      Tools
        │
        ├── GitHub
        ├── AWS
        ├── PostgreSQL
        ├── Sentry
        ├── Notion
        ├── Filesystem
        └── Browser
```

E eu faria **human-in-the-loop** para ações perigosas:

```markdown
Agent wants to deploy production

        ↓

⚠️ APPROVAL REQUIRED

Changes:
- 4 Lambda functions
- 1 database migration
- 2 IAM policies

[ APPROVE ] [ REJECT ]
```

Assim você mantém o controle enquanto deixa a IA fazer o trabalho pesado.

## Se fosse para começar amanhã

Eu priorizaria esta sequência:

**1\. Orchestrator** → cérebro
**2\. Developer Agent** → escreve/modifica código
**3\. QA Agent** → testa
**4\. Security Agent** → audita
**5\. AWS Agent** → infraestrutura/custos
**6\. SRE Agent** → produção/incidentes
**7\. Documentation Agent** → mantém tudo documentado

Isso já formaria uma espécie de **"time de engenharia virtual" trabalhando ao seu lado**, em vez de apenas um chatbot respondendo perguntas.

Neste sentido para ambiente de desenvolvimento, seria viável fazer essa estrutura utilizando o claude code?

Sim — **para o seu ambiente de desenvolvimento, Claude Code é provavelmente uma das formas mais práticas de começar essa arquitetura**.

E eu faria uma pequena mudança em relação ao desenho anterior: **não criaria inicialmente uma aplicação de orquestração própria**. Aproveitaria o Claude Code como o agente principal e usaria **subagentes + MCP + hooks + arquivos de contexto** para montar sua "equipe virtual".

A documentação atual da Anthropic inclusive descreve orquestração de subagentes para tarefas que se beneficiam de contexto isolado ou execução paralela.

![](https://www.google.com/s2/favicons?domain=https://docs.anthropic.com&sz=128)
*Claude Platform Docs*
![](https://www.google.com/s2/favicons?domain=https://docs.anthropic.com&sz=128)

Claude Platform Docs

## Como eu montaria no seu caso

```markdown
CLAUDE CODE
                      │
               ┌──────▼──────┐
               │ ORCHESTRATOR│
               │   /planner  │
               └──────┬──────┘
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                 │
    ▼                 ▼                 ▼
DEVELOPER            QA              SECURITY
    │                 │                 │
    ▼                 ▼                 ▼
ARCHITECT           TESTER           APSEC
    │
    └─────────────────┬─────────────────┐
                      │                 │
                      ▼                 ▼
                    AWS              REVIEWER
```

O interessante é que **você não precisa construir esses agentes como aplicações separadas**.

Eles podem ser especializações dentro do próprio projeto.

---

## 1. Estrutura que eu criaria

Por exemplo:

```markdown
meu-projeto/
│
├── .claude/
│   │
│   ├── CLAUDE.md
│   │
│   ├── agents/
│   │   ├── architect.md
│   │   ├── developer.md
│   │   ├── qa.md
│   │   ├── security.md
│   │   ├── aws.md
│   │   ├── reviewer.md
│   │   └── documentation.md
│   │
│   ├── commands/
│   │   ├── feature.md
│   │   ├── review.md
│   │   ├── security.md
│   │   ├── qa.md
│   │   └── deploy.md
│   │
│   └── settings.json
│
├── docs/
│   ├── architecture/
│   ├── decisions/
│   └── runbooks/
│
├── src/
│
└── tests/
```

O `CLAUDE.md` seria praticamente o **manual da sua equipe de engenharia**.

---

## 2. O CLAUDE.md seria extremamente importante

Eu colocaria nele coisas como:

```markdown
# Engineering Guidelines

## Stack

- NestJS 10
- TypeScript 5
- Node.js ES2021
- PostgreSQL
- MikroORM 6
- AWS Lambda
- API Gateway
- Cognito
- S3
- Terraform

## Architecture

- Controllers must remain thin
- Business logic belongs in services
- DTOs must use validation decorators
- Swagger decorators are mandatory
- Database access must use repositories

## Security

- All protected routes require AuthGuard
- Authorization must be explicit
- Never expose Cognito tokens
- Never log secrets

## Testing

Before considering a task complete:

1. lint
2. typecheck
3. unit tests
4. integration tests
5. security review

## Git

Never commit automatically unless explicitly requested.
Never deploy production without approval.
```

Isso é muito poderoso porque o Claude passa a trabalhar com **as regras específicas do seu ambiente**, em vez de você repetir tudo a cada conversa.

---

## 3. Developer Agent

Você poderia ter:

```markdown
.claude/agents/developer.md
```

Com algo como:

```markdown
# Developer Agent

You are a senior TypeScript/NestJS developer.

Responsibilities:

- Understand existing architecture before modifying code.
- Follow project conventions.
- Avoid unnecessary abstractions.
- Reuse existing services.
- Add tests for behavioral changes.
- Update Swagger decorators.
- Run typecheck and lint after modifications.

Never modify code before inspecting the relevant files.
```

Isso se encaixa muito bem com a orientação da Anthropic de investigar o código antes de fazer afirmações ou alterações.

![](https://www.google.com/s2/favicons?domain=https://docs.anthropic.com&sz=128)
*Claude Platform Docs*
![](https://www.google.com/s2/favicons?domain=https://docs.anthropic.com&sz=128)

Claude Platform Docs

---

## 4. QA Agent

Esse eu faria bastante sofisticado.

```markdown
.claude/agents/qa.md
```

Ele receberia:

```markdown
feature
+
requirements
+
implementation
```

e verificaria:

```markdown
Functional
├── happy path
├── edge cases
├── validation
└── error handling

Security
├── authentication
├── authorization
├── IDOR
├── injection
└── privilege escalation

API
├── status codes
├── contracts
├── pagination
└── response schema

Regression
└── existing tests
```

E o principal:

**ele não deveria simplesmente confiar nos testes escritos pelo Developer.**

Ele deve tentar **quebrar a implementação**.

---

## 5. Security Agent

Aqui eu adicionaria acesso a ferramentas externas via MCP.

Por exemplo:

```markdown
Claude Code
     │
     ├── GitHub MCP
     ├── AWS MCP
     ├── PostgreSQL MCP
     ├── Sentry MCP
     └── Security tools
```

O Claude Code pode trabalhar com MCP para acessar ferramentas e serviços externos; a própria plataforma Anthropic documenta MCP e seus mecanismos de integração.

![](https://www.google.com/s2/favicons?domain=https://docs.anthropic.com&sz=128)
*Claude Platform Docs*
![](https://www.google.com/s2/favicons?domain=https://docs.anthropic.com&sz=128)

Claude Platform Docs

Assim o Security Agent poderia, por exemplo:

```markdown
"Analise essa API."

       ↓

Código
       ↓
Terraform
       ↓
IAM
       ↓
Cognito
       ↓
API Gateway
       ↓
Banco
       ↓
Sentry
```

---

## 6. AWS Agent

No seu caso, eu daria uma especialização enorme para AWS.

Ele poderia verificar:

```markdown
AWS Agent

├── Lambda
├── API Gateway
├── Cognito
├── SQS
├── Step Functions
├── S3
├── CloudFront
├── RDS
├── IAM
├── CloudWatch
└── Terraform
```

E responder coisas como:

> "Essa implementação está adequada para Lambda?"

ou:

> "Revise minha infraestrutura Terraform."

ou:

> "Existe alguma permissão IAM excessiva?"

---

## 7. Reviewer Agent

Esse é importante porque cria uma espécie de **segunda opinião automática**.

Fluxo:

```markdown
Developer
    ↓
implementação
    ↓
Reviewer
    ↓
QA
    ↓
Security
```

O Reviewer poderia verificar:

-   arquitetura

-   legibilidade

-   complexidade

-   duplicação

-   padrões

-   segurança

-   testes

-   performance

-   compatibilidade


---

## 8. E aqui fica MUITO interessante

Você poderia trabalhar normalmente:

```markdown
claude
> Implemente autenticação para esse módulo.
```

Claude Code poderia planejar:

```markdown
PLAN

1. Inspect authentication architecture
2. Inspect Cognito configuration
3. Inspect guards
4. Inspect existing users module
5. Implement changes
6. Add tests
7. Run QA
8. Run security review
```

E então delegar partes.

A própria documentação da Anthropic descreve justamente o uso de subagentes quando existem tarefas independentes, contexto isolado ou possibilidade de paralelização.

![](https://www.google.com/s2/favicons?domain=https://docs.anthropic.com&sz=128)
*Claude Platform Docs*
![](https://www.google.com/s2/favicons?domain=https://docs.anthropic.com&sz=128)

Claude Platform Docs

---

## 9. Você pode ir além: agentes por "papel"

Eu criaria:

```markdown
.claude/agents/

architect.md
developer.md
frontend.md
backend.md
database.md
aws.md
terraform.md
qa.md
security.md
performance.md
reviewer.md
documentation.md
sre.md
```

Mas **não faria todos serem usados sempre**.

O Orchestrator decidiria:

```markdown
Feature simples
→ Developer
→ QA

Feature complexa
→ Architect
→ Developer
→ QA
→ Security
→ Reviewer

AWS change
→ Architect
→ AWS
→ Terraform
→ Security
→ Reviewer

Production incident
→ SRE
→ Developer
→ AWS
→ Reviewer
```

Isso evita gastar tokens criando uma "reunião de 12 agentes" para alterar uma linha.

A própria Anthropic recomenda controlar o uso de subagentes porque modelos mais recentes podem delegar com bastante facilidade.

![](https://www.google.com/s2/favicons?domain=https://docs.anthropic.com&sz=128)
*Claude Platform Docs*
![](https://www.google.com/s2/favicons?domain=https://docs.anthropic.com&sz=128)

Claude Platform Docs

---

## 10. MCP seria o "sistema nervoso"

Para você, eu considero isso ainda mais importante que os próprios agentes.

```markdown
CLAUDE CODE
               │
   ┌───────────┼───────────┐
   │           │           │
  MCP         MCP         MCP
   │           │           │
GitHub        AWS       Database
   │           │           │
Issues      Lambda       RDS
PRs         S3           SQL
Commits     IAM          Schema
```

Depois:

```markdown
MCP
├── GitHub
├── AWS
├── PostgreSQL
├── Sentry
├── Jira/Linear
├── Notion
└── Browser
```

Você deixa o Claude **agir sobre o ambiente**, não apenas conversar sobre ele.

---

## 11. Hooks entram como "guard rails"

Eu usaria hooks para impedir coisas perigosas.

Por exemplo:

```markdown
Claude tenta:

terraform apply
        ↓
HOOK
        ↓
Production?
        ↓
YES
        ↓
BLOCK
```

Ou:

```markdown
Claude modifica código
        ↓
hook
        ↓
eslint
        ↓
typecheck
        ↓
tests
```

Assim o agente não depende apenas de "lembrar" das regras.

---

## 12. Eu faria uma diferença entre DEV e PROD

Isso é fundamental.

### DEV

```markdown
Claude
  ↓
pode editar
  ↓
pode testar
  ↓
pode executar Docker
  ↓
pode consultar banco DEV
  ↓
pode executar Terraform plan
```

### STAGING

```markdown
Claude
  ↓
pode preparar
  ↓
pode testar
  ↓
pode fazer deploy
  ↓
health check
```

### PROD

```markdown
Claude
  ↓
prepare
  ↓
plan
  ↓
review
  ↓
ASK HUMAN
  ↓
approve
  ↓
deploy
```

**Eu não daria autonomia total para produção.**

---

## 13. E você pode ter um "Definition of Done" automático

Isso eu acho excelente para o seu perfil.

Sempre que você disser:

> "Terminei essa feature."

Claude executa:

```markdown
DEFINITION OF DONE

[ ] Requirements satisfied
[ ] Architecture reviewed
[ ] TypeScript passes
[ ] ESLint passes
[ ] Tests pass
[ ] Coverage acceptable
[ ] Swagger updated
[ ] Security reviewed
[ ] Database migration reviewed
[ ] Terraform reviewed
[ ] Documentation updated
[ ] Git diff reviewed
```

E retorna:

```markdown
╔══════════════════════════╗
║      FEATURE REVIEW      ║
╠══════════════════════════╣
║ Architecture      ✓      ║
║ Implementation    ✓      ║
║ Tests             ✓      ║
║ Security          ⚠      ║
║ Documentation     ✓      ║
╠══════════════════════════╣
║ STATUS: NEEDS FIX       ║
╚══════════════════════════╝
```

---

## 14. Onde eu NÃO usaria Claude Code

Aqui está a principal ressalva.

Eu usaria **Claude Code como agente de desenvolvimento**, não necessariamente como o cérebro de toda a sua operação empresarial.

Por exemplo:

```markdown
Claude Code
               │
      DEVELOPMENT AGENT
               │
 ┌─────────────┼─────────────┐
 ▼             ▼             ▼
Git           AWS           QA
```

Mas para coisas como:

-   monitoramento contínuo

-   jobs agendados

-   agentes 24/7

-   processamento de milhares de tarefas

-   workflows assíncronos

-   dashboards

-   memória persistente

-   filas

-   auditoria empresarial


eu começaria a separar:

```markdown
Claude Code
     ↓
desenvolvimento

Agno / LangGraph
     ↓
produção / workflows

MCP
     ↓
integrações
```

Ou seja:

### Claude Code = seu "engenheiro de software autônomo"

### Agno/LangGraph = sua "plataforma de agentes"

Essa separação é bastante saudável.

---

## 🚀 E eu faria isso no seu ambiente especificamente

Considerando seu stack, eu começaria assim:

```markdown
CLAUDE CODE
                   │
              ORCHESTRATOR
                   │
    ┌──────────────┼──────────────┐
    │              │              │
ARCHITECT       DEVELOPER        QA
    │              │              │
    └──────────────┼──────────────┘
                   │
               SECURITY
                   │
                 AWS
                   │
               REVIEWER
                   │
              DOCUMENTATION
```

Com:

```markdown
MCP
├── GitHub
├── AWS
├── PostgreSQL
├── Sentry
└── Browser
```

e:

```markdown
Hooks
├── lint
├── typecheck
├── tests
├── security
└── production approval
```

**Isso já seria uma primeira versão extremamente poderosa do seu "AI Development Team".**

E tem uma vantagem enorme: você pode começar **só com Claude Code + `.claude/agents` + `CLAUDE.md`**, sem construir plataforma nenhuma. Depois, conforme identificar quais tarefas realmente merecem automação, transforma as mais valiosas em MCP/Agno/workflows independentes.

Se eu estivesse montando isso para você, **o próximo passo seria desenhar a estrutura completa do `.claude/`**, incluindo `CLAUDE.md`, os 7–10 subagentes, comandos `/feature`, `/qa`, `/security`, `/review`, `/deploy`, hooks e a arquitetura MCP para AWS/GitHub/Postgres/Sentry. Isso já poderia virar um **template reutilizável para todos os seus projetos NestJS/AWS**.

Pensou por 16s

Sim. Eu estruturaria isso como um **framework pessoal de engenharia**, e não apenas como uma coleção de prompts.

A ideia é que você consiga copiar `.claude/` para qualquer projeto e o Claude Code passe a entender **como você desenvolve, como sua infraestrutura funciona, como testar, como revisar e quando pedir sua aprovação**.

## 1. Estrutura completa

Eu começaria com esta estrutura:

```markdown
.claude/
│
├── CLAUDE.md
│
├── agents/
│   ├── architect.md
│   ├── developer.md
│   ├── backend.md
│   ├── frontend.md
│   ├── database.md
│   ├── aws.md
│   ├── terraform.md
│   ├── qa.md
│   ├── security.md
│   ├── performance.md
│   ├── reviewer.md
│   ├── sre.md
│   └── documentation.md
│
├── commands/
│   ├── feature.md
│   ├── plan.md
│   ├── implement.md
│   ├── review.md
│   ├── qa.md
│   ├── security.md
│   ├── aws.md
│   ├── terraform.md
│   ├── docs.md
│   ├── investigate.md
│   ├── fix.md
│   └── release.md
│
├── hooks/
│   ├── pre-commit.sh
│   ├── pre-push.sh
│   ├── validate-production.sh
│   └── security-check.sh
│
├── rules/
│   ├── architecture.md
│   ├── backend.md
│   ├── frontend.md
│   ├── database.md
│   ├── aws.md
│   ├── security.md
│   ├── testing.md
│   ├── git.md
│   └── documentation.md
│
├── workflows/
│   ├── feature-development.md
│   ├── bug-fix.md
│   ├── security-review.md
│   ├── production-incident.md
│   └── release.md
│
├── context/
│   ├── project.md
│   ├── architecture.md
│   ├── infrastructure.md
│   └── decisions.md
│
└── settings.json
```

Mas existe uma distinção importante:

```markdown
CLAUDE.md
    ↓
REGRAS GERAIS

rules/
    ↓
REGRAS ESPECIALIZADAS

agents/
    ↓
PAPÉIS

commands/
    ↓
AÇÕES

workflows/
    ↓
PROCESSOS

hooks/
    ↓
GUARD RAILS

context/
    ↓
CONHECIMENTO DO PROJETO
```

---

## 2. CLAUDE.md

Esse é o arquivo mais importante.

Eu faria algo assim:

```markdown
# Engineering Operating System

You are operating as an AI engineering team.

Your primary objective is to help develop, test, review, secure and operate
this software while preserving the existing architecture and conventions.

---

# 1. General Rules

Before changing code:

1. Inspect the relevant files.
2. Understand existing architecture.
3. Identify dependencies and side effects.
4. Search for existing implementations.
5. Prefer existing patterns over introducing new abstractions.

Never make architectural assumptions without inspecting the repository.

Do not rewrite working code unnecessarily.

Do not introduce dependencies without justification.

---

# 2. Engineering Stack

Backend:

- NestJS 10.x
- TypeScript 5.x
- Node.js ES2021
- strictNullChecks
- noImplicitAny

Database:

- PostgreSQL
- Amazon RDS
- MikroORM 6.x

Authentication:

- AWS Cognito
- aws-jwt-verify

Authorization:

- Custom guards
- Custom decorators
- RBAC

Infrastructure:

- AWS Lambda
- API Gateway
- S3
- CloudFront
- SQS
- Step Functions
- CloudWatch
- SNS
- Terraform

AI:

- AWS Bedrock
- Bedrock Knowledge Bases
- AI Agents
- MCP

---

# 3. Authentication

Protected endpoints must use the project authentication mechanism.

Do not implement custom JWT verification when the existing authentication
architecture can be reused.

Never log:

- access tokens
- refresh tokens
- client secrets
- passwords
- API keys

---

# 4. Authorization

Authorization must be explicit.

Existing authorization mechanisms include:

- @CurrentUser()
- @RequireAdmin()
- @RequireManager()
- @TeamAccess()
- @CheckAbilities()

Do not bypass authorization.

Routes without explicit authorization requirements must follow the project's
defined public/private route convention.

---

# 5. API Standards

Controllers must remain thin.

Business logic belongs in services.

DTOs must:

- validate input
- document Swagger properties
- use existing project conventions

Endpoints should document:

- operation
- parameters
- request body
- responses
- authentication requirements

---

# 6. Database

Use MikroORM.

Do not modify production schema manually.

Schema changes require migrations.

Before creating a migration:

1. inspect current entities
2. inspect existing migrations
3. verify relationships
4. consider backward compatibility

---

# 7. Testing

A feature is not considered complete until:

- typecheck passes
- lint passes
- relevant unit tests pass
- relevant integration tests pass
- authorization is tested
- error cases are tested

---

# 8. Security

Every feature must consider:

- authentication
- authorization
- IDOR
- injection
- sensitive data exposure
- privilege escalation
- rate limiting
- validation
- dependency vulnerabilities

---

# 9. AWS

Prefer least privilege.

Never expose sensitive infrastructure unnecessarily.

Infrastructure changes should be represented in Terraform whenever
Terraform is the project's source of truth.

Never execute production infrastructure changes without explicit approval.

---

# 10. Git

Never:

- force push
- delete branches
- rewrite history
- commit secrets
- modify unrelated files

Do not create commits unless explicitly requested.

Before suggesting a commit:

- inspect git diff
- inspect git status
- verify tests
- verify lint
- verify typecheck

---

# 11. Human Approval

The following actions require explicit human approval:

- production deployment
- production database migration
- destructive AWS operation
- deleting infrastructure
- deleting data
- modifying IAM permissions
- rotating credentials
- force push
- irreversible operation

---

# 12. Definition of Done

Before declaring a task complete:

[ ] Requirements satisfied
[ ] Architecture respected
[ ] Code implemented
[ ] Tests added/updated
[ ] Typecheck passes
[ ] Lint passes
[ ] Security considered
[ ] Swagger updated when applicable
[ ] Migration created when applicable
[ ] Documentation updated when applicable
[ ] Git diff reviewed
```

---

## 3. Agents

Aqui começa a ficar interessante.

## architect.md

```markdown
# Architect Agent

Role:
Senior Software Architect.

Responsibilities:

- Analyze requirements.
- Understand existing architecture.
- Identify affected modules.
- Design implementation strategy.
- Identify risks.
- Identify required infrastructure changes.
- Identify database changes.
- Identify security implications.

Do not implement code unless explicitly requested.

Output:

1. Problem
2. Existing architecture
3. Proposed architecture
4. Files/modules affected
5. Database impact
6. Infrastructure impact
7. Security considerations
8. Testing strategy
9. Implementation plan
10. Risks
```

---

## 4. Developer

```markdown
# Developer Agent

Role:
Senior software engineer.

Responsibilities:

- Implement features.
- Fix bugs.
- Refactor code.
- Create tests.
- Update DTOs.
- Update Swagger.
- Follow existing architecture.

Before editing:

- inspect relevant code
- search for similar implementations
- understand dependencies

After editing:

- run typecheck
- run lint
- run relevant tests

Do not modify unrelated code.
```

---

## 5. Backend

Eu separaria `developer` de `backend`.

O Developer é generalista.

O Backend entende profundamente:

```markdown
NestJS
MikroORM
PostgreSQL
REST
authentication
authorization
queues
Lambda
```

E teria regras específicas para:

-   controllers

-   services

-   modules

-   repositories

-   DTOs

-   guards

-   interceptors

-   pipes

-   migrations


---

## 6. AWS Agent

Esse agente seria especializado em arquitetura AWS.

```markdown
# AWS Agent

Responsibilities:

- Lambda
- API Gateway
- Cognito
- S3
- CloudFront
- SQS
- Step Functions
- RDS
- CloudWatch
- SNS
- IAM
- Bedrock

For AWS changes analyze:

1. Security
2. Cost
3. Scalability
4. Availability
5. Observability
6. Failure modes
7. IAM permissions
8. AWS service limits
```

---

## 7. Terraform Agent

Especializado em:

```markdown
modules
variables
outputs
providers
state
environments
workspaces
IAM
Lambda
API Gateway
CloudFront
etc.
```

E uma regra muito importante:

> **Nunca executar `terraform apply` em produção sem aprovação humana.**

---

## 8. QA Agent

Esse seria um dos agentes mais importantes.

```markdown
# QA Agent

You are an adversarial QA engineer.

Your goal is not to confirm that the implementation works.

Your goal is to find how it can fail.

Analyze:

## Functional

- happy path
- invalid input
- missing input
- boundary conditions
- concurrency
- retries
- timeouts

## API

- status codes
- response schemas
- pagination
- filtering
- sorting

## Authorization

- unauthorized access
- cross-user access
- cross-team access
- privilege escalation
- IDOR

## Regression

Check whether existing behavior could be broken.

Output:

- Finding
- Severity
- Evidence
- Reproduction
- Expected behavior
- Actual behavior
- Suggested fix
```

---

## 9. Security Agent

Esse merece autonomia própria.

```markdown
Developer
     ↓
QA
     ↓
Security
     ↓
Reviewer
```

Ele procuraria:

```markdown
OWASP
IAM
JWT
Cognito
IDOR
injection
secrets
SSRF
XSS
CSRF
dependency vulnerabilities
misconfigured S3
IAM privilege escalation
```

---

## 10. Reviewer Agent

Esse seria o último filtro.

Ele não deveria simplesmente dizer:

> "LGTM."

Ele deve revisar:

```markdown
Architecture
Code quality
Security
Performance
Testing
Maintainability
Backward compatibility
```

E produzir:

```markdown
APPROVED

ou

CHANGES REQUIRED

1. ...
2. ...
3. ...
```

---

## 11. SRE Agent

Para produção:

```markdown
Sentry
CloudWatch
Lambda
API Gateway
RDS
SQS
```

Fluxo:

```markdown
Incident
   ↓
SRE
   ↓
Logs
   ↓
Metrics
   ↓
Recent deployments
   ↓
Git commits
   ↓
Root cause hypothesis
   ↓
Recommended fix
```

---

## 12. Commands

Aqui você ganha velocidade no dia a dia.

### /feature

```markdown
/feature Implement user invitation system
```

Workflow:

```markdown
Architect
   ↓
Developer
   ↓
QA
   ↓
Security
   ↓
Reviewer
```

---

### /review

```markdown
/review
```

Executa:

```markdown
git diff
↓
architecture
↓
quality
↓
security
↓
tests
```

---

### /qa

```markdown
/qa
```

Executa o QA Agent contra a implementação atual.

---

### /security

```markdown
/security
```

Executa análise de segurança.

---

### /aws

```markdown
/aws Review the architecture of this Lambda system
```

---

### /terraform

```markdown
/terraform Review my infrastructure
```

---

### /investigate

Muito útil:

```markdown
/investigate API is returning 500
```

Fluxo:

```markdown
SRE
 ↓
logs
 ↓
code
 ↓
recent changes
 ↓
dependencies
 ↓
root cause
```

---

## 13. Workflows

Aqui eu colocaria o comportamento dos agentes.

## feature-development.md

```markdown
REQUEST
   │
   ▼
ARCHITECT
   │
   ▼
PLAN
   │
   ▼
DEVELOPER
   │
   ▼
TEST
   │
   ▼
QA
   │
   ▼
SECURITY
   │
   ▼
REVIEWER
   │
   ▼
DOCUMENTATION
   │
   ▼
DONE
```

---

## 14. Hooks

Aqui está uma das partes mais importantes.

O agente pode ser inteligente, mas **hooks são determinísticos**.

Por exemplo:

```markdown
Claude modifica código
        ↓
pre-commit
        ↓
lint
        ↓
typecheck
        ↓
tests
```

Se falhar:

```markdown
❌ Commit blocked
```

Outro:

```markdown
Claude
  ↓
terraform apply
  ↓
hook
  ↓
environment == production
  ↓
BLOCK
```

Isso é muito melhor do que simplesmente colocar:

> "Não faça deploy em produção."

no prompt.

---

## 15. Context

Eu manteria informações específicas do projeto separadas.

### context/project.md

```markdown
# Project

Name:
Description:
Owner:
Repository:
Environments:

Development:
Staging:
Production:
```

### context/architecture.md

```markdown
# Architecture

Frontend
↓
CloudFront
↓
API Gateway
↓
Lambda
↓
NestJS
↓
MikroORM
↓
RDS PostgreSQL
```

### context/infrastructure.md

```markdown
# Infrastructure

AWS Account:
Region:
Environments:

Resources:

Lambda:
API Gateway:
RDS:
S3:
CloudFront:
SQS:
```

Isso evita transformar o `CLAUDE.md` em um arquivo gigante.

---

## 16. Rules

Eu usaria regras específicas.

Por exemplo:

```markdown
rules/
├── backend.md
├── database.md
├── aws.md
└── security.md
```

O Backend Agent lê `backend.md`.

O AWS Agent lê `aws.md`.

O Security Agent lê `security.md`.

Assim cada agente recebe **somente o contexto necessário**.

Isso ajuda bastante a reduzir contexto desperdiçado.

---

## 17. A arquitetura final

O resultado ficaria mais ou menos assim:

```markdown
YOU
                       │
                       ▼
                ┌─────────────┐
                │ CLAUDE CODE │
                └──────┬──────┘
                       │
                 ORCHESTRATOR
                       │
     ┌─────────────────┼─────────────────┐
     │                 │                 │
     ▼                 ▼                 ▼
ARCHITECT          DEVELOPER            QA
     │                 │                 │
     │                 ▼                 │
     │              BACKEND              │
     │                 │                 │
     └─────────────────┼─────────────────┘
                       │
              ┌────────┴────────┐
              ▼                 ▼
          SECURITY             AWS
              │                 │
              │             TERRAFORM
              │                 │
              └────────┬────────┘
                       ▼
                   REVIEWER
                       │
                       ▼
                 DOCUMENTATION
                       │
                       ▼
                      YOU
```

E por baixo:

```markdown
┌──────────── MCP ──────────────┐
   │                               │
GitHub          AWS             Sentry
   │                               │
Postgres       Browser          Notion
   │                               │
   └───────────────────────────────┘
```

---

## 18. O ponto mais importante: não automatizar tudo de uma vez

Eu faria em **3 fases**.

### Fase 1 — Assistente

```markdown
CLAUDE.md
agents/
rules/
commands/
```

Claude **sugere e implementa**, você aprova.

### Fase 2 — Engineering Team

Adicionar:

```markdown
QA
Security
Reviewer
AWS
Terraform
```

Agora o Claude consegue fazer:

```markdown
plan → code → test → security → review
```

### Fase 3 — Autonomous Development

Adicionar:

```markdown
MCP
hooks
Sentry
GitHub
AWS
CI/CD
```

Aí você chega no cenário:

```markdown
Você:

"Implemente o módulo de notificações."

                ↓

Architect
                ↓
Developer
                ↓
Tests
                ↓
QA
                ↓
Security
                ↓
Reviewer
                ↓

"Implementação pronta.

12 arquivos alterados.
43 testes executados.
43 passaram.
Security: 0 critical/high.
Terraform: no changes.

Aguardando sua aprovação para commit."
```

E isso, para o seu perfil, eu considero **bem mais interessante do que criar um único "Grok Bot" gigante**: você cria uma arquitetura de engenharia que consegue evoluir junto com seus projetos.

**O próximo passo que eu faria é transformar esse desenho em um `.claude/` real**, com o conteúdo completo de cada `*.md`, `settings.json`, comandos e hooks, já adaptado ao seu stack NestJS + TypeScript + MikroORM + PostgreSQL + AWS + Terraform. Isso poderia ser mantido como um **template-base (`claude-engineering-template`) e copiado para cada novo projeto**.

hoje 06:07

Sim. E, se você quer que isso seja **realmente garantido**, eu não confiaria apenas em colocar “use SDD” no `CLAUDE.md`.

O ideal é transformar SDD em uma **máquina de estados + arquivos obrigatórios + hooks que bloqueiam violações**.

A regra central seria:

```markdown
NENHUM CÓDIGO
    ↓
sem SPEC aprovada
    ↓
NENHUM IMPLEMENTATION
    ↓
sem DESIGN/PLAN aprovado
    ↓
NENHUM MERGE
    ↓
sem TEST/REVIEW
```

## 1. Defina SDD como o protocolo oficial

Eu usaria algo nessa linha:

```markdown
REQUEST
      │
      ▼
SPECIFICATION
      │
 human approval
      │
      ▼
    PLAN
      │
 human approval
      │
      ▼
 IMPLEMENTATION
      │
      ▼
   TESTING
      │
      ▼
   REVIEW
      │
      ▼
  SECURITY
      │
      ▼
    DONE
```

Ou seja, o Claude **nunca pode pular diretamente de Request → Code**.

---

## 2. Estrutura.claude/ específica para SDD

Eu mudaria a estrutura anterior para:

```markdown
.claude/
│
├── CLAUDE.md
│
├── agents/
│   ├── orchestrator.md
│   ├── specification.md
│   ├── architect.md
│   ├── developer.md
│   ├── qa.md
│   ├── security.md
│   └── reviewer.md
│
├── commands/
│   ├── sdd.md
│   ├── specify.md
│   ├── plan.md
│   ├── implement.md
│   ├── test.md
│   ├── review.md
│   └── release.md
│
├── rules/
│   ├── sdd.md
│   ├── architecture.md
│   ├── testing.md
│   ├── security.md
│   └── git.md
│
├── hooks/
│   ├── enforce-sdd.sh
│   ├── validate-spec.sh
│   ├── validate-plan.sh
│   └── pre-commit.sh
│
└── workflows/
    └── sdd.md
```

E no projeto:

```markdown
docs/
└── specs/
    └── <feature>/
        ├── spec.md
        ├── design.md
        ├── plan.md
        ├── tasks.md
        ├── test-plan.md
        └── review.md
```

---

## 3. O CLAUDE.md deve estabelecer a regra absoluta

Algo assim:

```markdown
# Spec-Driven Development

This project MUST follow Spec-Driven Development (SDD).

No production code may be written before an approved specification exists.

## Mandatory lifecycle

REQUEST
→ SPECIFICATION
→ DESIGN
→ PLAN
→ IMPLEMENTATION
→ TEST
→ SECURITY REVIEW
→ CODE REVIEW
→ DONE

## Hard rules

1. Never implement a feature without a specification.
2. Never modify the specification implicitly.
3. Never implement requirements that are not present in the specification.
4. If requirements change, update the specification first.
5. If architecture changes, update the design before coding.
6. Implementation must map to specification requirements.
7. Tests must map to specification acceptance criteria.
8. Code review must verify implementation against the specification.

## Forbidden

The agent MUST NOT:

- start coding immediately after receiving a feature request
- create implementation files before specification approval
- silently change requirements
- infer missing business requirements and implement them
- bypass the SDD workflow because the change appears small

## Small changes

Even small changes must pass through SDD.

For trivial changes, a lightweight specification may be used.

Example:

spec.md

Requirement:
"Rename X to Y."

Acceptance criteria:
- X no longer exists.
- Y is used consistently.
- Existing tests continue to pass.
```

A regra mais importante é:

> **"If requirements change, stop implementation and update the specification first."**

Isso evita aquele comportamento clássico de agente:

> "Enquanto estava implementando, percebi que seria melhor fazer de outra maneira..."

e de repente o código virou outra coisa.

---

## 4. Crie uma máquina de estados

Eu iria além do prompt.

Cada feature teria um estado:

```markdown
REQUESTED
    ↓
SPEC_DRAFT
    ↓
SPEC_APPROVED
    ↓
DESIGN_APPROVED
    ↓
IMPLEMENTING
    ↓
IMPLEMENTED
    ↓
TESTED
    ↓
SECURITY_APPROVED
    ↓
REVIEW_APPROVED
    ↓
DONE
```

Por exemplo:

```markdown
docs/specs/user-invitation/
├── metadata.yaml
├── spec.md
├── design.md
├── plan.md
├── tasks.md
├── test-plan.md
└── review.md
```

`metadata.yaml`:

```markdown
feature: user-invitation
status: SPEC_APPROVED

spec:
  status: approved

design:
  status: pending

implementation:
  status: blocked

tests:
  status: blocked

security:
  status: blocked

review:
  status: blocked
```

O agente só pode avançar o estado.

---

## 5. O comando /sdd

Eu faria esse ser o **comando principal**.

Você:

```markdown
/sdd Quero adicionar convite de usuários ao sistema
```

O Claude **não implementa**.

Ele faz:

```markdown
1. Analyze request
2. Ask/identify missing requirements
3. Inspect existing architecture
4. Create specification
5. Define acceptance criteria
6. Identify constraints
7. Ask for approval
```

Resultado:

```markdown
docs/specs/user-invitation/spec.md
```

E:

```markdown
SDD STATUS

Feature: User Invitation

Specification:
✓ Created
✓ Requirements defined
✓ Acceptance criteria defined

Implementation:
🔒 BLOCKED

Waiting for specification approval.
```

---

## 6. Depois /plan

Somente depois da aprovação:

```markdown
/plan
```

O agente lê:

```markdown
spec.md
```

e produz:

```markdown
design.md
plan.md
tasks.md
```

Exemplo:

```markdown
# Implementation Plan

## 1. Database

Create Invitation entity.

## 2. API

POST /users/invitations

## 3. Authorization

Managers can invite users.

## 4. Email

Generate invitation token.

## 5. Tests

Unit + integration + authorization tests.
```

E novamente:

```markdown
IMPLEMENTATION: BLOCKED

Reason:
Design has not been approved.
```

---

## 7. /implement

Só então:

```markdown
/implement
```

Claude verifica:

```markdown
spec.md       ✓
design.md     ✓
plan.md       ✓
approval      ✓
```

E aí:

```markdown
IMPLEMENTATION STARTED
```

Durante a implementação, o Developer Agent recebe:

```markdown
SPECIFICATION
+
DESIGN
+
PLAN
```

Não apenas o prompt original.

---

## 8. A parte mais importante: rastreabilidade

Eu faria cada requisito possuir um ID.

`spec.md`:

```markdown
# Requirements

## REQ-001 — Create invitation

The system must allow authorized managers to invite users.

## REQ-002 — Invitation expiration

Invitation tokens must expire after 24 hours.

## REQ-003 — Authorization

Only users with the required permission can create invitations.
```

Depois:

```markdown
# Acceptance Criteria

## AC-001

Given an authorized manager
When they create an invitation
Then the system creates an invitation token.

## AC-002

Given an expired token
When the user attempts to accept it
Then the system rejects the invitation.

## AC-003

Given an unauthorized user
When they attempt to create an invitation
Then the API returns 403.
```

---

## 9. O código deveria carregar a referência do requisito

Por exemplo:

```markdown
/**
 * Implements REQ-001 / AC-001.
 */
@Post('invitations')
async createInvitation(...) {
```

Não precisa necessariamente colocar isso em **todo** código, mas para mudanças relevantes é extremamente útil.

E o teste:

```markdown
describe('REQ-001 - User invitation', () => {
  it('AC-001 - creates invitation for authorized manager', ...)
});
```

Agora você consegue rastrear:

```markdown
Requirement
     ↓
Acceptance Criteria
     ↓
Implementation
     ↓
Test
     ↓
Review
```

Isso é SDD de verdade.

---

## 10. QA também deve ser SDD-aware

O QA Agent não recebe:

> "Teste essa feature."

Ele recebe:

```markdown
SPEC
DESIGN
IMPLEMENTATION
TEST PLAN
```

E compara.

Por exemplo:

```markdown
SPEC:

REQ-003
Only managers can create invitations.

IMPLEMENTATION:

POST /invitations
@UseGuards(AuthGuard)

❌ Missing manager authorization.
```

O QA encontra a divergência **porque conhece o contrato**.

---

## 11. Security também

Mesma coisa.

```markdown
REQ-003
Only managers can create invitations.
```

Security Agent:

```markdown
Authentication ✓

Authorization:
❌ Endpoint only verifies authentication.

Potential privilege escalation.
```

---

## 12. Reviewer vira um "Specification Compliance Reviewer"

Esse é um papel diferente do code review tradicional.

Ele pergunta:

### Specification

```markdown
Todos os requisitos foram implementados?
```

### Scope

```markdown
Existe código implementando algo que não está na SPEC?
```

Isso é extremamente importante.

Imagine:

```markdown
SPEC

REQ-001
Criar convite.

REQ-002
Expiração de 24h.
```

O desenvolvedor implementou também:

```markdown
automatic email retry
notification preferences
audit dashboard
```

O Reviewer deveria dizer:

```markdown
⚠️ OUT-OF-SPEC CHANGES

The implementation contains functionality not defined
in the approved specification:

- Email retry
- Notification preferences
- Audit dashboard

These changes require specification updates.
```

Esse mecanismo evita **scope creep causado pela própria IA**.

---

## 13. Hooks para impedir código antes da SPEC

Aqui está o ponto que transforma isso de:

> "Claude, por favor siga SDD"

para:

> **"Claude não consegue facilmente violar SDD."**

Um hook pode verificar:

```markdown
git diff
   ↓
existem novos arquivos de código?
   ↓
qual feature?
   ↓
existe spec?
   ↓
spec aprovada?
```

Se não:

```markdown
❌ SDD VIOLATION

Code changes detected without an approved specification.

Implementation blocked.
```

---

## 14. CI/CD também deve validar

Não dependa apenas do computador do desenvolvedor.

No GitHub Actions:

```markdown
Pull Request
     ↓
SDD Validator
     ↓
Spec exists?
     ↓
Spec approved?
     ↓
Requirements mapped?
     ↓
Tests mapped?
     ↓
Security review?
     ↓
Code review?
```

Se:

```markdown
❌ FAILED
```

o PR não pode ser mergeado.

---

## 15. Uma validação ainda melhor

Você pode ter um arquivo:

```markdown
docs/specs/user-invitation/traceability.yaml
```

```markdown
requirements:
  REQ-001:
    implementation:
      - src/invitations/invitation.service.ts
    tests:
      - test/invitations/create.spec.ts

  REQ-002:
    implementation:
      - src/invitations/invitation.service.ts
    tests:
      - test/invitations/expiration.spec.ts

  REQ-003:
    implementation:
      - src/invitations/invitation.controller.ts
    tests:
      - test/invitations/authorization.spec.ts
```

Então você pode gerar automaticamente:

```markdown
SDD COMPLIANCE

Requirements: 3

REQ-001 ✓
Implementation ✓
Tests ✓

REQ-002 ✓
Implementation ✓
Tests ✓

REQ-003 ✓
Implementation ✓
Tests ✓

Coverage: 100%

OUT-OF-SPEC CHANGES: 0

STATUS: APPROVED
```

---

## 16. Eu adicionaria uma regra especial para "bug"

Porque senão você pode criar uma brecha:

> "É só um bug, então não precisa de SDD."

Eu faria:

```markdown
BUG
 │
 ├── trivial
 │      ↓
 │   lightweight spec
 │
 └── complex
        ↓
     full SDD
```

Exemplo de lightweight:

```markdown
# BUG-123

## Problem

POST /users returns 500 when email is missing.

## Expected

API returns 400.

## Acceptance Criteria

- Missing email returns 400.
- Valid email continues working.
- Regression test added.
```

Pronto.

---

## 17. E para refactoring?

Mesma coisa.

```markdown
REF-001

Objective:
Extract authorization logic into reusable guard.

Constraints:
- No behavior change.
- No API contract change.

Acceptance criteria:
- Existing tests pass.
- Authorization behavior remains unchanged.
```

Então a IA não pode chamar qualquer alteração de:

> "refactoring"

para escapar do processo.

---

## 18. O fluxo que eu recomendo para você

No seu ambiente:

```markdown
┌─────────────┐
  │    USER     │
  └──────┬──────┘
         │
     /sdd
         │
         ▼
┌─────────────────┐
│ SPECIFICATION   │
│ Agent           │
└────────┬────────┘
         │
   APPROVAL
         │
         ▼
┌─────────────────┐
│ ARCHITECT       │
│ Agent           │
└────────┬────────┘
         │
   APPROVAL
         │
         ▼
┌─────────────────┐
│ DEVELOPER       │
│ Agent           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ QA              │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ SECURITY        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ SDD REVIEWER    │
└────────┬────────┘
         │
         ▼
       DONE
```

## E o princípio fundamental

Eu colocaria literalmente no topo do seu `CLAUDE.md`:

```markdown
┌───────────────────────────────────────────────────────┐
│                  SDD IS MANDATORY                     │
│                                                       │
│ The agent must never implement unapproved requirements│
│ and must never modify code without a valid            │
│ specification and implementation plan.                │
│                                                       │
│ If the specification is missing, STOP.                │
│ If the specification changes, STOP.                   │
│ If implementation diverges from the specification,    │
│ STOP.                                                  │
└───────────────────────────────────────────────────────┘
```

**Essa combinação é o que eu recomendo para você:**

**LLM instructions → máquina de estados → arquivos de SPEC → rastreabilidade → hooks → CI/CD.**

Assim o SDD deixa de ser uma preferência do Claude e passa a ser **uma propriedade verificável do seu processo de desenvolvimento**.

E, para o seu projeto de `.claude/`, eu faria ainda uma coisa: criar um **`sdd-orchestrator`**, responsável exclusivamente por controlar essa máquina de estados. Os agentes `architect`, `developer`, `qa`, `security` e `reviewer` **não poderiam decidir sozinhos em qual fase estão**. Isso evita que um subagente simplesmente diga "a especificação está suficientemente clara, vou implementar".