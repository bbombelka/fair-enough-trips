import React from 'react';
import { render, screen } from '@testing-library/react';
import GpxChart from './GpxChart';
import useGPXData from 'pages/api/hooks/useGpxData';

// Mock the hook
jest.mock('pages/api/hooks/useGpxData');

// Mock utilities
jest.mock('utils', () => ({
  isMobileDevice: jest.fn().mockReturnValue(false)
}));

// Mock d3 to avoid complicated SVG rendering logic in JSDOM if needed
// For now, let's see if D3 handles JSDOM rendering gracefully. It usually does for simple SVGs.

describe('GpxChart Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loader when isLoading is true', () => {
    (useGPXData as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      hasError: false
    });

    render(<GpxChart id="test-id" />);
    // Our Loader component renders "Chart is being loaded" text
    expect(screen.getByText(/Chart is being loaded/i)).toBeInTheDocument();
  });

  it('renders error alert when hasError is true', () => {
    (useGPXData as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      hasError: true
    });

    render(<GpxChart id="test-id" />);
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('renders chart svg when data is available', () => {
    (useGPXData as jest.Mock).mockReturnValue({
      data: {
        misc: { lowestAltitude: 100, highestAltitude: 500 },
        trackPoints: [
          { distance: 0, altitude: 100 },
          { distance: 1000, altitude: 300 },
          { distance: 2000, altitude: 200 }
        ]
      },
      isLoading: false,
      hasError: false
    });

    const { container } = render(<GpxChart id="test-id" />);
    
    // Should have rendered an svg
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(screen.queryByText(/Something went wrong/i)).not.toBeInTheDocument();
  });
});
