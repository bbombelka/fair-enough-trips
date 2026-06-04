import { renderHook } from '@testing-library/react';
import useClickAway from './useClickAway';

describe('useClickAway', () => {
  let mockCallback: jest.Mock;
  let mockRef: { current: HTMLElement | null };
  let targetElement: HTMLElement;
  let outsideElement: HTMLElement;

  beforeEach(() => {
    mockCallback = jest.fn();
    targetElement = document.createElement('div');
    outsideElement = document.createElement('div');
    document.body.appendChild(targetElement);
    document.body.appendChild(outsideElement);
    mockRef = { current: targetElement };
  });

  afterEach(() => {
    document.body.removeChild(targetElement);
    document.body.removeChild(outsideElement);
    jest.clearAllMocks();
  });

  it('should call callback when clicking outside the ref', () => {
    renderHook(() => useClickAway(mockRef, mockCallback));

    const event = new MouseEvent('mousedown', { bubbles: true });
    outsideElement.dispatchEvent(event);

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should not call callback when clicking inside the ref', () => {
    renderHook(() => useClickAway(mockRef, mockCallback));

    const event = new MouseEvent('mousedown', { bubbles: true });
    targetElement.dispatchEvent(event);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should not call callback if ref is null', () => {
    mockRef.current = null;
    renderHook(() => useClickAway(mockRef, mockCallback));

    const event = new MouseEvent('mousedown', { bubbles: true });
    outsideElement.dispatchEvent(event);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should not crash if no callback is provided', () => {
    renderHook(() => useClickAway(mockRef));

    const event = new MouseEvent('mousedown', { bubbles: true });
    outsideElement.dispatchEvent(event);

    // No expectation needed, just shouldn't throw error
  });
});
