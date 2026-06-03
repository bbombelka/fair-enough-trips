import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PostImages } from './PostImages';
import * as useGlobalContextHook from 'hooks/useGlobalContext';
import * as useImageSourcePathHook from 'hooks/useImageSourcePath';

jest.mock('hooks/useGlobalContext');
jest.mock('hooks/useImageSourcePath');
jest.mock('hooks/useSlickSettings', () => ({
  useSlickSettings: () => ({
    slickSettings: {},
    slickSettingsModal: {},
    videosSlickSettings: {},
  })
}));

// Mock react-slick to avoid complicated DOM structures and issues in JSDOM
jest.mock('react-slick', () => {
  return ({ children }: any) => <div data-testid="mock-slider">{children}</div>;
});

// Mock FETImage to simplify rendering
jest.mock('components/fet-image/FETImage', () => ({
  FETImage: ({ src, alt }: any) => <img src={src} alt={alt} data-testid="mock-fet-image" />
}));

describe('PostImages Component', () => {
  const mockSetOpenModal = jest.fn();
  const mockSetCurrentImage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useGlobalContextHook.useGlobalContext as jest.Mock).mockReturnValue({
      showModal: false,
      setOpenModal: mockSetOpenModal,
      currentImage: '',
      setCurrentImage: mockSetCurrentImage,
    });

    (useImageSourcePathHook.useImageSourcePath as jest.Mock).mockReturnValue(
      ({ id, filename }: any) => ({
        src: `/full/${id}/${filename}`,
        thumbSrc: `/thumb/${id}/${filename}`
      })
    );
  });

  it('renders images within the slider', () => {
    const images = [
      { filename: 'img1.jpg', desc: 'Desc 1', isVertical: false },
      { filename: 'img2.jpg', desc: 'Desc 2', isVertical: true }
    ];

    render(<PostImages id="test-id" images={images} />);
    
    const renderedImages = screen.getAllByTestId('mock-fet-image');
    expect(renderedImages).toHaveLength(2);
    expect(renderedImages[0]).toHaveAttribute('src', '/thumb/test-id/img1.jpg');
    expect(renderedImages[0]).toHaveAttribute('alt', 'Desc 1');
  });

  it('opens modal and sets current image on click', () => {
    const images = [{ filename: 'img1.jpg', desc: 'Desc 1', isVertical: false }];
    
    const { container } = render(<PostImages id="test-id" images={images} />);
    
    // The clickable div wraps the slick-image-container
    const imageContainer = container.querySelector('#post-images .images');
    fireEvent.click(imageContainer!);

    expect(mockSetCurrentImage).toHaveBeenCalledWith('img1.jpg');
    expect(mockSetOpenModal).toHaveBeenCalledWith(true);
  });

  it('renders modal with full size images when showModal is true', () => {
    (useGlobalContextHook.useGlobalContext as jest.Mock).mockReturnValue({
      showModal: true, // Force modal open
      setOpenModal: mockSetOpenModal,
      currentImage: 'img1.jpg',
      setCurrentImage: mockSetCurrentImage,
    });

    const images = [{ filename: 'img1.jpg', desc: 'Desc 1', isVertical: false }];
    render(<PostImages id="test-id" images={images} />);

    // Since showModal is true, we should see the images rendered twice (once in main slider, once in modal)
    const allImages = screen.getAllByTestId('mock-fet-image');
    expect(allImages).toHaveLength(2);

    // The modal image uses the full src, not thumbSrc
    expect(allImages[1]).toHaveAttribute('src', '/full/test-id/img1.jpg');
    // And caption should be visible
    expect(screen.getByText('Desc 1')).toBeInTheDocument();
  });
});
