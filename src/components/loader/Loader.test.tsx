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
    const { container, rerender } = render(<Loader isLoading={true} loadingHeading="Loading" />);
    // Not hidden yet
    expect(container.firstChild).not.toHaveClass('hidden');

    // Change to false
    rerender(<Loader isLoading={false} loadingHeading="Loading" />);
    
    act(() => {
      jest.advanceTimersByTime(0); // non-image timeout is 0
    });

    expect(container.firstChild).toHaveClass('hidden');
  });

  it('uses 2000ms timeout for images', () => {
    const { container, rerender } = render(<Loader isLoading={true} isImage={true} loadingHeading="Loading" />);
    rerender(<Loader isLoading={false} isImage={true} loadingHeading="Loading" />);
    
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

  it('applies border classes correctly', () => {
    const { container } = render(
      <Loader isLoading={true} hasExternalBorder={true} hasInternalBorder={true} loadingHeading="Loading" />
    );
    
    const rootDiv = container.firstChild as HTMLElement;
    expect(rootDiv).toHaveClass('border');
    
    const centerBox = rootDiv.querySelector('.center-box') as HTMLElement;
    expect(centerBox).toHaveClass('border');
  });
});
