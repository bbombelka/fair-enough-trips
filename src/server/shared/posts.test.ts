import { getLatestPosts, getPathsPosts } from './posts';

jest.mock('MongoClient', () => {
  return Promise.resolve({
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          project: jest.fn().mockReturnThis(),
          toArray: jest.fn().mockResolvedValue([{ id: 'test-post', postDate: new Date('2023-01-01T00:00:00Z') }]),
        }),
      })
    })
  });
});

describe('posts shared server utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'production';
  });

  it('getLatestPosts should fetch published posts in production', async () => {
    const posts = await getLatestPosts();
    expect(posts).toEqual([{ id: 'test-post', postDate: '2023-01-01T00:00:00.000Z' }]);
  });

  it('getPathsPosts should fetch paths', async () => {
    const paths = await getPathsPosts();
    expect(paths).toEqual([{ id: 'test-post', postDate: new Date('2023-01-01T00:00:00Z') }]);
  });
});
