import { renderHook } from '@testing-library/react';
import { useBreadcrumbs } from './useBreadcrumbs';

jest.mock('enums/categories', () => ({
  Activities: [{ code: 'hike', name: 'Hiking', url: 'hiking' }],
  Regions: [{ code: 'alps', name: 'Alps', url: 'alps' }],
  Countries: [],
}));

describe('useBreadcrumbs', () => {
  it('should return mapped breadcrumb objects', () => {
    const mockCategory = { activity: ['hike'], region: ['alps'], country: ['it'] };
    
    const { result } = renderHook(() => useBreadcrumbs(mockCategory));
    
    expect(result.current).toEqual([
      { name: 'Alps', url: 'regions/alps' },
      { name: 'Hiking', url: 'activity/hiking' },
    ]);
  });

  it('should handle undefined mappings', () => {
    const mockCategory = { activity: ['unknown'], region: ['unknown'], country: [] };
    
    const { result } = renderHook(() => useBreadcrumbs(mockCategory));
    
    expect(result.current).toEqual([
      { name: undefined, url: 'regions/undefined' },
      { name: undefined, url: 'activity/undefined' },
    ]);
  });
});
