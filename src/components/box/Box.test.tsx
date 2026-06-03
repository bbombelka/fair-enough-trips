import React from 'react';
import { render, screen } from '@testing-library/react';
import { Box } from './Box';

describe('Box', () => {
  it('renders children correctly', () => {
    render(
      <Box>
        <div data-testid="box-child">Content</div>
      </Box>
    );
    expect(screen.getByTestId('box-child')).toBeInTheDocument();
  });

  it('applies margin and padding styles', () => {
    const { container } = render(
      <Box margin="10px" padding="20px">
        Test Content
      </Box>
    );
    
    // The Box component wraps children in a div that receives the inline styles
    expect(container.firstChild).toHaveStyle({
      margin: '10px',
      padding: '20px',
    });
  });

  it('works without margin or padding provided', () => {
    const { container } = render(<Box>Test</Box>);
    expect(container.firstChild).toBeInTheDocument();
    
    // Should render fine, and inline style attribute might be empty or just missing the specific properties
    const element = container.firstChild as HTMLElement;
    expect(element.style.margin).toBe('');
    expect(element.style.padding).toBe('');
  });
});
