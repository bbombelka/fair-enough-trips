import fs from "fs";
import path from "path";
import os from "os";
import {
  parseCoordinates,
  resolvePoiDirectory,
  inspectExistingPoiFile,
  getNonCollidingFilePath,
  savePoiFile,
  Poi,
} from "../../script/create-poi/createPoi";

describe("create-poi module", () => {
  describe("parseCoordinates", () => {
    it("should parse standard comma-separated decimal coordinates", () => {
      const result = parseCoordinates("46.3769747, 13.8429506");
      expect(result).toEqual({ lat: 46.3769747, lon: 13.8429506 });
    });

    it("should parse coordinates without spaces after comma", () => {
      const result = parseCoordinates("46.3769747,13.8429506");
      expect(result).toEqual({ lat: 46.3769747, lon: 13.8429506 });
    });

    it("should parse space-separated coordinates", () => {
      const result = parseCoordinates("46.3769747 13.8429506");
      expect(result).toEqual({ lat: 46.3769747, lon: 13.8429506 });
    });

    it("should parse negative decimal coordinates", () => {
      const result = parseCoordinates("-46.3769747, -13.8429506");
      expect(result).toEqual({ lat: -46.3769747, lon: -13.8429506 });
    });

    it("should parse coordinates with N and E indicators", () => {
      const result1 = parseCoordinates("46.3769747N, 13.8429506E");
      expect(result1).toEqual({ lat: 46.3769747, lon: 13.8429506 });

      const result2 = parseCoordinates("46.3769747N,13.8429506E");
      expect(result2).toEqual({ lat: 46.3769747, lon: 13.8429506 });

      const result3 = parseCoordinates("46.3769747 N, 13.8429506 E");
      expect(result3).toEqual({ lat: 46.3769747, lon: 13.8429506 });
    });

    it("should parse coordinates with S and W indicators as negative numbers", () => {
      const result = parseCoordinates("46.3769747S, 13.8429506W");
      expect(result).toEqual({ lat: -46.3769747, lon: -13.8429506 });
    });

    it("should handle degree symbols", () => {
      const result = parseCoordinates("46.3769747° N, 13.8429506° E");
      expect(result).toEqual({ lat: 46.3769747, lon: 13.8429506 });
    });

    it("should handle longitude first if cardinal letters are present", () => {
      const result = parseCoordinates("13.8429506E, 46.3769747N");
      expect(result).toEqual({ lat: 46.3769747, lon: 13.8429506 });
    });

    it("should parse DMS format", () => {
      const result = parseCoordinates(`46°22'37.1"N, 13°50'34.6"E`);
      expect(result).toBeDefined();
      expect(result?.lat).toBeCloseTo(46.3769722, 5);
      expect(result?.lon).toBeCloseTo(13.8429444, 5);
    });

    it("should return null for invalid inputs", () => {
      expect(parseCoordinates("")).toBeNull();
      expect(parseCoordinates("invalid coords")).toBeNull();
      expect(parseCoordinates("10.0")).toBeNull();
      expect(parseCoordinates("95.0, 10.0")).toBeNull(); // lat > 90
      expect(parseCoordinates("10.0, 195.0")).toBeNull(); // lon > 180
      expect(parseCoordinates("-95.0, 10.0")).toBeNull(); // lat < -90
      expect(parseCoordinates("10.0, -195.0")).toBeNull(); // lon < -180
    });
  });

  describe("resolvePoiDirectory", () => {
    let tempRoot: string;
    let postsRoot: string;
    let createdPoiRoot: string;

    beforeEach(() => {
      tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "poi-dir-test-"));
      postsRoot = path.join(tempRoot, "posts");
      createdPoiRoot = path.join(tempRoot, "created-poi");
      fs.mkdirSync(postsRoot, { recursive: true });
      fs.mkdirSync(createdPoiRoot, { recursive: true });
    });

    afterEach(() => {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    });

    it("should return post directory if it exists under postsRoot", () => {
      const existingId = "my-post";
      fs.mkdirSync(path.join(postsRoot, existingId), { recursive: true });

      const resolved = resolvePoiDirectory(existingId, postsRoot, createdPoiRoot);
      expect(resolved).toBe(path.join(postsRoot, existingId));
    });

    it("should fallback to createdPoiRoot if post directory does not exist", () => {
      const nonExistingId = "new-post";
      const resolved = resolvePoiDirectory(nonExistingId, postsRoot, createdPoiRoot);
      expect(resolved).toBe(path.join(createdPoiRoot, nonExistingId));
    });
  });

  describe("inspectExistingPoiFile & getNonCollidingFilePath", () => {
    let tempDir: string;

    beforeEach(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "poi-file-test-"));
    });

    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it("should report non-existent file correctly", () => {
      const status = inspectExistingPoiFile(tempDir);
      expect(status.exists).toBe(false);
      expect(status.pois).toEqual([]);
    });

    it("should report empty file or [] as exists with empty pois", () => {
      const poiFile = path.join(tempDir, "poi.json");
      fs.writeFileSync(poiFile, "[]", "utf-8");

      const status = inspectExistingPoiFile(tempDir);
      expect(status.exists).toBe(true);
      expect(status.pois).toEqual([]);
    });

    it("should read existing pois if valid non-empty array", () => {
      const samplePois: Poi[] = [
        { name: "Hut", type: "hut", lat: 46.1, lon: 13.2, index: 0 },
      ];
      const poiFile = path.join(tempDir, "poi.json");
      fs.writeFileSync(poiFile, JSON.stringify(samplePois), "utf-8");

      const status = inspectExistingPoiFile(tempDir);
      expect(status.exists).toBe(true);
      expect(status.pois).toEqual(samplePois);
    });

    it("should find non-colliding file names", () => {
      fs.writeFileSync(path.join(tempDir, "poi.json"), "[]");
      expect(getNonCollidingFilePath(tempDir)).toBe(path.join(tempDir, "poi_1.json"));

      fs.writeFileSync(path.join(tempDir, "poi_1.json"), "[]");
      expect(getNonCollidingFilePath(tempDir)).toBe(path.join(tempDir, "poi_2.json"));
    });
  });

  describe("savePoiFile", () => {
    let tempDir: string;

    beforeEach(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "poi-save-test-"));
    });

    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it("should save formatted JSON file to disk", () => {
      const filePath = path.join(tempDir, "subfolder", "poi.json");
      const pois: Poi[] = [
        { name: "Parking", type: "parking", lat: 46.1234567, lon: 13.7654321, index: 0 },
      ];

      savePoiFile(filePath, pois);

      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, "utf-8");
      expect(JSON.parse(content)).toEqual(pois);
    });
  });
});
