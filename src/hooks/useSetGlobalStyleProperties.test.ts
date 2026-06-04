import { renderHook } from '@testing-library/react';
import { useSetGlobalStyleProperties } from './useSetGlobalStyleProperties';
import { NAVBAR_HEIGHT } from 'styles/variables/navbar-constants';

describe('useSetGlobalStyleProperties', () => {
  it('sets the CSS variable on document body', () => {
    const setPropertySpy = jest.spyOn(document.body.style, 'setProperty');
    
    renderHook(() => useSetGlobalStyleProperties());

    expect(setPropertySpy).toHaveBeenCalledWith('--navbar-height', `${NAVBAR_HEIGHT}px`);
    
    setPropertySpy.mockRestore();
  });
});
