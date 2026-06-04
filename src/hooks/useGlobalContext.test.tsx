import React from 'react';
import { renderHook } from '@testing-library/react';
import { useGlobalContext } from './useGlobalContext';
import { GlobalContext } from 'context/global/GlobalContextController';

describe('useGlobalContext', () => {
  it('throws an error when used outside of GlobalContextController', () => {
    // Suppress console.error for expected thrown errors in React
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useGlobalContext())).toThrow(
      'useGlobalContext must be used within a GlobalContextController'
    );

    consoleSpy.mockRestore();
  });

  it('returns context value when used within GlobalContextController', () => {
    const mockContextValue = {
      currentImage: 'test.jpg',
      setCurrentImage: jest.fn(),
      showModal: false,
      setOpenModal: jest.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GlobalContext.Provider value={mockContextValue}>
        {children}
      </GlobalContext.Provider>
    );

    const { result } = renderHook(() => useGlobalContext(), { wrapper });

    expect(result.current).toEqual(mockContextValue);
  });
});
