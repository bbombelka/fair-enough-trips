import { renderHook, act } from '@testing-library/react';
import { useHasHash } from './useHasHash';
import { useIsMounted } from './useIsMounted';

jest.mock('./useIsMounted');

describe('useHasHash', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns false initially', () => {
    (useIsMounted as jest.Mock).mockReturnValue(true);
    const { result } = renderHook(() => useHasHash());
    expect(result.current).toBe(false);
  });

  it('does not add event listener if not mounted', () => {
    (useIsMounted as jest.Mock).mockReturnValue(false);
    
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    renderHook(() => useHasHash());
    
    expect(addEventListenerSpy).not.toHaveBeenCalledWith('hashchange', expect.any(Function));
    addEventListenerSpy.mockRestore();
  });

  it('updates state when hashchange event occurs', () => {
    (useIsMounted as jest.Mock).mockReturnValue(true);
    
    const { result } = renderHook(() => useHasHash());

    act(() => {
      const event = new HashChangeEvent('hashchange', { newURL: 'http://localhost/#section' });
      window.dispatchEvent(event);
    });

    expect(result.current).toBe(true);

    act(() => {
      const event = new HashChangeEvent('hashchange', { newURL: 'http://localhost/' });
      window.dispatchEvent(event);
    });

    expect(result.current).toBe(false);
  });
});
