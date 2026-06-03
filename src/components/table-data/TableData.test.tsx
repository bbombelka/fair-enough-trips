import React from 'react';
import { render, screen } from '@testing-library/react';
import { TableData } from './TableData';
import * as utils from 'utils';

// Mock components
jest.mock('components/star-rate/StarRate', () => ({
  StarRate: ({ rate }: any) => <div data-testid="mock-star-rate">Stars: {rate}</div>
}));

jest.mock('./components/Cell', () => ({
  Cell: ({ label, value, children }: any) => (
    <tr data-testid="mock-cell">
      <th>{label}</th>
      <td>{value}{children}</td>
    </tr>
  )
}));

jest.mock('utils', () => ({
  formatIsoDuration: jest.fn().mockReturnValue('1h 30m'),
  parseDate: jest.fn().mockReturnValue('Summer 2023')
}));

describe('TableData Component', () => {
  const mockPost = {
    id: 'test-id',
    attractiveness: 4,
    condition: 3,
    difficulty: 'Moderate',
    terrain: 'Rocky',
    date: { season: 2, period: 2, month: 7, year: 2023 },
    stats: { up: 500, down: 400, duration: 1.5, distance: 5, highestPoint: 1200 },
    startingPoint: 'Start',
    endingPoint: 'End',
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all cells with correct values', () => {
    render(<TableData post={mockPost} />);

    // Check cells by label
    const labels = [
      'Attractiveness', 'Condition', 'Distance', 'Duration',
      'Ascent', 'Descent', 'Highest point', 'Terrain',
      'Season', 'Starting point', 'Ending point', 'Difficulty'
    ];

    labels.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });

    // Check specific mapped/formatted values
    expect(screen.getByText('5 km')).toBeInTheDocument();
    expect(screen.getByText('1.5 h')).toBeInTheDocument(); // formatted duration
    expect(screen.getByText('500 meters')).toBeInTheDocument();
    expect(screen.getByText('1200 meters')).toBeInTheDocument();
    expect(screen.getByText('Summer 2023')).toBeInTheDocument(); // parsed date
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('End')).toBeInTheDocument();

    // Check difficulty rendering (includes value and help icon link)
    expect(screen.getByText(/Moderate/)).toBeInTheDocument();
    
    // Check StarRate components
    const stars = screen.getAllByTestId('mock-star-rate');
    expect(stars).toHaveLength(2);
    expect(stars[0]).toHaveTextContent('Stars: 4'); // Attractiveness
    expect(stars[1]).toHaveTextContent('Stars: 3'); // Condition
  });
});
