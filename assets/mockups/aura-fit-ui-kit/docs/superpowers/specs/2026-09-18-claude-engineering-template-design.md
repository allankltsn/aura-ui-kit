# Claude Engineering Template — Design

## Contexto e objetivo

Este repositório (`aura-fit`) serve, por ora, como o laboratório onde se constrói um
template `.claude/` reutilizável — um conjunto de subagentes especialistas de domínio
e regras de engenharia que podem ser copiados para qualquer projeto do autor que use
o stack abaixo. Não é (ainda) o código do produto fitness; é a base de "equipe de
engenharia virtual" descrita numa conversa exploratória com o ChatGPT
(`DevStack - Ideias de agentes IA - chatgpt.com.md`), reduzida ao essencial depois de
descartar tudo que o plugin **Superpowers** (já instalado) já resolve.

Stack alvo do template:

```
Python
NestJS
TypeScript
MikroORM
PostgreSQL
AWS Lambda
API Gateway
Cognito
S3
SAM
Terraform
```

## Decisão central: não duplicar o Superpowers

A conversa original propunha um sistema SDD próprio: `docs/specs/<feature>/{spec,design,
plan,tasks}.md`, `metadata.yaml` de máquina de estados, comandos `/sdd /specify /plan
/implement`, e um `sdd-orchestrator` para controlar transições de fase.

O Superpowers, já instalado neste ambiente, cobre exatamente esse ciclo:

| Etapa do SDD imaginado | Skill do Superpowers equivalente |
|---|---|
| Specification + aprovação | `brainstorming` (classifica bounded/architectural, escreve spec, gate de aprovação) |
| Design/Plan | `writing-plans` |
| Implementação com checkpoints | `executing-plans` / `subagent-driven-development` |
| Definition of Done | `verification-before-completion` |
| Revisão de código | `requesting-code-review` / `receiving-code-review` / plugin `code-review` |

**Decisão:** não construir um segundo sistema de gates. O que falta e este template
resolve é **conhecimento de domínio** — as skills do Superpowers não sabem nada sobre
convenções de NestJS/MikroORM, arquitetura AWS Lambda, ou o que checar num audit de
segurança Cognito/IAM. Isso vira subagentes especialistas que essas skills (e o
usuário, diretamente) podem invocar.

## Arquitetura

```
Pedido do usuário
      │
      ▼
Superpowers decide o processo (brainstorming → writing-plans →
executing-plans → verification-before-completion) — sem alteração aqui.
      │
      ▼
Nos pontos de "propor arquitetura", "implementar", "validar antes de
concluir", o Claude consulta os subagentes especialistas deste template
em vez de conhecimento genérico.
      │
      ▼
CLAUDE.md (raiz do repo) fixa stack + regras específicas do projeto/AWS
+ uma tabela indicando qual agente consultar em cada etapa.
```

## Escopo desta fase (Fase 1 de 3)

A conversa original sugeria 3 fases (Assistente → Time de Engenharia → Autônomo).
Esta spec cobre apenas a **Fase 1**: agentes especialistas + CLAUDE.md + comandos de
atalho, sem hooks bloqueantes e sem integrações MCP (GitHub/AWS/Postgres/Sentry).
Fases seguintes (hooks de enforcement, MCP, CI/CD) ficam para specs futuras, quando
houver necessidade concreta validada pelo uso da Fase 1.

## Componentes

### 1. `CLAUDE.md` (raiz do repositório)

Conteúdo, evitando duplicar o que o Claude Code já faz por padrão:

1. Stack do projeto (lista acima).
2. Diretriz de processo: usar as skills do Superpowers para o fluxo de
   desenvolvimento; este arquivo não define gates próprios.
3. Tabela de delegação — qual agente consultar em qual etapa:

   | Etapa | Agente |
   |---|---|
   | Propor arquitetura / design | `architect` |
   | Implementar backend Node/NestJS | `backend` |
   | Implementar backend Python | `python` |
   | Design/revisão de infraestrutura AWS | `aws` |
   | Antes de concluir (`verification-before-completion`) | `qa`, `security` |

4. Regras de segurança específicas do projeto (nunca logar secrets/tokens Cognito,
   least privilege em IAM, nunca commitar credenciais).
5. Lista de ações que exigem aprovação humana explícita: deploy em produção,
   migration de banco em produção, mudança de política IAM, qualquer operação
   destrutiva em AWS, rotação de credenciais.
