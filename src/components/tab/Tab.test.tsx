import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Tab } from './Tab';

describe('Tab Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders name and children correctly', () => {
    render(
      <Tab name="My Tab">
        <div data-testid="tab-content">Tab Content</div>
      </Tab>
    );

    expect(screen.getByText('My Tab')).toBeInTheDocument();
    expect(screen.getByTestId('tab-content')).toBeInTheDocument();
  });

  it('opens tab on mouse enter', () => {
    const { container } = render(
      <Tab name="My Tab">
        <div data-testid="tab-content">Tab Content</div>
      </Tab>
    );

    const mainContainer = container.firstChild as HTMLElement;
    const contentContainer = screen.getByTestId('tab-content').parentElement!;

    // Initial state: not open
    expect(contentContainer.className).not.toMatch(/tab-content-open/);

    // Mouse enter opens it immediately
    fireEvent.mouseEnter(mainContainer);
    expect(contentContainer.className).toMatch(/tab-content-open/);
  });

  it('closes tab after delay on mouse leave', () => {
    const { container } = render(
      <Tab name="My Tab">
        <div data-testid="tab-content">Tab Content</div>
      </Tab>
    );

    const mainContainer = container.firstChild as HTMLElement;
    const contentContainer = screen.getByTestId('tab-content').parentElement!;

    // Open first
    fireEvent.mouseEnter(mainContainer);
    expect(contentContainer.className).toMatch(/tab-content-open/);

    // Leave triggers timeout
    fireEvent.mouseLeave(contentContainer);
    
    // Still open before timeout
    expect(contentContainer.className).toMatch(/tab-content-open/);

    // Advance timers
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now closed
    expect(contentContainer.className).not.toMatch(/tab-content-open/);
  });
});
