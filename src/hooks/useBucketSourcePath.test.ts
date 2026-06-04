import { renderHook } from '@testing-library/react';
import { useBucketSourcePath } from './useBucketSourcePath';
import Config from 'Config';

jest.mock('Config', () => ({
  S3_BUCKET: 'https://s3.bucket.com',
  DEFAULT_IMAGE_EXTENSION: 'webp'
}));

describe('useBucketSourcePath', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('generates prod params when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    const { result } = renderHook(() => useBucketSourcePath({ id: 'test-id', filename: 'test-img' }));

    expect(result.current).toEqual({
      src: 'https://s3.bucket.com/posts/test-id/test-img.webp',
      hdImageSrc: 'https://s3.bucket.com/posts/test-id/test-img-HD.webp'
    });
  });

  it('generates local upload params if not in prod and NEXT_PUBLIC_NEW_POST_ID is set', () => {
    process.env.NODE_ENV = 'development';
    process.env.NEXT_PUBLIC_NEW_POST_ID = 'test-id';
    
    const { result } = renderHook(() => useBucketSourcePath({ id: 'test-id', filename: 'test-img' }));
    
    expect(result.current).toEqual({
      src: 'test-id/test-img.webp',
      hdImageSrc: 'test-id/test-img-HD.webp'
    });
  });

  it('generates dev placeholder params if not in prod and no new post ID', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.NEXT_PUBLIC_NEW_POST_ID;
    
    const { result } = renderHook(() => useBucketSourcePath({ id: 'test-id', filename: 'test-img' }));
    
    expect(result.current).toEqual({
      src: '/placeholder.webp',
      hdImageSrc: '/placeholder.webp'
    });
  });
});
