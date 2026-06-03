import React from 'react';
import { render, screen } from '@testing-library/react';
import { Link } from './Link';

// Mock next/link to just render a regular anchor tag for testing
jest.mock('next/link', () => {
  return ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
});

describe('Link Component', () => {
  it('renders the link with correct name and href', () => {
    render(<Link name="My Link" href="/test-url" />);
    
    const anchor = screen.getByRole('link', { name: 'My Link' });
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute('href', '/test-url');
  });

  it('wraps the link in a span with the provided className', () => {
    const { container } = render(<Link name="Test" href="/" className="custom-span-class" />);
    
    // container.firstChild is the outer span
    const span = container.firstChild as HTMLElement;
    expect(span.tagName).toBe('SPAN');
    expect(span).toHaveClass('custom-span-class');
  });

  it('passes extra props to the NextLink element', () => {
    render(<Link name="Test" href="/" data-testid="custom-data" target="_blank" />);
    
    const anchor = screen.getByRole('link');
    expect(anchor).toHaveAttribute('data-testid', 'custom-data');
    expect(anchor).toHaveAttribute('target', '_blank');
  });
});
