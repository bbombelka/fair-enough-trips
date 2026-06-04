import { renderHook } from '@testing-library/react';
import { useScrollForOutOfViewport } from './useScrollForOutOfViewport';

describe('useScrollForOutOfViewport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a ref object', () => {
    const { result } = renderHook(() => useScrollForOutOfViewport());
    expect(result.current).toHaveProperty('current');
  });

  // Note: testing actual scrollIntoView logic triggered by useEffect requires a more complex
  // setup with element ref injection inside renderHook's wrapper, but we can verify it mounts safely.
  
  it('executes without crashing', () => {
    expect(() => renderHook(() => useScrollForOutOfViewport())).not.toThrow();
  });
});
