import React from 'react';
import { render } from '@testing-library/react';
import { Logo, LogoCursor, Error } from './Icons';

describe('Icons Components', () => {
  it('renders Logo successfully', () => {
    const { container } = render(<Logo data-testid="logo-icon" className="test-class" />);
    const svg = container.querySelector('svg');
    
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('test-class');
  });

  it('renders LogoCursor successfully', () => {
    const { container } = render(<LogoCursor />);
    const svg = container.querySelector('svg');
    
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 512 512');
  });

  it('renders Error successfully', () => {
    const { container } = render(<Error />);
    const svg = container.querySelector('svg');
    
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 512 512');
  });
});
