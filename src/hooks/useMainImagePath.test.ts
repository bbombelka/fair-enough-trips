import { renderHook, act } from '@testing-library/react';
import { useMainImagePath } from './useMainImagePath';
import { checkWindowSize } from './checkWindowSize';
import { useIsMounted } from './useIsMounted';

jest.mock('./checkWindowSize');
jest.mock('./useIsMounted');
jest.mock('Config', () => ({
  DEFAULT_IMAGE_EXTENSION: 'webp'
}));

describe('useMainImagePath', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useIsMounted as jest.Mock).mockReturnValue(true);
  });

  it('returns empty string if no id provided', () => {
    (checkWindowSize as jest.Mock).mockReturnValue({ isMobile: false });
    const { result } = renderHook(() => useMainImagePath({ isMainPostCard: true, id: '' }));
    
    expect(result.current.src).toBe('');
  });

  it('returns desktop path for main post card', () => {
    (checkWindowSize as jest.Mock).mockReturnValue({ isMobile: false });
    const { result } = renderHook(() => useMainImagePath({ isMainPostCard: true, id: 'test-id' }));
    
    expect(result.current.src).toBe('/content/posts/test-id/main.webp');
  });

  it('returns mobile path for main post card on mobile', () => {
    (checkWindowSize as jest.Mock).mockReturnValue({ isMobile: true });
    const { result } = renderHook(() => useMainImagePath({ isMainPostCard: true, id: 'test-id' }));
    
    expect(result.current.src).toBe('/content/posts/test-id/mobile-main.webp');
  });

  it('returns thumb path for regular post card', () => {
    (checkWindowSize as jest.Mock).mockReturnValue({ isMobile: false });
    const { result } = renderHook(() => useMainImagePath({ isMainPostCard: false, id: 'test-id' }));
    
    expect(result.current.src).toBe('/content/posts/test-id/thumb_main.webp');
  });

  it('returns regular path if error is set in thumb card', () => {
    (checkWindowSize as jest.Mock).mockReturnValue({ isMobile: false });
    const { result } = renderHook(() => useMainImagePath({ isMainPostCard: false, id: 'test-id' }));
    
    act(() => {
      result.current.setError(true);
    });

    expect(result.current.src).toBe('/content/posts/test-id/main.webp');
  });
});
