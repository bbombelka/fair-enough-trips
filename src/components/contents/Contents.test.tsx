import React from 'react';
import { render, screen } from '@testing-library/react';
import { Contents } from './Contents';

describe('Contents Component', () => {
  it('renders the contents list', () => {
    render(<Contents />);
    
    const links = [
      'Description',
      'General',
      'Trip conditions',
      'Other information',
      'Visual'
    ];

    links.forEach(link => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it('has correct href attributes', () => {
    render(<Contents />);
    
    expect(screen.getByText('Description')).toHaveAttribute('href', '#Description');
    expect(screen.getByText('General')).toHaveAttribute('href', '#General');
    expect(screen.getByText('Trip conditions')).toHaveAttribute('href', '#Trip conditions');
    expect(screen.getByText('Other information')).toHaveAttribute('href', '#Other');
    expect(screen.getByText('Visual')).toHaveAttribute('href', '#Visual');
  });
});
