import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileMenu } from './MobileMenu';

jest.mock('app-links', () => ({
  menuLinks: [
    { name: 'search', href: '/search' },
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
  ],
}));

describe('MobileMenu Component', () => {
  it('renders hamburger icon initially and menu is closed', () => {
    const { container } = render(<MobileMenu />);
    // Menu is closed, so no search icon inside menu
    expect(container.querySelector('.hamburger-icon')).toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  it('opens menu when hamburger is clicked', () => {
    const { container } = render(<MobileMenu />);
    fireEvent.click(container.querySelector('.hamburger-icon')!);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('closes menu when close icon is clicked', () => {
    const { container } = render(<MobileMenu />);
    fireEvent.click(container.querySelector('.hamburger-icon')!);
    expect(screen.getByText('Home')).toBeInTheDocument();

    fireEvent.click(container.querySelector('.close-icon')!);
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });
  
  it('locks scroll when opened and unlocks when closed', () => {
    const { container } = render(<MobileMenu />);
    
    fireEvent.click(container.querySelector('.hamburger-icon')!);
    expect(document.body.style.height).toBe('100vh');
    expect(document.body.style.overflowY).toBe('hidden');

    fireEvent.click(container.querySelector('.close-icon')!);
    expect(document.body.style.height).toBe('');
    expect(document.body.style.overflowY).toBe('');
  });
});
