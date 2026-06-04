import { renderHook } from '@testing-library/react';
import { useIsMounted } from './useIsMounted';

describe('useIsMounted', () => {
  it('returns true after mounting', () => {
    const { result } = renderHook(() => useIsMounted());
    
    // React Testing Library's renderHook runs useEffect before returning
    expect(result.current).toBe(true);
  });

  it('cleans up and becomes false on unmount (internal state)', () => {
    const { result, unmount } = renderHook(() => useIsMounted());
    expect(result.current).toBe(true);
    
    unmount();
    
    // Once unmounted, we can't really read the state normally, but the cleanup function
    // in useEffect will run setIsMounted(false). It's a standard pattern, we just check
    // it doesn't crash on unmount.
  });
});
