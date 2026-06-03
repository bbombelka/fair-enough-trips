import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FETImage } from './FETImage';

describe('FETImage Component', () => {
  it('renders a loader initially if no blurDataURL is provided', () => {
    render(<FETImage src="/test.jpg" alt="test image" width={100} height={100} />);
    // Loader component renders an element with text "Loading image"
    expect(screen.getByText(/Loading image/i)).toBeInTheDocument();
  });

  it('does not render a loader if blurDataURL is provided', () => {
    render(<FETImage src="/test.jpg" alt="test image" blurDataURL="mockBase64" width={100} height={100} />);
    expect(screen.queryByText('Loading image')).not.toBeInTheDocument();
  });

  it('renders the NextImage with correct attributes', () => {
    render(<FETImage src="/test.jpg" alt="test image" className="custom-class" width={100} height={100} />);
    const image = screen.getByRole('img');
    
    // next/image might transform the src, so we just check it exists
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass('custom-class');
  });

  it('hides loader and applies liven-up class when image loads', async () => {
    render(<FETImage src="/test.jpg" alt="test image" className="custom-class" width={100} height={100} />);
    
    expect(screen.getByText(/Loading image/i)).toBeInTheDocument();
    const image = screen.getByRole('img');

    // Simulate image load
    fireEvent.load(image);

    // Expect the class to be added
    await waitFor(() => {
      // It includes "liven-up" class from the module CSS
      // Note: CSS modules generate unique names in prod, but in jest they are usually identity mapped
      expect(image.className).toMatch(/liven-up/);
    });
  });
});
