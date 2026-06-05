import { createMocks } from 'node-mocks-http';
import searchHandler from 'pages/api/search';
import { getLatestPosts } from 'server/shared/posts';

jest.mock('server/shared/posts', () => ({
  getLatestPosts: jest.fn(),
}));

describe('/api/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and formatted search results based on searchTerm', async () => {
    const mockPosts = [
      {
        id: 'post-1',
        title: 'Post 1',
        postDate: '2023-01-01',
        base64Image: 'base64-1',
        category: { region: [], country: [], activity: [] },
        shortDescription: 'Short 1',
      },
      {
        id: 'post-2',
        title: 'Post 2',
        postDate: '2023-02-01',
        base64Image: 'base64-2',
        category: { region: ['r1'], country: ['c1'], activity: ['a1'] },
        shortDescription: 'Short 2',
      },
    ];

    (getLatestPosts as jest.Mock).mockResolvedValue(mockPosts);

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        searchTerm: 'test',
      },
    });

    await searchHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    
    expect(data).toHaveLength(2);
    expect(data[0]).toEqual({
      id: 'post-1',
      title: 'Post 1',
      postDate: '2023-01-01',
      base64Image: 'base64-1',
      category: { region: [], country: [], activity: [] },
    });

    // Check if getLatestPosts was called with the correct query
    expect(getLatestPosts).toHaveBeenCalledTimes(1);
    const [query, limit] = (getLatestPosts as jest.Mock).mock.calls[0];
    
    expect(query).toHaveProperty('$or');
    expect(query.$or).toHaveLength(3);
    expect(query).toHaveProperty('parentId', { $exists: false });
    expect(limit).toBe(25);
  });

  it('should handle errors gracefully (currently just catches them)', async () => {
    (getLatestPosts as jest.Mock).mockRejectedValue(new Error('DB Error'));

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        searchTerm: 'test',
      },
    });

    await searchHandler(req, res);
    
    // The current implementation has an empty catch block, so it doesn't return an error response
    // It basically hangs or ends without res.json() being called in the catch
    // Depending on what you want, it might be good to update the API route later.
    // We just verify it doesn't crash the test.
    expect(res._isEndCalled()).toBeFalsy(); 
  });
});
