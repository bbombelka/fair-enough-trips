import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ButtonGroup from './ButtonGroup';

describe('ButtonGroup Component', () => {
  it('renders all options', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    render(<ButtonGroup options={options} selectedOption="Option 1" />);
    
    options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('calls onSelect with the correct option when clicked', () => {
    const options = ['Option 1', 'Option 2'];
    const mockOnSelect = jest.fn();
    
    render(<ButtonGroup options={options} selectedOption="Option 1" onSelect={mockOnSelect} />);
    
    fireEvent.click(screen.getByText('Option 2'));
    expect(mockOnSelect).toHaveBeenCalledWith('Option 2');
  });

  it('applies selected class to the selected option', () => {
    const options = ['Option 1', 'Option 2'];
    render(<ButtonGroup options={options} selectedOption="Option 2" />);
    
    const selectedButton = screen.getByText('Option 2');
    const unselectedButton = screen.getByText('Option 1');
    
    // We check if the class name includes the selected class logic. 
    // Since CSS modules are mocked or passed as identity, we just check the output string.
    expect(selectedButton.className).toMatch(/group-button-selected/);
    expect(unselectedButton.className).not.toMatch(/group-button-selected/);
  });
});
