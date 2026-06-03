import React from 'react';
import { render, screen } from '@testing-library/react';
import { DateBox } from './DateBox';

describe('DateBox Component', () => {
  const mockDate = new Date('2023-05-15T10:00:00Z');

  it('renders day, month, and year correctly from a Date object', () => {
    render(<DateBox postDate={mockDate} />);
    
    // toDateString() in English locales typically returns "Mon May 15 2023"
    // split filters out index 0 ("Mon"), leaving ["May", "15", "2023"]
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('May')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('renders correctly from an ISO string', () => {
    render(<DateBox postDate="2024-10-20T10:00:00Z" />);
    
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('Oct')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('applies main class when isMain is true', () => {
    const { container } = render(<DateBox postDate={mockDate} isMain={true} />);
    expect(container.firstChild).toHaveClass('main');
  });

  it('applies is-bottom class when isTop is true', () => {
    const { container } = render(<DateBox postDate={mockDate} isTop={true} />);
    expect(container.firstChild).toHaveClass('is-bottom');
  });
});
