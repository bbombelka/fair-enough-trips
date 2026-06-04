import { renderHook } from '@testing-library/react';
import { useSlickSettings } from './useSlickSettings';
import { useWindowSize } from './useWindowSize';

jest.mock('./useWindowSize');

describe('useSlickSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns desktop settings when not mobile', () => {
    (useWindowSize as jest.Mock).mockReturnValue({ isMobile: false });
    
    const { result } = renderHook(() => useSlickSettings({ currentImageIndex: 2 }));
    
    expect(result.current.slickSettings.slidesToShow).toBe(2);
    expect(result.current.slickSettings.vertical).toBe(true);
    expect(result.current.slickSettings.initialSlide).toBe(2);
  });

  it('returns mobile settings when is mobile', () => {
    (useWindowSize as jest.Mock).mockReturnValue({ isMobile: true });
    
    const { result } = renderHook(() => useSlickSettings({ currentImageIndex: -1 }));
    
    expect(result.current.slickSettings.slidesToShow).toBe(1);
    expect(result.current.slickSettings.vertical).toBeUndefined();
    expect(result.current.slickSettings.initialSlide).toBe(0);
  });

  it('always returns valid modal and video settings', () => {
    (useWindowSize as jest.Mock).mockReturnValue({ isMobile: false });
    
    const { result } = renderHook(() => useSlickSettings({ currentImageIndex: 0 }));
    
    expect(result.current.slickSettingsModal.slidesToShow).toBe(1);
    expect(result.current.videosSlickSettings.slidesToShow).toBe(1);
  });
});
