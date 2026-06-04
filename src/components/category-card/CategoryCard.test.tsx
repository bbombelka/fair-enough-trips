import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryCard } from './CategoryCard';
import * as useMainImagePathHook from 'hooks/useMainImagePath';
import * as useCardClassesHook from 'hooks/useCardClasses';
import * as useScrollDownHook from 'hooks/useScrollDown';

// Mock dependencies
jest.mock('hooks/useMainImagePath');
jest.mock('hooks/useCardClasses');
jest.mock('hooks/useScrollDown');
jest.mock('components/fet-image/FETImage', () => ({
  FETImage: ({ src, alt, onError }: any) => <img src={src} alt={alt} data-testid="mock-fet-image" onError={onError} />
}));

describe('CategoryCard Component', () => {
  const mockCategory = {
    url: 'test-category',
    name: 'Test Category',
    originalName: 'Original Test Category',
    code: 'test_code',
  };

  const mockPostIds = ['post-1', 'post-2'];

  beforeEach(() => {
    jest.clearAllMocks();

    (useMainImagePathHook.useMainImagePath as jest.Mock).mockReturnValue({
      src: '/test-image.webp',
      setError: jest.fn(),
    });

    (useCardClassesHook.useCardClasses as jest.Mock).mockReturnValue({
      imageClass: 'image-class',
      buttonClass: 'button-class',
      titleClass: 'title-class',
      textBoxClass: 'text-box-class',
      imageContainerClass: 'image-container-class',
      containerClass: 'container-class',
    });

    (useScrollDownHook.useScrollDown as jest.Mock).mockReturnValue(jest.fn());
  });

  it('renders a main category card correctly', () => {
    render(
      <CategoryCard
        category={mockCategory}
        postIds={mockPostIds}
        isMainCard={true}
        categoryType="regions"
        id="test-id"
      />
    );

    expect(screen.getByText(/Test Category/)).toBeInTheDocument();
    expect(screen.getByText(/\(Original Test Category\)/)).toBeInTheDocument();
    expect(screen.getByText('See 2 trips')).toBeInTheDocument();
    expect(screen.getByTestId('mock-fet-image')).toHaveAttribute('src', '/content/posts/test-id/main.webp');
  });

  it('renders a regular category card correctly', () => {
    render(
      <CategoryCard
        category={mockCategory}
        postIds={mockPostIds}
        isMainCard={false}
        categoryType="regions"
        id="test-id"
      />
    );

    expect(screen.getByText(/Test Category/)).toBeInTheDocument();
    expect(screen.getByTestId('mock-fet-image')).toHaveAttribute('src', '/test-image.webp');
    // Verify it links to the category
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/regions/test-category');
  });

  it('calls scroll hooks when buttons are clicked in main card', () => {
    const mockScrollDownTrips = jest.fn();
    const mockScrollDownNotes = jest.fn();
    
    (useScrollDownHook.useScrollDown as jest.Mock).mockImplementation((targetId) => {
      if (targetId === 'card-list') return mockScrollDownTrips;
      if (targetId === 'trip-notes') return mockScrollDownNotes;
      return jest.fn();
    });

    render(
      <CategoryCard
        category={mockCategory}
        postIds={mockPostIds}
        isMainCard={true}
        categoryType="regions"
        areNotesPresent={true}
        buttonLabel="Trip Notes"
        id="test-id"
      />
    );

    fireEvent.click(screen.getByText('See 2 trips'));
    expect(mockScrollDownTrips).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Trip Notes'));
    expect(mockScrollDownNotes).toHaveBeenCalled();
  });

  it('does not render originalName if not provided', () => {
    const noOriginalNameCategory = { ...mockCategory, originalName: undefined };
    render(
      <CategoryCard
        category={noOriginalNameCategory as any}
        postIds={mockPostIds}
        isMainCard={true}
        categoryType="regions"
        id="test-id"
      />
    );

    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.queryByText(/\(Original Test Category\)/)).not.toBeInTheDocument();
  });

  it('calls setError on image load error in regular card', () => {
    const mockSetError = jest.fn();
    (useMainImagePathHook.useMainImagePath as jest.Mock).mockReturnValue({
      src: '/test-image.webp',
      setError: mockSetError,
    });

    render(
      <CategoryCard
        category={mockCategory}
        postIds={mockPostIds}
        isMainCard={false}
        categoryType="regions"
        id="test-id"
      />
    );

    const image = screen.getByTestId('mock-fet-image');
    fireEvent.error(image);
    
    expect(mockSetError).toHaveBeenCalledWith(true);
  });
});
