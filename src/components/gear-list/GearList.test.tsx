import React from 'react';
import { render, screen } from '@testing-library/react';
import { GearList } from './GearList';

describe('GearList Component', () => {
  it('renders a mix of strings and objects correctly', () => {
    const gearMock: any = [
      'hiking poles',
      { slug: '123', name: 'Special Harness', type: 'HARNESS' },
      'helmet',
      { slug: '456', name: 'Climbing Shoes', type: 'CLIMBING_SHOES' }
    ];

    render(<GearList gear={gearMock} />);

    // Check objects (Links)
    const harnessLink = screen.getByRole('link', { name: 'harness' });
    expect(harnessLink).toHaveAttribute('href', '/gear/123');

    const shoesLink = screen.getByRole('link', { name: 'climbing shoes' });
    expect(shoesLink).toHaveAttribute('href', '/gear/456');

    // Ensure commas are placed correctly (suffix for link is a separate text node)
    // We can just verify the text content of the container
    expect(screen.getByText(/harness/i).parentElement).toHaveTextContent('hiking poles, harness, helmet, climbing shoes');
  });

  it('renders nothing when gear is empty', () => {
    const { container } = render(<GearList gear={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
