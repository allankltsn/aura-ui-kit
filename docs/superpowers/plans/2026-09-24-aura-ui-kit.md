# Aura Fit UI Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o UI Kit web do Aura Fit (componentes React + tokens + showcase) publicável como `@allankltsn/ui`.

**Architecture:** Pacote único na raiz do repo. `src/` é a biblioteca (tokens, ícones, componentes, layouts). `showcase/` é um app Vite que consome `src/` por alias e documenta cada componente e cada tela dos mockups. Um `package.json`, dois configs Vite (showcase e biblioteca).

**Tech Stack:** Vite 5, React 18, TypeScript 5.6 strict, Tailwind 3.4, Vitest 2 + Testing Library + vitest-axe, react-router-dom 6 (só showcase), pnpm 9, Node 22.

**Spec:** `docs/superpowers/specs/2026-09-24-aura-ui-kit-design.md`

## Global Constraints

- Shell: usar **PowerShell** neste ambiente (o Bash da ferramenta não encontra o `node`). Node 22 via nvm-windows.
- Não alterar nem depender de `mobile/` como código. Só é fonte de valores visuais aprovados (paleta, semânticas, dark, raios, sombras) e do SVG dos ícones Google/Apple.
- Só Tailwind para estilo. Sem CSS-in-JS. Classe reutilizável extraída só se o padrão se repetir 3 vezes ou mais.
- TypeScript `strict`. Nada de `any`.
- Componentes apresentacionais: sem dados de servidor. Props estendem os atributos nativos; `className` repassada; `forwardRef` em inputs e botões.
- Sem react-hook-form, Zod, TanStack Query, Orval, MSW. `react-router-dom` só em `showcase/`.
- Contraste WCAG AA: 4,5:1 texto normal, 3:1 texto grande e componentes. Alvo interativo com área mínima de 44×44px.
- Cor nunca é o único sinal. Foco visível em todo elemento interativo. Todo interativo acessível por teclado.
- Dark mode por classe `.dark` com CSS variables; nenhum hex literal em componentes.
- Sem larguras fixas em componentes.
- Exports nomeados em `src/index.ts`. `showcase/` e telas nunca entram no pacote.
- `mobile/`, `docs/`, `assets/` ficam fora de lint, tsc e testes.
- Versões de dependências: instalar com `pnpm add` respeitando os majors da stack (vite@^5, vitest@^2, tailwindcss@^3.4, typescript@~5.6, react@^18.3, tailwind-merge@^2, react-router-dom@^6). Não digitar versões de memória em `package.json`.
- Antes de marcar qualquer tarefa como concluída: `pnpm typecheck`, `pnpm lint` e `pnpm test` verdes.
- Cor primária: `#b1111b` (paleta aprovada do `mobile/`, igual ao `ui-designer`). O design kit em `assets/` usa `#C50B27`. Decidido pelo usuário.

## Review Focus

- Componente controlado vs. não controlado (Tabs, Switch, Checkbox, Segmented, Dialog) trocando de modo no meio da vida: não deve perder estado nem avisar erro no console.
- Dialog aberto por `open` e fechado por Esc, clique no backdrop ou botão: `onClose` dispara uma vez e o foco volta ao gatilho.
- Textos longos ou em português com acento (títulos de 2 linhas, e-mail longo em Input, nome longo em Avatar/Chip/DataTable): sem corte de acento nem estouro horizontal.
- `DataTable` e `Pagination` vazios ou com 1 página: mostram EmptyState/estado estático sem erro.
- Tema escuro: todo par de cor dos tokens passa o contraste nos dois temas (teste automatizado).
- Consumidor sem `Inter` instalada ou sem o preset: o kit degrada para fonte do sistema; classes não são purgadas se o `content` apontar para `node_modules/@allankltsn/ui` (documentado e conferido em `pnpm pack`).

## Execução em lotes (definida pelo usuário)

Método: `superpowers:subagent-driven-development`, com **um lote de 3 tarefas por vez** e **parada obrigatória para revisão e testes do usuário ao final de cada lote**. Não iniciar o lote seguinte sem aprovação explícita.

| Lote | Tarefas | Entrega para revisar |
|---|---|---|
| 1 | 1, 2, 3 | Projeto rodando, tokens com contraste provado, ícones e Logo |
| 2 | 4, 5, 6 | Button, Spinner, Badge, Alert, Card, Input/TextField, Dialog, Checkbox/Radio/Switch/Segmented |
| 3 | 7, 8, 9 | Feedback, navegação e dados |
| 4 | 10, 11, 12 | Layouts e showcase com as 24 páginas de componentes |
| 5 | 13, 14, 15 | 13 telas, empacotamento e validação da publicação, revisão final |

**Evidências obrigatórias ao fim de cada lote** (o `qa` gera; o controlador anexa e o usuário confere). Salvar em `docs/evidence/lote-N/`:
1. `resultado-testes.txt`: saída completa e sem cortes de `pnpm typecheck`, `pnpm lint`, `pnpm test` (com contagem de arquivos e testes, passados e falhados) e `pnpm build`.
2. `qa-relatorio.md`: relatório do agente `qa` com o que tentou quebrar, cada defeito achado, a correção e o teste que prova a correção (falha antes, passa depois, com o comando e a saída dos dois).
3. `a11y-axe.txt`: resultado do `vitest-axe` por componente do lote (zero violações) e, quando houver UI navegável, captura de tela nos temas claro e escuro.
4. `contraste.txt`: tabela de razões de contraste dos tokens e pares usados no lote, com o mínimo exigido e o valor medido.
5. `git-log.txt`: `git log --oneline` do lote e `git diff --stat` contra o lote anterior.
6. `como-testar.md`: passos curtos para o usuário repetir os testes e ver o resultado (`pnpm dev`, rotas, atalhos de teclado a testar).
O `qa` roda cada comando de verdade e cola a saída real. Nenhum número entra nas evidências sem ter sido medido naquela execução.
---

## File Structure

```
package.json  tsconfig.json  vite.config.ts  vite.lib.config.ts (Task 13)
tailwind.config.ts  postcss.config.js  eslint.config.js  .prettierrc.json
.node-version  .gitignore  index.html
scripts/
  tokens-css.mjs        função pura que gera o CSS das variáveis
  build-tokens-css.mjs  escreve src/tokens/tokens.css
  icons-module.mjs      funções puras: extrai o miolo dos SVGs
  build-icons.mjs       escreve src/icons/icons.generated.ts
src/
  index.ts
  lib/cn.ts
  test/setup.ts  test/vitest-axe.d.ts  test/render.tsx
  tokens/tokens.json  tokens.css (gerado)  preset.ts  contrast.ts
  icons/Icon.tsx  SocialIcon.tsx  icons.generated.ts (gerado)
  hooks/useControllableState.ts  useDismissOnEscape.ts
  components/<Nome>/<Nome>.tsx  <Nome>.test.tsx  index.ts
  layouts/AuthLayout  DashboardShell
showcase/
  main.tsx  App.tsx  index.css  theme.tsx
  layout/ShowcaseLayout.tsx  layout/ComponentPage.tsx
  pages/components/*.tsx  pages/screens/*.tsx  routes.tsx
```

---

### Task 1: Scaffold do projeto

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `eslint.config.js`, `.prettierrc.json`, `.node-version`, `.gitignore`, `index.html`
- Create: `src/lib/cn.ts`, `src/lib/cn.test.ts`, `src/test/setup.ts`, `src/test/vitest-axe.d.ts`, `src/test/render.tsx`, `src/index.ts`
- Create: `showcase/main.tsx`, `showcase/App.tsx`, `showcase/index.css`

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string` em `src/lib/cn.ts`; alias `@` → `src`; `renderUi(ui)` em `src/test/render.tsx`; `expect(...).toHaveNoViolations()` global.

- [ ] **Step 1: Preparar Node e pnpm (PowerShell)**

```powershell
node -v                       # esperado v22.x
corepack enable
corepack prepare pnpm@9 --activate
pnpm -v                       # esperado 9.x
```
Se `corepack enable` falhar com EPERM, usar `npm install -g pnpm@9` e conferir com `pnpm -v`.

- [ ] **Step 2: Criar arquivos de configuração base**

`.node-version`:
```
22
```

`.gitignore`:
```
node_modules
dist
*.tsbuildinfo
coverage
.DS_Store
```

`package.json`:
```json
{
  "name": "@allankltsn/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@9.15.0",
  "engines": { "node": ">=22" },
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:watch": "vitest",
    "tokens": "node scripts/build-tokens-css.mjs",
    "icons": "node scripts/build-icons.mjs"
  }
}
```
Se `pnpm -v` mostrar outra 9.x, ajustar `packageManager` para essa versão.

- [ ] **Step 3: Instalar dependências**

```powershell
pnpm add clsx tailwind-merge@^2
pnpm add -D react@^18.3 react-dom@^18.3 @types/react@^18.3 @types/react-dom@^18.3 typescript@~5.6 vite@^5 @vitejs/plugin-react@^4 tailwindcss@^3.4 postcss autoprefixer vitest@^2 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest-axe react-router-dom@^6 @fontsource/inter eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-jsx-a11y globals prettier prettier-plugin-tailwindcss
```
Esperado: instala sem erro. Conferir com `pnpm ls tailwindcss vite vitest react typescript` os majors 3, 5, 2, 18, 5.6.

- [ ] **Step 4: `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["vitest/globals"],
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src", "showcase", "scripts", "*.ts"],
  "exclude": ["node_modules", "dist", "mobile", "docs", "assets"]
}
```

- [ ] **Step 5: `vite.config.ts`, `postcss.config.js`, `tailwind.config.ts`**

`vite.config.ts`:
```ts
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'showcase/**/*.test.{ts,tsx}', 'scripts/**/*.test.{ts,mjs}'],
    css: false,
  },
});
```

`postcss.config.js`:
```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

`tailwind.config.ts` (o preset entra na Task 2):
```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', './showcase/**/*.{ts,tsx}'],
} satisfies Config;
```

- [ ] **Step 6: ESLint e Prettier**

`eslint.config.js`:
```js
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  { ignores: ['dist', 'mobile', 'docs', 'assets', 'coverage', '**/*.generated.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { 'react-hooks': reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
  },
  {
    files: ['scripts/**/*.mjs', '*.config.{js,ts}'],
    languageOptions: { globals: { ...globals.node } },
  },
);
```

`.prettierrc.json`:
```json
{ "singleQuote": true, "trailingComma": "all", "printWidth": 100, "plugins": ["prettier-plugin-tailwindcss"] }
```

Adicionar `.prettierignore`:
```
dist
mobile
docs
assets
pnpm-lock.yaml
*.generated.ts
src/tokens/tokens.css
```

- [ ] **Step 7: Escrever o teste falho de `cn`**

`src/lib/cn.test.ts`:
```ts
import { cn } from './cn';

describe('cn', () => {
  it('junta classes e ignora valores falsos', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c');
  });

  it('resolve conflitos do Tailwind mantendo a última', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('não confunde tamanhos de fonte customizados com cores de texto', () => {
    expect(cn('text-body', 'text-primary')).toBe('text-body text-primary');
    expect(cn('text-body', 'text-caption')).toBe('text-caption');
  });
});
```

- [ ] **Step 8: Rodar e ver falhar**

Run: `pnpm test`
Expected: FAIL, "Failed to resolve import ./cn".

- [ ] **Step 9: Implementar `cn`**

`src/lib/cn.ts`:
```ts
import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: ['display', 'heading-lg', 'heading-md', 'heading-sm', 'body', 'body-medium', 'label', 'caption', 'button'],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 10: Setup de testes**

`src/test/setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';

expect.extend(axeMatchers);

// jsdom não implementa <dialog>.
HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
  this.removeAttribute('open');
  this.dispatchEvent(new Event('close'));
};
```

`src/test/vitest-axe.d.ts`:
```ts
import 'vitest';

declare module 'vitest' {
  interface Assertion {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
```

`src/test/render.tsx`:
```tsx
import { render, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';

export function renderUi(ui: ReactElement): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
  return { user: userEvent.setup(), ...render(ui) };
}
```

- [ ] **Step 11: Entradas mínimas do app e do pacote**

`src/index.ts`:
```ts
export { cn } from './lib/cn';
```

`index.html`:
```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Aura Fit UI Kit</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/showcase/main.tsx"></script>
  </body>
</html>
```

`showcase/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`showcase/main.tsx`:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './index.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`showcase/App.tsx`:
```tsx
export function App() {
  return <h1>Aura Fit UI Kit</h1>;
}
```

- [ ] **Step 12: Verificar tudo verde**

Run: `pnpm typecheck; pnpm lint; pnpm test; pnpm build`
Expected: `cn` com 3 testes passando; typecheck, lint e build sem erro.

- [ ] **Step 13: Commit**

```powershell
git checkout -b feat/ui-kit-foundation
git add <somente os arquivos criados ou alterados nesta tarefa, por caminho; nunca -A nem ponto>
git commit -m "chore: scaffold do UI Kit (Vite, React 18, Tailwind 3.4, Vitest)" -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Tokens (fonte única, CSS vars, preset Tailwind, contraste)

**Files:**
- Create: `src/tokens/tokens.json`, `src/tokens/contrast.ts`, `src/tokens/contrast.test.ts`, `src/tokens/preset.ts`, `src/tokens/preset.test.ts`, `src/tokens/tokens.css` (gerado)
- Create: `scripts/tokens-css.mjs`, `scripts/build-tokens-css.mjs`, `scripts/tokens-css.test.ts`
- Modify: `tailwind.config.ts`, `showcase/index.css`

**Interfaces:**
- Consumes: nada das tarefas anteriores além do setup de testes.
- Produces: `tokens.json` com `color.light`, `color.dark`, `typography`, `radius`, `shadow`; `contrastRatio(a: string, b: string): number`; `renderTokensCss(tokens): string`; default export de `preset.ts`. Classes Tailwind resultantes: `bg-bg bg-surface bg-surface-2 border-line border-line-strong text-ink text-muted text-faint bg-primary bg-primary-hover bg-primary-press bg-primary-soft border-primary-line text-on-primary text-accent-text` e `{success,warning,danger,info}` com sufixos `-bg` e `-text`; `text-{display,heading-lg,heading-md,heading-sm,body,body-medium,label,caption,button}`; `rounded-{xs,sm,md,lg}`; `shadow-elev-{1,2,3}`.

- [ ] **Step 1: Confirmar a cor primária com o usuário**

O `mobile/` e o `ui-designer` usam `#b1111b`; o design kit em `assets/AuraFit-auth-design-kit/tokens` usa `#C50B27`. Perguntar ao usuário qual vale. O restante deste plano usa `#b1111b`. Decisão já tomada pelo usuário: **`#b1111b`**. Nada a trocar; este passo é só registrar a decisão no commit.

- [ ] **Step 2: Criar `src/tokens/tokens.json`**

`faint` e `danger-text` foram escurecidos em relação ao `mobile/` (relatório de análise, seção 5.3); `danger` deixa de ser igual a `primary`; `info` foi adicionado.

```json
{
  "color": {
    "light": {
      "bg": "#f5f5f5",
      "surface": "#ffffff",
      "surface-2": "#efefef",
      "line": "#e3e3e3",
      "line-strong": "#cfcfcf",
      "ink": "#1f1f1f",
      "muted": "#5c5c5c",
      "faint": "#666666",
      "primary": "#b1111b",
      "primary-hover": "#960f17",
      "primary-press": "#7b0c13",
      "primary-soft": "#fbe8e9",
      "primary-line": "#ecb4b8",
      "on-primary": "#ffffff",
      "accent-text": "#b1111b",
      "success": "#22a45d",
      "success-bg": "#e3f5ea",
      "success-text": "#137a3d",
      "warning": "#e2a400",
      "warning-bg": "#fdf0cc",
      "warning-text": "#855800",
      "danger": "#d92d20",
      "danger-bg": "#fdecea",
      "danger-text": "#b42318",
      "info": "#175cd3",
      "info-bg": "#eff4ff",
      "info-text": "#175cd3"
    },
    "dark": {
      "bg": "#141414",
      "surface": "#1f1f1f",
      "surface-2": "#2a2a2a",
      "line": "#333333",
      "line-strong": "#4a4a4a",
      "ink": "#f5f5f5",
      "muted": "#b0b0b0",
      "faint": "#999999",
      "primary": "#b1111b",
      "primary-hover": "#c9202a",
      "primary-press": "#960f17",
      "primary-soft": "#451b1e",
      "primary-line": "#7a1a21",
      "on-primary": "#ffffff",
      "accent-text": "#ff6f78",
      "success": "#52d88a",
      "success-bg": "#1f3429",
      "success-text": "#52d88a",
      "warning": "#f1b93a",
      "warning-bg": "#3e341a",
      "warning-text": "#f1b93a",
      "danger": "#f97066",
      "danger-bg": "#3a1a18",
      "danger-text": "#ff8a80",
      "info": "#84adff",
      "info-bg": "#16233d",
      "info-text": "#84adff"
    }
  },
  "typography": {
    "display": [32, 40, 700],
    "heading-lg": [26, 34, 700],
    "heading-md": [22, 30, 700],
    "heading-sm": [18, 26, 600],
    "body": [14, 22, 400],
    "body-medium": [14, 22, 500],
    "label": [12, 18, 600],
    "caption": [11, 16, 400],
    "button": [13, 20, 600]
  },
  "radius": { "xs": "4px", "sm": "8px", "md": "10px", "lg": "12px" },
  "shadow": {
    "elev-1": "0 1px 2px rgb(31 31 31 / 0.06)",
    "elev-2": "0 4px 14px rgb(31 31 31 / 0.09)",
    "elev-3": "0 18px 44px rgb(31 31 31 / 0.18)"
  }
}
```

- [ ] **Step 3: Escrever o teste de contraste (falha)**

`src/tokens/contrast.test.ts`:
```ts
import tokens from './tokens.json';
import { contrastRatio } from './contrast';

type Theme = keyof typeof tokens.color;

const PAIRS: Array<[string, string, number]> = [
  ['ink', 'bg', 4.5], ['ink', 'surface', 4.5], ['ink', 'surface-2', 4.5],
  ['muted', 'bg', 4.5], ['muted', 'surface', 4.5], ['muted', 'surface-2', 4.5],
  ['faint', 'bg', 4.5], ['faint', 'surface', 4.5], ['faint', 'surface-2', 4.5],
  ['on-primary', 'primary', 4.5], ['on-primary', 'primary-hover', 4.5],
  ['accent-text', 'surface', 4.5], ['accent-text', 'bg', 4.5], ['accent-text', 'primary-soft', 4.5],
  ['success-text', 'success-bg', 4.5], ['warning-text', 'warning-bg', 4.5],
  ['danger-text', 'danger-bg', 4.5], ['info-text', 'info-bg', 4.5],
  ['success-text', 'surface', 4.5], ['danger-text', 'surface', 4.5], ['info-text', 'surface', 4.5],
  // componentes e ícones: 3:1
  ['primary', 'surface', 3], ['success', 'surface', 3], ['danger', 'surface', 3],
];

describe('contraste dos tokens (WCAG AA)', () => {
  for (const theme of Object.keys(tokens.color) as Theme[]) {
    describe(theme, () => {
      const c = tokens.color[theme] as Record<string, string>;
      it.each(PAIRS)('%s sobre %s >= %f', (fg, bg, min) => {
        const ratio = contrastRatio(c[fg]!, c[bg]!);
        expect(ratio, `${fg} ${c[fg]} sobre ${bg} ${c[bg]} = ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(min);
      });
    });
  }

  it('danger não reaproveita o hex da marca', () => {
    expect(tokens.color.light.danger).not.toBe(tokens.color.light.primary);
  });

  it('light e dark têm as mesmas chaves', () => {
    expect(Object.keys(tokens.color.dark).sort()).toEqual(Object.keys(tokens.color.light).sort());
  });
});
```

- [ ] **Step 4: Rodar e ver falhar**

Run: `pnpm test src/tokens/contrast.test.ts`
Expected: FAIL, "Failed to resolve import ./contrast".

- [ ] **Step 5: Implementar `src/tokens/contrast.ts`**

```ts
function channel(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
```

- [ ] **Step 6: Rodar; corrigir tokens que falharem**

Run: `pnpm test src/tokens/contrast.test.ts`
Expected: PASS. Se algum par falhar, a mensagem mostra o valor: escurecer (tema claro) ou clarear (tema escuro) o token em `tokens.json` até passar. Não baixar o limite do teste.

- [ ] **Step 7: Teste do gerador de CSS (falha)**

`scripts/tokens-css.test.ts`:
```ts
import { readFileSync } from 'node:fs';
import tokens from '../src/tokens/tokens.json';
// @ts-expect-error módulo .mjs sem tipos
import { renderTokensCss } from './tokens-css.mjs';

describe('renderTokensCss', () => {
  const css: string = renderTokensCss(tokens);

  it('converte hex em canais RGB para suportar opacidade', () => {
    expect(css).toContain('--color-primary: 177 17 27;');
  });

  it('gera o tema escuro sob .dark', () => {
    expect(css).toMatch(/\.dark\s*{[^}]*--color-bg: 20 20 20;/);
  });

  it('src/tokens/tokens.css está em dia com tokens.json', () => {
    const onDisk = readFileSync(new URL('../src/tokens/tokens.css', import.meta.url), 'utf8');
    expect(onDisk).toBe(css);
  });
});
```

- [ ] **Step 8: Implementar o gerador**

`scripts/tokens-css.mjs`:
```js
function rgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

function block(selector, colors) {
  const lines = Object.entries(colors).map(([k, v]) => `  --color-${k}: ${rgb(v)};`);
  return `${selector} {\n${lines.join('\n')}\n}\n`;
}

export function renderTokensCss(tokens) {
  return (
    '/* Gerado por scripts/build-tokens-css.mjs a partir de tokens.json. Não edite. */\n' +
    block(':root', tokens.color.light) +
    '\n' +
    block('.dark', tokens.color.dark)
  );
}
```

`scripts/build-tokens-css.mjs`:
```js
import { readFileSync, writeFileSync } from 'node:fs';
import { renderTokensCss } from './tokens-css.mjs';

const tokens = JSON.parse(readFileSync(new URL('../src/tokens/tokens.json', import.meta.url), 'utf8'));
writeFileSync(new URL('../src/tokens/tokens.css', import.meta.url), renderTokensCss(tokens));
console.log('tokens.css atualizado');
```

- [ ] **Step 9: Gerar o CSS e ver passar**

Run: `pnpm tokens; pnpm test scripts/tokens-css.test.ts`
Expected: PASS (3 testes).

- [ ] **Step 10: Teste do preset (falha)**

`src/tokens/preset.test.ts`:
```ts
import preset from './preset';

describe('preset Tailwind', () => {
  const ext = preset.theme.extend as Record<string, Record<string, unknown>>;

  it('usa dark mode por classe', () => {
    expect(preset.darkMode).toBe('class');
  });

  it('mapeia cores para variáveis CSS com suporte a opacidade', () => {
    expect(ext.colors!.primary).toBe('rgb(var(--color-primary) / <alpha-value>)');
    expect(ext.colors!['surface-2']).toBe('rgb(var(--color-surface-2) / <alpha-value>)');
  });

  it('gera a escala tipográfica a partir dos tokens', () => {
    expect(ext.fontSize!.display).toEqual(['32px', { lineHeight: '40px', fontWeight: '700' }]);
    expect(ext.fontSize!.caption).toEqual(['11px', { lineHeight: '16px', fontWeight: '400' }]);
  });

  it('expõe raios e sombras', () => {
    expect(ext.borderRadius!.lg).toBe('12px');
    expect(ext.boxShadow!['elev-2']).toContain('14px');
  });
});
```

- [ ] **Step 11: Implementar `src/tokens/preset.ts`**

```ts
import type { Config } from 'tailwindcss';
import tokens from './tokens.json';

const colors = Object.fromEntries(
  Object.keys(tokens.color.light).map((name) => [name, `rgb(var(--color-${name}) / <alpha-value>)`]),
);

const fontSize = Object.fromEntries(
  Object.entries(tokens.typography).map(([name, [size, line, weight]]) => [
    name,
    [`${size}px`, { lineHeight: `${line}px`, fontWeight: String(weight) }],
  ]),
);

const preset = {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      colors,
      fontSize,
      borderRadius: tokens.radius,
      boxShadow: tokens.shadow,
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
} satisfies Config;

export default preset;
```

- [ ] **Step 12: Ligar o preset ao app e criar o CSS base**

`tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss';
import preset from './src/tokens/preset';

export default {
  presets: [preset],
  content: ['./index.html', './src/**/*.{ts,tsx}', './showcase/**/*.{ts,tsx}'],
} satisfies Config;
```

`showcase/index.css`:
```css
@import '../src/tokens/tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-bg font-sans text-body text-ink antialiased;
  }
}
```

- [ ] **Step 13: Verificar**

Run: `pnpm typecheck; pnpm lint; pnpm test; pnpm build`
Expected: tudo verde.

- [ ] **Step 14: Commit**

```powershell
git add <somente os arquivos criados ou alterados nesta tarefa, por caminho; nunca -A nem ponto>
git commit -m "feat(tokens): tokens únicos, CSS vars, preset Tailwind e teste de contraste" -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: Ícones, ícones sociais e Logo

