---
id: "backlog-d2-switch-formdata"
status: "backlog"
priority: "low"
assignee: "frontend-web"
epic: "UI Kit — lote 2"
created: "2026-09-24T00:00:00.000Z"
labels: ["backlog", "ui-kit", "qa-lote-2", "a11y-forms"]
order: "b1"
---
# Switch não entra no FormData (D2)

**Origem:** QA do lote 2 (`docs/evidence/lote-2/qa-relatorio.md`), defeito D2.

`<Switch name="notif" defaultChecked />` não aparece em `new FormData(form)`, pois é um `<button role="switch">` sem input. Adicionar `name`/`value` e um input oculto (ou `<input type="hidden">`) sincronizado com o estado.

**Aceite:** teste que falha antes e passa depois; typecheck, lint e testes verdes; evidência atualizada em `docs/evidence/lote-2/`.
