import { mergeGpxFiles } from "../../build-post";
import { Parser } from "xml2js";
import fs from "fs";
import path from "path";
import os from "os";

describe("mergeGpxFiles", () => {
  let tempDir: string;
  let file1Path: string;
  let file2Path: string;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "build-post-test-"));
    file1Path = path.join(tempDir, "file1.gpx");
    file2Path = path.join(tempDir, "file2.gpx");

    const gpx1 = `<?xml version="1.0" encoding="utf-8"?>
<gpx version="1.1" creator="test-creator">
  <trk>
    <name>Track 1</name>
    <trkseg>
      <trkpt lat="10.0" lon="20.0">
        <ele>100</ele>
        <time>2026-01-01T10:00:00Z</time>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`;

    const gpx2 = `<?xml version="1.0" encoding="utf-8"?>
<gpx version="1.1" creator="test-creator-2">
  <trk>
    <name>Track 2</name>
    <trkseg>
      <trkpt lat="30.0" lon="40.0">
        <ele>200</ele>
        <time>2026-01-01T11:00:00Z</time>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`;

    fs.writeFileSync(file1Path, gpx1, "utf-8");
    fs.writeFileSync(file2Path, gpx2, "utf-8");
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("should merge track points from multiple GPX files sequentially into a single segment", async () => {
    const mergedXml = await mergeGpxFiles([file1Path, file2Path]);
    expect(mergedXml).toBeDefined();

    const parser = new Parser();
    const result = await parser.parseStringPromise(mergedXml);

    expect(result.gpx).toBeDefined();
    expect(result.gpx.trk).toBeDefined();
    expect(result.gpx.trk[0].trkseg).toBeDefined();
    
    const trackPoints = result.gpx.trk[0].trkseg[0].trkpt;
    expect(trackPoints).toHaveLength(2);

    expect(trackPoints[0].$.lat).toBe("10.0");
    expect(trackPoints[0].$.lon).toBe("20.0");
    expect(trackPoints[0].ele[0]).toBe("100");
    expect(trackPoints[0].time[0]).toBe("2026-01-01T10:00:00Z");

    expect(trackPoints[1].$.lat).toBe("30.0");
    expect(trackPoints[1].$.lon).toBe("40.0");
    expect(trackPoints[1].ele[0]).toBe("200");
    expect(trackPoints[1].time[0]).toBe("2026-01-01T11:00:00Z");
  });
});
