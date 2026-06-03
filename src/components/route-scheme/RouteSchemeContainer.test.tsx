import React from 'react';
import { render, screen } from '@testing-library/react';
import RouteSchemeContainer from './RouteSchemeContainer';
import useRouteSchemePoints from 'pages/api/hooks/useRouteSchemePoints';

jest.mock('pages/api/hooks/useRouteSchemePoints');
jest.mock('./RouteScheme', () => ({
  __esModule: true,
  default: ({ points }: any) => <div data-testid="mock-route-scheme">Points: {points.length}</div>
}));

describe('RouteSchemeContainer Component', () => {
  it('renders loader when isLoading is true', () => {
    (useRouteSchemePoints as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      hasError: false
    });

    render(<RouteSchemeContainer id="test-id" />);
    expect(screen.getByText(/Route scheme is loading/i)).toBeInTheDocument();
  });

  it('renders error alert when hasError is true', () => {
    (useRouteSchemePoints as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      hasError: true
    });

    render(<RouteSchemeContainer id="test-id" />);
    expect(screen.getByText('Error while loading route scheme')).toBeInTheDocument();
  });

  it('renders RouteScheme when data is available', () => {
    (useRouteSchemePoints as jest.Mock).mockReturnValue({
      data: { points: [{ lat: 1, lon: 1 }], disabledModes: [] },
      isLoading: false,
      hasError: false
    });

    render(<RouteSchemeContainer id="test-id" />);
    expect(screen.getByTestId('mock-route-scheme')).toBeInTheDocument();
    expect(screen.getByText('Points: 1')).toBeInTheDocument();
  });
});
