import { renderHook } from '@testing-library/react';
import { useWindowSize } from './useWindowSize';
import { useIsMounted } from './useIsMounted';
import { checkWindowSize } from './checkWindowSize';

jest.mock('./useIsMounted');
jest.mock('./checkWindowSize');

describe('useWindowSize', () => {
  it('calls checkWindowSize with isMounted value', () => {
    (useIsMounted as jest.Mock).mockReturnValue(true);
    const mockSize = { isMobile: true, isTablet: false, isDesktop: false };
    (checkWindowSize as jest.Mock).mockReturnValue(mockSize);

    const { result } = renderHook(() => useWindowSize());

    expect(checkWindowSize).toHaveBeenCalledWith({ isEnabled: true });
    expect(result.current).toEqual(mockSize);
  });

  it('passes false to checkWindowSize if not mounted', () => {
    (useIsMounted as jest.Mock).mockReturnValue(false);
    const mockSize = { isMobile: false, isTablet: false, isDesktop: true };
    (checkWindowSize as jest.Mock).mockReturnValue(mockSize);

    const { result } = renderHook(() => useWindowSize());

    expect(checkWindowSize).toHaveBeenCalledWith({ isEnabled: false });
    expect(result.current).toEqual(mockSize);
  });
});
