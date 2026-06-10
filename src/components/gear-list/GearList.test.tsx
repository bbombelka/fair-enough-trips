import React from 'react';
import { render, screen } from '@testing-library/react';
import { GearList } from './GearList';

describe('GearList Component', () => {
  it('renders a mix of strings and objects correctly', () => {
    const gearMock = [
      'hiking poles',
      { id: '123', name: 'Special Harness', type: 'harness' },
      'helmet',
      { id: '456', name: 'Climbing Shoes' }
    ];

    render(<GearList gear={gearMock} />);

    // Check objects (Links)
    const harnessLink = screen.getByRole('link', { name: 'harness' });
    expect(harnessLink).toHaveAttribute('href', '/gear/123');

    const shoesLink = screen.getByRole('link', { name: 'Climbing Shoes' });
    expect(shoesLink).toHaveAttribute('href', '/gear/456');

    // Ensure commas are placed correctly (suffix for link is a separate text node)
    // We can just verify the text content of the container
    expect(screen.getByText(/harness/i).parentElement).toHaveTextContent('hiking poles, harness, helmet, Climbing Shoes');
  });

  it('renders nothing when gear is empty', () => {
    const { container } = render(<GearList gear={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
