import React from 'react';
import { render, screen } from '@testing-library/react';
import { SearchBar } from './SearchBar';

jest.mock('components/search-input/SearchInput', () => ({
  SearchInput: ({ isLoading }: any) => <div data-testid="mock-search-input">Loading: {isLoading ? 'yes' : 'no'}</div>
}));

describe('SearchBar Component', () => {
  it('renders SearchInput and passes props correctly', () => {
    render(<SearchBar setSearchTerm={jest.fn()} isLoading={true} />);
    
    expect(screen.getByTestId('mock-search-input')).toBeInTheDocument();
    expect(screen.getByText('Loading: yes')).toBeInTheDocument();
  });

  it('applies styling container classes', () => {
    const { container } = render(<SearchBar setSearchTerm={jest.fn()} isLoading={false} />);
    const div = container.firstChild as HTMLElement;
    
    expect(div.className).toMatch(/navbar/);
    expect(div.className).toMatch(/searchbar/);
  });
});
