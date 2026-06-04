import { renderHook, act } from '@testing-library/react';
import useSessionStorage from './useSessionStorage';

describe('useSessionStorage Hook', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should initialize with initial value if not in storage', () => {
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('initial');
  });

  it('should initialize with stored value if it exists', () => {
    window.sessionStorage.setItem('test-key', JSON.stringify('stored'));
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('stored');
  });

  it('should return undefined if no initial value and not in storage', () => {
    const { result } = renderHook(() => useSessionStorage('test-key'));
    expect(result.current[0]).toBeUndefined();
  });

  it('should update state and session storage', () => {
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(window.sessionStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  it('should handle function updates', () => {
    const { result } = renderHook(() => useSessionStorage('count', 0));
    
    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(window.sessionStorage.getItem('count')).toBe(JSON.stringify(1));
  });

  it('should return initialValue if parsing stored value fails', () => {
    window.sessionStorage.setItem('bad-json', '{ invalid json');
    const { result } = renderHook(() => useSessionStorage('bad-json', 'initial'));
    expect(result.current[0]).toBe('initial');
  });
});
