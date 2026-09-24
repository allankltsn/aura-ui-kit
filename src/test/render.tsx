import { render, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';

export function renderUi(ui: ReactElement): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
  return { user: userEvent.setup(), ...render(ui) };
}
