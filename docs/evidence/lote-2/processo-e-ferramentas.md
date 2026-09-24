# Processo e ferramentas — retomada Codex

Data: 2026-09-24. Sessão de origem: `63961740-6c61-4f62-a18e-cab764f5e735`.

O usuário autorizou a revisão/correção do lote 1 e a execução do lote 2. O lote 3 continua sujeito à revisão do usuário.

## Capacidades

| Recurso do Claude | Situação nesta sessão |
|---|---|
| Superpowers | Instalado pelo CLI como `superpowers@openai-curated`, versão `1dc19589`; `enabled = true` confirmado em config.toml. Processo desta retomada segue as instruções 6.4.1 locais já lidas. |
| Subagentes frontend-web, qa, ui-designer | Disponíveis nativamente; instruções específicas em `.claude/agents/` consultadas. |
| code-review | Instalado pelo CLI do Codex a partir do catálogo local oficial Claude; `enabled = true` confirmado. Revisões desta execução usam subagentes e critérios Superpowers. |
| GitHub | Plugin já instalado. Nenhum push, publicação ou comunicação externa necessária neste lote. |
| Playwright | Instalado pelo CLI do Codex a partir do catálogo local oficial Claude; `enabled = true` confirmado. MCP ainda não exposto nesta conversa; não confundir instalação com disponibilidade imediata de ferramenta. |
| frontend-design | Instalado pelo CLI do Codex a partir do catálogo local oficial Claude; `enabled = true` confirmado. |
| Voltagent | Os papéis necessários já estão disponíveis nativamente; pacotes sem relação com este lote não são necessários para execução. |
| Kanban | Arquivos locais em `docs/sprints/board/ui-kit-lote-2/`, seguindo o formato existente. |

## Execução

1. QA revalida base e achados do lote 1.
2. Um implementador por tarefa, sem implementadores concorrentes nos mesmos arquivos.
3. Revisão independente após cada tarefa, correções e reverificação dos achados.
4. QA final executa checks, registra contraste/axe e evidências reais.
5. Entrega do lote 2 para revisão do usuário, sem iniciar lote 3.

Testes seguem o ciclo de falha e sucesso quando há comportamento novo ou correção. O controlador mantém o kanban e o ledger em `.superpowers/sdd/2026-09-24-aura-ui-kit/progress.md`. Alterações preexistentes do usuário são preservadas.
