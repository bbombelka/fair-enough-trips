import { createMocks } from 'node-mocks-http';
import publishHandler from 'pages/api/publish';
import triggerDeployment from 'server/shared/trigger-deployment';
import mongoClientConnectPromise from 'MongoClient';

jest.mock('server/shared/trigger-deployment', () => jest.fn());
jest.mock('MongoClient', () => {
  return Promise.resolve({
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnThis(),
        project: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([{ id: 'post-1' }]),
        updateMany: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      })
    })
  });
});

describe('/api/publish', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CRON_SECRET = 'my-secret';
  });

  it('should return 401 if secret does not match', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { secret: 'wrong-secret' },
    });

    await publishHandler(req, res as any);

    expect(res._getStatusCode()).toBe(401);
  });

  it('should process database changes and trigger deployment', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { secret: 'my-secret' },
    });

    // We already mocked the DB to return [{ id: 'post-1' }]
    await publishHandler(req, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toBe('Deployment triggered');
    expect(triggerDeployment).toHaveBeenCalledTimes(1);
  });

  it('should return no deployment message if no records found', async () => {
    // Override the toArray mock for this specific test
    const mockDb = await mongoClientConnectPromise;
    (mockDb.db().collection().toArray as jest.Mock).mockResolvedValueOnce([]);

    const { req, res } = createMocks({
      method: 'GET',
      query: { secret: 'my-secret' },
    });

    await publishHandler(req, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toBe('No deployment happened');
    expect(triggerDeployment).not.toHaveBeenCalled();
  });
});
