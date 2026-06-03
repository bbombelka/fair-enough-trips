import React from 'react';
import { render, screen } from '@testing-library/react';
import { RatingSection } from './RatingSection';

jest.mock('components/divider/Divider', () => ({
  Divider: ({ title }: any) => <div data-testid="mock-divider">{title}</div>
}));

jest.mock('components/paragraph/Paragraph', () => ({
  Paragraph: ({ body }: any) => <div data-testid="mock-paragraph">{body[0]}</div>
}));

jest.mock('components/box/Box', () => ({
  Box: ({ children }: any) => <div data-testid="mock-box">{children}</div>
}));

jest.mock('components/star-rate/StarRate', () => ({
  StarRate: ({ rate, comment }: any) => <div data-testid="mock-star-rate">Stars: {rate}{comment}</div>
}));

describe('RatingSection Component', () => {
  it('renders divider, paragraphs, and star rates with comments', () => {
    render(<RatingSection />);
    
    expect(screen.getByTestId('mock-divider')).toHaveTextContent('Rating');
    
    const paragraphs = screen.getAllByTestId('mock-paragraph');
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]).toHaveTextContent(/Atractiveness - though subjective/);
    expect(paragraphs[1]).toHaveTextContent(/Condition - I rate the trip/);

    const starRates = screen.getAllByTestId('mock-star-rate');
    expect(starRates).toHaveLength(10); // 5 for attractiveness, 5 for condition
    
    // Check a few comments to ensure they passed down correctly
    expect(starRates[0]).toHaveTextContent('Stars: 1 - for connoisseurs only');
    expect(starRates[4]).toHaveTextContent('Stars: 5 - trip of your lifetime');
    expect(starRates[5]).toHaveTextContent(/Stars: 1 - tiny to small effort/);
    expect(starRates[9]).toHaveTextContent(/Stars: 5 - huge to extreme effort/);
  });
});
