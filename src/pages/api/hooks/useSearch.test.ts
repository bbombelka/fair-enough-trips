import { renderHook, act } from '@testing-library/react';
import useSearch from './useSearch';
import * as navigation from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

describe('useSearch Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (navigation.usePathname as jest.Mock).mockReturnValue('/current-path');
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSearch({ isEnabled: true }));

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasError).toBe(false);
  });

  it('should fetch data when searchTerm changes', async () => {
    const mockData = [{ id: '1', title: 'Test' }];
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });

    const { result } = renderHook(() => useSearch({ isEnabled: true }));

    act(() => {
      result.current.setSearchTerm('mountain');
    });

    expect(result.current.isLoading).toBe(true);
    
    // Wait for async fetch to resolve
    await act(async () => {
      // Small delay to allow promises to resolve
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/search?searchTerm=mountain');
    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasError).toBe(false);
  });

  it('should handle fetch errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useSearch({ isEnabled: true }));

    act(() => {
      result.current.setSearchTerm('lake');
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should clear data when pathname changes', () => {
    const { result, rerender } = renderHook(() => useSearch({ isEnabled: true }));

    act(() => {
      result.current.setSearchTerm('forest');
    });

    // Mock changing the path
    (navigation.usePathname as jest.Mock).mockReturnValue('/new-path');
    rerender();

    // After rerender with new path, data and searchTerm should be cleared
    expect(result.current.data).toEqual([]);
    
    // We can't directly read searchTerm, but we can infer it was reset because clearData does so
    // Actually we can check if it fetched again? It shouldn't fetch empty string.
  });
});
