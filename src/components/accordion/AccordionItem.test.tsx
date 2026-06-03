import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccordionItem } from './AccordionItem';

describe('AccordionItem', () => {
  it('renders the title', () => {
    render(<AccordionItem title="Test Accordion" content="Accordion Content" />);
    expect(screen.getByText('Test Accordion')).toBeInTheDocument();
  });

  it('does not render content initially', () => {
    render(<AccordionItem title="Test Accordion" content="Accordion Content" />);
    expect(screen.queryByText('Accordion Content')).not.toBeInTheDocument();
  });

  it('renders content when clicked', () => {
    render(<AccordionItem title="Test Accordion" content="Accordion Content" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    
    expect(screen.getByText('Accordion Content')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('hides content when clicked twice', () => {
    render(<AccordionItem title="Test Accordion" content={<div>Accordion Content</div>} />);
    
    const button = screen.getByRole('button');
    
    // Open
    fireEvent.click(button);
    expect(screen.getByText('Accordion Content')).toBeInTheDocument();
    
    // Close
    fireEvent.click(button);
    expect(screen.queryByText('Accordion Content')).not.toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
