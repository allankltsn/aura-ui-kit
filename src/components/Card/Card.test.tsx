import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Card, CardBody, CardFooter, CardHeader } from './Card';

describe('Card', () => {
  it('composes parts and forwards native attributes', async () => {
    const { container } = render(
      <Card data-testid="card" className="extra">
        <CardHeader>Título</CardHeader>
        <CardBody>Conteúdo</CardBody>
        <CardFooter>Ações</CardFooter>
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveClass('extra', 'p-5');
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('can omit padding', () => {
    render(
      <Card padded={false} data-testid="card">
        x
      </Card>,
    );
    expect(screen.getByTestId('card')).not.toHaveClass('p-5');
  });
});
