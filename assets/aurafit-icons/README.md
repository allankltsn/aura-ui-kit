# AuraFit — ícones vetoriais

83 desenhos únicos de interface e uma reconstrução aproximada do wordmark, em SVG e PNG transparente. Sem fotografias.

## Escopo e fidelidade
Foram inspecionadas quatro pranchas: exercícios/IA, calendário, autenticação e RBAC. Os dois dashboards e as imagens de marca pessoal não puderam ser recuperados do link compartilhado. Portanto, este pacote não certifica cobertura de TODOS os ícones da conversa. As referências raster têm ícones muito pequenos; esta é uma reconstrução manual normalizada, não os vetores originais. Símbolos ambíguos foram simplificados. Itens com origem `requested` complementam os conceitos pedidos, sem alegação de correspondência visual confirmada. O manifesto distingue ambos.

Não foi identificado símbolo isolado AuraFit. O wordmark em brand/ é aproximação em curvas e deve ser conferido com o arquivo de marca original. Marca pessoal não incluída por falta da referência acessível. Google e Apple aparecem como provedores no login; suas marcas não foram redesenhadas neste pacote.

## Uso
SVGs: viewBox 0 0 24 24, traço 1.7, currentColor, sem imagens incorporadas, scripts ou fontes externas. PNGs: 512 × 512, cor #1f1f1f e canal alfa; wordmark 1120 × 256. Use SVG inline para herdar a cor via CSS/Tailwind. Um SVG usado como img não herda currentColor da página.

```jsx
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="size-6 text-red-700" aria-hidden="true">
  {/* Copie os elementos internos do SVG desejado aqui. */}
</svg>
```

Deduplicação: aliases no manifest.json apontam para o mesmo desenho (por exemplo, workout e exercises usam dumbbell). Não há arquivos duplicados por nome de contexto. Ícones decorativos devem usar aria-hidden; botões precisam de rótulo acessível.

