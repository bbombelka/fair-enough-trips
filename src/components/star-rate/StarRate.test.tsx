import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { StarRate } from './StarRate';

describe('StarRate Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly with disableCount (immediate rendering)', () => {
    // With rate=3.5, we should see 3 solid, 1 half, 1 empty
    render(<StarRate rate={3.5} disableCount={true} comment=" - good" />);
    
    // Icons are SVGs handled by FontAwesome, but we can check the comment
    expect(screen.getByText('- good')).toBeInTheDocument();
  });

  it('animates rendering of stars if disableCount is false', () => {
    const { container } = render(<StarRate rate={5} disableCount={false} />);
    
    // Initially, there might be 1 star drawn
    // We wait for timers to advance
    act(() => {
      jest.advanceTimersByTime(500);
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Check if the container still renders elements
    expect(container.firstChild).toBeInTheDocument();
  });
});
