import React from 'react';
import { render, screen } from '@testing-library/react';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders the message correctly', () => {
    render(<Alert message="Warning: Low battery" />);
    expect(screen.getByText('Warning: Low battery')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <Alert message="Look out!">
        <span data-testid="child-icon">⚠️</span>
      </Alert>
    );
    expect(screen.getByTestId('child-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Alert message="Message" className="custom-error-class" />);
    // container.firstChild is the outer div
    expect(container.firstChild).toHaveClass('custom-error-class');
  });
});
