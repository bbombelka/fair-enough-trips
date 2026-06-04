import { renderHook } from '@testing-library/react';
import { useScrollDown } from './useScrollDown';

describe('useScrollDown', () => {
  let originalScrollTo: typeof window.scrollTo;

  beforeEach(() => {
    originalScrollTo = window.scrollTo;
    window.scrollTo = jest.fn();
    
    // Create a mock element to be scrolled to
    const targetElement = document.createElement('div');
    targetElement.id = 'target-section';
    Object.defineProperty(targetElement, 'offsetTop', { value: 500 });
    document.body.appendChild(targetElement);
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
    document.body.innerHTML = '';
  });

  it('scrolls window to the correct offset', () => {
    const { result } = renderHook(() => useScrollDown('target-section'));
    const scrollDown = result.current;

    scrollDown();

    // offsetTop (500) - navbarMargin (60) - listTitleTopMargin (20) = 420
    expect(window.scrollTo).toHaveBeenCalledWith(0, 420);
  });

  it('does not crash if element is not found (scrolls to NaN)', () => {
    const { result } = renderHook(() => useScrollDown('non-existent'));
    const scrollDown = result.current;

    expect(() => scrollDown()).not.toThrow();
    // offsetTop evaluates to undefined, undefined - 80 is NaN
    expect(window.scrollTo).toHaveBeenCalledWith(0, NaN);
  });
});
