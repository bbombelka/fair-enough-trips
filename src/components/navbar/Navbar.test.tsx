import React from 'react';
import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';
import * as navigation from 'next/navigation';

jest.mock('app-links', () => ({
  navbarLinks: [
    { name: 'Home', href: '/home' },
    { name: 'About', href: '/about' },
    { name: 'Dropdown', nestedLinks: [{ name: 'Sub', href: '/sub' }] }
  ]
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock MobileMenu to keep tests isolated
jest.mock('components/mobile-menu/MobileMenu', () => ({
  MobileMenu: () => <div data-testid="mobile-menu" />
}));

describe('Navbar Component', () => {
  it('renders logo, links, and mobile menu', () => {
    (navigation.usePathname as jest.Mock).mockReturnValue('/');
    render(<Navbar />);

    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Dropdown')).toBeInTheDocument();
  });

  it('highlights the active link based on pathname', () => {
    (navigation.usePathname as jest.Mock).mockReturnValue('/about');
    render(<Navbar />);
    
    const aboutLink = screen.getByText('About');
    // Using string matching to be robust against class names
    expect(aboutLink.parentElement?.className).toMatch(/navbar-link-active/);
  });
});