6. Definition of Done curta, delegando a checagem de qualidade aos agentes `qa` e
   `security` em vez de listar critérios soltos redundantes com
   `verification-before-completion`.

### 2. Subagentes (`.claude/agents/*.md`)

Cada agente é um arquivo único (frontmatter `name`/`description`/`tools` + corpo com
o papel e as convenções do domínio). Sem pasta `rules/` separada — um subagente só
carrega seu próprio arquivo quando invocado, o que já isola o contexto; um arquivo de
regras à parte seria indireção sem benefício aqui.

| Agente | Quando é consultado | Conhecimento embutido |
|---|---|---|
| **architect** | Etapa de "propor arquitetura" dentro de `brainstorming`/`writing-plans` | Como estruturar módulos NestJS/AWS, trade-offs Lambda vs. serviço long-running, quando usar SQS/Step Functions |
| **backend** | Implementação (`executing-plans`) de código Node/NestJS | NestJS 10, TypeScript strict, MikroORM, DTOs com Swagger, guards/decorators, controller fino / service com a lógica |
| **python** | Implementação de backend em Python (uso variado — o agente pergunta/detecta o framework se não especificado, em vez de assumir um) | Boas práticas gerais de Python: typing, estrutura de projeto, testes, dependências |
| **aws** | Design/revisão de infraestrutura (Lambda, API Gateway, Cognito, S3, SAM, Terraform) | Least privilege, custo, limites de serviço, quando usar SAM vs. Terraform |
| **qa** | Em `verification-before-completion`, antes de considerar uma feature pronta | Postura adversarial: tenta quebrar a implementação — autorização, IDOR, edge cases, contratos de API |
| **security** | Junto do QA ou sob demanda (via `/security`) | OWASP, IAM, Cognito, JWT, injection, exposição de segredos — auditoria focada no que é específico do stack, não uma varredura genérica |

Não há agente `reviewer` dedicado — duplicaria as skills `requesting-code-review` /
`receiving-code-review` e o plugin `code-review` já instalados. Agentes de
documentação, SRE e Terraform dedicado ficam fora do escopo desta fase (YAGNI —
entram numa fase futura se o uso da Fase 1 mostrar necessidade real).

### 3. Comandos de atalho (`.claude/commands/*.md`)

Três comandos que invocam um agente especialista diretamente para uma checagem
pontual, sem passar pelo fluxo completo do Superpowers:

- `/qa` → invoca o agente `qa` sobre o estado atual do código/diff.
- `/security` → invoca o agente `security`.
- `/aws` → invoca o agente `aws`.

## Fora de escopo (fases futuras)

- Hooks bloqueantes (ex.: impedir commit sem spec aprovada).
  - **Pendência concreta para a Fase 2:** a tabela de delegação em `CLAUDE.md` é
    apenas uma sugestão — nada impede o thread principal de implementar/revisar
    direto em vez de invocar `architect`/`backend`/`python`/`aws`/`qa`/`security`.
    Um hook (ex.: `PreToolUse` em `Edit`/`Write` fora de um subagente, ou
    `Stop`/`SubagentStop` checando se `qa`/`security` rodaram antes de encerrar)
    é o mecanismo natural para tornar a delegação obrigatória em vez de opcional.
    Revisitar quando a Fase 2 for desenhada.
- Integrações MCP (GitHub, AWS, PostgreSQL, Sentry).
- Agentes de documentação, SRE, Terraform dedicado, reviewer dedicado.
- CI/CD validando conformidade.

## Validação

Como o entregável é configuração (não código de aplicação), a validação é manual:

1. Abrir uma sessão nova do Claude Code neste repositório.
2. Confirmar que `CLAUDE.md` é carregado (visível no contexto/comportamento).
3. Confirmar que os 6 subagentes aparecem como agentes disponíveis.
4. Testar cada comando (`/qa`, `/security`, `/aws`) e confirmar que aciona o
   subagente correspondente.

**Herança de `CLAUDE.md` pelos subagentes (confirmado):** segundo a documentação
oficial do Claude Code (`sub-agents.md`, seção "What Loads at Startup for
Subagents"), todo subagente carrega automaticamente a hierarquia de `CLAUDE.md`
(usuário, projeto, local) a menos que declare `omitClaudeMd: true` no frontmatter.
Nenhum dos 6 agentes desta Fase 1 declara esse campo, então as regras de segurança
e a lista de ações que exigem aprovação humana (seções 4–5 de `CLAUDE.md`) chegam a
todos eles por padrão — não é necessário duplicá-las nos arquivos de agente.
