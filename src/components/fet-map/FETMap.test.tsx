import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FETMap } from './FETMap';

// Mock child components to isolate FETMap logic
jest.mock('components/table-data/TableData', () => ({
  TableData: () => <div data-testid="mock-table-data" />
}));

jest.mock('./MapIframe', () => ({
  MapIframe: ({ iframeUrl }: any) => <div data-testid="mock-map-iframe">{iframeUrl}</div>
}));

// Mock dynamic import for GpxChart
jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => <div data-testid="mock-gpx-chart" />;
  return DynamicComponent;
});

describe('FETMap Component', () => {
  const mockPost = {
    id: 'test-post',
    title: 'Test Post Title',
    iframeUrl: 'http://test.map.com',
    category: { region: [], country: [], activity: [] },
    postDate: '2023-01-01',
    base64Image: '',
    subTitle: '',
    terrain: '',
    difficulty: '',
    startingPoint: '',
    endingPoint: '',
    attractiveness: 5,
    condition: 5,
    date: { season: 1, period: 1, month: 1, year: 2023 },
    stats: { distance: 10, duration: "PT5H", highestPoint: 1000, up: 500, down: 500 }
  } as any;

  it('renders MapIframe and TableData initially', () => {
    render(<FETMap post={mockPost} />);
    
    // By default, showMapIframe is true
    expect(screen.getByTestId('mock-map-iframe')).toBeInTheDocument();
    expect(screen.getByTestId('mock-table-data')).toBeInTheDocument();
  });

  it('toggles map visibility when hide/show link is clicked', () => {
    render(<FETMap post={mockPost} />);
    
    const toggleLink = screen.getByText(/Hide the map/i);
    expect(screen.getByTestId('mock-map-iframe')).toBeInTheDocument();

    fireEvent.click(toggleLink);

    // Map should be hidden
    expect(screen.queryByTestId('mock-map-iframe')).not.toBeInTheDocument();
    expect(screen.getByText(/Show the map/i)).toBeInTheDocument();
  });

  it('renders download links if provided in controlDisplayLinks', () => {
    render(
      <FETMap 
        post={mockPost} 
        controlDisplayLinks={{ 
          gpxDownloadLink: '/test.gpx',
          topoDownloadLink: '/test.pdf',
          displayGpxChart: true
        }} 
      />
    );

    expect(screen.getByText('Download gps track')).toBeInTheDocument();
    expect(screen.getByText('Topo')).toBeInTheDocument();
    expect(screen.getByText('Show elevation profile')).toBeInTheDocument();
  });

  it('opens modal with GpxChart when elevation profile link is clicked', () => {
    render(
      <FETMap 
        post={mockPost} 
        controlDisplayLinks={{ displayGpxChart: true }} 
      />
    );

    expect(screen.queryByTestId('mock-gpx-chart')).not.toBeInTheDocument();

    const chartLink = screen.getByText('Show elevation profile');
    fireEvent.click(chartLink);

    expect(screen.getByTestId('mock-gpx-chart')).toBeInTheDocument();
  });
});
