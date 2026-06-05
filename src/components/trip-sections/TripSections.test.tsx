import React from 'react';
import { render, screen } from '@testing-library/react';
import { TripSections } from './TripSections';
import * as navigation from 'next/navigation';

// Mock Link
jest.mock('components/link/Link', () => ({
  Link: ({ name, href, className }: any) => <a href={href} className={className}>{name}</a>
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('TripSections Component', () => {
  const subPosts = [
    { id: 'day-1', title: 'First Day' },
    { id: 'day-2', title: 'Second Day' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders overview and subposts correctly', () => {
    (navigation.usePathname as jest.Mock).mockReturnValue('/parent-post');
    render(<TripSections subPosts={subPosts as any} parentPostId="parent-post" />);

    // Check links
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('href', '/posts/parent-post');
    expect(screen.getByRole('link', { name: 'Day 1' })).toHaveAttribute('href', '/posts/parent-post/day-1');
    expect(screen.getByRole('link', { name: 'Day 2' })).toHaveAttribute('href', '/posts/parent-post/day-2');

    // Check separators
    const separators = screen.getAllByText('|');
    expect(separators).toHaveLength(2); // One after overview, one between day 1 and day 2
  });

  it('applies active class to overview if pathname matches parent', () => {
    (navigation.usePathname as jest.Mock).mockReturnValue('/posts/parent-post');
    render(<TripSections subPosts={subPosts as any} parentPostId="parent-post" />);

    const overviewLink = screen.getByRole('link', { name: 'Overview' });
    expect(overviewLink).toHaveClass('active');

    const day1Link = screen.getByRole('link', { name: 'Day 1' });
    expect(day1Link).not.toHaveClass('active');
  });

  it('applies active class to subpost if pathname matches it', () => {
    (navigation.usePathname as jest.Mock).mockReturnValue('/posts/parent-post/day-2');
    render(<TripSections subPosts={subPosts as any} parentPostId="parent-post" />);

    const overviewLink = screen.getByRole('link', { name: 'Overview' });
    expect(overviewLink).not.toHaveClass('active');

    const day2Link = screen.getByRole('link', { name: 'Day 2' });
    expect(day2Link).toHaveClass('active');
  });
});
