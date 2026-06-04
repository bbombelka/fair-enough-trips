import { renderHook } from '@testing-library/react';
import { useCardClasses } from './useCardClasses';

describe('useCardClasses', () => {
  // clsx will use the values provided here. If a key is missing, it will be undefined and ignored.
  const mockStyles = {
    'textBox': 'textBox',
    'top': 'top',
    'bottom': 'bottom',
    'main': 'main',
    'next-image': 'next-image',
    'next-image-main': 'next-image-main',
    'text': 'text',
    'title-main': 'title-main',
    'title': 'title',
    'main-post-card-subtitle': 'main-post-card-subtitle',
    'subtitle': 'subtitle',
    'scroll-down-icon': 'scroll-down-icon',
    'is-top': 'is-top',
    'button': 'button',
    'next-image-container': 'next-image-container',
    'grid-card': 'grid-card',
    'container': 'container',
    'container-main-card': 'container-main-card'
  };

  it('returns classes for main card', () => {
    const { result } = renderHook(() => useCardClasses({ isMainCard: true, isTop: false, styles: mockStyles }));
    expect(result.current).toEqual({
      textBoxClass: 'textBox bottom main',
      imageClass: 'next-image next-image-main',
      titleClass: 'text title-main',
      subtitleClass: 'text main-post-card-subtitle',
      scrollDownIconClass: 'scroll-down-icon',
      buttonClass: 'button main',
      imageContainerClass: 'next-image-container',
      containerClass: 'container container-main-card',
    });
  });

  it('returns classes for regular card', () => {
    const { result } = renderHook(() => useCardClasses({ isMainCard: false, isTop: false, styles: mockStyles }));
    expect(result.current).toEqual({
      textBoxClass: 'textBox bottom',
      imageClass: 'next-image',
      titleClass: 'text title',
      subtitleClass: 'text subtitle',
      scrollDownIconClass: 'scroll-down-icon',
      buttonClass: 'button',
      imageContainerClass: 'next-image-container grid-card',
      containerClass: 'container',
    });
  });

  it('adds top class if isTop is true', () => {
    const { result } = renderHook(() => useCardClasses({ isMainCard: false, isTop: true, styles: mockStyles }));
    expect(result.current.textBoxClass).toContain('top');
    expect(result.current.textBoxClass).not.toContain('bottom');
    expect(result.current.scrollDownIconClass).toContain('is-top');
  });
});
