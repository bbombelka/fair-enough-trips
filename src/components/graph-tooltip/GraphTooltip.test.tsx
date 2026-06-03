import React from 'react';
import { render, screen } from '@testing-library/react';
import { GraphTooltip } from './GraphTooltip';
import * as useClickAwayHook from 'hooks/useClickAway';

jest.mock('hooks/useClickAway');

describe('GraphTooltip Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children correctly', () => {
    render(
      <GraphTooltip left={10} top={20} onClickAway={jest.fn()}>
        <div data-testid="tooltip-content">Tooltip Content</div>
      </GraphTooltip>
    );

    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    expect(screen.getByText('Tooltip Content')).toBeInTheDocument();
  });

  it('applies left and top styles', () => {
    const { container } = render(
      <GraphTooltip left={50} top={100} onClickAway={jest.fn()}>
        Content
      </GraphTooltip>
    );

    const tooltip = container.firstChild as HTMLElement;
    expect(tooltip).toHaveStyle({
      left: '50px',
      top: '100px',
    });
  });

  it('calls useClickAway with the correct ref and callback', () => {
    const mockOnClickAway = jest.fn();
    render(
      <GraphTooltip left={10} top={20} onClickAway={mockOnClickAway}>
        Content
      </GraphTooltip>
    );

    // useClickAway is called with (ref, callback)
    expect(useClickAwayHook.default).toHaveBeenCalledTimes(1);
    const [, passedCallback] = (useClickAwayHook.default as jest.Mock).mock.calls[0];
    
    // Check if the passed callback is our mock
    expect(passedCallback).toBe(mockOnClickAway);
  });
});
