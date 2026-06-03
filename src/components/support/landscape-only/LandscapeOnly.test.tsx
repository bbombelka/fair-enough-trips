import React from 'react';
import { render, screen } from '@testing-library/react';
import { LandscapeOnly } from './LandscapeOnly';

describe('LandscapeOnly Component', () => {
  it('renders children and rotation prompt', () => {
    render(
      <LandscapeOnly>
        <div data-testid="child-content">Child Content</div>
      </LandscapeOnly>
    );
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('To see the content rotate your device to landscape mode')).toBeInTheDocument();
    expect(screen.getByAltText('Image suggesting to rotate the device')).toBeInTheDocument();
  });

  it('applies styling container classes', () => {
    const { container } = render(<LandscapeOnly><div /></LandscapeOnly>);
    
    const rootDiv = container.firstChild as HTMLElement;
    expect(rootDiv.className).toMatch(/landscape-only-container/);
  });
});
