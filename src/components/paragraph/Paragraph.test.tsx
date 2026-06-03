import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Paragraph } from './Paragraph';
import * as useGlobalContextHook from 'hooks/useGlobalContext';

jest.mock('hooks/useGlobalContext');

describe('Paragraph Component', () => {
  const mockSetOpenModal = jest.fn();
  const mockSetCurrentImage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useGlobalContextHook.useGlobalContext as jest.Mock).mockReturnValue({
      setOpenModal: mockSetOpenModal,
      setCurrentImage: mockSetCurrentImage,
    });
  });

  it('renders title and text paragraphs', () => {
    render(<Paragraph title="Main Title" body={['First line', 'Second line']} />);
    expect(screen.getByText('Main Title:')).toBeInTheDocument();
    expect(screen.getByText('First line')).toBeInTheDocument();
    expect(screen.getByText('Second line')).toBeInTheDocument();
  });

  it('renders list items correctly', () => {
    render(
      <Paragraph 
        body={[
          'A paragraph', 
          { tag: 'li', body: 'List item 1' }, 
          { tag: 'li', body: 'List item 2' }
        ]} 
      />
    );
    expect(screen.getByText('A paragraph')).toBeInTheDocument();
    expect(screen.getByText('List item 1')).toBeInTheDocument();
    expect(screen.getByText('List item 2')).toBeInTheDocument();
  });

  it('renders links and handles image link clicks', () => {
    render(
      <Paragraph 
        body={['Content']} 
        links={[
          { title: 'Image Link', href: '/img.jpg', internal: true, type: 'image' },
          { title: 'External Link', href: 'http://ext.com', internal: false },
          { title: 'Nav Link', href: '/nav', internal: true, type: 'navigation' },
          { title: 'Anchor Link', href: 'anchor', internal: true }
        ]} 
      />
    );

    expect(screen.getByText('External Link').closest('a')).toHaveAttribute('href', 'http://ext.com');
    expect(screen.getByText('Nav Link').closest('a')).toHaveAttribute('href', '/nav');
    expect(screen.getByText('Anchor Link').closest('a')).toHaveAttribute('href', '#anchor');
    
    const imgLink = screen.getByText('Image Link');
    fireEvent.click(imgLink);
    expect(mockSetCurrentImage).toHaveBeenCalledWith('/img.jpg');
    expect(mockSetOpenModal).toHaveBeenCalledWith(true);
  });
});
