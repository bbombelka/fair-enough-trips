import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Loader } from './Loader';

describe('Loader Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly when isLoading is true', () => {
    render(<Loader isLoading={true} loadingHeading="Loading Data" />);
    expect(screen.getByText(/Loading Data/)).toBeInTheDocument();
  });

  it('hides after timeout when isLoading becomes false', () => {
    const { container, rerender } = render(<Loader isLoading={true} />);
    // Not hidden yet
    expect(container.firstChild).not.toHaveClass('hidden');

    // Change to false
    rerender(<Loader isLoading={false} />);
    
    act(() => {
      jest.advanceTimersByTime(0); // non-image timeout is 0
    });

    expect(container.firstChild).toHaveClass('hidden');
  });

  it('uses 2000ms timeout for images', () => {
    const { container, rerender } = render(<Loader isLoading={true} isImage={true} />);
    rerender(<Loader isLoading={false} isImage={true} />);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    // Should not be hidden yet
    expect(container.firstChild).not.toHaveClass('hidden');

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    // Should be hidden now
    expect(container.firstChild).toHaveClass('hidden');
  });
});
