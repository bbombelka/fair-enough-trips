import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PostCard } from './PostCard';
import * as useMappedCategoriesHook from 'hooks/useMappedCategories';
import * as useScrollDownHook from 'hooks/useScrollDown';
import * as useMainImagePathHook from 'hooks/useMainImagePath';
import * as useCardClassesHook from 'hooks/useCardClasses';

jest.mock('hooks/useMappedCategories');
jest.mock('hooks/useScrollDown');
jest.mock('hooks/useMainImagePath');
jest.mock('hooks/useCardClasses');
jest.mock('components/fet-image/FETImage', () => ({
  FETImage: ({ src, alt, className }: any) => <img src={src} alt={alt} data-testid="mock-fet-image" className={className} />
}));

describe('PostCard Component', () => {
  const mockPost = {
    id: 'test-post',
    title: 'Test Post Title',
    category: { region: ['region1'], country: ['country1'], activity: ['act1'] },
    postDate: '2023-01-01',
    base64Image: 'mockBase64',
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();

    (useMappedCategoriesHook.useMappedCategoriesNames as jest.Mock).mockReturnValue([
      ['Hiking'], ['Alps'], ['France', 'Italy']
    ]);

    (useScrollDownHook.useScrollDown as jest.Mock).mockReturnValue(jest.fn());

    (useMainImagePathHook.useMainImagePath as jest.Mock).mockReturnValue({
      src: '/test.webp',
      setError: jest.fn(),
    });

    (useCardClassesHook.useCardClasses as jest.Mock).mockReturnValue({
      imageClass: 'img-cls',
      subtitleClass: 'sub-cls',
      buttonClass: 'btn-cls',
      scrollDownIconClass: 'scroll-cls',
      titleClass: 'title-cls',
      textBoxClass: 'text-cls',
      imageContainerClass: 'img-container-cls',
      containerClass: 'container-cls',
    });
  });

  it('renders a main post card correctly', () => {
    render(<PostCard post={mockPost} isMainPostCard={true} />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText('Hiking in Alps')).toBeInTheDocument();
    expect(screen.getByText('France, Italy')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Read more about Test Post Title/i })).toBeInTheDocument();
    
    const image = screen.getByTestId('mock-fet-image');
    expect(image).toHaveAttribute('src', '/test.webp');
  });

  it('renders a regular post card correctly', () => {
    render(<PostCard post={mockPost} isMainPostCard={false} />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText('Hiking in Alps')).toBeInTheDocument();
    expect(screen.getByText('France, Italy')).toBeInTheDocument();
    
    // The entire card is a link, not a "Read more" button
    expect(screen.queryByText('Read more')).not.toBeInTheDocument();
    
    const image = screen.getByTestId('mock-fet-image');
    expect(image).toHaveAttribute('src', '/test.webp');
  });

  it('calls scrollDown when the scroll icon is clicked in main post card', () => {
    const scrollMock = jest.fn();
    (useScrollDownHook.useScrollDown as jest.Mock).mockReturnValue(scrollMock);

    const { container } = render(<PostCard post={mockPost} isMainPostCard={true} displayScrollDownButton={true} />);
    
    // Find the FontAwesomeIcon by class since it's an SVG
    const scrollIcon = container.querySelector('.scroll-cls');
    expect(scrollIcon).toBeInTheDocument();
    
    if (scrollIcon) {
      fireEvent.click(scrollIcon);
      expect(scrollMock).toHaveBeenCalledTimes(1);
    }
  });
});
