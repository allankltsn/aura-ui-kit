# Cadência de entrega (scrum)

Plano de referência: [`../superpowers/plans/2026-09-19-rbac-auth.md`](../superpowers/plans/2026-09-19-rbac-auth.md) ·
Spec: [`../superpowers/specs/2026-09-19-rbac-auth-design.md`](../superpowers/specs/2026-09-19-rbac-auth-design.md)

## Papéis

| Quem | Papel |
|---|---|
| Allan | Product Owner e **revisor técnico e negocial** nas Sprints 1 e 2; **cliente** a partir da Sprint 3 (avalia a entrega final e os artefatos como usuário) |
| Claude (orquestrador) | Facilita a cadência, faz o planning, os dailies e monta a review |
| Subagentes | Um por task do plano (contexto limpo), com revisão em duas etapas: conformidade com o plano/spec e qualidade de código |

## Cerimônias

1. **Sprint Planning** (início): apresento objetivo, tasks, critérios de aceite, roteiro de demo, riscos e o que **não** entra. **Nada começa sem o seu OK.**
2. **Daily** (a cada sessão de trabalho e a cada task concluída). Formato fixo, registrado no arquivo da sprint:
   - **Progresso:** o que foi feito, com evidência (testes, commits).
   - **Hoje:** o que será feito agora.
   - **Dificuldades:** o que atrapalhou ou pode atrapalhar.
   - **Pendências:** decisões que dependem de você e itens adiados.
3. **Sprint Review** (fim): **paro de executar**. Faço a demo com roteiro reproduzível, entrego os artefatos e você avalia. O feedback e os ajustes para a próxima sprint ficam registrados.

Regra: **não inicio a sprint seguinte sem o seu aceite da review.**

## Definition of Done (toda task)

- Teste escrito antes e visto falhando; depois passando.
- Executado via docker compose (nada depende de Node no host).
- Passou nas duas revisões (conformidade e qualidade).
- Um commit por task, em branch dedicada (`feat/rbac-auth`), com a mensagem do plano.
- Sem segredo no repositório (`secrets/` e `.env` ignorados).

## Mapa de sprints

Cada sprint termina com algo que você consegue ver funcionando.

| Sprint | Tasks | Entrega demonstrável | Seu papel |
|---|---|---|---|
| **1** | 0–4 (5) | Plataforma local sobe com um comando; o Keycloak autentica usuários por trás da nossa porta (Adapter), provado por testes contra o Keycloak real | Revisor técnico e negocial |
| **2** | 5–10 (6) | **API de identidade rodando**: cadastro → e-mail de verificação (Mailpit) → login → contexto de autorização, convites, RBAC e admin via CLI, com headers/erros seguros. Demo por script | Revisor técnico e negocial |
| **3** | 11–15 (5) | **Você usa o produto no navegador**: cadastro, verificação de e-mail, login, esqueci a senha e seleção de perfil no web, via BFF | Cliente |
| **4** | 16–19 (4) | **Produto completo e endurecido**: painel, perfil, convites, tela de permissões do admin, app mobile do aluno, **login com Google**, CI, scans e imagens de produção | Cliente |

A Sprint 2 tem 6 tasks (e não 5) porque as Tasks 9 e 10 são necessárias para a API subir e ser demonstrada. Mantê-las na Sprint 2 evita uma sprint sem nada funcional para ver.

## Fora do escopo desta fase

- Login social com **Apple** e outros provedores (Google entra na Task 19; o código já fica preparado para novos provedores). Apple: não iniciado, a verificar depois.
- Login social no mobile, funções customizadas por tenant, MFA, foto de perfil, dashboard e módulos de treino/financeiro.

## Arquivos

- `sprint-01.md` … `sprint-04.md`: planning, daily log e review de cada sprint.
