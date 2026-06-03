import React from 'react';
import { render, screen } from '@testing-library/react';
import { TripNotes } from './TripNotes';

jest.mock('components/divider/Divider', () => ({
  Divider: ({ title, id }: any) => <div data-testid={`mock-divider-${id}`}>{title}</div>
}));

jest.mock('components/paragraph/Paragraph', () => ({
  Paragraph: ({ body }: any) => <div data-testid="mock-paragraph">{body[0]}</div>
}));

describe('TripNotes Component', () => {
  it('renders title and multiple notes correctly', () => {
    const notes = [
      { title: 'Note 1', paragraph: ['First note content'], links: [] },
      { title: 'Note 2', paragraph: ['Second note content'], links: [] }
    ];

    render(<TripNotes title="My Trip Notes" notes={notes} />);

    // Check main title
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('My Trip Notes');

    // Check dividers (titles of the notes)
    expect(screen.getByTestId('mock-divider-note-1')).toHaveTextContent('Note 1');
    expect(screen.getByTestId('mock-divider-note-2')).toHaveTextContent('Note 2');

    // Check paragraphs
    const paragraphs = screen.getAllByTestId('mock-paragraph');
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]).toHaveTextContent('First note content');
    expect(paragraphs[1]).toHaveTextContent('Second note content');
  });
});
