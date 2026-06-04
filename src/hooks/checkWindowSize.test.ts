import { renderHook } from '@testing-library/react';
import { checkWindowSize } from './checkWindowSize';

// The hook imports Breakpoints from styles/variables/breakpoints
// We must mock the actual object being imported
jest.mock('styles/variables/breakpoints', () => ({
  Breakpoints: {
    S: 768,
    M: 1024,
  }
}));

describe('checkWindowSize', () => {
  beforeEach(() => {
    // Reset innerWidth before each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });
  });

  it('should return all false if isEnabled is false', () => {
    const { result } = renderHook(() => checkWindowSize({ isEnabled: false }));
    expect(result.current).toEqual({
      isMobile: false,
      isTablet: false,
      isDesktop: true, // The hook defaults to desktop if not enabled
    });
  });

  it('should detect mobile size', () => {
    window.innerWidth = 500; // <= 768 (S)
    const { result } = renderHook(() => checkWindowSize({ isEnabled: true }));
    expect(result.current).toEqual({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
    });
  });

  it('should detect tablet size', () => {
    window.innerWidth = 800; // > 768 and <= 1024 (M)
    const { result } = renderHook(() => checkWindowSize({ isEnabled: true }));
    expect(result.current).toEqual({
      isMobile: false,
      isTablet: true,
      isDesktop: false,
    });
  });

  it('should detect desktop size', () => {
    window.innerWidth = 1300; // > 1024 (M)
    const { result } = renderHook(() => checkWindowSize({ isEnabled: true }));
    expect(result.current).toEqual({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    });
  });
});
