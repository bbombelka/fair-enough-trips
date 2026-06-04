import { renderHook } from '@testing-library/react';
import { useServiceWorker } from './useServiceWorker';

describe('useServiceWorker', () => {
  const originalNavigator = global.navigator;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    });
  });

  it('registers service worker if supported', async () => {
    const mockRegister = jest.fn().mockResolvedValue({ installing: true });
    
    Object.defineProperty(global, 'navigator', {
      value: {
        serviceWorker: { register: mockRegister }
      },
      writable: true,
    });

    renderHook(() => useServiceWorker());

    // Wait for microtasks
    await Promise.resolve();

    expect(mockRegister).toHaveBeenCalledWith('/sw.js');
    expect(console.log).toHaveBeenCalledWith('Service worker installing');
  });

  it('does nothing if service worker is not supported', async () => {
    Object.defineProperty(global, 'navigator', {
      value: {}, // no serviceWorker
      writable: true,
    });

    renderHook(() => useServiceWorker());

    await Promise.resolve();
    
    // Just verify it doesn't crash
  });

  it('logs error if registration fails', async () => {
    const mockRegister = jest.fn().mockRejectedValue(new Error('SW failed'));
    
    Object.defineProperty(global, 'navigator', {
      value: {
        serviceWorker: { register: mockRegister }
      },
      writable: true,
    });

    renderHook(() => useServiceWorker());

    await Promise.resolve();

    expect(console.error).toHaveBeenCalledWith('Registration failed with Error: SW failed');
  });
});
