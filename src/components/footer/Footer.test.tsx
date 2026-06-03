import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

// Mock footerLinks from app-links
jest.mock('app-links', () => ({
  footerLinks: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
}));

describe('Footer Component', () => {
  it('renders footer links correctly', () => {
    render(<Footer />);
    
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('applies sticky class when isSticky is true', () => {
    const { container } = render(<Footer isSticky={true} />);
    expect(container.firstChild).toHaveClass('sticky');
  });

  it('does not apply sticky class when isSticky is false', () => {
    const { container } = render(<Footer isSticky={false} />);
    expect(container.firstChild).not.toHaveClass('sticky');
  });
});
