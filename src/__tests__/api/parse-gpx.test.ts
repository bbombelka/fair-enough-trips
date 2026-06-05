import { createMocks } from 'node-mocks-http';
import parseGpxHandler from 'pages/api/parse-gpx';
import unzipper from 'unzipper';

jest.mock('unzipper', () => ({
  Open: {
    buffer: jest.fn(),
  },
}));

describe('/api/parse-gpx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('should return 500 if id is missing or fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    const { req, res } = createMocks({
      method: 'GET',
      query: { id: 'test-id' },
    });

    await parseGpxHandler(req, res as any);

    expect(res._getStatusCode()).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe('Failed to parse GPX');
  });

  it('should parse GPX from zip and return track points', async () => {
    const mockPoiData = [{ index: 0, name: 'Start', type: 'parking', lat: 45.0, lon: 10.0 }];
    
    const mockGpxData = `
      <gpx>
        <trk>
          <trkseg>
            <trkpt lat="45.0" lon="10.0">
              <ele>100</ele>
            </trkpt>
            <trkpt lat="45.1" lon="10.1">
              <ele>200</ele>
            </trkpt>
          </trkseg>
        </trk>
      </gpx>
    `;

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockPoiData),
      }) // json fetch
      .mockResolvedValueOnce({
        ok: true,
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
      }); // zip fetch

    (unzipper.Open.buffer as jest.Mock).mockResolvedValue({
      files: [
        {
          buffer: jest.fn().mockResolvedValue(Buffer.from(mockGpxData)),
        },
      ],
    });

    const { req, res } = createMocks({
      method: 'GET',
      query: { id: 'test-id' },
    });

    await parseGpxHandler(req, res as any);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('misc');
    expect(data).toHaveProperty('trackPoints');
    expect(data.trackPoints).toHaveLength(2);
    expect(data.trackPoints[0].altitude).toBe(100);
    expect(data.trackPoints[0].poi).toEqual(mockPoiData[0]);
    expect(data.trackPoints[1].altitude).toBe(200);
    expect(data.misc.lowestAltitude).toBe(100);
    expect(data.misc.highestAltitude).toBe(200);
  });
});