**Files:**
- Create: `scripts/icons-module.mjs`, `scripts/build-icons.mjs`, `scripts/icons-module.test.ts`
- Create: `src/icons/icons.generated.ts` (gerado), `src/icons/Icon.tsx`, `src/icons/Icon.test.tsx`, `src/icons/SocialIcon.tsx`, `src/icons/index.ts`
- Create: `src/components/Logo/Logo.tsx`, `src/components/Logo/Logo.test.tsx`, `src/components/Logo/index.ts`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `cn` (Task 1).
- Produces: `type IconName`; `<Icon name size? title? className? />`; `<GoogleIcon size? />`, `<AppleIcon size? />`; `<Logo size? variant? />` com `variant: 'on-light' | 'on-dark' | 'on-red'`.

- [ ] **Step 1: Teste do extrator de SVG (falha)**

`scripts/icons-module.test.ts`:
```ts
// @ts-expect-error módulo .mjs sem tipos
import { extractInner, buildIconsModule } from './icons-module.mjs';

const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M1 1"/><circle cx="12" cy="12" r="3"/></svg>';

describe('extractInner', () => {
  it('devolve só o miolo do SVG', () => {
    expect(extractInner(svg)).toBe('<path d="M1 1"/><circle cx="12" cy="12" r="3"/>');
  });

  it('lança erro para arquivo sem <svg>', () => {
    expect(() => extractInner('<div/>')).toThrow(/svg/);
  });
});

describe('buildIconsModule', () => {
  it('gera o módulo com nomes ordenados e o tipo IconName', () => {
    const out: string = buildIconsModule({ b: '<path/>', a: '<circle/>' });
    expect(out.indexOf("'a'")).toBeLessThan(out.indexOf("'b'"));
    expect(out).toContain('export type IconName = keyof typeof iconPaths;');
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm test scripts/icons-module.test.ts`
Expected: FAIL, "Failed to resolve import".

- [ ] **Step 3: Implementar o gerador**

`scripts/icons-module.mjs`:
```js
export function extractInner(svg) {
  const match = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!match) throw new Error('arquivo sem <svg>');
  return match[1].trim();
}

export function buildIconsModule(icons) {
  const entries = Object.keys(icons)
    .sort()
    .map((name) => `  '${name}': ${JSON.stringify(icons[name])},`);
  return (
    '// Gerado por scripts/build-icons.mjs a partir de assets/aurafit-icons/svg. Não edite.\n' +
    `export const iconPaths = {\n${entries.join('\n')}\n} as const;\n\n` +
    'export type IconName = keyof typeof iconPaths;\n'
  );
}
```

`scripts/build-icons.mjs`:
```js
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { buildIconsModule, extractInner } from './icons-module.mjs';

const dir = new URL('../assets/aurafit-icons/svg/', import.meta.url);
const icons = {};
for (const file of readdirSync(dir).filter((f) => f.endsWith('.svg'))) {
  icons[basename(file, '.svg')] = extractInner(readFileSync(new URL(file, dir), 'utf8'));
}
writeFileSync(new URL('../src/icons/icons.generated.ts', import.meta.url), buildIconsModule(icons));
console.log(`${Object.keys(icons).length} ícones gerados`);
```

- [ ] **Step 4: Gerar e ver passar**

Run: `pnpm icons; pnpm test scripts/icons-module.test.ts`
Expected: "83 ícones gerados" (ou o total atual da pasta) e PASS.

- [ ] **Step 5: Teste do `Icon` (falha)**

`src/icons/Icon.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Icon } from './Icon';
import { iconPaths } from './icons.generated';

describe('Icon', () => {
  it('é decorativo por padrão', () => {
    const { container } = render(<Icon name="home" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('width', '20');
  });

  it('com title vira imagem acessível', () => {
    render(<Icon name="home" title="Início" size={24} />);
    expect(screen.getByRole('img', { name: 'Início' })).toHaveAttribute('width', '24');
  });

  it('usa currentColor para herdar a cor do texto', () => {
    const { container } = render(<Icon name="eye" />);
    expect(container.querySelector('svg')).toHaveAttribute('stroke', 'currentColor');
  });

  it('todo ícone tem conteúdo', () => {
    for (const [name, inner] of Object.entries(iconPaths)) {
      expect(inner.length, name).toBeGreaterThan(0);
    }
  });

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Icon name="home" title="Início" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 6: Implementar `Icon`, `SocialIcon` e o barrel**

`src/icons/Icon.tsx`:
```tsx
import type { SVGProps } from 'react';
import { cn } from '@/lib/cn';
import { iconPaths, type IconName } from './icons.generated';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'name'> {
  name: IconName;
  size?: number;
  /** Quando informado, o ícone vira uma imagem acessível; sem ele fica oculto para leitores de tela. */
  title?: string;
}

export function Icon({ name, size = 20, title, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      className={cn('shrink-0', className)}
      // O conteúdo vem de assets/aurafit-icons/svg, gerado em build (confiável, sem entrada do usuário).
      dangerouslySetInnerHTML={{ __html: iconPaths[name] }}
      {...rest}
    />
  );
}
```

`src/icons/SocialIcon.tsx` (paths reaproveitados do `mobile/`, cores fixas por norma das plataformas):
```tsx
export interface SocialIconProps {
  size?: number;
}

export function GoogleIcon({ size = 18 }: SocialIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33z" fill="#FBBC05" />
      <path d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

/** A maçã herda `currentColor`, então funciona em fundo claro e escuro. */
export function AppleIcon({ size = 18 }: SocialIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M13.15 9.53c-.02-1.86 1.52-2.76 1.59-2.8-.87-1.27-2.22-1.44-2.7-1.46-1.15-.12-2.25.68-2.83.68-.59 0-1.48-.66-2.44-.65-1.25.02-2.42.73-3.06 1.85-1.32 2.29-.34 5.67.95 7.52.63.9 1.38 1.91 2.36 1.87.95-.04 1.31-.61 2.46-.61s1.48.61 2.48.59c1.03-.02 1.68-.92 2.3-1.83.72-1.05 1.02-2.07 1.03-2.12-.02-.01-1.98-.76-2-3.04z" />
      <path d="M11.29 3.98c.52-.63.87-1.5.77-2.37-.75.03-1.65.5-2.19 1.12-.48.55-.9 1.44-.79 2.28.83.06 1.68-.42 2.21-1.03z" />
    </svg>
  );
}
```

`src/icons/index.ts`:
```ts
export { Icon, type IconProps } from './Icon';
export type { IconName } from './icons.generated';
export { GoogleIcon, AppleIcon, type SocialIconProps } from './SocialIcon';
```

- [ ] **Step 7: Teste do `Logo` (falha)**

`src/components/Logo/Logo.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Logo } from './Logo';

