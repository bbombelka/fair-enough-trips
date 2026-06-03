import React from 'react';
import { render, screen } from '@testing-library/react';
import CardList from './CardList';

describe('CardList Component', () => {
  it('renders children correctly', () => {
    render(
      <CardList>
        <div data-testid="card-child">Child Item</div>
      </CardList>
    );
    expect(screen.getByTestId('card-child')).toBeInTheDocument();
    expect(screen.getByText('Child Item')).toBeInTheDocument();
  });

  it('renders listTitle if provided', () => {
    render(<CardList listTitle="My Awesome List" />);
    expect(screen.getByText('My Awesome List')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('does not render listTitle if not provided', () => {
    render(<CardList />);
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('applies dropGrid class when dropGrid is true', () => {
    const { container } = render(
      <CardList dropGrid={true}>
        <div />
      </CardList>
    );
    
    const listContainer = container.querySelector('#card-list > div');
    expect(listContainer?.className).toMatch(/drop-grid/);
  });
});
