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

  it('renders ordered lists when first li has tag li-ol', () => {
    const { container } = render(
      <Paragraph 
        body={[
          { tag: 'li-ol', body: 'Step 1' }, 
          { tag: 'li', body: 'Step 2' }
        ]} 
      />
    );
    const ol = container.querySelector('ol');
    expect(ol).toBeInTheDocument();
    expect(ol).toHaveTextContent('Step 1');
    expect(ol).toHaveTextContent('Step 2');
    expect(container.querySelector('ul')).not.toBeInTheDocument();
  });

  it('renders unordered lists by default', () => {
    const { container } = render(
      <Paragraph 
        body={[
          { tag: 'li', body: 'Item 1' }, 
          { tag: 'li', body: 'Item 2' }
        ]} 
      />
    );
    const ul = container.querySelector('ul');
    expect(ul).toBeInTheDocument();
    expect(container.querySelector('ol')).not.toBeInTheDocument();
  });

  it('renders mixed content in correct order', () => {
    const { container } = render(
      <Paragraph 
        body={[
          'Text before',
          { tag: 'li', body: 'Item 1' },
          'Text between',
          { tag: 'li-ol', body: 'Step 1' },
          'Text after'
        ]} 
      />
    );
    
    const contentDiv = container.firstChild as HTMLElement;
    const children = Array.from(contentDiv.children);
    
    expect(children[0].tagName).toBe('P');
    expect(children[0]).toHaveTextContent('Text before');
    
    expect(children[1].tagName).toBe('UL');
    expect(children[1]).toHaveTextContent('Item 1');
    
    expect(children[2].tagName).toBe('P');
    expect(children[2]).toHaveTextContent('Text between');
    
    expect(children[3].tagName).toBe('OL');
    expect(children[3]).toHaveTextContent('Step 1');
    
    expect(children[4].tagName).toBe('P');
    expect(children[4]).toHaveTextContent('Text after');
  });

  it('correctly uses the tag of the FIRST li in a group to determine list type', () => {
    const { container, rerender } = render(
      <Paragraph 
        body={[
          { tag: 'li-ol', body: 'Ordered 1' },
          { tag: 'li', body: 'Ordered 2' }
        ]} 
      />
    );
    expect(container.querySelector('ol')).toBeInTheDocument();
    expect(container.querySelector('ul')).not.toBeInTheDocument();

    rerender(
      <Paragraph 
        body={[
          { tag: 'li', body: 'Unordered 1' },
          { tag: 'li-ol', body: 'Unordered 2' }
        ]} 
      />
    );
    expect(container.querySelector('ul')).toBeInTheDocument();
    expect(container.querySelector('ol')).not.toBeInTheDocument();
  });

  it('renders stats correctly', () => {
    const stats = {
      up: 'PT1H',
      length: '500',
      difficulty: 'IV'
    };
    render(<Paragraph body={[]} stats={stats as any} />);

    expect(screen.getByText('Climbing time')).toBeInTheDocument();
    expect(screen.getByText('1h 00m')).toBeInTheDocument();
    
    expect(screen.getByText('Length')).toBeInTheDocument();
    expect(screen.getByText('500 meters')).toBeInTheDocument();
    
    expect(screen.getByText('Difficulty')).toBeInTheDocument();
    expect(screen.getByText('IV')).toBeInTheDocument();
    expect(screen.getByTitle('Difficulty scales explained')).toBeInTheDocument();
  });

  it('renders correctly with empty body but defined stats', () => {
    const stats = {
      up: 'PT1H',
      length: '500',
    };
    render(<Paragraph body={[]} stats={stats as any} />);

    expect(screen.getByText('Climbing time')).toBeInTheDocument();
    expect(screen.getByText('1h 00m')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });
});
