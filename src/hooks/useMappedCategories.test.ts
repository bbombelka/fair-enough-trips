import { renderHook } from '@testing-library/react';
import { useMappedCategoriesNames } from './useMappedCategories';

jest.mock('enums/categories', () => ({
  Activities: [{ code: 'hike', name: 'Hiking' }],
  Regions: [{ code: 'alps', name: 'Alps' }],
  Countries: [{ code: 'fr', name: 'France' }, { code: 'it', name: 'Italy' }],
}));

describe('useMappedCategoriesNames', () => {
  it('maps category names correctly', () => {
    const mockCategory = { activity: ['hike'], region: ['alps'], country: ['fr', 'it'] };
    
    const { result } = renderHook(() => useMappedCategoriesNames(mockCategory));
    
    expect(result.current).toEqual([
      ['Hiking'],
      ['Alps'],
      ['France', 'Italy'],
    ]);
  });

  it('handles empty category arrays', () => {
    const mockCategory = { activity: [], region: [], country: [] };
    const { result } = renderHook(() => useMappedCategoriesNames(mockCategory));
    
    expect(result.current).toEqual([
      ['Activity'],
      ['Region'],
      ['Country'],
    ]);
  });
});
