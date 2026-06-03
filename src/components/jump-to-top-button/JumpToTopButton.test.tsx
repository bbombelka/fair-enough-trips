import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { JumpToTopButton } from './JumpToTopButton';
import * as navigation from 'next/navigation';
import * as useHasHashHook from 'hooks/useHasHash';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('hooks/useHasHash');

describe('JumpToTopButton Component', () => {
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (navigation.useRouter as jest.Mock).mockReturnValue({
      back: mockBack,
    });
    
    // Reset window.location.hash
    window.location.hash = '';
  });

  it('renders correctly and is invisible by default if no hash', () => {
    (useHasHashHook.useHasHash as jest.Mock).mockReturnValue(false);

    render(<JumpToTopButton element={null} />);
    
    const button = screen.getByRole('button', { name: 'Back to top' });
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveClass('visible');
  });

  it('becomes visible if hook indicates hash exists', () => {
    (useHasHashHook.useHasHash as jest.Mock).mockReturnValue(true);

    render(<JumpToTopButton element={null} />);
    
    const button = screen.getByRole('button', { name: 'Back to top' });
    expect(button).toHaveClass('visible');
  });

  it('scrolls into view of provided element when clicked', () => {
    (useHasHashHook.useHasHash as jest.Mock).mockReturnValue(false);
    
    const mockElement = document.createElement('div');
    const scrollIntoViewMock = jest.fn();
    mockElement.scrollIntoView = scrollIntoViewMock;

    render(<JumpToTopButton element={mockElement} />);
    
    const button = screen.getByRole('button', { name: 'Back to top' });
    fireEvent.click(button);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
    expect(mockBack).not.toHaveBeenCalled();
  });

  it('calls router.back if window.location.hash is present', () => {
    (useHasHashHook.useHasHash as jest.Mock).mockReturnValue(true);
    
    // Set hash
    window.location.hash = '#some-hash';

    render(<JumpToTopButton element={null} />);
    
    const button = screen.getByRole('button', { name: 'Back to top' });
    fireEvent.click(button);

    expect(mockBack).toHaveBeenCalled();
  });
});