## Catálogo
| Nome | Finalidade/contexto | Prancha | Arquivos |
|---|---|---|---|
| `home` | Início e navegação principal | shared | [SVG](svg/home.svg) · [PNG](png/home.png) |
| `dashboard` | Visão geral | requested | [SVG](svg/dashboard.svg) · [PNG](png/dashboard.png) |
| `user` | Perfil e aluno | auth | [SVG](svg/user.svg) · [PNG](png/user.png) |
| `users` | Alunos, usuários e equipes | rbac | [SVG](svg/users.svg) · [PNG](png/users.png) |
| `user-add` | Cadastrar usuário | requested | [SVG](svg/user-add.svg) · [PNG](png/user-add.png) |
| `user-check` | Presença confirmada | requested | [SVG](svg/user-check.svg) · [PNG](png/user-check.png) |
| `user-minus` | Desativar aluno | requested | [SVG](svg/user-minus.svg) · [PNG](png/user-minus.png) |
| `roles` | Papéis e responsabilidades | rbac | [SVG](svg/roles.svg) · [PNG](png/roles.png) |
| `dumbbell` | Treinos, exercícios e equipamento | shared | [SVG](svg/dumbbell.svg) · [PNG](png/dumbbell.png) |
| `workout-plan` | Protocolos de treino | requested | [SVG](svg/workout-plan.svg) · [PNG](png/workout-plan.png) |
| `calendar` | Calendário e agenda | calendar | [SVG](svg/calendar.svg) · [PNG](png/calendar.png) |
| `calendar-check` | Atendimento confirmado | calendar | [SVG](svg/calendar-check.svg) · [PNG](png/calendar-check.png) |
| `calendar-add` | Novo atendimento | calendar | [SVG](svg/calendar-add.svg) · [PNG](png/calendar-add.png) |
| `calendar-clock` | Remarcar horário | calendar | [SVG](svg/calendar-clock.svg) · [PNG](png/calendar-clock.png) |
| `calendar-x` | Falta ou cancelamento | calendar | [SVG](svg/calendar-x.svg) · [PNG](png/calendar-x.png) |
| `clock` | Horário, atraso, manutenção e sessão expirada | shared | [SVG](svg/clock.svg) · [PNG](png/clock.png) |
| `timer` | Tempo de descanso | exercises-ai | [SVG](svg/timer.svg) · [PNG](png/timer.png) |
| `finance` | Financeiro e cobrança | shared | [SVG](svg/finance.svg) · [PNG](png/finance.png) |
| `credit-card` | Planos e assinaturas | auth | [SVG](svg/credit-card.svg) · [PNG](png/credit-card.png) |
| `analytics` | Relatórios e evolução | shared | [SVG](svg/analytics.svg) · [PNG](png/analytics.png) |
| `trend-up` | Crescimento de indicadores | calendar | [SVG](svg/trend-up.svg) · [PNG](png/trend-up.png) |
| `trend-down` | Queda de indicadores | calendar | [SVG](svg/trend-down.svg) · [PNG](png/trend-down.png) |
| `ai-assistant` | Prescrição e assistência de IA | exercises-ai | [SVG](svg/ai-assistant.svg) · [PNG](png/ai-assistant.png) |
| `sparkles` | Gerar conteúdo com IA | requested | [SVG](svg/sparkles.svg) · [PNG](png/sparkles.png) |
| `video` | Vídeo de exercício | exercises-ai | [SVG](svg/video.svg) · [PNG](png/video.png) |
| `play` | Reproduzir vídeo | exercises-ai | [SVG](svg/play.svg) · [PNG](png/play.png) |
| `pause` | Pausar vídeo | exercises-ai | [SVG](svg/pause.svg) · [PNG](png/pause.png) |
| `volume` | Volume do vídeo | exercises-ai | [SVG](svg/volume.svg) · [PNG](png/volume.png) |
| `fullscreen` | Expandir vídeo | exercises-ai | [SVG](svg/fullscreen.svg) · [PNG](png/fullscreen.png) |
| `captions` | Legendas automáticas | exercises-ai | [SVG](svg/captions.svg) · [PNG](png/captions.png) |
| `chat` | Chat e mensagens | calendar | [SVG](svg/chat.svg) · [PNG](png/chat.png) |
| `send` | Enviar mensagem | calendar | [SVG](svg/send.svg) · [PNG](png/send.png) |
| `mail` | E-mail, envio e verificação | auth | [SVG](svg/mail.svg) · [PNG](png/mail.png) |
| `notifications` | Notificações e alertas | rbac | [SVG](svg/notifications.svg) · [PNG](png/notifications.png) |
| `settings` | Configurações | shared | [SVG](svg/settings.svg) · [PNG](png/settings.png) |
| `sliders` | Preferências | auth | [SVG](svg/sliders.svg) · [PNG](png/sliders.png) |
| `security` | Segurança e política de acesso | rbac | [SVG](svg/security.svg) · [PNG](png/security.png) |
| `lock` | Senha, bloqueio e acesso negado | auth | [SVG](svg/lock.svg) · [PNG](png/lock.png) |
| `key` | Credencial e política de senha | requested | [SVG](svg/key.svg) · [PNG](png/key.png) |
| `two-factor` | Autenticação em dois fatores | rbac | [SVG](svg/two-factor.svg) · [PNG](png/two-factor.png) |
| `access-matrix` | Matriz de acesso | rbac | [SVG](svg/access-matrix.svg) · [PNG](png/access-matrix.png) |
| `audit` | Auditoria e logs | rbac | [SVG](svg/audit.svg) · [PNG](png/audit.png) |
| `history` | Histórico de atividade | requested | [SVG](svg/history.svg) · [PNG](png/history.png) |
| `integrations` | Integrações | rbac | [SVG](svg/integrations.svg) · [PNG](png/integrations.png) |
| `logout` | Sair da conta | auth | [SVG](svg/logout.svg) · [PNG](png/logout.png) |
| `login` | Entrar na conta | requested | [SVG](svg/login.svg) · [PNG](png/login.png) |
| `eye` | Mostrar senha | auth | [SVG](svg/eye.svg) · [PNG](png/eye.png) |
| `eye-off` | Ocultar senha | requested | [SVG](svg/eye-off.svg) · [PNG](png/eye-off.png) |
| `search` | Busca e filtros | shared | [SVG](svg/search.svg) · [PNG](png/search.png) |
| `filter` | Filtrar registros | requested | [SVG](svg/filter.svg) · [PNG](png/filter.png) |
| `plus` | Adicionar e criar | shared | [SVG](svg/plus.svg) · [PNG](png/plus.png) |
| `minus` | Remover ou reduzir | requested | [SVG](svg/minus.svg) · [PNG](png/minus.png) |
| `close` | Fechar janela | rbac | [SVG](svg/close.svg) · [PNG](png/close.png) |
| `check` | Confirmação e recomendação | shared | [SVG](svg/check.svg) · [PNG](png/check.png) |
| `check-circle` | Sucesso e presença | shared | [SVG](svg/check-circle.svg) · [PNG](png/check-circle.png) |
| `x-circle` | Falta e erro | calendar | [SVG](svg/x-circle.svg) · [PNG](png/x-circle.png) |
| `info` | Informação e prescrição | shared | [SVG](svg/info.svg) · [PNG](png/info.png) |
| `help` | Ajuda | auth | [SVG](svg/help.svg) · [PNG](png/help.png) |
| `warning` | Alerta de atenção | requested | [SVG](svg/warning.svg) · [PNG](png/warning.png) |
| `chevron-left` | Navegação, paginação e seleção | shared | [SVG](svg/chevron-left.svg) · [PNG](png/chevron-left.png) |
| `chevron-right` | Navegação, paginação e seleção | shared | [SVG](svg/chevron-right.svg) · [PNG](png/chevron-right.png) |
| `chevron-down` | Navegação, paginação e seleção | shared | [SVG](svg/chevron-down.svg) · [PNG](png/chevron-down.png) |
| `chevron-up` | Navegação, paginação e seleção | shared | [SVG](svg/chevron-up.svg) · [PNG](png/chevron-up.png) |
| `arrow-right` | Navegação, paginação e seleção | shared | [SVG](svg/arrow-right.svg) · [PNG](png/arrow-right.png) |
| `arrow-left` | Navegação, paginação e seleção | shared | [SVG](svg/arrow-left.svg) · [PNG](png/arrow-left.png) |
| `more-horizontal` | Mais ações | shared | [SVG](svg/more-horizontal.svg) · [PNG](png/more-horizontal.png) |
| `edit` | Editar perfil e permissões | rbac | [SVG](svg/edit.svg) · [PNG](png/edit.png) |
| `trash` | Excluir registro | requested | [SVG](svg/trash.svg) · [PNG](png/trash.png) |
| `export` | Exportar registros | rbac | [SVG](svg/export.svg) · [PNG](png/export.png) |
| `download` | Baixar arquivo | requested | [SVG](svg/download.svg) · [PNG](png/download.png) |
| `refresh` | Gerar outro exercício e atualizar | exercises-ai | [SVG](svg/refresh.svg) · [PNG](png/refresh.png) |
| `link` | Vincular referência | requested | [SVG](svg/link.svg) · [PNG](png/link.png) |
| `pin` | Dica do personal | exercises-ai | [SVG](svg/pin.svg) · [PNG](png/pin.png) |
| `level` | Nível de experiência | exercises-ai | [SVG](svg/level.svg) · [PNG](png/level.png) |
| `sets-reps` | Séries e repetições | exercises-ai | [SVG](svg/sets-reps.svg) · [PNG](png/sets-reps.png) |
| `muscle-group` | Grupo muscular | exercises-ai | [SVG](svg/muscle-group.svg) · [PNG](png/muscle-group.png) |
| `phone` | Telefone | calendar | [SVG](svg/phone.svg) · [PNG](png/phone.png) |
| `location` | Atendimento presencial | calendar | [SVG](svg/location.svg) · [PNG](png/location.png) |
| `heart` | Saúde e favoritos | requested | [SVG](svg/heart.svg) · [PNG](png/heart.png) |
| `nutrition` | Nutrição | requested | [SVG](svg/nutrition.svg) · [PNG](png/nutrition.png) |
| `instagram` | Rede social na manutenção | auth | [SVG](svg/instagram.svg) · [PNG](png/instagram.png) |
| `youtube` | Rede social na manutenção | auth | [SVG](svg/youtube.svg) · [PNG](png/youtube.png) |
| `linkedin` | Rede social na manutenção | auth | [SVG](svg/linkedin.svg) · [PNG](png/linkedin.png) |

## Branding
| Nome | Finalidade | Arquivos |
|---|---|---|
| aurafit-wordmark | Assinatura tipográfica aproximada | [SVG](brand/aurafit-wordmark.svg) · [PNG](brand/aurafit-wordmark.png) |

## Validação
Consulte validation.json: XML, elementos vetoriais, tamanho não zero, PNG decodificado, canal alfa, pixels transparentes e visíveis, dimensões e ausência de geometrias duplicadas.
