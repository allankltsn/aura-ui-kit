# Relatorio QA adversarial, lote 2

Base 5eb7d1d, commits 5e4c62a, c02ffb4, c22d24f. Nenhum codigo-fonte alterado. Saidas reais em `resultado-testes.txt` e `qa-saida-bruta.txt`.

## Suite existente (regressao)
typecheck, lint, test, build: exit 0. 19 arquivos, 139 testes, todos passando (ver resultado-testes.txt).

## O que foi tentado
24 testes em `qa-adversarial.test.tsx.txt`: axe em 20 variantes (0 violacoes), Button loading/disabled/submit, Switch teclado/controlado/disabled/controlado->nao controlado, Segmented (setas, vazio, value inexistente, names distintos), Dialog (Esc, X, backdrop, clique interno, foco de retorno, reabrir), TextField (aria-describedby, hint+erro), Input revealable, Alert, 32 pares de contraste em 2 temas.
Resultado: 19 passam, 5 falham (abaixo). Correcoes nao foram feitas (fora do escopo); "falha antes/passa depois" fica pendente.

## Defeitos

[SEVERITY: Medium] D1 Dialog: apos o primeiro pedido de fechar, Esc, X e backdrop param de chamar onClose se o pai nao fechar
Reproduction: teste "D1" - render `<Dialog open onClose={fn}>`, disparar cancel duas vezes e clicar "Fechar". Codigo: `closeRequested` (Dialog.tsx) so e resetado quando `open` vira true.
Expected: onClose chamado 3 vezes (pai pode recusar, ex.: "descartar alteracoes?").
Actual: 1 chamada; dialogo fica preso aberto e o usuario nao consegue fecha-lo por nenhum meio depois de uma recusa. Sugestao: resetar closeRequested apos a chamada (microtask) ou remover a trava.

[SEVERITY: Low] D2 Switch nao participa de formulario
Reproduction: teste "D2" - `<form><Switch defaultChecked name="notif"/></form>`, FormData nao contem "notif" (e um button, sem input oculto).
Expected/Actual: valor no FormData / ausente. Sugestao: input hidden com name, ou documentar.

[SEVERITY: Low] D3 Segmented nao aceita disabled
Reproduction: teste "D3". Expected radios desabilitados; Actual: prop nao existe/nao propaga.

[SEVERITY: Low] D4 TextField: `aria-describedby` do consumidor sobrescreve hint/erro
Reproduction: teste "D4" - `<TextField label="L" error="ruim" aria-describedby="externo"/>`. Expected: descricao acessivel contem "ruim". Actual: `{...rest}` vem depois e substitui, o erro some para leitor de tela. Sugestao: concatenar ids.

[SEVERITY: Low] D5 Contraste dark, nao texto, abaixo de 3:1
Reproduction: teste "CONTRASTE" / contraste.txt. Segmented ativo (primary #d0202b) sobre trilho surface-2 #2a2a2a = 2.68; polegar branco do Switch sobre track faint #999999 = 2.85. Minimo 3. O polegar e decorativo e a posicao tambem indica estado; o segmentado ativo tambem diferencia por cor do texto. Ainda assim abaixo do criterio 1.4.11.

## Observacoes sem defeito
- Todos os 62 demais pares de contraste passam. `on-danger` escuro (#1f1f1f sobre #f97066) OK.
- Sem capturas de tela: nao ha UI navegavel; contraste medido por formula, nao por render.
- Nao testado: comportamento real de showModal/focus trap (jsdom nao implementa); recomenda-se teste em navegador (Playwright) no Lote 4.

## Correções após o QA (controlador)

- D1 (Medium) corrigido: `Dialog` só deduplica pedidos de fechamento do mesmo tick. Teste: "novos pedidos de fechamento em ticks seguintes continuam chamando onClose" (falhou antes, passa depois).
- D4 (Low) corrigido: `TextField` concatena o `aria-describedby` do consumidor aos ids de hint e erro. Teste: "mantém hint e erro junto do aria-describedby externo" (falhou antes, passa depois).
- Suíte após as correções: 19 arquivos, 141/141 testes; typecheck, lint e prettier sem erros.
- Deferidos para decisão do usuário: D2 (Switch fora do FormData), D3 (Segmented sem `disabled`), D5 (contraste não textual no tema escuro: Segmented ativo 2,68:1 e polegar do Switch 2,85:1; exige decisão de token).
