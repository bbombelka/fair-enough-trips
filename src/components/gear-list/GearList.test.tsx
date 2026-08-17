import React from 'react';
import { render, screen } from '@testing-library/react';
import { GearList } from './GearList';

describe('GearList Component', () => {
  it('renders a mix of strings and objects correctly', () => {
    const gearMock: any = [
      'hiking poles',
      { slug: '123', name: 'Special Harness', type: 'HARNESS', brand: 'Edelrid' },
      'helmet',
      { slug: '456', name: 'Climbing Shoes', type: 'CLIMBING_SHOES', brand: 'La Sportiva' }
    ];

    render(<GearList gear={gearMock} />);

    // Check objects (Links)
    const harnessLink = screen.getByRole('link', { name: 'harness - Edelrid Special Harness' });
    expect(harnessLink).toHaveAttribute('href', '/gear/123');

    const shoesLink = screen.getByRole('link', { name: 'climbing shoes - La Sportiva Climbing Shoes' });
    expect(shoesLink).toHaveAttribute('href', '/gear/456');

    // Ensure commas are placed correctly (suffix for link is a separate text node)
    // We can just verify the text content of the container
    expect(screen.getByText(/Special Harness/i).parentElement).toHaveTextContent('hiking poles, harness - Edelrid Special Harness, helmet, climbing shoes - La Sportiva Climbing Shoes');
  });

  it('renders nothing when gear is empty', () => {
    const { container } = render(<GearList gear={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders gear with quantities correctly', () => {
    const gearMock: any = [
      'hiking poles',
      { slug: '123', name: 'Rope 30m', type: 'ROPE_30M', brand: 'Beal', quantity: 2 },
      'helmet',
      { slug: '456', name: 'Carabiner', type: 'LOCKED_CARABINER', brand: 'Camp', quantity: 1 }
    ];

    render(<GearList gear={gearMock} />);

    // Beal Rope 30m has quantity 2 -> Expect "2 x 30m rope - Beal Rope 30m"
    const ropeLink = screen.getByRole('link', { name: '2 x 30m rope - Beal Rope 30m' });
    expect(ropeLink).toHaveAttribute('href', '/gear/123');

    // Camp Carabiner has quantity 1 -> Expect "locked carabiner - Camp Carabiner"
    const carabinerLink = screen.getByRole('link', { name: 'locked carabiner - Camp Carabiner' });
    expect(carabinerLink).toHaveAttribute('href', '/gear/456');

    expect(screen.getByText(/Rope 30m/i).parentElement).toHaveTextContent('hiking poles, 2 x 30m rope - Beal Rope 30m, helmet, locked carabiner - Camp Carabiner');
  });
});
