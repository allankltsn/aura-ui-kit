# AuraFit — Kit de autenticação para Penpot

## Ordem de importação

1. Crie um arquivo Penpot `AuraFit · Authentication` e uma página `01 · Foundations`.
2. No painel **Tokens → Tools → Import**, importe apenas `tokens/penpot-import.json` (não importe o ZIP inteiro como arquivo Penpot). Confira os tipos de token no diálogo; `tokens.json` e `tokens.css` são referências para o frontend.
3. Escolha **Inter** no catálogo de fontes do Penpot. Cadastre estilos tipográficos usando as medidas em `docs/typography.md` e os tokens. Nomes `Inter_400Regular` etc. são aliases do projeto, não nomes de famílias separados.
4. Arraste os SVGs de `brand/`, `icons/svg/` e `components/` para uma página `02 · Assets`. Prefira SVG para edição, PNG para prévias ou quando a importação de SVG perder alguma propriedade.
5. Para cada tela, crie uma board de 960 × 650 px. Posicione o PNG de `backgrounds/` atrás das camadas editáveis, conforme `docs/screen-map.md`. A tela de cadastro usa painel preto liso sem foto.

## Limites e verificações

- As fotografias são rasterizadas; textos, inputs e botões devem continuar como camadas editáveis do Penpot.
- O ZIP não é um arquivo `.penpot`. É um kit de importação de assets e tokens.
- Os SVGs de componentes são exemplos de aparência. Transforme-os em componentes e variantes dentro do Penpot; confira edição de textos após a importação.
- Não há fontes binárias no pacote: use o catálogo de fontes do Penpot e escolha a família Inter. O projeto usa pesos 400, 500, 600 e 700.
- O texto jurídico dos protótipos deve passar por revisão antes da publicação.