describe('Logo', () => {
  it('tem nome acessível único, sem ler as partes do wordmark', () => {
    render(<Logo />);
    expect(screen.getByRole('img', { name: 'aura-fit' })).toBeInTheDocument();
  });

  it('só o hífen é vermelho sobre fundo claro', () => {
    const { container } = render(<Logo variant="on-light" />);
    expect(container.querySelector('[data-part="hyphen"]')).toHaveClass('text-primary');
  });

  it('sobre vermelho o wordmark inteiro fica branco', () => {
    const { container } = render(<Logo variant="on-red" />);
    expect(container.querySelector('[data-part="hyphen"]')).toHaveClass('text-on-primary');
  });

  it('aplica o tamanho em px e não tem violações de acessibilidade', async () => {
    const { container } = render(<Logo size={40} />);
    expect(screen.getByRole('img')).toHaveStyle({ fontSize: '40px' });
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 8: Implementar o `Logo`**

Regra da marca: minúsculas, peso 700, tracking curto; o hífen é o único elemento vermelho, exceto sobre fundo vermelho, em que tudo fica branco.

`src/components/Logo/Logo.tsx`:
```tsx
import { cn } from '@/lib/cn';

export type LogoVariant = 'on-light' | 'on-dark' | 'on-red';

export interface LogoProps {
  /** Tamanho da fonte em px. Escala da marca: 64, 40, 28, 20 (20 é o mínimo legível). */
  size?: number;
  variant?: LogoVariant;
  className?: string;
}

const word: Record<LogoVariant, string> = {
  'on-light': 'text-ink',
  'on-dark': 'text-white',
  'on-red': 'text-on-primary',
};

const hyphen: Record<LogoVariant, string> = {
  'on-light': 'text-primary',
  'on-dark': 'text-primary',
  'on-red': 'text-on-primary',
};

export function Logo({ size = 28, variant = 'on-light', className }: LogoProps) {
  return (
    <span
      role="img"
      aria-label="aura-fit"
      className={cn('inline-flex items-baseline font-bold leading-none tracking-[-0.045em]', word[variant], className)}
      style={{ fontSize: size }}
    >
      <span aria-hidden="true">aura</span>
      <span aria-hidden="true" data-part="hyphen" className={hyphen[variant]}>-</span>
      <span aria-hidden="true">fit</span>
    </span>
  );
}
```

`src/components/Logo/index.ts`:
```ts
export { Logo, type LogoProps, type LogoVariant } from './Logo';
```

- [ ] **Step 9: Exportar no pacote**

`src/index.ts`:
```ts
export { cn } from './lib/cn';
export * from './icons';
export * from './components/Logo';
```

- [ ] **Step 10: Verificar**

Run: `pnpm typecheck; pnpm lint; pnpm test`
Expected: tudo verde. Se o axe reclamar de `role="img"` com filhos `aria-hidden`, manter como está: o padrão é válido.

- [ ] **Step 11: Commit**

```powershell
git add <somente os arquivos criados ou alterados nesta tarefa, por caminho; nunca -A nem ponto>
git commit -m "feat(icons): Icon gerado dos SVGs da marca, ícones sociais e Logo" -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: Conjunto mínimo (Button, Spinner, Badge, Alert, Card)

**Files:**
- Create: `src/components/Button/{Button.tsx,Button.test.tsx,index.ts}`
- Create: `src/components/Spinner/{Spinner.tsx,Spinner.test.tsx,index.ts}`
- Create: `src/components/Badge/{Badge.tsx,Badge.test.tsx,index.ts}`
- Create: `src/components/Alert/{Alert.tsx,Alert.test.tsx,index.ts}`
- Create: `src/components/Card/{Card.tsx,Card.test.tsx,index.ts}`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `cn`, `Icon`/`IconName` (Tasks 1 e 3).
- Produces:
  - `Button`: props `variant?: 'primary' | 'outline' | 'ghost' | 'danger'` (padrão `primary`), `size?: 'sm' | 'md' | 'lg'` (padrão `md`), `loading?: boolean`, `leftIcon?: IconName`, `fullWidth?: boolean` + atributos de `<button>`; `forwardRef<HTMLButtonElement>`.
  - `Spinner`: `size?: number`, `label?: string` (padrão `'Carregando'`).
  - `Badge`: `tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'` (padrão `neutral`), `icon?: IconName`; `children`.
  - `Alert`: `tone?: 'info' | 'success' | 'warning' | 'danger'` (padrão `info`), `title?: string`, `onDismiss?: () => void`; `children`; `role="alert"` para warning/danger e `role="status"` para o resto.
  - `Card`: `Card`, `CardHeader`, `CardBody`, `CardFooter` (divs); `Card` aceita `padded?: boolean` (padrão `true`).

- [ ] **Step 1: Teste do `Spinner` e do `Button` (falha)**

`src/components/Spinner/Spinner.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('anuncia o estado de carregamento', () => {
    render(<Spinner />);
    expect(screen.getByRole('status', { name: 'Carregando' })).toBeInTheDocument();
  });

  it('aceita rótulo customizado e não tem violações', async () => {
    const { container } = render(<Spinner label="Salvando" />);
    expect(screen.getByRole('status', { name: 'Salvando' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

`src/components/Button/Button.test.tsx`:
```tsx
import { createRef } from 'react';
import { axe } from 'vitest-axe';
import { renderUi } from '@/test/render';
import { Button } from './Button';

describe('Button', () => {
  it('dispara onClick e tem type=button por padrão', async () => {
    const onClick = vi.fn();
    const { user, getByRole } = renderUi(<Button onClick={onClick}>Entrar</Button>);
    const btn = getByRole('button', { name: 'Entrar' });
    expect(btn).toHaveAttribute('type', 'button');
    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ativa por teclado (Enter e Espaço)', async () => {
    const onClick = vi.fn();
    const { user, getByRole } = renderUi(<Button onClick={onClick}>Entrar</Button>);
    getByRole('button').focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('desabilitado não dispara onClick', async () => {
    const onClick = vi.fn();
    const { user, getByRole } = renderUi(<Button disabled onClick={onClick}>Entrar</Button>);
    await user.click(getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('loading bloqueia cliques, marca aria-busy e mantém o rótulo', async () => {
    const onClick = vi.fn();
    const { user, getByRole } = renderUi(<Button loading onClick={onClick}>Salvar</Button>);
    const btn = getByRole('button', { name: /Salvar/ });
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('repassa ref e className', () => {
    const ref = createRef<HTMLButtonElement>();
    const { getByRole } = renderUi(<Button ref={ref} className="extra">Ok</Button>);
    expect(ref.current).toBe(getByRole('button'));
    expect(getByRole('button')).toHaveClass('extra');
  });

  it('variantes e tamanhos aplicam as classes esperadas', () => {
    const { getByRole } = renderUi(<Button variant="outline" size="lg">Ok</Button>);
    expect(getByRole('button')).toHaveClass('border', 'h-12');
  });

  it('não tem violações de acessibilidade', async () => {
    const { container } = renderUi(<Button leftIcon="plus">Novo</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm test src/components`
Expected: FAIL, imports não resolvidos.

- [ ] **Step 3: Implementar `Spinner`**

`src/components/Spinner/Spinner.tsx`:
```tsx
import { cn } from '@/lib/cn';

export interface SpinnerProps {
  size?: number;
  label?: string;
  className?: string;
}

export function Spinner({ size = 20, label = 'Carregando', className }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={cn('inline-flex', className)}>
      <svg
        aria-hidden="true"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin motion-reduce:animate-none"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  );
}
```

`src/components/Spinner/index.ts`:
```ts
export { Spinner, type SpinnerProps } from './Spinner';
```

- [ ] **Step 4: Implementar `Button`**

Alvos de toque: `sm` tem 36px visíveis e uma área expandida por `after:` para chegar a 44px.

`src/components/Button/Button.tsx`:
```tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from '@/icons';
import { Spinner } from '../Spinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: IconName;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-press',
  outline: 'border border-line-strong bg-surface text-ink hover:bg-surface-2 active:bg-line',
  ghost: 'text-ink hover:bg-surface-2 active:bg-line',
  danger: 'bg-danger text-white hover:opacity-90 active:opacity-80',
} as const;

const sizes = {
  sm: 'h-9 px-3 relative after:absolute after:inset-x-0 after:-inset-y-[4px] after:content-[""]',
  md: 'h-11 px-4',
  lg: 'h-12 px-6',
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, leftIcon, fullWidth, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-sm text-button transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? <Spinner size={16} label="Carregando" /> : leftIcon ? <Icon name={leftIcon} size={16} /> : null}
      {children}
    </button>
  );
});
```

`src/components/Button/index.ts`:
```ts
export { Button, type ButtonProps } from './Button';
```

- [ ] **Step 5: Rodar e ver passar**

Run: `pnpm test src/components/Spinner src/components/Button`
Expected: PASS. Se o teste `loading` falhar em `getByRole('button', { name: /Salvar/ })`, é porque o Spinner adiciona "Carregando" ao nome: a regex já cobre isso.

- [ ] **Step 6: Testes de `Badge`, `Alert` e `Card` (falha)**

`src/components/Badge/Badge.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Badge } from './Badge';

describe('Badge', () => {
  it('mostra o texto e usa a cor semântica do tom', () => {
    render(<Badge tone="success">Ativa</Badge>);
    expect(screen.getByText('Ativa')).toHaveClass('bg-success-bg', 'text-success-text');
  });

  it('tom padrão é neutro', () => {
    render(<Badge>Rascunho</Badge>);
    expect(screen.getByText('Rascunho')).toHaveClass('bg-surface-2');
  });

  it('com ícone não depende só da cor e passa no axe', async () => {
    const { container } = render(<Badge tone="danger" icon="warning">Falhou</Badge>);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

`src/components/Alert/Alert.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Alert } from './Alert';

describe('Alert', () => {
  it('danger e warning usam role=alert', () => {
    render(<Alert tone="danger">Falha ao salvar</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Falha ao salvar');
  });

  it('info e success usam role=status', () => {
    render(<Alert tone="success">Salvo</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent('Salvo');
  });

  it('renderiza título e ícone do tom', () => {
    const { container } = render(<Alert title="Atenção">Texto</Alert>);
    expect(screen.getByText('Atenção')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('só mostra o botão de fechar quando há onDismiss e ele funciona', async () => {
    const onDismiss = vi.fn();
    const { rerender } = render(<Alert>Texto</Alert>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(<Alert onDismiss={onDismiss}>Texto</Alert>);
    await userEvent.click(screen.getByRole('button', { name: 'Fechar aviso' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Alert tone="warning" title="Cuidado" onDismiss={() => {}}>Texto</Alert>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

`src/components/Card/Card.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Card, CardBody, CardFooter, CardHeader } from './Card';

describe('Card', () => {
  it('compõe cabeçalho, corpo e rodapé', () => {
    render(
      <Card>
        <CardHeader>Título</CardHeader>
        <CardBody>Conteúdo</CardBody>
        <CardFooter>Ações</CardFooter>
      </Card>,
    );
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('padded=false remove o padding', () => {
    const { container } = render(<Card padded={false}>x</Card>);
    expect(container.firstChild).not.toHaveClass('p-5');
  });

  it('repassa className e atributos nativos', () => {
    render(<Card className="extra" data-testid="c">x</Card>);
    expect(screen.getByTestId('c')).toHaveClass('extra');
  });

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Card>x</Card>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 7: Implementar `Badge`, `Alert` e `Card`**

`src/components/Badge/Badge.tsx`:
```tsx
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from '@/icons';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  icon?: IconName;
}

const tones = {
  neutral: 'bg-surface-2 text-muted',
  primary: 'bg-primary-soft text-accent-text',
  success: 'bg-success-bg text-success-text',
  warning: 'bg-warning-bg text-warning-text',
  danger: 'bg-danger-bg text-danger-text',
  info: 'bg-info-bg text-info-text',
} as const;

export function Badge({ tone = 'neutral', icon, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-xs px-2 py-0.5 text-label', tones[tone], className)}
      {...rest}
    >
      {icon ? <Icon name={icon} size={12} /> : null}
      {children}
    </span>
  );
}
```

`src/components/Badge/index.ts`:
```ts
export { Badge, type BadgeProps } from './Badge';
```

`src/components/Alert/Alert.tsx`:
```tsx
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from '@/icons';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  onDismiss?: () => void;
}

const tones: Record<NonNullable<AlertProps['tone']>, { box: string; icon: IconName }> = {
  info: { box: 'border-info/30 bg-info-bg text-info-text', icon: 'info' },
  success: { box: 'border-success/30 bg-success-bg text-success-text', icon: 'check-circle' },
  warning: { box: 'border-warning/40 bg-warning-bg text-warning-text', icon: 'warning' },
  danger: { box: 'border-danger/30 bg-danger-bg text-danger-text', icon: 'x-circle' },
};

export function Alert({ tone = 'info', title, onDismiss, className, children, ...rest }: AlertProps) {
  const urgent = tone === 'danger' || tone === 'warning';
  return (
    <div
      role={urgent ? 'alert' : 'status'}
      className={cn('flex items-start gap-3 rounded-md border p-3 text-body', tones[tone].box, className)}
      {...rest}
    >
      <Icon name={tones[tone].icon} size={18} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        {title ? <p className="text-body-medium font-semibold">{title}</p> : null}
        <div>{children}</div>
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar aviso"
          className="-m-2 grid h-11 w-11 place-items-center rounded-sm hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Icon name="close" size={16} />
        </button>
      ) : null}
    </div>
  );
}
```

`src/components/Alert/index.ts`:
```ts
export { Alert, type AlertProps } from './Alert';
```

`src/components/Card/Card.tsx`:
```tsx
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export function Card({ padded = true, className, ...rest }: CardProps) {
  return (
    <div
      className={cn('rounded-lg border border-line bg-surface shadow-elev-1', padded && 'p-5', className)}
      {...rest}
    />
  );
}

export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-3 text-heading-sm text-ink', className)} {...rest} />;
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('text-body text-muted', className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-4 flex items-center justify-end gap-2', className)} {...rest} />;
}
```

`src/components/Card/index.ts`:
```ts
export { Card, CardHeader, CardBody, CardFooter, type CardProps } from './Card';
```

- [ ] **Step 8: Exportar e verificar**

Acrescentar em `src/index.ts`:
```ts
export * from './components/Spinner';
export * from './components/Button';
export * from './components/Badge';
export * from './components/Alert';
export * from './components/Card';
```

Run: `pnpm typecheck; pnpm lint; pnpm test`
Expected: verde. Se `border-info/30` não gerar classe, é porque cores com `<alpha-value>` já suportam `/30`; conferir que o preset foi carregado.

- [ ] **Step 9: Commit**

```powershell
git add <somente os arquivos criados ou alterados nesta tarefa, por caminho; nunca -A nem ponto>
git commit -m "feat(ui): Button, Spinner, Badge, Alert e Card" -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: Hook de estado controlável, Input/TextField e Dialog

**Files:**
- Create: `src/hooks/useControllableState.ts`, `src/hooks/useControllableState.test.ts`, `src/hooks/index.ts`
- Create: `src/components/Input/{Input.tsx,TextField.tsx,Input.test.tsx,index.ts}`
- Create: `src/components/Dialog/{Dialog.tsx,ConfirmDialog.tsx,Dialog.test.tsx,index.ts}`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `cn`, `Icon`, `Button`.
- Produces:
  - `useControllableState<T>(opts: { value?: T; defaultValue: T; onChange?: (v: T) => void }): [T, (v: T) => void]`.
  - `Input`: `forwardRef<HTMLInputElement>`, props nativas + `invalid?: boolean`, `revealable?: boolean` (só para `type="password"`, mostra o botão "Mostrar senha"/"Ocultar senha").
  - `TextField`: `Input` + `label: string`, `hint?: string`, `error?: string`, `required?: boolean`; liga `id`, `aria-describedby`, `aria-invalid`.
  - `Dialog`: `{ open: boolean; onClose: () => void; title: string; description?: string; footer?: ReactNode; children?: ReactNode }`.
  - `ConfirmDialog`: `{ open; onClose; onConfirm: () => void; title; description?; confirmLabel?: string; cancelLabel?: string; tone?: 'primary' | 'danger' }`.

- [ ] **Step 1: Teste do hook (falha)**

`src/hooks/useControllableState.test.ts`:
```ts
import { act, renderHook } from '@testing-library/react';
import { useControllableState } from './useControllableState';

describe('useControllableState', () => {
  it('modo não controlado guarda o estado e avisa a mudança', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 'a', onChange }));
    act(() => result.current[1]('b'));
    expect(result.current[0]).toBe('b');
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('modo controlado só reflete o valor recebido', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: 'a', onChange }),
      { initialProps: { value: 'x' } },
    );
    act(() => result.current[1]('y'));
    expect(result.current[0]).toBe('x');
    expect(onChange).toHaveBeenCalledWith('y');
    rerender({ value: 'y' });
    expect(result.current[0]).toBe('y');
  });

  it('trocar de não controlado para controlado não perde o valor nem lança erro', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value?: string }) => useControllableState({ value, defaultValue: 'a' }),
      { initialProps: {} as { value?: string } },
    );
    act(() => result.current[1]('b'));
    rerender({ value: 'c' });
    expect(result.current[0]).toBe('c');
    rerender({});
    expect(result.current[0]).toBe('c');
  });
});
```

- [ ] **Step 2: Implementar o hook**

`src/hooks/useControllableState.ts`:
```ts
import { useCallback, useRef, useState } from 'react';

interface Options<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

/** Suporta uso controlado (`value`) e não controlado (`defaultValue`). Ao voltar de controlado para não controlado, mantém o último valor. */
export function useControllableState<T>({ value, defaultValue, onChange }: Options<T>): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const last = useRef<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  last.current = current;

  const set = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  // Ao sair do modo controlado, o estado interno precisa refletir o último valor conhecido.
  if (!isControlled && internal !== last.current) setInternal(last.current);

  return [current, set];
}
```

`src/hooks/index.ts`:
```ts
export { useControllableState } from './useControllableState';
```

- [ ] **Step 3: Rodar o teste do hook**

Run: `pnpm test src/hooks`
Expected: PASS. Se o terceiro teste entrar em loop de render, trocar a linha de sincronização por um `useEffect` que só roda quando `isControlled` muda de `true` para `false`.

- [ ] **Step 4: Teste de `Input` e `TextField` (falha)**

`src/components/Input/Input.test.tsx`:
```tsx
import { createRef } from 'react';
import { axe } from 'vitest-axe';
import { renderUi } from '@/test/render';
import { Input } from './Input';
import { TextField } from './TextField';

describe('Input', () => {
  it('aceita digitação e repassa ref', async () => {
    const ref = createRef<HTMLInputElement>();
    const { user, getByRole } = renderUi(<Input ref={ref} aria-label="Nome" />);
    await user.type(getByRole('textbox'), 'Maria');
    expect(ref.current).toHaveValue('Maria');
  });

  it('invalid marca aria-invalid', () => {
    const { getByRole } = renderUi(<Input aria-label="Nome" invalid />);
    expect(getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('revealable alterna a visibilidade da senha pelo botão', async () => {
    const { user, getByLabelText, getByRole } = renderUi(<Input type="password" revealable aria-label="Senha" />);
    const input = getByLabelText('Senha');
    expect(input).toHaveAttribute('type', 'password');
    await user.click(getByRole('button', { name: 'Mostrar senha' }));
    expect(input).toHaveAttribute('type', 'text');
    expect(getByRole('button', { name: 'Ocultar senha' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('e-mail longo não estoura o contêiner', () => {
    const { getByRole } = renderUi(<Input aria-label="E-mail" defaultValue={'a'.repeat(200) + '@exemplo.com'} />);
    expect(getByRole('textbox')).toHaveClass('min-w-0', 'w-full');
  });
});

describe('TextField', () => {
  it('associa label, dica e erro ao campo', () => {
    const { getByLabelText } = renderUi(<TextField label="E-mail" hint="Use o e-mail de cadastro" error="E-mail inválido" />);
    const input = getByLabelText('E-mail');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Use o e-mail de cadastro E-mail inválido');
  });

  it('erro aparece com ícone e texto, não só com cor', () => {
    const { getByText } = renderUi(<TextField label="E-mail" error="E-mail inválido" />);
    expect(getByText('E-mail inválido').parentElement!.querySelector('svg')).toBeInTheDocument();
  });

  it('required mostra indicador acessível', () => {
    const { getByLabelText } = renderUi(<TextField label="Nome" required />);
    expect(getByLabelText(/Nome/)).toBeRequired();
  });

  it('não tem violações de acessibilidade', async () => {
    const { container } = renderUi(<TextField label="Senha" type="password" revealable hint="Mínimo 8 caracteres" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 5: Implementar `Input` e `TextField`**

`src/components/Input/Input.tsx`:
```tsx
import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/icons';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  /** Só faz efeito com type="password". */
  revealable?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, revealable, type = 'text', className, ...rest },
  ref,
) {
  const [shown, setShown] = useState(false);
  const canReveal = revealable && type === 'password';
  return (
    <div className="relative">
      <input
        ref={ref}
        type={canReveal && shown ? 'text' : type}
        aria-invalid={invalid || undefined}
        className={cn(
          'h-11 w-full min-w-0 rounded-sm border bg-surface px-3 text-body text-ink placeholder:text-faint',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          invalid ? 'border-danger' : 'border-line-strong',
          'disabled:cursor-not-allowed disabled:bg-surface-2 disabled:opacity-60',
          canReveal && 'pr-12',
          className,
        )}
        {...rest}
      />
      {canReveal ? (
        <button
          type="button"
          aria-label={shown ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={shown}
          onClick={() => setShown((s) => !s)}
          className="absolute right-0 top-0 grid h-11 w-11 place-items-center text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Icon name={shown ? 'eye-off' : 'eye'} size={18} />
        </button>
      ) : null}
    </div>
  );
});
```

`src/components/Input/TextField.tsx`:
```tsx
import { forwardRef, useId } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/icons';
import { Input, type InputProps } from './Input';

export interface TextFieldProps extends InputProps {
  label: string;
  hint?: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, required, id, className, ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id ?? auto;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={inputId} className="text-label text-ink">
        {label}
        {required ? <span className="text-accent-text"> *</span> : null}
      </label>
      <Input
        ref={ref}
        id={inputId}
        required={required}
        invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...rest}
      />
      {hint ? (
        <p id={hintId} className="text-caption text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="flex items-center gap-1 text-caption text-danger-text">
          <Icon name="warning" size={12} />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
});
```

`src/components/Input/index.ts`:
```ts
export { Input, type InputProps } from './Input';
export { TextField, type TextFieldProps } from './TextField';
```

- [ ] **Step 6: Rodar e ajustar**

Run: `pnpm test src/components/Input`
Expected: PASS. Detalhe: `toHaveAccessibleDescription` junta as descrições referenciadas por espaço; o `<span>` dentro do `<p>` do erro mantém o texto "E-mail inválido".

- [ ] **Step 7: Teste do `Dialog` (falha)**

`src/components/Dialog/Dialog.test.tsx`:
```tsx
import { fireEvent, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { renderUi } from '@/test/render';
import { Dialog } from './Dialog';
import { ConfirmDialog } from './ConfirmDialog';

describe('Dialog', () => {
  it('fechado não é exposto', () => {
    renderUi(<Dialog open={false} onClose={() => {}} title="Título" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('aberto expõe título e descrição acessíveis', () => {
    renderUi(<Dialog open onClose={() => {}} title="Excluir aluno" description="Essa ação é definitiva." />);
    const dialog = screen.getByRole('dialog', { name: 'Excluir aluno' });
    expect(dialog).toHaveAccessibleDescription('Essa ação é definitiva.');
  });

  it('Esc (evento cancel) chama onClose uma vez', () => {
    const onClose = vi.fn();
    renderUi(<Dialog open onClose={onClose} title="T" />);
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clique no backdrop fecha, clique no conteúdo não', async () => {
    const onClose = vi.fn();
    const { user } = renderUi(<Dialog open onClose={onClose} title="T">Corpo</Dialog>);
    await user.click(screen.getByText('Corpo'));
    expect(onClose).not.toHaveBeenCalled();
    await user.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('o botão de fechar chama onClose e a prop open=false não dispara onClose de novo', async () => {
    const onClose = vi.fn();
    const { user, rerender } = renderUi(<Dialog open onClose={onClose} title="T" />);
    await user.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    rerender(<Dialog open={false} onClose={onClose} title="T" />);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('devolve o foco ao gatilho ao fechar', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    const { rerender } = renderUi(<Dialog open onClose={() => {}} title="T" />);
    rerender(<Dialog open={false} onClose={() => {}} title="T" />);
    expect(trigger).toHaveFocus();
    trigger.remove();
  });

  it('não tem violações de acessibilidade', async () => {
    const { container } = renderUi(<Dialog open onClose={() => {}} title="T" description="D" footer={<button type="button">Ok</button>} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('ConfirmDialog', () => {
  it('confirma e cancela', async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    const { user } = renderUi(
      <ConfirmDialog open onClose={onClose} onConfirm={onConfirm} title="Excluir?" confirmLabel="Excluir" tone="danger" />,
    );
    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 8: Implementar `Dialog` e `ConfirmDialog`**

`src/components/Dialog/Dialog.tsx`:
```tsx
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Icon } from '@/icons';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
}

export function Dialog({ open, onClose, title, description, footer, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      trigger.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
      trigger.current?.focus();
      trigger.current = null;
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-line bg-surface p-0 text-ink shadow-elev-3 backdrop:bg-black/50"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-heading-sm">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="-m-2 grid h-11 w-11 shrink-0 place-items-center rounded-sm text-muted hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Icon name="close" size={18} />
          </button>
        </div>
        {description ? (
          <p id={descId} className="mt-2 text-body text-muted">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-4">{children}</div> : null}
        {footer ? <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div> : null}
      </div>
    </dialog>
  );
}
```

`src/components/Dialog/ConfirmDialog.tsx`:
```tsx
import { Button } from '../Button';
import { Dialog } from './Dialog';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger';
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'primary',
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
```

`src/components/Dialog/index.ts`:
```ts
export { Dialog, type DialogProps } from './Dialog';
export { ConfirmDialog, type ConfirmDialogProps } from './ConfirmDialog';
```

- [ ] **Step 9: Exportar e verificar**

Acrescentar em `src/index.ts`:
```ts
export * from './hooks';
export * from './components/Input';
export * from './components/Dialog';
```

Run: `pnpm typecheck; pnpm lint; pnpm test`
Expected: verde. Se `getByRole('dialog')` não encontrar o elemento, conferir que o polyfill de `showModal` em `src/test/setup.ts` seta o atributo `open`.

- [ ] **Step 10: Commit**

```powershell
git add <somente os arquivos criados ou alterados nesta tarefa, por caminho; nunca -A nem ponto>
git commit -m "feat(ui): useControllableState, Input, TextField e Dialog" -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 6: Controles de formulário (Checkbox, Radio, Switch, Segmented)

**Files:**
- Create: `src/components/Checkbox/{Checkbox.tsx,Checkbox.test.tsx,index.ts}` (exporta `Checkbox` e `Radio`)
- Create: `src/components/Switch/{Switch.tsx,Switch.test.tsx,index.ts}`
- Create: `src/components/Segmented/{Segmented.tsx,Segmented.test.tsx,index.ts}`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `cn`, `useControllableState`.
- Produces:
  - `Checkbox` e `Radio`: `forwardRef<HTMLInputElement>`, props nativas de `<input>` (sem `type`) + `label: ReactNode`, `description?: string`, `invalid?: boolean`.
  - `Switch`: `{ checked?: boolean; defaultChecked?: boolean; onCheckedChange?: (v: boolean) => void; label: string; disabled?: boolean; className?: string }`.
  - `Segmented<T extends string>`: `{ options: Array<{ value: T; label: string }>; value?: T; defaultValue?: T; onValueChange?: (v: T) => void; 'aria-label': string; className?: string }`.

- [ ] **Step 1: Testes (falha)**

`src/components/Checkbox/Checkbox.test.tsx`:
```tsx
import { axe } from 'vitest-axe';
import { renderUi } from '@/test/render';
import { Checkbox, Radio } from './Checkbox';

describe('Checkbox', () => {
  it('alterna por clique no rótulo e por Espaço', async () => {
    const { user, getByRole, getByText } = renderUi(<Checkbox label="Li e aceito os termos" />);
    const box = getByRole('checkbox', { name: 'Li e aceito os termos' });
    await user.click(getByText('Li e aceito os termos'));
    expect(box).toBeChecked();
    box.focus();
    await user.keyboard(' ');
    expect(box).not.toBeChecked();
  });

  it('descrição e erro ficam associados', () => {
    const { getByRole } = renderUi(<Checkbox label="Termos" description="Obrigatório" invalid />);
    const box = getByRole('checkbox');
    expect(box).toHaveAccessibleDescription('Obrigatório');
    expect(box).toHaveAttribute('aria-invalid', 'true');
  });

  it('a área clicável tem pelo menos 44px de altura', () => {
    const { getByText } = renderUi(<Checkbox label="Termos" />);
    expect(getByText('Termos').closest('label')).toHaveClass('min-h-11');
  });

  it('não tem violações de acessibilidade', async () => {
    const { container } = renderUi(<Checkbox label="Termos" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Radio', () => {
  it('seleciona uma opção do grupo e navega com as setas', async () => {
    const { user, getAllByRole } = renderUi(
      <div role="radiogroup" aria-label="Perfil">
        <Radio name="p" value="a" label="Personal" defaultChecked />
        <Radio name="p" value="b" label="Aluno" />
      </div>,
    );
    const [a, b] = getAllByRole('radio');
    a!.focus();
    await user.keyboard('{ArrowDown}');
    expect(b).toBeChecked();
    expect(a).not.toBeChecked();
  });
});
```

`src/components/Switch/Switch.test.tsx`:
```tsx
import { axe } from 'vitest-axe';
import { renderUi } from '@/test/render';
import { Switch } from './Switch';

describe('Switch', () => {
  it('não controlado alterna e avisa', async () => {
    const onCheckedChange = vi.fn();
    const { user, getByRole } = renderUi(<Switch label="Notificações" onCheckedChange={onCheckedChange} />);
    const sw = getByRole('switch', { name: 'Notificações' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
    await user.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('controlado só muda quando o pai muda', async () => {
    const { user, getByRole, rerender } = renderUi(<Switch label="N" checked={false} />);
    await user.click(getByRole('switch'));
    expect(getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    rerender(<Switch label="N" checked />);
    expect(getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('alterna por teclado e respeita disabled', async () => {
    const { user, getByRole } = renderUi(<Switch label="N" />);
    getByRole('switch').focus();
    await user.keyboard('{Enter}');
    expect(getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('desabilitado não alterna e passa no axe', async () => {
    const { user, getByRole, container } = renderUi(<Switch label="N" disabled />);
    await user.click(getByRole('switch'));
    expect(getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

`src/components/Segmented/Segmented.test.tsx`:
```tsx
import { axe } from 'vitest-axe';
import { renderUi } from '@/test/render';
import { Segmented } from './Segmented';

const options = [
  { value: 'personal', label: 'Personal Trainer' },
  { value: 'aluno', label: 'Aluno' },
  { value: 'admin', label: 'Admin' },
] as const;

describe('Segmented', () => {
  it('seleciona por clique e avisa', async () => {
    const onValueChange = vi.fn();
    const { user, getByRole } = renderUi(
      <Segmented aria-label="Perfil" options={[...options]} defaultValue="personal" onValueChange={onValueChange} />,
    );
    await user.click(getByRole('radio', { name: 'Aluno' }));
    expect(getByRole('radio', { name: 'Aluno' })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('aluno');
  });

  it('navega com as setas', async () => {
    const { user, getByRole } = renderUi(<Segmented aria-label="Perfil" options={[...options]} defaultValue="personal" />);
    getByRole('radio', { name: 'Personal Trainer' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(getByRole('radio', { name: 'Aluno' })).toBeChecked();
  });

  it('modo controlado reflete o value', () => {
    const { getByRole } = renderUi(<Segmented aria-label="Perfil" options={[...options]} value="admin" />);
    expect(getByRole('radio', { name: 'Admin' })).toBeChecked();
  });

  it('expõe o grupo com nome acessível e passa no axe', async () => {
    const { getByRole, container } = renderUi(<Segmented aria-label="Perfil" options={[...options]} defaultValue="aluno" />);
    expect(getByRole('radiogroup', { name: 'Perfil' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm test src/components/Checkbox src/components/Switch src/components/Segmented`
Expected: FAIL, imports não resolvidos.

- [ ] **Step 3: Implementar `Checkbox` e `Radio`**

`src/components/Checkbox/Checkbox.tsx`:
```tsx
import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  description?: string;
  invalid?: boolean;
}

function makeChoice(type: 'checkbox' | 'radio', displayName: string) {
  const Choice = forwardRef<HTMLInputElement, ChoiceProps>(function Choice(
    { label, description, invalid, id, className, ...rest },
    ref,
  ) {
    const auto = useId();
    const inputId = id ?? auto;
    const descId = description ? `${inputId}-desc` : undefined;
    return (
      <label htmlFor={inputId} className={cn('flex min-h-11 cursor-pointer items-start gap-3 py-2', className)}>
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={invalid || undefined}
          aria-describedby={descId}
          className={cn(
            'mt-0.5 h-5 w-5 shrink-0 accent-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
            invalid && 'outline outline-2 outline-danger',
          )}
          {...rest}
        />
        <span className="min-w-0 text-body text-ink">
          {label}
          {description ? (
            <span id={descId} className="block text-caption text-muted">
              {description}
            </span>
          ) : null}
        </span>
      </label>
    );
  });
  Choice.displayName = displayName;
  return Choice;
}

export const Checkbox = makeChoice('checkbox', 'Checkbox');
export const Radio = makeChoice('radio', 'Radio');
export type CheckboxProps = ChoiceProps;
export type RadioProps = ChoiceProps;
```

`src/components/Checkbox/index.ts`:
```ts
export { Checkbox, Radio, type CheckboxProps, type RadioProps } from './Checkbox';
```

- [ ] **Step 4: Implementar `Switch`**

`src/components/Switch/Switch.tsx`:
```tsx
import { cn } from '@/lib/cn';
import { useControllableState } from '@/hooks';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

export function Switch({ checked, defaultChecked = false, onCheckedChange, label, disabled, className }: SwitchProps) {
  const [on, setOn] = useControllableState({ value: checked, defaultValue: defaultChecked, onChange: onCheckedChange });
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => setOn(!on)}
      className={cn(
        'relative inline-flex h-11 w-14 shrink-0 items-center justify-center rounded-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      <span className={cn('relative h-6 w-11 rounded-full transition-colors', on ? 'bg-primary' : 'bg-line-strong')}>
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-elev-1 transition-transform motion-reduce:transition-none',
            on ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </span>
    </button>
  );
}
```

`src/components/Switch/index.ts`:
```ts
export { Switch, type SwitchProps } from './Switch';
```

- [ ] **Step 5: Implementar `Segmented`**

Usa radios nativos escondidos para herdar teclado e semântica de grupo.

`src/components/Segmented/Segmented.tsx`:
```tsx
import { useId } from 'react';
import { cn } from '@/lib/cn';
import { useControllableState } from '@/hooks';

export interface SegmentedProps<T extends string> {
  options: Array<{ value: T; label: string }>;
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  'aria-label': string;
  className?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  defaultValue,
  onValueChange,
  className,
  'aria-label': ariaLabel,
}: SegmentedProps<T>) {
  const name = useId();
  const [current, setCurrent] = useControllableState<T>({
    value,
    defaultValue: (defaultValue ?? options[0]?.value) as T,
    onChange: onValueChange,
  });

  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cn('flex gap-1 rounded-md bg-surface-2 p-1', className)}>
      {options.map((opt) => (
        <label key={opt.value} className="relative min-w-0 flex-1">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={current === opt.value}
            onChange={() => setCurrent(opt.value)}
            className="peer sr-only"
          />
          <span
            className={cn(
              'flex h-9 cursor-pointer items-center justify-center truncate rounded-sm px-3 text-button text-muted transition-colors',
              'peer-checked:bg-primary peer-checked:text-on-primary',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-2',
            )}
          >
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
}
```

`src/components/Segmented/index.ts`:
```ts
export { Segmented, type SegmentedProps } from './Segmented';
```

- [ ] **Step 6: Exportar e verificar**

Acrescentar em `src/index.ts`:
```ts
export * from './components/Checkbox';
export * from './components/Switch';
export * from './components/Segmented';
```

Run: `pnpm typecheck; pnpm lint; pnpm test`
Expected: verde. O `Segmented` tem 36px de altura visível dentro de um grupo com padding, então a área de toque efetiva do `label` fica em 36px: conferir no showcase e, se o `ui-designer` exigir 44px, subir para `h-11`.

- [ ] **Step 7: Commit**

```powershell
git add <somente os arquivos criados ou alterados nesta tarefa, por caminho; nunca -A nem ponto>
git commit -m "feat(ui): Checkbox, Radio, Switch e Segmented" -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 7: Feedback (Skeleton, EmptyState, ProgressBar, ProgressRing, Toast)

**Files:**
- Create: `src/components/Skeleton/{Skeleton.tsx,Skeleton.test.tsx,index.ts}`
- Create: `src/components/EmptyState/{EmptyState.tsx,EmptyState.test.tsx,index.ts}`
- Create: `src/components/Progress/{ProgressBar.tsx,ProgressRing.tsx,Progress.test.tsx,index.ts}`
- Create: `src/components/Toast/{Toast.tsx,Toast.test.tsx,index.ts}`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `cn`, `Icon`, `Button`.
- Produces:
  - `Skeleton`: `className?`; div `aria-hidden` com pulso.
  - `EmptyState`: `{ icon?: IconName; title: string; description?: string; action?: ReactNode }`.
  - `ProgressBar`: `{ value: number; max?: number (100); label: string; showValue?: boolean }`, `role="progressbar"` com `aria-valuenow/min/max`; valor é limitado a `[0, max]`.
  - `ProgressRing`: `{ value: number; max?: number; size?: number (64); label: string }`, mesma semântica.
  - `Toast`: `{ tone?: 'info' | 'success' | 'warning' | 'danger'; title: string; description?: string; onDismiss?: () => void }`. Só o item visual; o app consumidor decide onde e por quanto tempo mostrá-lo.

- [ ] **Step 1: Testes (falha)**

`src/components/Skeleton/Skeleton.test.tsx`:
```tsx
import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('é decorativo e respeita prefers-reduced-motion', () => {
    const { container } = render(<Skeleton className="h-4 w-24" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).toHaveClass('animate-pulse', 'motion-reduce:animate-none', 'h-4');
  });
});
```

`src/components/EmptyState/EmptyState.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('mostra título, descrição e ação', () => {
    render(<EmptyState icon="users" title="Nenhum aluno" description="Cadastre o primeiro." action={<button type="button">Novo aluno</button>} />);
    expect(screen.getByRole('heading', { name: 'Nenhum aluno' })).toBeInTheDocument();
    expect(screen.getByText('Cadastre o primeiro.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Novo aluno' })).toBeInTheDocument();
  });

  it('funciona só com título e passa no axe', async () => {
    const { container } = render(<EmptyState title="Vazio" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

`src/components/Progress/Progress.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ProgressBar } from './ProgressBar';
import { ProgressRing } from './ProgressRing';

describe('ProgressBar', () => {
  it('expõe valor, mínimo e máximo', () => {
    render(<ProgressBar value={40} label="Meta semanal" />);
    const bar = screen.getByRole('progressbar', { name: 'Meta semanal' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('limita valores fora do intervalo', () => {
    const { rerender } = render(<ProgressBar value={150} label="x" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    rerender(<ProgressBar value={-5} label="x" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('max = 0 não gera NaN', () => {
    render(<ProgressBar value={1} max={0} label="x" />);
    expect(screen.getByRole('progressbar').querySelector('[data-fill]')).toHaveStyle({ width: '0%' });
  });

  it('showValue mostra o percentual em texto', () => {
    render(<ProgressBar value={40} label="Meta" showValue />);
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('passa no axe', async () => {
    const { container } = render(<ProgressBar value={10} label="x" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('ProgressRing', () => {
  it('expõe a semântica de progressbar e mostra o percentual', () => {
    render(<ProgressRing value={75} label="Concluído" />);
    expect(screen.getByRole('progressbar', { name: 'Concluído' })).toHaveAttribute('aria-valuenow', '75');
    expect(screen.getByText('75%')).toBeInTheDocument();
  });
});
```

`src/components/Toast/Toast.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Toast } from './Toast';

describe('Toast', () => {
  it('sucesso é status; erro é alert', () => {
    const { rerender } = render(<Toast tone="success" title="Salvo" />);
    expect(screen.getByRole('status')).toHaveTextContent('Salvo');
    rerender(<Toast tone="danger" title="Falhou" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Falhou');
  });

  it('mostra a descrição e permite fechar', async () => {
    const onDismiss = vi.fn();
    render(<Toast title="Oi" description="Detalhe" onDismiss={onDismiss} />);
    expect(screen.getByText('Detalhe')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Fechar notificação' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('passa no axe', async () => {
    const { container } = render(<Toast tone="info" title="Oi" onDismiss={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm test src/components/Skeleton src/components/EmptyState src/components/Progress src/components/Toast`
Expected: FAIL, imports não resolvidos.

- [ ] **Step 3: Implementar**

`src/components/Skeleton/Skeleton.tsx`:
```tsx
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Skeleton({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-sm bg-surface-2 motion-reduce:animate-none', className)} {...rest} />;
}
```
`src/components/Skeleton/index.ts`:
```ts
export { Skeleton } from './Skeleton';
```

`src/components/EmptyState/EmptyState.tsx`:
```tsx
import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/icons';

export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
      {icon ? (
        <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-2 text-muted">
          <Icon name={icon} size={24} />
        </span>
      ) : null}
      <h3 className="text-heading-sm text-ink">{title}</h3>
      {description ? <p className="max-w-sm text-body text-muted">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
```
`src/components/EmptyState/index.ts`:
```ts
export { EmptyState, type EmptyStateProps } from './EmptyState';
```

`src/components/Progress/ProgressBar.tsx`:
```tsx
import { cn } from '@/lib/cn';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label: string;
  showValue?: boolean;
  className?: string;
}

export function clampPercent(value: number, max: number): { now: number; percent: number } {
  const safeMax = max > 0 ? max : 0;
  const now = Math.min(Math.max(value, 0), safeMax);
  return { now, percent: safeMax === 0 ? 0 : Math.round((now / safeMax) * 100) };
}

export function ProgressBar({ value, max = 100, label, showValue, className }: ProgressBarProps) {
  const { now, percent } = clampPercent(value, max);
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={now}
        aria-valuemin={0}
        aria-valuemax={max}
        className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-2"
      >
        <div data-fill className="h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none" style={{ width: `${percent}%` }} />
      </div>
      {showValue ? <span className="text-label text-muted">{percent}%</span> : null}
    </div>
  );
}
```

`src/components/Progress/ProgressRing.tsx`:
```tsx
import { clampPercent } from './ProgressBar';

export interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  label: string;
}

export function ProgressRing({ value, max = 100, size = 64, label }: ProgressRingProps) {
  const { now, percent } = clampPercent(value, max);
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={now}
      aria-valuemin={0}
      aria-valuemax={max}
      className="relative inline-grid place-items-center text-primary"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-surface-2" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke="currentColor"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - percent / 100)}
        />
      </svg>
      <span className="absolute text-label text-ink">{percent}%</span>
    </div>
  );
}
```

`src/components/Progress/index.ts`:
```ts
export { ProgressBar, type ProgressBarProps } from './ProgressBar';
export { ProgressRing, type ProgressRingProps } from './ProgressRing';
```

`src/components/Toast/Toast.tsx`:
```tsx
import { cn } from '@/lib/cn';
import { Icon, type IconName } from '@/icons';

export interface ToastProps {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  description?: string;
  onDismiss?: () => void;
  className?: string;
}

const icons: Record<NonNullable<ToastProps['tone']>, { icon: IconName; color: string }> = {
  info: { icon: 'info', color: 'text-info' },
  success: { icon: 'check-circle', color: 'text-success' },
  warning: { icon: 'warning', color: 'text-warning' },
  danger: { icon: 'x-circle', color: 'text-danger' },
};

export function Toast({ tone = 'info', title, description, onDismiss, className }: ToastProps) {
  const urgent = tone === 'danger' || tone === 'warning';
  return (
    <div
      role={urgent ? 'alert' : 'status'}
      className={cn('flex w-full max-w-sm items-start gap-3 rounded-lg border border-line bg-surface p-4 shadow-elev-2', className)}
    >
      <Icon name={icons[tone].icon} size={20} className={cn('mt-0.5', icons[tone].color)} />
      <div className="min-w-0 flex-1">
        <p className="text-body-medium font-semibold text-ink">{title}</p>
        {description ? <p className="text-body text-muted">{description}</p> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          aria-label="Fechar notificação"
          onClick={onDismiss}
          className="-m-2 grid h-11 w-11 place-items-center rounded-sm text-muted hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Icon name="close" size={16} />
        </button>
      ) : null}
    </div>
  );
}
```
`src/components/Toast/index.ts`:
```ts
export { Toast, type ToastProps } from './Toast';
```

- [ ] **Step 4: Exportar e verificar**

Acrescentar em `src/index.ts`:
```ts
export * from './components/Skeleton';
export * from './components/EmptyState';
export * from './components/Progress';
export * from './components/Toast';
```

Run: `pnpm typecheck; pnpm lint; pnpm test`
Expected: verde. O `Skeleton` do teste usa `motion-reduce:animate-none`, já presente.

- [ ] **Step 5: Commit**

```powershell
git add <somente os arquivos criados ou alterados nesta tarefa, por caminho; nunca -A nem ponto>
git commit -m "feat(ui): Skeleton, EmptyState, ProgressBar, ProgressRing e Toast" -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 8: Navegação (Tabs, Stepper, Breadcrumb, Pagination)

**Files:**
- Create: `src/components/Tabs/{Tabs.tsx,Tabs.test.tsx,index.ts}`
- Create: `src/components/Stepper/{Stepper.tsx,Stepper.test.tsx,index.ts}`
- Create: `src/components/Breadcrumb/{Breadcrumb.tsx,Breadcrumb.test.tsx,index.ts}`
- Create: `src/components/Pagination/{Pagination.tsx,Pagination.test.tsx,index.ts}`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `cn`, `Icon`, `useControllableState`.
- Produces:
  - `Tabs`: `{ tabs: Array<{ value: string; label: string; content: ReactNode }>; value?: string; defaultValue?: string; onValueChange?: (v: string) => void; 'aria-label': string }`. Padrão WAI-ARIA: `tablist`/`tab`/`tabpanel`, setas, Home e End, ativação automática.
  - `Stepper`: `{ steps: string[]; current: number }` (0-based), `<ol>` com `aria-current="step"`.
  - `Breadcrumb`: `{ items: Array<{ label: string; href?: string }> }`; o último item é a página atual.
  - `Pagination`: `{ page: number; pageCount: number; onPageChange: (p: number) => void }` (1-based). Com `pageCount <= 1` não renderiza nada.

- [ ] **Step 1: Testes (falha)**

`src/components/Tabs/Tabs.test.tsx`:
```tsx
import { axe } from 'vitest-axe';
import { renderUi } from '@/test/render';
import { Tabs } from './Tabs';

const tabs = [
  { value: 'a', label: 'Perfil', content: 'Conteúdo A' },
  { value: 'b', label: 'Segurança', content: 'Conteúdo B' },
  { value: 'c', label: 'Preferências', content: 'Conteúdo C' },
];

describe('Tabs', () => {
  it('mostra só o painel da aba ativa e liga aba e painel', () => {
    const { getByRole, queryByText } = renderUi(<Tabs aria-label="Conta" tabs={tabs} defaultValue="a" />);
    const tab = getByRole('tab', { name: 'Perfil' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(getByRole('tabpanel')).toHaveAccessibleName('Perfil');
    expect(queryByText('Conteúdo B')).not.toBeInTheDocument();
  });

  it('clique troca a aba e avisa', async () => {
    const onValueChange = vi.fn();
    const { user, getByRole } = renderUi(<Tabs aria-label="Conta" tabs={tabs} defaultValue="a" onValueChange={onValueChange} />);
    await user.click(getByRole('tab', { name: 'Segurança' }));
    expect(getByRole('tabpanel')).toHaveTextContent('Conteúdo B');
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('setas, Home e End movem o foco e a seleção, com volta circular', async () => {
    const { user, getByRole } = renderUi(<Tabs aria-label="Conta" tabs={tabs} defaultValue="a" />);
    getByRole('tab', { name: 'Perfil' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(getByRole('tab', { name: 'Segurança' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(getByRole('tab', { name: 'Preferências' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowRight}');
    expect(getByRole('tab', { name: 'Perfil' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowLeft}');
    expect(getByRole('tab', { name: 'Preferências' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(getByRole('tab', { name: 'Perfil' })).toHaveFocus();
  });

  it('só a aba ativa participa da ordem de Tab (roving tabindex)', () => {
    const { getAllByRole } = renderUi(<Tabs aria-label="Conta" tabs={tabs} defaultValue="b" />);
    const [a, b, c] = getAllByRole('tab');
    expect([a, b, c].map((t) => t!.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
  });

  it('modo controlado só muda pelo pai', async () => {
    const { user, getByRole } = renderUi(<Tabs aria-label="Conta" tabs={tabs} value="a" />);
    await user.click(getByRole('tab', { name: 'Segurança' }));
    expect(getByRole('tab', { name: 'Perfil' })).toHaveAttribute('aria-selected', 'true');
  });

  it('lista vazia não quebra e passa no axe', async () => {
    const { container, unmount } = renderUi(<Tabs aria-label="Conta" tabs={tabs} defaultValue="a" />);
    expect(await axe(container)).toHaveNoViolations();
    unmount();
    expect(() => renderUi(<Tabs aria-label="Vazio" tabs={[]} />)).not.toThrow();
  });
});
```

`src/components/Stepper/Stepper.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Stepper } from './Stepper';

describe('Stepper', () => {
  const steps = ['Conta', 'Perfil', 'Plano'];

  it('marca a etapa atual com aria-current e conta as etapas concluídas', () => {
    render(<Stepper steps={steps} current={1} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).toHaveTextContent('Conta');
    expect(screen.getByText('Etapa 2 de 3', { selector: '.sr-only' })).toBeInTheDocument();
  });

  it('etapa concluída tem ícone, não só cor', () => {
    const { container } = render(<Stepper steps={steps} current={2} />);
    expect(container.querySelectorAll('svg').length).toBe(2);
  });

  it('current fora do intervalo não quebra', () => {
    expect(() => render(<Stepper steps={steps} current={99} />)).not.toThrow();
  });

  it('passa no axe', async () => {
    const { container } = render(<Stepper steps={steps} current={0} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

`src/components/Breadcrumb/Breadcrumb.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
  const items = [{ label: 'Início', href: '/' }, { label: 'Alunos', href: '/alunos' }, { label: 'Maria Silva' }];

  it('é uma navegação com o último item como página atual', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole('navigation', { name: 'Você está em' })).toBeInTheDocument();
    expect(screen.getByText('Maria Silva')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Alunos' })).toHaveAttribute('href', '/alunos');
  });

  it('o item atual não é link', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.queryByRole('link', { name: 'Maria Silva' })).not.toBeInTheDocument();
  });

  it('nome longo trunca sem estourar', () => {
    render(<Breadcrumb items={[{ label: 'x'.repeat(200) }]} />);
    expect(screen.getByText('x'.repeat(200))).toHaveClass('truncate');
  });

  it('passa no axe', async () => {
    const { container } = render(<Breadcrumb items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

`src/components/Pagination/Pagination.test.tsx`:
```tsx
import { axe } from 'vitest-axe';
import { renderUi } from '@/test/render';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('marca a página atual e navega', async () => {
    const onPageChange = vi.fn();
    const { user, getByRole } = renderUi(<Pagination page={2} pageCount={5} onPageChange={onPageChange} />);
    expect(getByRole('button', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page');
    await user.click(getByRole('button', { name: 'Página 3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    await user.click(getByRole('button', { name: 'Página anterior' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
    await user.click(getByRole('button', { name: 'Próxima página' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('desabilita anterior na primeira e próxima na última', () => {
    const { getByRole, rerender } = renderUi(<Pagination page={1} pageCount={3} onPageChange={() => {}} />);
    expect(getByRole('button', { name: 'Página anterior' })).toBeDisabled();
    rerender(<Pagination page={3} pageCount={3} onPageChange={() => {}} />);
    expect(getByRole('button', { name: 'Próxima página' })).toBeDisabled();
  });

  it('com muitas páginas usa reticências e sempre mostra primeira e última', () => {
    const { getByRole, getAllByText } = renderUi(<Pagination page={10} pageCount={20} onPageChange={() => {}} />);
    expect(getByRole('button', { name: 'Página 1' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Página 20' })).toBeInTheDocument();
    expect(getAllByText('…')).toHaveLength(2);
  });

  it('com 1 página ou nenhuma não renderiza nada', () => {
    const { container, rerender } = renderUi(<Pagination page={1} pageCount={1} onPageChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<Pagination page={1} pageCount={0} onPageChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('passa no axe', async () => {
    const { container } = renderUi(<Pagination page={2} pageCount={5} onPageChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm test src/components/Tabs src/components/Stepper src/components/Breadcrumb src/components/Pagination`
Expected: FAIL, imports não resolvidos.

- [ ] **Step 3: Implementar `Tabs`**

`src/components/Tabs/Tabs.tsx`:
```tsx
import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useControllableState } from '@/hooks';

export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  'aria-label': string;
  className?: string;
}

export function Tabs({ tabs, value, defaultValue, onValueChange, className, 'aria-label': ariaLabel }: TabsProps) {
  const base = useId();
  const [current, setCurrent] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? tabs[0]?.value ?? '',
    onChange: onValueChange,
  });
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function move(index: number) {
    const target = tabs[(index + tabs.length) % tabs.length];
    if (!target) return;
    setCurrent(target.value);
    refs.current[(index + tabs.length) % tabs.length]?.focus();
  }

  function onKeyDown(e: KeyboardEvent, index: number) {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    if (e.key in keys) {
      e.preventDefault();
      move(keys[e.key]!);
    }
  }

  const active = tabs.find((t) => t.value === current);

  return (
    <div className={className}>
      <div role="tablist" aria-label={ariaLabel} className="flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map((tab, i) => {
          const selected = tab.value === current;
          return (
            <button
              key={tab.value}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`${base}-tab-${tab.value}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={selected ? `${base}-panel` : undefined}
              tabIndex={selected ? 0 : -1}
              onClick={() => setCurrent(tab.value)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                'h-11 shrink-0 border-b-2 px-4 text-button transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
                selected ? 'border-primary text-accent-text' : 'border-transparent text-muted hover:text-ink',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {active ? (
        <div id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-tab-${active.value}`} tabIndex={0} className="pt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          {active.content}
        </div>
      ) : null}
    </div>
  );
}
```
`src/components/Tabs/index.ts`:
```ts
export { Tabs, type TabsProps, type TabItem } from './Tabs';
```

- [ ] **Step 4: Implementar `Stepper`, `Breadcrumb` e `Pagination`**

`src/components/Stepper/Stepper.tsx`:
```tsx
import { cn } from '@/lib/cn';
import { Icon } from '@/icons';

export interface StepperProps {
  steps: string[];
  /** Índice da etapa atual, base 0. */
  current: number;
  className?: string;
}

export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol className={cn('flex items-center gap-2', className)}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} aria-current={active ? 'step' : undefined} className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className={cn(
                'grid h-7 w-7 shrink-0 place-items-center rounded-full text-label',
                done && 'bg-primary text-on-primary',
                active && 'border-2 border-primary text-accent-text',
                !done && !active && 'border border-line-strong text-muted',
              )}
            >
              {done ? <Icon name="check" size={14} /> : i + 1}
            </span>
            <span className={cn('truncate text-label', active ? 'text-ink' : 'text-muted')}>{label}</span>
            {active ? <span className="sr-only">{`Etapa ${i + 1} de ${steps.length}`}</span> : null}
            {i < steps.length - 1 ? <span aria-hidden="true" className="h-px flex-1 bg-line-strong" /> : null}
          </li>
        );
      })}
    </ol>
  );
}
```
`src/components/Stepper/index.ts`:
```ts
export { Stepper, type StepperProps } from './Stepper';
```

`src/components/Breadcrumb/Breadcrumb.tsx`:
```tsx
import { Icon } from '@/icons';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Você está em">
      <ol className="flex min-w-0 items-center gap-1 text-body text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex min-w-0 items-center gap-1">
              {last || !item.href ? (
                <span aria-current={last ? 'page' : undefined} className="truncate text-ink">
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className="truncate rounded-xs hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  {item.label}
                </a>
              )}
              {!last ? <Icon name="chevron-right" size={14} /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```
`src/components/Breadcrumb/index.ts`:
```ts
export { Breadcrumb, type BreadcrumbProps, type BreadcrumbItem } from './Breadcrumb';
```

`src/components/Pagination/Pagination.tsx`:
```tsx
import { cn } from '@/lib/cn';
import { Icon } from '@/icons';

export interface PaginationProps {
  /** Página atual, base 1. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function pageWindow(page: number, count: number): Array<number | 'gap'> {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const set = new Set([1, count, page - 1, page, page + 1].filter((p) => p >= 1 && p <= count));
  const sorted = [...set].sort((a, b) => a - b);
  const out: Array<number | 'gap'> = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev > 1) out.push('gap');
    out.push(p);
  });
  return out;
}

const btn =
  'grid h-11 min-w-11 place-items-center rounded-sm px-2 text-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40';

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;
  return (
    <nav aria-label="Paginação">
      <ul className="flex flex-wrap items-center gap-1">
        <li>
          <button type="button" aria-label="Página anterior" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className={cn(btn, 'text-muted hover:bg-surface-2')}>
            <Icon name="chevron-left" size={16} />
          </button>
        </li>
        {pageWindow(page, pageCount).map((p, i) =>
          p === 'gap' ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-muted">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                aria-label={`Página ${p}`}
                aria-current={p === page ? 'page' : undefined}
                onClick={() => onPageChange(p)}
                className={cn(btn, p === page ? 'bg-primary text-on-primary' : 'text-ink hover:bg-surface-2')}
              >
                {p}
              </button>
            </li>
          ),
        )}
        <li>
          <button type="button" aria-label="Próxima página" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} className={cn(btn, 'text-muted hover:bg-surface-2')}>
            <Icon name="chevron-right" size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
```
`src/components/Pagination/index.ts`:
```ts
export { Pagination, type PaginationProps } from './Pagination';
```

- [ ] **Step 5: Exportar e verificar**

Acrescentar em `src/index.ts`:
```ts
export * from './components/Tabs';
export * from './components/Stepper';
export * from './components/Breadcrumb';
export * from './components/Pagination';
```

Run: `pnpm typecheck; pnpm lint; pnpm test`
Expected: verde. No teste de reticências, `getAllByText('…')` encontra os itens `aria-hidden` porque `getAllByText` não filtra por acessibilidade.

- [ ] **Step 6: Commit**

```powershell
git add <somente os arquivos criados ou alterados nesta tarefa, por caminho; nunca -A nem ponto>
git commit -m "feat(ui): Tabs, Stepper, Breadcrumb e Pagination" -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 9: Dados (Avatar, Chip, KPICard, LineChart, DataTable)

**Files:**
- Create: `src/components/Avatar/{Avatar.tsx,Avatar.test.tsx,index.ts}`
- Create: `src/components/Chip/{Chip.tsx,Chip.test.tsx,index.ts}`
- Create: `src/components/KPICard/{KPICard.tsx,KPICard.test.tsx,index.ts}`
- Create: `src/components/LineChart/{LineChart.tsx,buildPath.ts,LineChart.test.tsx,index.ts}`
- Create: `src/components/DataTable/{DataTable.tsx,DataTable.test.tsx,index.ts}`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `cn`, `Icon`, `Card`, `EmptyState`, `Skeleton`.
- Produces:
  - `initialsOf(name: string): string`; `Avatar`: `{ name: string; src?: string; size?: 'sm' | 'md' | 'lg' }` (imagem com `alt=""` quando há `name` visível ao redor não é assumido: o `alt` é `name`).
  - `Chip`: botão de alternância `{ selected?: boolean; onClick?: () => void; children }` com `aria-pressed`.
  - `KPICard`: `{ label: string; value: string; icon?: IconName; delta?: { value: string; trend: 'up' | 'down' } }`.
  - `buildPath(values: number[], width: number, height: number, pad?: number): string`; `LineChart`: `{ data: Array<{ label: string; value: number }>; ariaLabel: string; height?: number }`.
  - `DataTable<T>`: `{ columns: Array<{ key: string; header: string; cell: (row: T) => ReactNode; align?: 'left' | 'right' }>; rows: T[]; getRowId: (row: T) => string; caption: string; loading?: boolean; empty?: ReactNode }`.

- [ ] **Step 1: Testes (falha)**

`src/components/Avatar/Avatar.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Avatar, initialsOf } from './Avatar';

describe('initialsOf', () => {
  it.each([
    ['Maria Silva', 'MS'],
    ['maria', 'M'],
    ['  João  Pedro da Costa ', 'JC'],
    ['', '?'],
    ['Álvaro', 'Á'],
  ])('%s -> %s', (name, expected) => {
    expect(initialsOf(name)).toBe(expected);
  });
});

describe('Avatar', () => {
  it('sem imagem mostra iniciais com nome acessível', () => {
    render(<Avatar name="Maria Silva" />);
    expect(screen.getByRole('img', { name: 'Maria Silva' })).toHaveTextContent('MS');
  });

  it('com imagem usa o nome como alt', () => {
    render(<Avatar name="Maria Silva" src="/m.png" />);
    expect(screen.getByRole('img', { name: 'Maria Silva' })).toHaveAttribute('src', '/m.png');
  });

  it('a cor é estável para o mesmo nome', () => {
    const { container, rerender } = render(<Avatar name="Maria Silva" />);
    const first = (container.firstChild as HTMLElement).className;
    rerender(<Avatar name="Maria Silva" />);
    expect((container.firstChild as HTMLElement).className).toBe(first);
  });

  it('passa no axe', async () => {
    const { container } = render(<Avatar name="Maria Silva" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

`src/components/Chip/Chip.test.tsx`:
```tsx
import { axe } from 'vitest-axe';
import { renderUi } from '@/test/render';
import { Chip } from './Chip';

describe('Chip', () => {
  it('é um botão de alternância com aria-pressed', async () => {
    const onClick = vi.fn();
    const { user, getByRole } = renderUi(<Chip selected onClick={onClick}>Pernas</Chip>);
    const chip = getByRole('button', { name: 'Pernas' });
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    await user.click(chip);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('selecionado tem ícone de check, não só cor', () => {
    const { container } = renderUi(<Chip selected>Pernas</Chip>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('passa no axe', async () => {
    const { container } = renderUi(<Chip>Pernas</Chip>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

`src/components/KPICard/KPICard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { KPICard } from './KPICard';

describe('KPICard', () => {
  it('mostra rótulo e valor', () => {
    render(<KPICard label="Alunos ativos" value="128" />);
    expect(screen.getByText('Alunos ativos')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();
  });

  it('variação tem ícone e texto para leitores de tela', () => {
    const { container } = render(<KPICard label="Receita" value="R$ 12 mil" delta={{ value: '8%', trend: 'up' }} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(screen.getByText('Aumento de 8%')).toHaveClass('sr-only');
  });

  it('queda usa o texto correspondente', () => {
    render(<KPICard label="Churn" value="2%" delta={{ value: '1%', trend: 'down' }} />);
    expect(screen.getByText('Queda de 1%')).toBeInTheDocument();
  });

  it('valor longo não estoura o cartão e passa no axe', async () => {
    const { container } = render(<KPICard label="Receita" value="R$ 12.345.678,90" />);
    expect(screen.getByText('R$ 12.345.678,90')).toHaveClass('truncate');
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

`src/components/LineChart/LineChart.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { buildPath } from './buildPath';
import { LineChart } from './LineChart';

describe('buildPath', () => {
  it('mapeia o menor valor para a base e o maior para o topo', () => {
    expect(buildPath([0, 10], 100, 50, 0)).toBe('M0,50 L100,0');
  });

  it('valores iguais viram uma linha reta no meio, sem NaN', () => {
    const d = buildPath([5, 5, 5], 100, 50, 0);
    expect(d).not.toContain('NaN');
    expect(d).toBe('M0,25 L50,25 L100,25');
  });

  it('um único ponto não divide por zero', () => {
    expect(buildPath([3], 100, 50, 0)).not.toContain('NaN');
  });

  it('lista vazia devolve string vazia', () => {
    expect(buildPath([], 100, 50)).toBe('');
  });
});

describe('LineChart', () => {
  const data = [
    { label: 'Jan', value: 10 },
    { label: 'Fev', value: 30 },
    { label: 'Mar', value: 20 },
  ];

  it('é uma imagem acessível com os dados numa tabela para leitores de tela', () => {
    render(<LineChart data={data} ariaLabel="Evolução mensal" />);
    expect(screen.getByRole('img', { name: 'Evolução mensal' })).toBeInTheDocument();
    expect(screen.getByRole('table', { hidden: true })).toHaveClass('sr-only');
  });

  it('sem dados mostra mensagem em vez de gráfico', () => {
    render(<LineChart data={[]} ariaLabel="Evolução" />);
    expect(screen.getByText('Sem dados para exibir')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('é fluido (sem largura fixa) e passa no axe', async () => {
    const { container } = render(<LineChart data={data} ariaLabel="Evolução mensal" />);
    expect(container.querySelector('svg')).toHaveClass('w-full');
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

`src/components/DataTable/DataTable.test.tsx`:
```tsx
import { render, screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { DataTable } from './DataTable';

interface Row {
  id: string;
  name: string;
  role: string;
}

const rows: Row[] = [
  { id: '1', name: 'Personal Trainer', role: 'Acesso completo' },
  { id: '2', name: 'Aluno', role: 'Acesso limitado' },
];

const columns = [
  { key: 'name', header: 'Papel', cell: (r: Row) => r.name },
  { key: 'role', header: 'Descrição', cell: (r: Row) => r.role },
];

describe('DataTable', () => {
  it('usa tabela semântica com legenda e cabeçalhos de coluna', () => {
    render(<DataTable caption="Papéis" columns={columns} rows={rows} getRowId={(r) => r.id} />);
    expect(screen.getByRole('table', { name: 'Papéis' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(within(screen.getAllByRole('row')[1]!).getByText('Personal Trainer')).toBeInTheDocument();
  });

  it('sem linhas mostra o estado vazio padrão ou o customizado', () => {
    const { rerender } = render(<DataTable caption="Papéis" columns={columns} rows={[]} getRowId={(r: Row) => r.id} />);
    expect(screen.getByText('Nada por aqui')).toBeInTheDocument();
    rerender(<DataTable caption="Papéis" columns={columns} rows={[]} getRowId={(r: Row) => r.id} empty={<p>Cadastre um papel</p>} />);
    expect(screen.getByText('Cadastre um papel')).toBeInTheDocument();
  });

  it('loading mostra esqueleto e marca a tabela como ocupada', () => {
    render(<DataTable caption="Papéis" columns={columns} rows={[]} getRowId={(r: Row) => r.id} loading />);
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('Nada por aqui')).not.toBeInTheDocument();
  });

  it('nomes longos quebram sem estourar e a região rolável é focável', () => {
    render(<DataTable caption="Papéis" columns={columns} rows={[{ id: '1', name: 'x'.repeat(200), role: 'y' }]} getRowId={(r) => r.id} />);
    expect(screen.getByRole('region', { name: 'Papéis' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByText('x'.repeat(200)).closest('td')).toHaveClass('break-words');
  });

  it('passa no axe', async () => {
    const { container } = render(<DataTable caption="Papéis" columns={columns} rows={rows} getRowId={(r) => r.id} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm test src/components/Avatar src/components/Chip src/components/KPICard src/components/LineChart src/components/DataTable`
Expected: FAIL, imports não resolvidos.

- [ ] **Step 3: Implementar `Avatar` e `Chip`**

`src/components/Avatar/Avatar.tsx`:
```tsx
import { cn } from '@/lib/cn';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0]![0]!;
  const last = words.length > 1 ? words[words.length - 1]![0]! : '';
  return (first + last).toLocaleUpperCase('pt-BR');
}

const tones = ['bg-ink text-bg', 'bg-line-strong text-ink', 'bg-primary-soft text-accent-text', 'bg-primary text-on-primary'] as const;

function toneFor(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return tones[hash % tones.length]!;
}

const sizes = { sm: 'h-8 w-8 text-caption', md: 'h-10 w-10 text-label', lg: 'h-14 w-14 text-heading-sm' } as const;

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return <img src={src} alt={name} className={cn('shrink-0 rounded-full object-cover', sizes[size], className)} />;
  }
  return (
    <span role="img" aria-label={name} className={cn('inline-grid shrink-0 place-items-center rounded-full font-semibold', sizes[size], toneFor(name), className)}>
      <span aria-hidden="true">{initialsOf(name)}</span>
    </span>
  );
}
```
`src/components/Avatar/index.ts`:
```ts
export { Avatar, initialsOf, type AvatarProps } from './Avatar';
```

`src/components/Chip/Chip.tsx`:
```tsx
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/icons';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed'> {
  selected?: boolean;
}

export function Chip({ selected = false, className, children, type = 'button', ...rest }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex h-11 items-center gap-1.5 rounded-full border px-4 text-button transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        selected ? 'border-primary bg-primary-soft text-accent-text' : 'border-line-strong bg-surface text-ink hover:bg-surface-2',
        className,
      )}
      {...rest}
    >
      {selected ? <Icon name="check" size={14} /> : null}
      {children}
    </button>
  );
}
```
`src/components/Chip/index.ts`:
```ts
export { Chip, type ChipProps } from './Chip';
```

- [ ] **Step 4: Implementar `KPICard`**

`src/components/KPICard/KPICard.tsx`:
```tsx
import { cn } from '@/lib/cn';
import { Icon, type IconName } from '@/icons';
import { Card } from '../Card';

export interface KPICardProps {
  label: string;
  value: string;
  icon?: IconName;
  delta?: { value: string; trend: 'up' | 'down' };
}

export function KPICard({ label, value, icon, delta }: KPICardProps) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 text-muted">
        <span className="truncate text-label">{label}</span>
        {icon ? <Icon name={icon} size={18} /> : null}
      </div>
      <p className="truncate text-heading-lg text-ink">{value}</p>
      {delta ? (
        <p className={cn('flex items-center gap-1 text-label', delta.trend === 'up' ? 'text-success-text' : 'text-danger-text')}>
          <Icon name={delta.trend === 'up' ? 'trend-up' : 'trend-down'} size={14} />
          <span aria-hidden="true">{delta.value}</span>
          <span className="sr-only">{`${delta.trend === 'up' ? 'Aumento' : 'Queda'} de ${delta.value}`}</span>
        </p>
      ) : null}
    </Card>
  );
}
```
`src/components/KPICard/index.ts`:
```ts
export { KPICard, type KPICardProps } from './KPICard';
```

- [ ] **Step 5: Implementar `LineChart`**

`src/components/LineChart/buildPath.ts`:
```ts
/** Converte valores em um path SVG (`M x,y L x,y ...`) dentro de width×height, com margem `pad`. Y cresce para cima. */
export function buildPath(values: number[], width: number, height: number, pad = 0): string {
  if (values.length === 0) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const x = (i: number) => (values.length === 1 ? width / 2 : pad + (i / (values.length - 1)) * innerW);
  const y = (v: number) => (span === 0 ? height / 2 : pad + innerH - ((v - min) / span) * innerH);
  return values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ');
}
```

`src/components/LineChart/LineChart.tsx`:
```tsx
import { buildPath } from './buildPath';

export interface LineChartProps {
  data: Array<{ label: string; value: number }>;
  ariaLabel: string;
  height?: number;
}

const VIEW_WIDTH = 600;

export function LineChart({ data, ariaLabel, height = 160 }: LineChartProps) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-body text-muted">Sem dados para exibir</p>;
  }
  const d = buildPath(
    data.map((p) => p.value),
    VIEW_WIDTH,
    height,
    8,
  );
  return (
    <figure className="m-0">
      <svg
        role="img"
        aria-label={ariaLabel}
        viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
        preserveAspectRatio="none"
        className="h-auto w-full text-primary"
      >
        <path d={d} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <table className="sr-only">
        <caption>{ariaLabel}</caption>
        <thead>
          <tr>
            <th scope="col">Período</th>
            <th scope="col">Valor</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.label}>
              <th scope="row">{p.label}</th>
              <td>{p.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div aria-hidden="true" className="mt-1 flex justify-between text-caption text-muted">
        {data.map((p) => (
          <span key={p.label}>{p.label}</span>
        ))}
      </div>
    </figure>
  );
}
```
`src/components/LineChart/index.ts`:
```ts
export { LineChart, type LineChartProps } from './LineChart';
export { buildPath } from './buildPath';
```

- [ ] **Step 6: Implementar `DataTable`**

`src/components/DataTable/DataTable.tsx`:
```tsx
import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { EmptyState } from '../EmptyState';
import { Skeleton } from '../Skeleton';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  align?: 'left' | 'right';
}

export interface DataTableProps<T> {
  columns: Array<DataTableColumn<T>>;
  rows: T[];
  getRowId: (row: T) => string;
  caption: string;
  loading?: boolean;
  empty?: ReactNode;
}

export function DataTable<T>({ columns, rows, getRowId, caption, loading = false, empty }: DataTableProps<T>) {
  const captionId = useId();
  const align = (a?: 'left' | 'right') => (a === 'right' ? 'text-right' : 'text-left');
  return (
    <div role="region" aria-labelledby={captionId} tabIndex={0} className="overflow-x-auto rounded-lg border border-line bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <table aria-busy={loading || undefined} className="w-full border-collapse text-body">
        <caption id={captionId} className="sr-only">
          {caption}
        </caption>
        <thead className="bg-surface-2">
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cn('px-4 py-3 text-label text-muted', align(c.align))}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 3 }, (_, i) => (
                <tr key={i} className="border-t border-line">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row) => (
                <tr key={getRowId(row)} className="border-t border-line">
                  {columns.map((c) => (
                    <td key={c.key} className={cn('break-words px-4 py-3 text-ink', align(c.align))}>
                      {c.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
          {!loading && rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>{empty ?? <EmptyState title="Nada por aqui" />}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
```
`src/components/DataTable/index.ts`:
```ts
export { DataTable, type DataTableProps, type DataTableColumn } from './DataTable';
```

- [ ] **Step 7: Exportar e verificar**

Acrescentar em `src/index.ts`:
```ts
export * from './components/Avatar';
export * from './components/Chip';
export * from './components/KPICard';
export * from './components/LineChart';
export * from './components/DataTable';
```

Run: `pnpm typecheck; pnpm lint; pnpm test`
Expected: verde. Se o teste `nomes longos` falhar em `getByRole('region', { name })`, conferir que a legenda `<caption>` (sr-only) está no DOM: o `aria-labelledby` aponta para ela. Se o `noUncheckedIndexedAccess` reclamar em `initialsOf`, manter os `!` já presentes.

- [ ] **Step 8: Commit**

```powershell
git add <somente os arquivos criados ou alterados nesta tarefa, por caminho; nunca -A nem ponto>
git commit -m "feat(ui): Avatar, Chip, KPICard, LineChart e DataTable" -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 10: Layouts (AuthLayout, Sidebar, AppHeader, DashboardShell)

**Files:**
- Create: `src/layouts/AuthLayout/{AuthLayout.tsx,AuthLayout.test.tsx,index.ts}`
- Create: `src/layouts/DashboardShell/{Sidebar.tsx,AppHeader.tsx,DashboardShell.tsx,DashboardShell.test.tsx,index.ts}`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `Logo`, `Icon`, `IconName`, `cn`.
- Produces:
  - `AuthLayout`: `{ imageSrc?: string; title?: string; features?: Array<{ icon: IconName; label: string }>; footer?: ReactNode; panel?: 'lg' | 'sm'; children }`. Painel escuro à esquerda (oculto abaixo de `lg`, com o Logo repetido acima do formulário) e conteúdo à direita. A imagem é decorativa (`alt=""`).
  - `Sidebar`: `{ items: Array<{ label: string; href: string; icon: IconName; active?: boolean }>; footer?: ReactNode }`; `<nav aria-label="Principal">`, item ativo com `aria-current="page"`.
  - `AppHeader`: `{ title: string; description?: string; actions?: ReactNode }`.
  - `DashboardShell`: `{ sidebar: ReactNode; children: ReactNode }`. Link "Ir para o conteúdo", `<main id="conteudo">`, botão "Abrir menu" (`aria-expanded`, `aria-controls`) abaixo de `lg`, gaveta que fecha com Esc e ao clicar no fundo.

- [ ] **Step 1: Testes (falha)**

`src/layouts/AuthLayout/AuthLayout.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { AuthLayout } from './AuthLayout';

describe('AuthLayout', () => {
  it('renderiza o conteúdo e o logo', () => {
    render(<AuthLayout><h1>Login</h1></AuthLayout>);
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: 'aura-fit' }).length).toBeGreaterThan(0);
  });

  it('lista os diferenciais quando informados', () => {
    render(<AuthLayout features={[{ icon: 'users', label: 'Gestão de alunos' }]}><p>x</p></AuthLayout>);
    expect(screen.getByText('Gestão de alunos')).toBeInTheDocument();
  });

  it('a imagem é decorativa', () => {
    const { container } = render(<AuthLayout imageSrc="/x.jpg"><p>x</p></AuthLayout>);
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('o painel some no mobile e o formulário não depende dele', () => {
    const { container } = render(<AuthLayout title="Mais que treinos"><p>x</p></AuthLayout>);
    expect(container.querySelector('aside')).toHaveClass('hidden', 'lg:flex');
  });

  it('passa no axe', async () => {
    const { container } = render(
      <AuthLayout title="Bem-vindo" features={[{ icon: 'users', label: 'Alunos' }]}>
        <main><h1>Login</h1></main>
      </AuthLayout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

`src/layouts/DashboardShell/DashboardShell.test.tsx`:
```tsx
import { axe } from 'vitest-axe';
import { renderUi } from '@/test/render';
import { AppHeader } from './AppHeader';
import { DashboardShell } from './DashboardShell';
import { Sidebar } from './Sidebar';

const items = [
  { label: 'Início', href: '/', icon: 'home' as const, active: true },
  { label: 'Alunos', href: '/alunos', icon: 'users' as const },
];

describe('Sidebar', () => {
  it('é navegação principal e marca o item ativo', () => {
    const { getByRole } = renderUi(<Sidebar items={items} />);
    expect(getByRole('navigation', { name: 'Principal' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'Início' })).toHaveAttribute('aria-current', 'page');
    expect(getByRole('link', { name: 'Alunos' })).not.toHaveAttribute('aria-current');
  });
});

describe('AppHeader', () => {
  it('mostra título, descrição e ações', () => {
    const { getByRole, getByText } = renderUi(<AppHeader title="Permissões" description="Gerencie papéis" actions={<button type="button">Nova função</button>} />);
    expect(getByRole('heading', { level: 1, name: 'Permissões' })).toBeInTheDocument();
    expect(getByText('Gerencie papéis')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Nova função' })).toBeInTheDocument();
  });
});

describe('DashboardShell', () => {
  it('tem link de pular para o conteúdo e landmark main', () => {
    const { getByRole } = renderUi(<DashboardShell sidebar={<Sidebar items={items} />}><p>Conteúdo</p></DashboardShell>);
    expect(getByRole('link', { name: 'Ir para o conteúdo' })).toHaveAttribute('href', '#conteudo');
    expect(getByRole('main')).toHaveAttribute('id', 'conteudo');
  });

  it('o botão de menu abre e fecha a gaveta e atualiza aria-expanded', async () => {
    const { user, getByRole } = renderUi(<DashboardShell sidebar={<Sidebar items={items} />}>x</DashboardShell>);
    const btn = getByRole('button', { name: 'Abrir menu' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await user.click(btn);
    expect(getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'true');
    await user.click(getByRole('button', { name: 'Fechar menu' }));
    expect(getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('Esc fecha a gaveta e devolve o foco ao botão de menu', async () => {
    const { user, getByRole } = renderUi(<DashboardShell sidebar={<Sidebar items={items} />}>x</DashboardShell>);
    await user.click(getByRole('button', { name: 'Abrir menu' }));
    await user.keyboard('{Escape}');
    const btn = getByRole('button', { name: 'Abrir menu' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(btn).toHaveFocus();
  });

  it('passa no axe', async () => {
    const { container } = renderUi(
      <DashboardShell sidebar={<Sidebar items={items} />}>
        <AppHeader title="Início" />
      </DashboardShell>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm test src/layouts`
Expected: FAIL, imports não resolvidos.

- [ ] **Step 3: Implementar `AuthLayout`**

O painel é sempre escuro (é a identidade do fundo com foto), independentemente do tema, então usa a paleta neutra padrão do Tailwind, sem hex.

`src/layouts/AuthLayout/AuthLayout.tsx`:
```tsx
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from '@/icons';
import { Logo } from '@/components/Logo';

export interface AuthLayoutProps {
  imageSrc?: string;
  title?: string;
  features?: Array<{ icon: IconName; label: string }>;
  footer?: ReactNode;
  /** Largura do painel: `lg` (login, cadastro) ou `sm` (recuperação, estados). */
  panel?: 'lg' | 'sm';
  children: ReactNode;
}

export function AuthLayout({ imageSrc, title, features, footer, panel = 'lg', children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-surface text-ink">
      <aside
        className={cn(
          'relative hidden shrink-0 flex-col justify-between overflow-hidden bg-neutral-900 p-10 text-white lg:flex',
          panel === 'lg' ? 'w-[44%]' : 'w-[28%]',
        )}
      >
        {imageSrc ? <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" /> : null}
        <div className="relative z-10 flex h-full flex-col justify-between gap-8">
          <Logo variant="on-dark" size={28} />
          <div className="flex flex-col gap-6">
            {title ? <p className="max-w-xs text-heading-lg">{title}</p> : null}
            {features?.length ? (
              <ul className="flex flex-col gap-3 text-body">
                {features.map((f) => (
                  <li key={f.label} className="flex items-center gap-3">
                    <Icon name={f.icon} size={18} />
                    {f.label}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {footer ? <div className="text-body">{footer}</div> : <span />}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-8 px-4 py-10 sm:px-8">
        <Logo size={28} className="lg:hidden" />
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
```
`src/layouts/AuthLayout/index.ts`:
```ts
export { AuthLayout, type AuthLayoutProps } from './AuthLayout';
```

- [ ] **Step 4: Implementar `Sidebar`, `AppHeader` e `DashboardShell`**

`src/layouts/DashboardShell/Sidebar.tsx`:
```tsx
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from '@/icons';
import { Logo } from '@/components/Logo';

export interface SidebarItem {
  label: string;
  href: string;
  icon: IconName;
  active?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  footer?: ReactNode;
}

export function Sidebar({ items, footer }: SidebarProps) {
  return (
    <div className="flex h-full flex-col gap-6 bg-neutral-900 p-4 text-white">
      <div className="px-2 pt-2">
        <Logo variant="on-dark" size={24} />
      </div>
      <nav aria-label="Principal" className="flex-1">
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                className={cn(
                  'flex h-11 items-center gap-3 rounded-sm px-3 text-button transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                  item.active ? 'bg-primary text-on-primary' : 'text-neutral-300 hover:bg-white/10 hover:text-white',
                )}
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {footer ? <div className="border-t border-white/10 pt-4">{footer}</div> : null}
    </div>
  );
}
```

`src/layouts/DashboardShell/AppHeader.tsx`:
```tsx
import type { ReactNode } from 'react';

export interface AppHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function AppHeader({ title, description, actions }: AppHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-heading-md text-ink">{title}</h1>
        {description ? <p className="mt-1 text-body text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}
```

`src/layouts/DashboardShell/DashboardShell.tsx`:
```tsx
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/icons';

export interface DashboardShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function DashboardShell({ sidebar, children }: DashboardShellProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-sm focus:bg-surface focus:px-3 focus:py-2 focus:text-ink focus:ring-2 focus:ring-primary"
      >
        Ir para o conteúdo
      </a>

      <aside id={menuId} className={cn('fixed inset-y-0 left-0 z-40 w-64 transition-transform motion-reduce:transition-none lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
        {sidebar}
      </aside>
      {open ? (
        <button type="button" aria-label="Fechar menu" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/50 lg:hidden" />
      ) : null}

      <div className="lg:pl-64">
        <div className="flex h-14 items-center border-b border-line bg-surface px-4 lg:hidden">
          <button
            ref={menuButton}
            type="button"
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((o) => !o)}
            className="-ml-2 grid h-11 w-11 place-items-center rounded-sm text-ink hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Icon name="dashboard" size={20} />
          </button>
        </div>
        <main id="conteudo" tabIndex={-1} className="mx-auto max-w-6xl p-4 focus:outline-none sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
```

`src/layouts/DashboardShell/index.ts`:
```ts
export { DashboardShell, type DashboardShellProps } from './DashboardShell';
export { Sidebar, type SidebarProps, type SidebarItem } from './Sidebar';
export { AppHeader, type AppHeaderProps } from './AppHeader';
```

- [ ] **Step 5: Exportar e verificar**

Acrescentar em `src/index.ts`:
```ts
export * from './layouts/AuthLayout';
export * from './layouts/DashboardShell';
```

Run: `pnpm typecheck; pnpm lint; pnpm test`
Expected: verde. Se o axe reclamar de "landmark-one-main" ou "region" no teste do `AuthLayout`, embrulhar o conteúdo de teste em `<main>` (já feito) e não mexer no componente. No teste da gaveta, o botão "Fechar menu" só existe com a gaveta aberta e o "Abrir menu" continua no DOM, por isso as consultas por nome funcionam.

- [ ] **Step 6: Commit**

```powershell
git add <somente os arquivos criados ou alterados nesta tarefa, por caminho; nunca -A nem ponto>
git commit -m "feat(layouts): AuthLayout, Sidebar, AppHeader e DashboardShell" -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 11: Fundação do showcase (tema, layout, registro de componentes)

**Files:**
- Create: `showcase/theme.tsx`, `showcase/theme.test.tsx`
- Create: `showcase/registry.ts`, `showcase/Demo.tsx`
- Create: `showcase/pages/ComponentPage.tsx`, `showcase/pages/Home.tsx`
- Create: `showcase/layout/ShowcaseLayout.tsx`
- Create: `showcase/demos/primitives.tsx`
- Create: `showcase/showcase.test.tsx`
- Modify: `showcase/App.tsx`, `showcase/main.tsx`, `src/layouts/DashboardShell/Sidebar.tsx`

**Interfaces:**
- Consumes: todo o `src/` via `@/`.
- Produces:
  - `useTheme(): { theme: 'light' | 'dark'; toggle: () => void }` e `<ThemeProvider>`.
  - `interface ComponentDoc { slug: string; title: string; description: string; use: string[]; avoid: string[]; render: () => ReactNode }`.
  - `registry: ComponentDoc[]` (concatenação de `showcase/demos/*.tsx`). Cada arquivo de demos exporta `export const docs: ComponentDoc[]`.
  - `<Demo title>` para seções rotuladas dentro de uma página de componente.
  - Rotas: `#/` (Home), `#/componentes/:slug`, `#/telas/:slug` (Task 13).

- [ ] **Step 1: Teste do tema (falha)**

`showcase/theme.test.tsx`:
```tsx
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './theme';

function Probe() {
  const { theme, toggle } = useTheme();
  return (
    <button type="button" onClick={toggle}>
      {theme}
    </button>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    localStorage.clear();
  });

  it('começa no claro quando não há preferência salva', () => {
    render(<ThemeProvider><Probe /></ThemeProvider>);
    expect(screen.getByRole('button')).toHaveTextContent('light');
    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('alterna a classe .dark no <html> e persiste a escolha', async () => {
    render(<ThemeProvider><Probe /></ThemeProvider>);
    await userEvent.click(screen.getByRole('button'));
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('aura-theme')).toBe('dark');
  });

  it('respeita o tema salvo', () => {
    localStorage.setItem('aura-theme', 'dark');
    render(<ThemeProvider><Probe /></ThemeProvider>);
    expect(screen.getByRole('button')).toHaveTextContent('dark');
  });

  it('funciona quando o localStorage lança erro', async () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    render(<ThemeProvider><Probe /></ThemeProvider>);
    await act(async () => {
      await userEvent.click(screen.getByRole('button'));
    });
    expect(document.documentElement).toHaveClass('dark');
    spy.mockRestore();
  });
});
```

- [ ] **Step 2: Implementar o tema**

`showcase/theme.tsx`:
```tsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
const KEY = 'aura-theme';

function readInitial(): Theme {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* armazenamento indisponível: segue o padrão */
  }
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitial);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next: Theme = t === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* sem persistência */
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme precisa estar dentro de ThemeProvider');
  return ctx;
}
```

- [ ] **Step 3: Rodar o teste do tema**

Run: `pnpm test showcase/theme.test.tsx`
Expected: PASS (4 testes). Em jsdom `matchMedia` não existe: o código já checa `typeof window.matchMedia`.

- [ ] **Step 4: Registro, `Demo` e página de componente**

`showcase/registry.ts`:
```ts
import type { ReactNode } from 'react';
import { docs as primitives } from './demos/primitives';

export interface ComponentDoc {
  slug: string;
  title: string;
  description: string;
  use: string[];
  avoid: string[];
  render: () => ReactNode;
}

export const registry: ComponentDoc[] = [...primitives];
```
Nota: `primitives.tsx` importa o tipo `ComponentDoc` de `../registry`, o que cria import circular só de tipo. Usar `import type` nos demos (não gera código em runtime).

`showcase/Demo.tsx`:
```tsx
import type { ReactNode } from 'react';

export function Demo({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-label uppercase tracking-wide text-muted">{title}</h3>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </section>
  );
}
```

`showcase/pages/ComponentPage.tsx`:
```tsx
import { Card } from '@/components/Card';
import type { ComponentDoc } from '../registry';

export function ComponentPage({ doc }: { doc: ComponentDoc }) {
  return (
    <article className="flex flex-col gap-8">
      <header>
        <h1 className="text-heading-lg text-ink">{doc.title}</h1>
        <p className="mt-2 max-w-2xl text-body text-muted">{doc.description}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="text-heading-sm text-ink">Quando usar</h2>
          <ul className="mt-2 list-disc pl-5 text-body text-muted">{doc.use.map((u) => <li key={u}>{u}</li>)}</ul>
        </Card>
        <Card>
          <h2 className="text-heading-sm text-ink">Quando evitar</h2>
          <ul className="mt-2 list-disc pl-5 text-body text-muted">{doc.avoid.map((a) => <li key={a}>{a}</li>)}</ul>
        </Card>
      </div>
      <Card className="flex flex-col gap-8">{doc.render()}</Card>
    </article>
  );
}
```

- [ ] **Step 5: Primeiros demos (primitivos)**

`showcase/demos/primitives.tsx`:
```tsx
import type { ComponentDoc } from '../registry';
import { Alert, Badge, Button, Card, CardBody, CardFooter, CardHeader, Icon, Logo, Spinner } from '@/index';
import { Demo } from '../Demo';

export const docs: ComponentDoc[] = [
  {
    slug: 'button',
    title: 'Button',
    description: 'Ação principal ou secundária. Sempre um <button>, com foco visível e área de toque de 44px.',
    use: ['Uma ação primária por tela.', 'Ações de formulário (salvar, enviar).'],
    avoid: ['Navegação entre páginas: use um link.', 'Vários botões primários lado a lado.'],
    render: () => (
      <>
        <Demo title="Variantes">
          <Button>Entrar</Button>
          <Button variant="outline">Cancelar</Button>
          <Button variant="ghost">Ver mais</Button>
          <Button variant="danger">Excluir</Button>
        </Demo>
        <Demo title="Tamanhos">
          <Button size="sm">Pequeno</Button>
          <Button size="md">Médio</Button>
          <Button size="lg">Grande</Button>
        </Demo>
        <Demo title="Estados">
          <Button disabled>Desabilitado</Button>
          <Button loading>Salvando</Button>
          <Button leftIcon="plus">Nova função</Button>
        </Demo>
      </>
    ),
  },
  {
    slug: 'badge',
    title: 'Badge',
    description: 'Rótulo curto de status. Use ícone quando a cor for o único diferencial.',
    use: ['Status de item (ativa, pendente, falhou).'],
    avoid: ['Textos longos.', 'Ações clicáveis: use Chip ou Button.'],
    render: () => (
      <Demo title="Tons">
        <Badge>Rascunho</Badge>
        <Badge tone="primary">Novo</Badge>
        <Badge tone="success" icon="check-circle">Ativa</Badge>
        <Badge tone="warning" icon="warning">Pendente</Badge>
        <Badge tone="danger" icon="x-circle">Falhou</Badge>
        <Badge tone="info" icon="info">Informação</Badge>
      </Demo>
    ),
  },
  {
    slug: 'alert',
    title: 'Alert',
    description: 'Mensagem contextual dentro da página. Erros e avisos usam role="alert"; os demais, role="status".',
    use: ['Feedback persistente de um formulário ou seção.'],
    avoid: ['Feedback passageiro: use Toast.'],
    render: () => (
      <div className="flex w-full flex-col gap-3">
        <Alert tone="info" title="Informação">O link expira em 15 minutos.</Alert>
        <Alert tone="success" title="Tudo certo">Alterações salvas.</Alert>
        <Alert tone="warning" title="Atenção">Sua sessão expira em breve.</Alert>
        <Alert tone="danger" title="Erro" onDismiss={() => {}}>Não foi possível salvar.</Alert>
      </div>
    ),
  },
  {
    slug: 'spinner',
    title: 'Spinner',
    description: 'Indicador de carregamento com role="status" e rótulo. Respeita prefers-reduced-motion.',
    use: ['Espera curta e sem estrutura previsível.'],
    avoid: ['Listas e tabelas: use Skeleton.'],
    render: () => (
      <Demo title="Tamanhos">
        <Spinner size={16} />
        <Spinner size={24} />
        <Spinner size={40} label="Salvando" />
      </Demo>
    ),
  },
  {
    slug: 'card',
    title: 'Card',
    description: 'Contêiner com borda e elevação leve. Compõe cabeçalho, corpo e rodapé.',
    use: ['Agrupar conteúdo relacionado.'],
    avoid: ['Cartão dentro de cartão.'],
    render: () => (
      <Card className="w-full max-w-sm">
        <CardHeader>Plano mensal</CardHeader>
        <CardBody>Acesso completo a alunos, treinos e cobranças.</CardBody>
        <CardFooter><Button size="sm">Assinar</Button></CardFooter>
      </Card>
    ),
  },
  {
    slug: 'icon',
    title: 'Icon e Logo',
    description: 'Ícones da marca herdam currentColor. O Logo segue a regra: só o hífen é vermelho, exceto sobre fundo vermelho.',
    use: ['Reforçar um texto ou sinalizar estado junto com texto.'],
    avoid: ['Ícone sozinho sem title: ele é ocultado para leitores de tela.'],
    render: () => (
      <>
        <Demo title="Ícones (currentColor)">
          {(['home', 'users', 'workout-plan', 'analytics', 'credit-card', 'ai-assistant', 'lock', 'mail'] as const).map((n) => (
            <span key={n} className="grid h-11 w-11 place-items-center rounded-sm bg-surface-2 text-ink"><Icon name={n} size={22} /></span>
          ))}
        </Demo>
        <Demo title="Logo">
          <span className="rounded-md bg-bg p-4"><Logo variant="on-light" /></span>
          <span className="rounded-md bg-neutral-900 p-4"><Logo variant="on-dark" /></span>
          <span className="rounded-md bg-primary p-4"><Logo variant="on-red" /></span>
        </Demo>
      </>
    ),
  },
];
```

- [ ] **Step 6: Layout, Home e rotas**

Alterar `src/layouts/DashboardShell/Sidebar.tsx`: na tag `<nav aria-label="Principal" className="flex-1">` trocar a classe para `"min-h-0 flex-1 overflow-y-auto"`, para listas longas rolarem dentro do painel.

`showcase/layout/ShowcaseLayout.tsx`:
```tsx
import { Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/Button';
import { DashboardShell, Sidebar, type SidebarItem } from '@/layouts/DashboardShell';
import { registry } from '../registry';
import { screens } from '../screens';
import { useTheme } from '../theme';

export function ShowcaseLayout() {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();

  const items: SidebarItem[] = [
    { label: 'Visão geral', href: '#/', icon: 'home', active: pathname === '/' },
    ...registry.map((d) => ({ label: d.title, href: `#/componentes/${d.slug}`, icon: 'dashboard' as const, active: pathname === `/componentes/${d.slug}` })),
    ...screens.map((s) => ({ label: `Tela: ${s.title}`, href: `#/telas/${s.slug}`, icon: 'link' as const, active: pathname === `/telas/${s.slug}` })),
  ];

  return (
    <DashboardShell
      sidebar={
        <Sidebar
          items={items}
          footer={
            <Button variant="outline" size="sm" fullWidth onClick={toggle} aria-pressed={theme === 'dark'}>
              {theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
            </Button>
          }
        />
      }
    >
      <Outlet />
    </DashboardShell>
  );
}
```

`showcase/screens.ts` (provisório, preenchido na Task 13):
```ts
import type { ComponentType } from 'react';

export interface ScreenDoc {
  slug: string;
  title: string;
  Component: ComponentType;
}

export const screens: ScreenDoc[] = [];
```

`showcase/pages/Home.tsx`:
```tsx
import { Card } from '@/components/Card';
import { registry } from '../registry';

export function Home() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-heading-lg text-ink">Aura Fit UI Kit</h1>
        <p className="mt-2 max-w-2xl text-body text-muted">
          Componentes React com Tailwind, tokens da marca, tema claro e escuro e acessibilidade AA. Use o menu para ver cada componente e cada tela.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {registry.map((d) => (
          <a key={d.slug} href={`#/componentes/${d.slug}`} className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <Card className="h-full transition-shadow hover:shadow-elev-2">
              <h2 className="text-heading-sm text-ink">{d.title}</h2>
              <p className="mt-1 text-body text-muted">{d.description}</p>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
```

`showcase/App.tsx`:
```tsx
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ComponentPage } from './pages/ComponentPage';
import { Home } from './pages/Home';
import { ShowcaseLayout } from './layout/ShowcaseLayout';
import { registry } from './registry';
import { screens } from './screens';
import { ThemeProvider } from './theme';

export function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route element={<ShowcaseLayout />}>
            <Route index element={<Home />} />
            {registry.map((d) => (
              <Route key={d.slug} path={`componentes/${d.slug}`} element={<ComponentPage doc={d} />} />
            ))}
          </Route>
          {screens.map((s) => (
            <Route key={s.slug} path={`telas/${s.slug}`} element={<s.Component />} />
          ))}
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}
```
As telas ficam fora do `ShowcaseLayout` porque ocupam a tela inteira (AuthLayout). Elas trazem um link "Voltar ao showcase" (Task 13).

- [ ] **Step 7: Teste de fumaça de todas as páginas (falha até os demos existirem)**

`showcase/showcase.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'vitest-axe';
import { ComponentPage } from './pages/ComponentPage';
import { registry } from './registry';
import { screens } from './screens';
import { ThemeProvider } from './theme';

describe('showcase', () => {
  it('os slugs de componentes e telas são únicos', () => {
    const slugs = [...registry.map((d) => d.slug), ...screens.map((s) => s.slug)];
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  describe.each(registry.map((d) => [d.slug, d] as const))('página %s', (_slug, doc) => {
    it('renderiza título, orientações e o demo sem violações de acessibilidade', async () => {
      const { container } = render(
        <ThemeProvider>
          <MemoryRouter>
            <main>
              <ComponentPage doc={doc} />
            </main>
          </MemoryRouter>
        </ThemeProvider>,
      );
      expect(screen.getByRole('heading', { level: 1, name: doc.title })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Quando usar' })).toBeInTheDocument();
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
```

- [ ] **Step 8: Rodar tudo**

Run: `pnpm typecheck; pnpm lint; pnpm test; pnpm build`
Expected: verde. `pnpm dev` deve abrir o showcase em `http://localhost:5173/#/` com o menu lateral, o botão de tema e as páginas de Button, Badge, Alert, Spinner, Card e Icon. Conferir no navegador o tema escuro e o menu em largura de celular (gaveta).

- [ ] **Step 9: Commit**

```powershell
git add <somente os arquivos criados ou alterados nesta tarefa, por caminho; nunca -A nem ponto>
git commit -m "feat(showcase): tema, layout, registro de componentes e primeiras páginas" -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 12: Páginas de documentação dos demais componentes

**Files:**
- Create: `showcase/demos/forms.tsx`, `showcase/demos/feedback.tsx`, `showcase/demos/navigation.tsx`, `showcase/demos/data.tsx`
- Modify: `showcase/registry.ts`

**Interfaces:**
- Consumes: `ComponentDoc`, `Demo` (Task 11) e todos os componentes de `@/index`.
- Produces: `docs: ComponentDoc[]` em cada arquivo; `registry` passa a ter uma entrada por componente: `input`, `checkbox`, `switch`, `segmented`, `dialog`, `skeleton`, `empty-state`, `progress`, `toast`, `tabs`, `stepper`, `breadcrumb`, `pagination`, `avatar`, `chip`, `kpi-card`, `line-chart`, `data-table`.

O teste de fumaça da Task 11 (`showcase/showcase.test.tsx`) já cobre estas páginas: cada entrada nova precisa passar nele. Demos com estado usam componentes internos, porque `render` não pode chamar hooks.

- [ ] **Step 1: `showcase/demos/forms.tsx`**

```tsx
import { useState } from 'react';
import { Button, Checkbox, ConfirmDialog, Dialog, Radio, Segmented, Switch, TextField } from '@/index';
import { Demo } from '../Demo';
import type { ComponentDoc } from '../registry';

function SwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <Demo title="Controlado">
      <label className="flex items-center gap-2 text-body text-ink">
        <Switch label="Notificações por e-mail" checked={on} onCheckedChange={setOn} />
        Notificações por e-mail: {on ? 'ligadas' : 'desligadas'}
      </label>
      <Switch label="Desabilitado" disabled />
    </Demo>
  );
}

function DialogDemo() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  return (
    <Demo title="Modal e confirmação">
      <Button onClick={() => setOpen(true)}>Abrir modal</Button>
      <Button variant="danger" onClick={() => setConfirm(true)}>Excluir aluno</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Editar plano" description="As mudanças valem para o próximo ciclo." footer={<Button onClick={() => setOpen(false)}>Salvar</Button>}>
        <TextField label="Nome do plano" defaultValue="Mensal" />
      </Dialog>
      <ConfirmDialog open={confirm} onClose={() => setConfirm(false)} onConfirm={() => setConfirm(false)} title="Excluir aluno?" description="Essa ação é definitiva." confirmLabel="Excluir" tone="danger" />
    </Demo>
  );
}

function SegmentedDemo() {
  const [role, setRole] = useState('personal');
  return (
    <Demo title="Seleção de perfil">
      <div className="w-full max-w-md">
        <Segmented aria-label="Perfil" value={role} onValueChange={setRole} options={[{ value: 'personal', label: 'Personal Trainer' }, { value: 'aluno', label: 'Aluno' }, { value: 'admin', label: 'Admin' }]} />
      </div>
    </Demo>
  );
}

export const docs: ComponentDoc[] = [
  {
    slug: 'input',
    title: 'Input e TextField',
    description: 'Campo de texto de 44px. O TextField liga rótulo, dica e erro ao campo por id e aria-describedby. Erro aparece com ícone e texto.',
    use: ['Qualquer entrada de texto em formulários.', 'Senha com botão de mostrar/ocultar.'],
    avoid: ['Validação dentro do kit: quem decide as regras é o app.'],
    render: () => (
      <div className="grid w-full gap-4 sm:grid-cols-2">
        <TextField label="E-mail" type="email" placeholder="seu@email.com" hint="Use o e-mail de cadastro" />
        <TextField label="Senha" type="password" revealable placeholder="Digite sua senha" />
        <TextField label="Telefone" error="Informe um telefone válido" defaultValue="(11) 9" />
        <TextField label="Nome" defaultValue="Campo desabilitado" disabled />
      </div>
    ),
  },
  {
    slug: 'checkbox',
    title: 'Checkbox e Radio',
    description: 'Controles nativos com área de toque de 44px. Radios do mesmo grupo compartilham name e navegam com as setas.',
    use: ['Aceite de termos, múltiplas escolhas (checkbox).', 'Escolha única entre poucas opções (radio).'],
    avoid: ['Ligar/desligar algo imediatamente: use Switch.'],
    render: () => (
      <>
        <Demo title="Checkbox">
          <Checkbox label="Lembrar de mim" />
          <Checkbox label="Li e aceito os Termos de Uso" description="Obrigatório para criar a conta" invalid />
          <Checkbox label="Desabilitado" disabled />
        </Demo>
        <Demo title="Radio">
          <fieldset className="flex flex-col">
            <legend className="mb-1 text-label text-ink">Frequência</legend>
            <Radio name="freq" value="semanal" label="Semanal" defaultChecked />
            <Radio name="freq" value="mensal" label="Mensal" />
          </fieldset>
        </Demo>
      </>
    ),
  },
  {
    slug: 'switch',
    title: 'Switch',
    description: 'Interruptor com role="switch" e aria-checked. Aplica a mudança na hora.',
    use: ['Preferências que valem imediatamente.'],
    avoid: ['Escolhas que só valem depois de enviar o formulário: use Checkbox.'],
    render: () => <SwitchDemo />,
  },
  {
    slug: 'segmented',
    title: 'Segmented',
    description: 'Seleção única entre 2 a 4 opções curtas, montada sobre radios nativos.',
    use: ['Escolha de perfil, período ou visão.'],
    avoid: ['Mais de 4 opções ou rótulos longos.'],
    render: () => <SegmentedDemo />,
  },
  {
    slug: 'dialog',
    title: 'Dialog e ConfirmDialog',
    description: 'Modal sobre o elemento nativo <dialog>: prende o foco, fecha com Esc ou clique no fundo e devolve o foco ao gatilho.',
    use: ['Confirmar ações destrutivas.', 'Formulários curtos.'],
    avoid: ['Fluxos longos: use uma página.', 'Mensagens informativas: use Alert ou Toast.'],
    render: () => <DialogDemo />,
  },
];
```

- [ ] **Step 2: `showcase/demos/feedback.tsx`**

```tsx
import { Button, EmptyState, ProgressBar, ProgressRing, Skeleton, Toast } from '@/index';
import { Demo } from '../Demo';
import type { ComponentDoc } from '../registry';

export const docs: ComponentDoc[] = [
  {
    slug: 'skeleton',
    title: 'Skeleton',
    description: 'Placeholder decorativo para conteúdo com forma previsível. Some com prefers-reduced-motion.',
    use: ['Listas, tabelas e cartões carregando.'],
    avoid: ['Ações sem estrutura: use Spinner.'],
    render: () => (
      <div className="flex w-full max-w-sm flex-col gap-2">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    ),
  },
  {
    slug: 'empty-state',
    title: 'EmptyState',
    description: 'Estado vazio com ícone, título, explicação e uma ação.',
    use: ['Listas e tabelas sem itens.', 'Resultado de busca vazio.'],
    avoid: ['Erros: use Alert.'],
    render: () => <EmptyState icon="users" title="Nenhum aluno ainda" description="Cadastre o primeiro aluno para começar a prescrever treinos." action={<Button leftIcon="user-add">Novo aluno</Button>} />,
  },
  {
    slug: 'progress',
    title: 'ProgressBar e ProgressRing',
    description: 'Progresso com role="progressbar". O valor é limitado ao intervalo e o percentual aparece em texto.',
    use: ['Metas, ciclos de treino, uso do plano.'],
    avoid: ['Espera de duração desconhecida: use Spinner.'],
    render: () => (
      <>
        <Demo title="Barra">
          <div className="w-full max-w-md"><ProgressBar value={65} label="Meta semanal" showValue /></div>
        </Demo>
        <Demo title="Anel">
          <ProgressRing value={30} label="Treinos concluídos" />
          <ProgressRing value={100} size={96} label="Meta atingida" />
        </Demo>
      </>
    ),
  },
  {
    slug: 'toast',
    title: 'Toast',
    description: 'Item visual de notificação passageira. O app decide onde mostrar e por quanto tempo.',
    use: ['Confirmar uma ação rápida (salvo, copiado).'],
    avoid: ['Erros que exigem decisão: use Alert ou Dialog.'],
    render: () => (
      <div className="flex flex-col gap-3">
        <Toast tone="success" title="Aluno cadastrado" description="Maria Silva foi adicionada." onDismiss={() => {}} />
        <Toast tone="danger" title="Falha ao enviar" description="Tente novamente." onDismiss={() => {}} />
      </div>
    ),
  },
];
```

- [ ] **Step 3: `showcase/demos/navigation.tsx`**

```tsx
import { useState } from 'react';
import { Breadcrumb, Pagination, Stepper, Tabs } from '@/index';
import { Demo } from '../Demo';
import type { ComponentDoc } from '../registry';

function PaginationDemo() {
  const [page, setPage] = useState(3);
  return (
    <Demo title="20 páginas">
      <Pagination page={page} pageCount={20} onPageChange={setPage} />
    </Demo>
  );
}

export const docs: ComponentDoc[] = [
  {
    slug: 'tabs',
    title: 'Tabs',
    description: 'Abas no padrão WAI-ARIA: setas, Home e End movem a seleção e só a aba ativa entra na ordem de Tab.',
    use: ['Alternar seções de uma mesma página (perfil, segurança, preferências).'],
    avoid: ['Navegar entre páginas: use links.'],
    render: () => (
      <div className="w-full">
        <Tabs
          aria-label="Minha conta"
          tabs={[
            { value: 'perfil', label: 'Perfil', content: 'Dados pessoais e foto.' },
            { value: 'seguranca', label: 'Segurança', content: 'Senha e verificação em duas etapas.' },
            { value: 'preferencias', label: 'Preferências', content: 'Idioma e notificações.' },
          ]}
        />
      </div>
    ),
  },
  {
    slug: 'stepper',
    title: 'Stepper',
    description: 'Progresso em etapas. A etapa atual usa aria-current="step" e as concluídas mostram um check.',
    use: ['Cadastro ou onboarding em várias etapas.'],
    avoid: ['Mais de 5 etapas.'],
    render: () => <div className="w-full max-w-xl"><Stepper steps={['Conta', 'Perfil', 'Plano', 'Pagamento']} current={1} /></div>,
  },
  {
    slug: 'breadcrumb',
    title: 'Breadcrumb',
    description: 'Trilha de navegação. O último item é a página atual e nomes longos são truncados.',
    use: ['Hierarquias com 3 ou mais níveis.'],
    avoid: ['Navegação plana de 1 ou 2 níveis.'],
    render: () => <Breadcrumb items={[{ label: 'Início', href: '#/' }, { label: 'Alunos', href: '#/' }, { label: 'Maria Silva' }]} />,
  },
  {
    slug: 'pagination',
    title: 'Pagination',
    description: 'Paginação com reticências, primeira e última sempre visíveis. Com 1 página não renderiza nada.',
    use: ['Tabelas e listas longas.'],
    avoid: ['Listas curtas: mostre tudo.'],
    render: () => <PaginationDemo />,
  },
];
```

- [ ] **Step 4: `showcase/demos/data.tsx`**

```tsx
import { useState } from 'react';
import { Avatar, Badge, Chip, DataTable, KPICard, LineChart } from '@/index';
import { Demo } from '../Demo';
import type { ComponentDoc } from '../registry';

function ChipDemo() {
  const options = ['Pernas', 'Costas', 'Peito', 'Braços'];
  const [selected, setSelected] = useState<string[]>(['Pernas']);
  const toggle = (o: string) => setSelected((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]));
  return (
    <Demo title="Filtro de grupo muscular">
      {options.map((o) => (
        <Chip key={o} selected={selected.includes(o)} onClick={() => toggle(o)}>{o}</Chip>
      ))}
    </Demo>
  );
}

interface Role { id: string; name: string; description: string; active: boolean }
const roles: Role[] = [
  { id: '1', name: 'Personal Trainer', description: 'Acesso completo aos recursos do tenant.', active: true },
  { id: '2', name: 'Aluno', description: 'Acesso limitado aos próprios dados.', active: true },
  { id: '3', name: 'Administrador', description: 'Acesso total à plataforma.', active: false },
];

export const docs: ComponentDoc[] = [
  {
    slug: 'avatar',
    title: 'Avatar',
    description: 'Foto ou iniciais coloridas de forma estável pelo nome. Sempre tem nome acessível.',
    use: ['Identificar pessoas em listas e no perfil.'],
    avoid: ['Ícone genérico quando há nome disponível.'],
    render: () => (
      <Demo title="Tamanhos e tons">
        <Avatar name="Maria Silva" size="sm" />
        <Avatar name="João Pedro da Costa" />
        <Avatar name="Rafael Silva" size="lg" />
        <Avatar name="Ana" />
      </Demo>
    ),
  },
  {
    slug: 'chip',
    title: 'Chip',
    description: 'Botão de alternância para filtros, com aria-pressed e check quando selecionado.',
    use: ['Filtros e seleção múltipla de poucas opções.'],
    avoid: ['Status somente leitura: use Badge.'],
    render: () => <ChipDemo />,
  },
  {
    slug: 'kpi-card',
    title: 'KPICard',
    description: 'Indicador com valor em destaque e variação com ícone e texto para leitores de tela.',
    use: ['Painéis com 3 a 4 números principais.'],
    avoid: ['Séries históricas: use LineChart.'],
    render: () => (
      <div className="grid w-full gap-4 sm:grid-cols-3">
        <KPICard label="Alunos ativos" value="128" icon="users" delta={{ value: '8%', trend: 'up' }} />
        <KPICard label="Receita do mês" value="R$ 12.480" icon="finance" delta={{ value: '3%', trend: 'up' }} />
        <KPICard label="Cancelamentos" value="4" icon="user-minus" delta={{ value: '1%', trend: 'down' }} />
      </div>
    ),
  },
  {
    slug: 'line-chart',
    title: 'LineChart',
    description: 'Gráfico de linha em SVG fluido. Os dados também vão numa tabela oculta para leitores de tela.',
    use: ['Evolução de uma métrica ao longo do tempo.'],
    avoid: ['Comparar muitas séries: o kit tem uma série só.'],
    render: () => (
      <div className="w-full max-w-2xl">
        <LineChart ariaLabel="Peso médio dos alunos por mês" data={[{ label: 'Jan', value: 82 }, { label: 'Fev', value: 81 }, { label: 'Mar', value: 79.5 }, { label: 'Abr', value: 78 }, { label: 'Mai', value: 77.2 }]} />
      </div>
    ),
  },
  {
    slug: 'data-table',
    title: 'DataTable',
    description: 'Tabela semântica com legenda, região rolável focável, estado vazio e carregamento.',
    use: ['Listas de registros com várias colunas.'],
    avoid: ['Dados de 1 ou 2 campos: use uma lista.'],
    render: () => (
      <div className="w-full">
        <DataTable
          caption="Papéis e permissões"
          rows={roles}
          getRowId={(r) => r.id}
          columns={[
            { key: 'name', header: 'Papel', cell: (r) => <span className="flex items-center gap-2"><Avatar name={r.name} size="sm" />{r.name}</span> },
            { key: 'description', header: 'Descrição', cell: (r) => r.description },
            { key: 'status', header: 'Status', cell: (r) => <Badge tone={r.active ? 'success' : 'neutral'} icon={r.active ? 'check-circle' : 'minus'}>{r.active ? 'Ativa' : 'Inativa'}</Badge> },
          ]}
        />
      </div>
    ),
  },
];
```

- [ ] **Step 5: Registrar todos os demos**

`showcase/registry.ts`:
```ts
import type { ReactNode } from 'react';
import { docs as primitives } from './demos/primitives';
import { docs as forms } from './demos/forms';
import { docs as feedback } from './demos/feedback';
import { docs as navigation } from './demos/navigation';
import { docs as data } from './demos/data';

export interface ComponentDoc {
  slug: string;
  title: string;
  description: string;
  use: string[];
  avoid: string[];
  render: () => ReactNode;
}

export const registry: ComponentDoc[] = [...primitives, ...forms, ...feedback, ...navigation, ...data];
```

- [ ] **Step 6: Verificar**

Run: `pnpm typecheck; pnpm lint; pnpm test; pnpm build`
Expected: o teste de fumaça agora roda 24 páginas (6 + 5 + 4 + 4 + 5) e todas passam. Se `chip` falhar no axe por `aria-pressed` em `button`, não é violação; se falhar por nome duplicado, revisar o demo. Abrir `pnpm dev` e percorrer as páginas nos dois temas e em largura de celular, checando foco por teclado nos Tabs e no Dialog.

- [ ] **Step 7: Commit**

```powershell
git add <somente os arquivos criados ou alterados nesta tarefa, por caminho; nunca -A nem ponto>
git commit -m "feat(showcase): páginas de documentação de todos os componentes" -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 13: Telas dos mockups no showcase

**Files:**
- Create: `public/backgrounds/*.png` (cópia de `assets/AuraFit-auth-design-kit/backgrounds/`)
- Create: `showcase/screens/AuthScreens.tsx`, `showcase/screens/DashboardScreens.tsx`, `showcase/screens/screens.test.tsx`
- Modify: `showcase/screens.ts`, `src/layouts/AuthLayout/AuthLayout.tsx`, `src/layouts/AuthLayout/AuthLayout.test.tsx`

**Interfaces:**
- Consumes: `AuthLayout`, `DashboardShell`, `Sidebar`, `AppHeader`, `TextField`, `Button`, `Checkbox`, `Segmented`, `Alert`, `DataTable`, `Avatar`, `Badge`, `Tabs`, `GoogleIcon`, `AppleIcon`, `Icon`.
- Produces: `screens: ScreenDoc[]` com os slugs `login`, `cadastro`, `recuperar-senha`, `link-enviado`, `verificar-email`, `404`, `manutencao`, `acesso-negado`, `sessao-expirada`, `selecionar-perfil`, `termos`, `meu-perfil`, `permissoes`.

Referência visual: `assets/mockups/Imagem do Codex 23 de set. de 2026, 17_11_04.png` (todas as telas num quadro) e `assets/AuraFit-auth-design-kit/docs/screen-map.md` (qual fundo e qual ícone em cada tela). As telas usam dados estáticos, sem chamadas de rede, e cada uma tem um link "Voltar ao showcase" para `#/`.

- [ ] **Step 1: Copiar os fundos**

```powershell
New-Item -ItemType Directory -Force public/backgrounds | Out-Null
Copy-Item assets/AuraFit-auth-design-kit/backgrounds/*.png public/backgrounds/
Get-ChildItem public/backgrounds | Select-Object Name
```
Expected: 8 PNGs (`01-login.png`, `03-recuperar-senha.png`, `04-link-enviado.png`, `05-404.png`, `06-manutencao.png`, `07-verificar-email.png`, `08-acesso-negado.png`, `13-sessao-expirada.png`).

- [ ] **Step 2: `AuthLayout` passa a ser o landmark `main`**

Em `src/layouts/AuthLayout/AuthLayout.tsx`, trocar `<div className="w-full max-w-sm">{children}</div>` por `<main className="w-full max-w-sm">{children}</main>`.

Em `src/layouts/AuthLayout/AuthLayout.test.tsx`, no teste `passa no axe`, remover o `<main>` manual e deixar só `<h1>Login</h1>` dentro do layout, e acrescentar:
```tsx
  it('o conteúdo fica dentro do landmark main', () => {
    render(<AuthLayout><h1>Login</h1></AuthLayout>);
    expect(screen.getByRole('main')).toContainElement(screen.getByRole('heading', { name: 'Login' }));
  });
```

Run: `pnpm test src/layouts/AuthLayout`
Expected: PASS.

- [ ] **Step 3: Teste das telas (falha)**

`showcase/screens/screens.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'vitest-axe';
import { ThemeProvider } from '../theme';
import { screens } from '../screens';

const EXPECTED = ['login', 'cadastro', 'recuperar-senha', 'link-enviado', 'verificar-email', '404', 'manutencao', 'acesso-negado', 'sessao-expirada', 'selecionar-perfil', 'termos', 'meu-perfil', 'permissoes'];

describe('telas do showcase', () => {
  it('cobre todas as telas dos mockups', () => {
    expect(screens.map((s) => s.slug).sort()).toEqual([...EXPECTED].sort());
  });

  describe.each(screens.map((s) => [s.slug, s] as const))('tela %s', (_slug, screenDoc) => {
    it('tem um h1, um main e nenhuma violação de acessibilidade', async () => {
      const { container } = render(
        <ThemeProvider>
          <MemoryRouter>
            <screenDoc.Component />
          </MemoryRouter>
        </ThemeProvider>,
      );
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
      expect(screen.getAllByRole('main')).toHaveLength(1);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
```

- [ ] **Step 4: Rodar e ver falhar**

Run: `pnpm test showcase/screens`
Expected: FAIL, "cobre todas as telas" recebe lista vazia.

- [ ] **Step 5: `showcase/screens/AuthScreens.tsx`**

Fundos: `login` e `cadastro` usam `/backgrounds/01-login.png`; `recuperar-senha`, `link-enviado`, `404`, `manutencao`, `verificar-email`, `acesso-negado`, `sessao-expirada` usam o arquivo de mesmo nome. `panel="sm"` nas telas de recuperação e estados.

```tsx
import { useState, type ReactNode } from 'react';
import { Alert, AppleIcon, AuthLayout, Button, Checkbox, GoogleIcon, Icon, Segmented, TextField, type IconName } from '@/index';

const BG = (file: string) => `${import.meta.env.BASE_URL}backgrounds/${file}`;
const FEATURES: Array<{ icon: IconName; label: string }> = [
  { icon: 'users', label: 'Gestão de alunos' },
  { icon: 'workout-plan', label: 'Prescrição de treinos' },
  { icon: 'analytics', label: 'Acompanhamento de evolução' },
  { icon: 'credit-card', label: 'Cobrança e assinaturas' },
  { icon: 'ai-assistant', label: 'Inteligência Artificial' },
];

function Back() {
  return (
    <a href="#/" className="mt-6 inline-flex h-11 items-center gap-1 rounded-sm text-caption text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <Icon name="arrow-left" size={14} /> Voltar ao showcase
    </a>
  );
}

function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-heading-md text-ink">{title}</h1>
      {subtitle ? <p className="mt-1 text-body text-muted">{subtitle}</p> : null}
    </header>
  );
}

export function LoginScreen() {
  return (
    <AuthLayout imageSrc={BG('01-login.png')} title="Mais que treinos. Resultados reais." features={FEATURES} footer={<span>Já é um usuário? <a href="#/" className="text-accent-text underline">Faça login</a></span>}>
      <Heading title="Login" subtitle="Acesse sua conta para continuar" />
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <TextField label="E-mail ou usuário" placeholder="seu@email.com" autoComplete="username" />
        <TextField label="Senha" type="password" revealable placeholder="Digite sua senha" autoComplete="current-password" />
        <div className="flex items-center justify-between gap-2">
          <Checkbox label="Lembrar de mim" />
          <a href="#/telas/recuperar-senha" className="text-caption text-accent-text underline">Esqueceu sua senha?</a>
        </div>
        <Button type="submit" fullWidth>Entrar</Button>
        <p className="text-center text-caption text-muted">ou</p>
        <Button variant="outline" fullWidth type="button"><GoogleIcon /> Continuar com Google</Button>
        <Button variant="outline" fullWidth type="button"><AppleIcon /> Continuar com Apple</Button>
        <p className="text-center text-caption text-muted">Não tem uma conta? <a href="#/telas/cadastro" className="text-accent-text underline">Cadastre-se</a></p>
      </form>
      <Back />
    </AuthLayout>
  );
}

export function SignupScreen() {
  const [role, setRole] = useState('personal');
  return (
    <AuthLayout imageSrc={BG('01-login.png')} title="Comece sua jornada com o aura-fit" features={FEATURES.slice(0, 4)}>
      <Heading title="Cadastro" subtitle="Preencha os dados para criar sua conta" />
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <Segmented aria-label="Tipo de conta" value={role} onValueChange={setRole} options={[{ value: 'personal', label: 'Personal Trainer' }, { value: 'aluno', label: 'Aluno' }]} />
        <TextField label="Nome completo" placeholder="Seu nome completo" autoComplete="name" />
        <TextField label="E-mail" type="email" placeholder="seu@email.com" autoComplete="email" />
        <TextField label="Telefone" type="tel" placeholder="(XX) XXXXX-XXXX" autoComplete="tel" />
        <TextField label="Senha" type="password" revealable placeholder="Crie uma senha" autoComplete="new-password" />
        <TextField label="Confirmar senha" type="password" revealable placeholder="Confirme sua senha" autoComplete="new-password" />
        <Checkbox label={<>Li e aceito os <a href="#/telas/termos" className="text-accent-text underline">Termos de Uso</a> e a Política de Privacidade</>} />
        <Button type="submit" fullWidth>Criar conta</Button>
      </form>
      <Back />
    </AuthLayout>
  );
}

export function ForgotPasswordScreen() {
  return (
    <AuthLayout panel="sm" imageSrc={BG('03-recuperar-senha.png')} title="Recupere sua senha">
      <Heading title="Esqueceu sua senha?" subtitle="Sem problemas. Digite seu e-mail e receberá um link para redefinir sua senha." />
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <TextField label="E-mail" type="email" placeholder="seu@email.com" />
        <Button type="submit" fullWidth>Enviar link</Button>
        <a href="#/telas/login" className="inline-flex h-11 items-center gap-1 text-caption text-muted"><Icon name="arrow-left" size={14} /> Voltar para o login</a>
      </form>
      <Back />
    </AuthLayout>
  );
}

function StateScreen({ file, icon, title, text, tone, children }: { file: string; icon: IconName; title: string; text: string; tone?: 'primary' | 'success'; children?: ReactNode }) {
  return (
    <AuthLayout panel="sm" imageSrc={BG(file)}>
      <div className="flex flex-col items-center gap-4 text-center">
        <span className={tone === 'success' ? 'grid h-14 w-14 place-items-center rounded-full bg-success-bg text-success-text' : 'grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-accent-text'}>
          <Icon name={icon} size={28} />
        </span>
        <h1 className="text-heading-md text-ink">{title}</h1>
        <p className="text-body text-muted">{text}</p>
        {children}
        <Back />
      </div>
    </AuthLayout>
  );
}

export const LinkSentScreen = () => (
  <StateScreen file="04-link-enviado.png" icon="check-circle" tone="success" title="Link enviado!" text="Enviamos um link de recuperação de senha para o e-mail cadastrado.">
    <Alert tone="info" title="Verifique sua caixa de entrada" className="w-full text-left">O link expira em 15 minutos.</Alert>
    <Button fullWidth>Voltar para o login</Button>
  </StateScreen>
);

export const VerifyEmailScreen = () => (
  <StateScreen file="07-verificar-email.png" icon="mail" tone="success" title="Verifique seu e-mail" text="Enviamos um link de verificação para seu endereço de e-mail. Clique no link para ativar sua conta.">
    <Button fullWidth>Reenviar e-mail</Button>
  </StateScreen>
);

export const NotFoundScreen = () => (
  <StateScreen file="05-404.png" icon="arrow-left" title="Página não encontrada" text="A página que você está procurando não existe ou foi removida.">
    <Button variant="outline">Voltar para o início</Button>
  </StateScreen>
);

export const MaintenanceScreen = () => (
  <StateScreen file="06-manutencao.png" icon="clock" title="Estamos em manutenção" text="Voltaremos em breve. Enquanto isso, acompanhe nossas redes sociais para novidades." />
);

export const AccessDeniedScreen = () => (
  <StateScreen file="08-acesso-negado.png" icon="lock" title="Acesso negado" text="Você não tem permissão para acessar esta área do sistema.">
    <Button>Voltar para o início</Button>
  </StateScreen>
);

export const SessionExpiredScreen = () => (
  <StateScreen file="13-sessao-expirada.png" icon="clock" title="Sessão expirada" text="Sua sessão expirou por inatividade. Faça login novamente para continuar.">
    <Button>Fazer login</Button>
  </StateScreen>
);

export function SelectRoleScreen() {
  const roles = [
    { value: 'personal', title: 'Personal Trainer', text: 'Gerencie seus alunos, treinos e finanças.', icon: 'roles' as const },
    { value: 'aluno', title: 'Aluno', text: 'Acompanhe seus treinos, progresso e informações.', icon: 'user' as const },
    { value: 'admin', title: 'Administrador', text: 'Gerencie a plataforma, usuários e configurações.', icon: 'access-matrix' as const },
  ];
  const [selected, setSelected] = useState('personal');
  return (
    <AuthLayout panel="sm" imageSrc={BG('03-recuperar-senha.png')}>
      <Heading title="Selecione seu perfil" subtitle="Você possui mais de um perfil de acesso. Escolha com qual deseja continuar." />
      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">Perfil de acesso</legend>
        {roles.map((r) => (
          <label key={r.value} className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-md border p-4 ${selected === r.value ? 'border-primary bg-primary-soft' : 'border-line-strong bg-surface'}`}>
            <input type="radio" name="perfil" value={r.value} checked={selected === r.value} onChange={() => setSelected(r.value)} className="mt-1 h-5 w-5 accent-primary" />
            <span className="min-w-0">
              <span className="flex items-center gap-2 text-body-medium text-ink"><Icon name={r.icon} size={18} />{r.title}</span>
              <span className="block text-caption text-muted">{r.text}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <Button fullWidth className="mt-4">Continuar</Button>
      <Back />
    </AuthLayout>
  );
}
```

- [ ] **Step 6: `showcase/screens/DashboardScreens.tsx`**

```tsx
import { Avatar, AppHeader, Badge, Button, Checkbox, DashboardShell, DataTable, Sidebar, TextField, type SidebarItem } from '@/index';

const nav = (active: string): SidebarItem[] =>
  [
    { label: 'Perfil', href: '#/telas/meu-perfil', icon: 'user' as const, key: 'meu-perfil' },
    { label: 'Permissões', href: '#/telas/permissoes', icon: 'access-matrix' as const, key: 'permissoes' },
    { label: 'Termos de Uso', href: '#/telas/termos', icon: 'audit' as const, key: 'termos' },
    { label: 'Voltar ao showcase', href: '#/', icon: 'arrow-left' as const, key: 'home' },
  ].map(({ key, ...item }) => ({ ...item, active: key === active }));

export function TermsScreen() {
  return (
    <DashboardShell sidebar={<Sidebar items={nav('termos')} />}>
      <AppHeader title="Termos de Uso" description="Última atualização: 12 de abril de 2025" />
      <article className="mt-6 max-w-2xl space-y-6 text-body text-muted">
        <section>
          <h2 className="mb-2 text-heading-sm text-ink">1. Aceitação dos Termos</h2>
          <p>Ao acessar ou utilizar o aura-fit, você concorda em cumprir estes termos. Se não concordar, não utilize a plataforma.</p>
        </section>
        <section>
          <h2 className="mb-2 text-heading-sm text-ink">2. Cadastro e Conta</h2>
          <p>Você é responsável por manter a confidencialidade das suas credenciais e por toda atividade realizada na sua conta.</p>
        </section>
      </article>
    </DashboardShell>
  );
}

export function ProfileScreen() {
  return (
    <DashboardShell sidebar={<Sidebar items={nav('meu-perfil')} />}>
      <AppHeader title="Meu Perfil" description="Gerencie suas informações pessoais." />
      <form className="mt-6 flex max-w-xl flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <div className="flex items-center gap-4">
          <Avatar name="Rafael Silva" size="lg" />
          <Button variant="outline" size="sm" type="button">Alterar foto</Button>
        </div>
        <TextField label="Nome completo" defaultValue="Rafael Silva" />
        <TextField label="E-mail" type="email" defaultValue="rafael@aura.fit" />
        <TextField label="Telefone" type="tel" defaultValue="(11) 98765-4321" />
        <Checkbox label="Receber novidades por e-mail" />
        <Button type="submit" className="self-start">Salvar alterações</Button>
      </form>
    </DashboardShell>
  );
}

interface Role { id: string; name: string; description: string; active: boolean }
const roles: Role[] = [
  { id: '1', name: 'Personal Trainer', description: 'Acesso completo aos recursos do tenant.', active: true },
  { id: '2', name: 'Aluno', description: 'Acesso limitado aos próprios dados.', active: true },
  { id: '3', name: 'Administrador', description: 'Acesso total à plataforma.', active: true },
];

export function PermissionsScreen() {
  return (
    <DashboardShell sidebar={<Sidebar items={nav('permissoes')} />}>
      <AppHeader title="Gerenciamento de Permissões" description="Configure o que cada papel pode acessar no sistema." actions={<Button leftIcon="plus">Nova função</Button>} />
      <div className="mt-6">
        <DataTable
          caption="Funções"
          rows={roles}
          getRowId={(r) => r.id}
          columns={[
            { key: 'name', header: 'Papel', cell: (r) => <span className="flex items-center gap-2"><Avatar name={r.name} size="sm" />{r.name}</span> },
            { key: 'description', header: 'Descrição', cell: (r) => r.description },
            { key: 'status', header: 'Status', cell: (r) => <Badge tone="success" icon="check-circle">Ativa</Badge> },
          ]}
        />
      </div>
    </DashboardShell>
  );
}
```

- [ ] **Step 7: Registrar as telas**

`showcase/screens.ts`:
```ts
import type { ComponentType } from 'react';
import {
  AccessDeniedScreen,
  ForgotPasswordScreen,
  LinkSentScreen,
  LoginScreen,
  MaintenanceScreen,
  NotFoundScreen,
  SelectRoleScreen,
  SessionExpiredScreen,
  SignupScreen,
  VerifyEmailScreen,
} from './screens/AuthScreens';
import { PermissionsScreen, ProfileScreen, TermsScreen } from './screens/DashboardScreens';

export interface ScreenDoc {
  slug: string;
  title: string;
  Component: ComponentType;
}

export const screens: ScreenDoc[] = [
  { slug: 'login', title: 'Login', Component: LoginScreen },
  { slug: 'cadastro', title: 'Cadastro', Component: SignupScreen },
  { slug: 'recuperar-senha', title: 'Recuperar senha', Component: ForgotPasswordScreen },
  { slug: 'link-enviado', title: 'Link enviado', Component: LinkSentScreen },
  { slug: 'verificar-email', title: 'Verificar e-mail', Component: VerifyEmailScreen },
  { slug: '404', title: '404', Component: NotFoundScreen },
  { slug: 'manutencao', title: 'Manutenção', Component: MaintenanceScreen },
  { slug: 'acesso-negado', title: 'Acesso negado', Component: AccessDeniedScreen },
  { slug: 'sessao-expirada', title: 'Sessão expirada', Component: SessionExpiredScreen },
  { slug: 'selecionar-perfil', title: 'Selecionar perfil', Component: SelectRoleScreen },
  { slug: 'termos', title: 'Termos de Uso', Component: TermsScreen },
  { slug: 'meu-perfil', title: 'Meu perfil', Component: ProfileScreen },
  { slug: 'permissoes', title: 'Permissões', Component: PermissionsScreen },
];
```

- [ ] **Step 8: Rodar e corrigir**

Run: `pnpm typecheck; pnpm lint; pnpm test; pnpm build`
Expected: o teste das telas passa (13 telas). Possíveis ajustes:
- `getAllByRole('heading', { level: 1 })` deve ser exatamente 1 por tela: o `Logo` não é heading, então basta cada tela ter um `<h1>`. Na `SelectRoleScreen` e nas telas de estado o `<h1>` já existe.
- `LinkSentScreen` usa `Alert` com `role="status"`, sem conflito.
- `import.meta.env.BASE_URL` não existe no tipo do Vitest: se o `tsc` reclamar, adicionar `/// <reference types="vite/client" />` em `showcase/vite-env.d.ts`.

Depois abrir `pnpm dev` e comparar cada tela com o quadro do mockup: proporção do painel, textos, ícones do `screen-map.md`. Registrar divergências visuais como tarefas de ajuste, sem mudar tokens sem passar pelo `ui-designer`.

- [ ] **Step 9: Commit**

```powershell
git add <somente os arquivos criados ou alterados nesta tarefa, por caminho; nunca -A nem ponto>
git commit -m "feat(showcase): 13 telas dos mockups (auth, estados, termos, perfil, permissões)" -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 14: Empacotamento e publicação (`@allankltsn/ui`)

Decisão do spec (seção 8), com um ajuste: em vez de Changesets, o versionamento é por `pnpm version` + tag `v*`, o que dispensa uma dependência extra para um único pacote. Atualizar a seção 8 do spec ao concluir esta tarefa.

**Files:**
- Create: `vite.lib.config.ts`, `tsconfig.lib.json`, `scripts/copy-lib-css.mjs`, `scripts/verify-package.mjs`
- Create: `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `.npmrc`, `README.md`
- Modify: `package.json`

**Interfaces:**
- Consumes: `src/index.ts` e `src/tokens/preset.ts`.
- Produces: `dist/index.js`, `dist/index.d.ts`, `dist/preset.js`, `dist/tokens/preset.d.ts`, `dist/styles.css`. Exports do pacote: `.`, `./preset`, `./styles.css`. Scripts `build:lib` e `verify:package`.

- [ ] **Step 1: Instalar o plugin de tipos**

```powershell
pnpm add -D vite-plugin-dts
```

- [ ] **Step 2: Config da biblioteca**

`tsconfig.lib.json`:
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "noEmit": false, "declaration": true, "emitDeclarationOnly": true, "types": [] },
  "include": ["src"],
  "exclude": ["src/**/*.test.ts", "src/**/*.test.tsx", "src/test"]
}
```

`vite.lib.config.ts`:
```ts
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: './tsconfig.lib.json', entryRoot: 'src' })],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: false,
    sourcemap: false,
    lib: { entry: { index: 'src/index.ts', preset: 'src/tokens/preset.ts' }, formats: ['es'] },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
  },
});
```

`scripts/copy-lib-css.mjs`:
```js
import { copyFileSync } from 'node:fs';

copyFileSync(new URL('../src/tokens/tokens.css', import.meta.url), new URL('../dist/styles.css', import.meta.url));
console.log('dist/styles.css copiado');
```

- [ ] **Step 3: Script de verificação do pacote (falha até o build existir)**

`scripts/verify-package.mjs`:
```js
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const fail = (msg) => {
  console.error(`verify:package FALHOU: ${msg}`);
  process.exit(1);
};

for (const f of ['index.js', 'index.d.ts', 'preset.js', 'tokens/preset.d.ts', 'styles.css']) {
  if (!existsSync(new URL(f, dist))) fail(`falta dist/${f}`);
}

const api = await import(new URL('index.js', dist));
for (const name of ['Button', 'Input', 'TextField', 'Dialog', 'Tabs', 'DataTable', 'Icon', 'Logo', 'AuthLayout', 'DashboardShell', 'cn']) {
  if (typeof api[name] !== 'function') fail(`export ausente: ${name}`);
}

const preset = (await import(new URL('preset.js', dist))).default;
if (preset.darkMode !== 'class') fail('preset sem darkMode: class');
if (!preset.theme?.extend?.colors?.primary) fail('preset sem cor primary');

const css = readFileSync(new URL('styles.css', dist), 'utf8');
if (!css.includes('--color-primary') || !css.includes('.dark')) fail('styles.css sem variáveis do tema');

// Nenhum alias interno pode vazar para os tipos publicados.
const leaks = [];
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = new URL(e.name + (e.isDirectory() ? '/' : ''), dir);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.d.ts') && /from '@\//.test(readFileSync(p, 'utf8'))) leaks.push(e.name);
  }
};
walk(dist);
if (leaks.length) fail(`alias @/ nos tipos: ${leaks.join(', ')}`);

if (existsSync(new URL('showcase', dist))) fail('showcase não pode estar no pacote');
console.log('verify:package OK');
```

- [ ] **Step 4: Ajustar o `package.json`**

Acrescentar/alterar (manter as chaves existentes):
```json
{
  "version": "0.1.0",
  "description": "UI Kit web do Aura Fit (React 18 + Tailwind 3.4)",
  "license": "UNLICENSED",
  "repository": { "type": "git", "url": "git+https://github.com/allankltsn/aura-ui-kit.git" },
  "sideEffects": ["**/*.css"],
  "files": ["dist"],
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./preset": { "types": "./dist/tokens/preset.d.ts", "import": "./dist/preset.js" },
    "./styles.css": "./dist/styles.css",
    "./package.json": "./package.json"
  },
  "peerDependencies": { "react": "^18.3.0", "react-dom": "^18.3.0", "tailwindcss": "^3.4.0" },
  "publishConfig": { "registry": "https://npm.pkg.github.com" },
  "scripts": {
    "build:lib": "vite build -c vite.lib.config.ts && node scripts/copy-lib-css.mjs",
    "verify:package": "node scripts/verify-package.mjs",
    "prepublishOnly": "pnpm typecheck && pnpm lint && pnpm test && pnpm build:lib && pnpm verify:package"
  }
}
```
O repositório é `allankltsn/aura-ui-kit`: o GitHub Packages exige que o escopo do pacote (`@allankltsn`) seja o dono do repositório. A publicação real (`pnpm publish`, tag `v*`) só acontece com confirmação explícita do usuário e com um token com escopo `write:packages`. `"private": true` continua no arquivo como trava; o workflow de release o remove só no CI (Step 7).

- [ ] **Step 5: Build e verificação**

Run: `pnpm build:lib; pnpm verify:package`
Expected: "verify:package OK". Se falhar por `alias @/ nos tipos`, conferir `entryRoot: 'src'` no plugin; se ainda vazar, adicionar `aliasesExclude: []` e rodar de novo, ou trocar os imports `@/…` dos arquivos apontados por imports relativos.

- [ ] **Step 6: Conferir o conteúdo do tarball**

Run: `pnpm pack --dry-run`
Expected: só `dist/**`, `package.json` e `README.md`; nada de `showcase`, `assets`, `mobile`, `docs`. Se `pnpm pack` recusar por `private`, rodar `npm pkg set private=false` temporariamente, empacotar e desfazer com `git checkout package.json`.

- [ ] **Step 7: Workflows e `.npmrc`**

`.npmrc`:
```
@allankltsn:registry=https://npm.pkg.github.com
```

`.github/workflows/ci.yml`:
```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .node-version
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
      - run: pnpm build:lib
      - run: pnpm verify:package
      - run: pnpm audit --prod --audit-level high
```

`.github/workflows/release.yml`:
```yaml
name: Release
on:
  push:
    tags: ['v*']
permissions:
  contents: read
  packages: write
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .node-version
          cache: pnpm
          registry-url: https://npm.pkg.github.com
          scope: '@allankltsn'
      - run: pnpm install --frozen-lockfile
      - name: A tag precisa bater com a versão do package.json
        run: test "v$(node -p "require('./package.json').version")" = "${GITHUB_REF_NAME}"
      - run: pnpm typecheck && pnpm lint && pnpm test
      - run: pnpm build:lib && pnpm verify:package
      - name: Liberar a publicação (remove a trava private só no CI)
        run: npm pkg set private=false
      - run: pnpm publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
O `pnpm/action-setup@v4` lê a versão do pnpm do campo `packageManager`. O `prepublishOnly` roda de novo os checks dentro do `pnpm publish`: é redundância barata e protege publicações manuais.

- [ ] **Step 8: README para o consumidor**

`README.md`:
````markdown
# @allankltsn/ui

UI Kit web do Aura Fit: componentes React 18, tokens da marca, tema claro e escuro.

## Instalação

O pacote é privado no GitHub Packages. No projeto consumidor, crie um `.npmrc`:

```
@allankltsn:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

`GITHUB_TOKEN` é um token com o escopo `read:packages`.

```bash
pnpm add @allankltsn/ui
```

Peer dependencies: `react` e `react-dom` 18, `tailwindcss` 3.4.

## Configuração (obrigatória)

`tailwind.config.ts` do app. O `content` precisa incluir o pacote, senão o Tailwind remove as classes dos componentes:

```ts
import auraPreset from '@allankltsn/ui/preset';

export default {
  presets: [auraPreset],
  content: ['./index.html', './src/**/*.{ts,tsx}', './node_modules/@allankltsn/ui/dist/**/*.js'],
};
```

No CSS de entrada, importe as variáveis do tema antes das diretivas do Tailwind:

```css
@import '@allankltsn/ui/styles.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

A fonte Inter não vem no pacote. Instale a sua (por exemplo `@fontsource/inter`) ou o kit usa a fonte do sistema.

Tema escuro: adicione a classe `dark` ao elemento `<html>`.

## Uso

```tsx
import { Button, TextField } from '@allankltsn/ui';

<TextField label="E-mail" type="email" />
<Button>Entrar</Button>
```

O catálogo de componentes e telas está no showcase: `pnpm dev`.

## Desenvolvimento

```bash
pnpm install
pnpm dev          # showcase em http://localhost:5173
pnpm test
pnpm build:lib    # gera dist/
```

## Publicar uma versão

```bash
pnpm version minor     # ou patch / major; cria o commit e a tag vX.Y.Z
git push --follow-tags
```

O workflow `Release` roda os checks, monta o pacote e publica no GitHub Packages.
````

- [ ] **Step 9: Verificação final da tarefa**

Run: `pnpm typecheck; pnpm lint; pnpm test; pnpm build; pnpm build:lib; pnpm verify:package`
Expected: tudo verde.

Teste de consumo real (manual, uma vez): em uma pasta temporária fora do repo, `pnpm init`, instalar `react@18 react-dom@18 tailwindcss@3 vite`, apontar `@allankltsn/ui` para o tarball gerado por `pnpm pack` (`pnpm add ../aura-ui-kit/aura-ui-0.1.0.tgz`), seguir o README e renderizar um `<Button>`. Conferir que o botão sai estilizado (classes não purgadas), que o tema escuro funciona ao adicionar `dark` no `<html>` e que os tipos aparecem no editor.

- [ ] **Step 10: Commit**

```powershell
git add <somente os arquivos criados ou alterados nesta tarefa, por caminho; nunca -A nem ponto>
git commit -m "build: empacotamento @allankltsn/ui, verificação do pacote, CI e release por tag" -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 15: Revisão final (qa, ui-designer, security de dependências)

**Files:**
- Modify: apenas o que os revisores apontarem; `docs/superpowers/specs/2026-09-24-aura-ui-kit-design.md` (seção 8, versionamento por tag).

**Interfaces:** consome tudo. Não produz API nova.

- [ ] **Step 1: Rodar a suíte completa e registrar os números**

Run: `pnpm typecheck; pnpm lint; pnpm test; pnpm build; pnpm build:lib; pnpm verify:package`
Expected: tudo verde. Anotar o total de testes para o relatório.

- [ ] **Step 2: Revisão do `qa` (adversarial)**

Despachar o agente `qa` com este pedido: "Tente quebrar o UI Kit em `src/` e `showcase/`. Foque em: Dialog (foco, Esc, duplo `onClose`), Tabs/Segmented/Switch controlados vs. não controlados, Pagination e DataTable vazios ou com 1 página, textos longos e com acento, tema escuro, prefers-reduced-motion. Rode os testes, escreva testes novos para o que achar e devolva a lista de defeitos com passos de reprodução." Corrigir cada defeito confirmado com um teste que falha antes e passa depois, e commitar por correção.

- [ ] **Step 3: Revisão do `ui-designer` contra os mockups**

Despachar o agente `ui-designer` com: "Compare cada tela do showcase (`pnpm dev`, rotas `#/telas/*`) com `assets/mockups/Imagem do Codex 23 de set. de 2026, 17_11_04.png` e cada componente com os critérios da seção 7 do spec. Verifique contraste nos dois temas, alvos de 44px, foco visível, estados documentados e fidelidade de marca. Devolva divergências priorizadas." Ajustar tokens só com a aprovação do `ui-designer`; qualquer troca de token roda o teste de contraste.

- [ ] **Step 3: Checagem manual de acessibilidade**

Com `pnpm dev`, navegar só pelo teclado nas páginas de Dialog, Tabs, Segmented, Switch, Pagination e no menu lateral em largura de celular (gaveta). Testar as telas de login e cadastro com um leitor de tela (NVDA no Windows): rótulos dos campos, mensagens de erro, botão de mostrar senha, título da página. Registrar o resultado no PR.

- [ ] **Step 4: Dependências**

Run: `pnpm audit --prod --audit-level high; pnpm outdated`
Expected: nenhuma vulnerabilidade alta em dependências de produção (`clsx`, `tailwind-merge`). Despachar o agente `security` só se aparecer algo, com o resultado do audit.

- [ ] **Step 5: Cobertura do spec**

Conferir item a item contra `docs/superpowers/specs/2026-09-24-aura-ui-kit-design.md`: escopo (seção 2), stack (3), estrutura (4), componentes (5), telas (6), design e acessibilidade (7), publicação (8), testes (9). Listar qualquer requisito sem tarefa e criar a tarefa. Atualizar a seção 8 do spec para refletir versionamento por tag em vez de Changesets.

- [ ] **Step 6: Fechamento**

```powershell
git add <somente os arquivos criados ou alterados nesta tarefa, por caminho; nunca -A nem ponto>
git commit -m "chore: revisão final (qa, ui-designer, a11y) e ajuste do spec" -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```
Depois, seguir `superpowers:finishing-a-development-branch` para decidir merge na `main` ou PR.

---

## Self-Review (spec × plano)

| Requisito do spec | Tarefa |
|---|---|
| Vite 5, React 18, TS strict, Tailwind 3.4, Vitest, pnpm, Node 22 | 1 |
| Tokens únicos, preset, CSS vars, dark, contraste AA testado | 2 |
| Ícones da marca, Logo, ícones sociais | 3 |
| Conjunto mínimo (Button, Input, Card, Dialog, Alert, Badge, Spinner) | 4, 5 |
| Formulário (AuthField/TextField, Checkbox, Radio, Switch, Segmented) | 5, 6 |
| Feedback (Toast, Skeleton, EmptyState, Progress) | 7 |
| Navegação (Tabs, Stepper, Breadcrumb, Pagination, Sidebar, AppHeader) | 8, 10 |
| Dados (Avatar, Chip, KPICard, LineChart, DataTable) | 9 |
| Layouts AuthLayout e DashboardShell | 10 |
| Showcase com página por componente, estados, uso/evitar, tema | 11, 12 |
| 13 telas dos mockups | 13 |
| Pacote único, exports `.`/`./preset`/`./styles.css`, peer deps, GitHub Packages, release por tag, trava `private` | 14 |
| `vitest-axe`, teclado, tsc/lint/testes antes de concluir | todas (em cada tarefa) |
| qa, ui-designer, security de dependências | 15 |

Pontos que dependem do usuário antes de publicar: token com `write:packages` e a confirmação explícita para o `pnpm publish` (Task 14).
