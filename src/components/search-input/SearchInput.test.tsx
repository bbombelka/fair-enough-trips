import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchInput } from './SearchInput';

describe('SearchInput Component', () => {
  it('renders input and button correctly', () => {
    render(<SearchInput setSearchTerm={jest.fn()} isLoading={false} />);
    
    expect(screen.getByPlaceholderText('Trip to find...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls setSearchTerm when button is clicked', () => {
    const mockSetSearchTerm = jest.fn();
    render(<SearchInput setSearchTerm={mockSetSearchTerm} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Trip to find...');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'mountain' } });
    fireEvent.click(button);

    expect(mockSetSearchTerm).toHaveBeenCalledWith('mountain');
  });

  it('calls setSearchTerm when Enter key is pressed', () => {
    const mockSetSearchTerm = jest.fn();
    render(<SearchInput setSearchTerm={mockSetSearchTerm} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Trip to find...');

    fireEvent.change(input, { target: { value: 'lake' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockSetSearchTerm).toHaveBeenCalledWith('lake');
  });

  it('disables button and applies styling when isLoading is true', () => {
    render(<SearchInput setSearchTerm={jest.fn()} isLoading={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.className).toMatch(/button-disabled/);
  });
});
