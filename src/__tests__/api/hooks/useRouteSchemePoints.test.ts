import { renderHook, act } from '@testing-library/react';
import useRouteSchemePoints from 'hooks/useRouteSchemePoints';

describe('useRouteSchemePoints Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ points: [] }),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize correctly when not enabled', () => {
    const { result } = renderHook(() => useRouteSchemePoints({ isEnabled: false, id: '1' }));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasError).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should fetch data when enabled', async () => {
    const mockData = { points: [{ lat: 10, lon: 10 }] };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const { result } = renderHook(() => useRouteSchemePoints({ isEnabled: true, id: 'post-1' }));

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/route-scheme-points?id=post-1');
    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasError).toBe(false);
  });

  it('should handle fetch errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useRouteSchemePoints({ isEnabled: true, id: 'post-1' }));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.isLoading).toBe(false); 
  });
});
