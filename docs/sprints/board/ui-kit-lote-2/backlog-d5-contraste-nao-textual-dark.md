---
id: "backlog-d5-contraste-nao-textual-dark"
status: "backlog"
priority: "medium"
assignee: "frontend-web"
epic: "UI Kit — lote 2"
created: "2026-09-24T00:00:00.000Z"
labels: ["backlog", "ui-kit", "qa-lote-2", "contraste"]
order: "c3"
---
# Contraste não textual no tema escuro abaixo de 3:1 (D5)

**Origem:** QA do lote 2 (`docs/evidence/lote-2/qa-relatorio.md`), defeito D5.

Medido: Segmented ativo (`primary` sobre `surface-2`) 2,68:1; polegar branco do Switch sobre `faint` 2,85:1. Exige decisão de token (ex.: borda/anel de separação ou ajuste de cor) e novos pares em `src/tokens/contrast.test.ts`. Decisão de design pendente com o usuário.

**Aceite:** teste que falha antes e passa depois; typecheck, lint e testes verdes; evidência atualizada em `docs/evidence/lote-2/`.
