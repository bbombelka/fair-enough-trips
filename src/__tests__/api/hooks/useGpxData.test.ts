import { renderHook, act } from '@testing-library/react';
import useGpxData from 'hooks/useGpxData';
import useSessionStorage from 'hooks/useSessionStorage';

jest.mock('hooks/useSessionStorage');

describe('useGpxData Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a mock implementation that behaves like useState
    (useSessionStorage as jest.Mock).mockImplementation((key, initialValue) => {
      const React = require('react');
      return React.useState(initialValue);
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ trackPoints: [] }),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize correctly when not enabled', () => {
    const { result } = renderHook(() => useGpxData({ isEnabled: false, id: '1' }));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasError).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should fetch data when enabled', async () => {
    const mockData = { trackPoints: [{ distance: 10 }] };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const { result } = renderHook(() => useGpxData({ isEnabled: true, id: 'post-1' }));

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/parse-gpx?id=post-1');
    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasError).toBe(false);
  });

  it('should handle fetch errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useGpxData({ isEnabled: true, id: 'post-1' }));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.isLoading).toBe(false); 
  });
});
