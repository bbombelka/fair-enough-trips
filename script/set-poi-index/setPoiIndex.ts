import { Parser } from "xml2js";
import haversineDistance from "haversine-distance";
import unzipper from "unzipper";
import { readFile, writeFile } from "fs/promises";

type Coords = {
  lat: number;
  lon: number;
};

// improve typing !!!

export default async function setPoiIndex(zipFilePath: string, jsonFilePath: string) {
  console.log("Running setPoiIndex for " + zipFilePath);

  try {
    const jsonFile = await readFile(jsonFilePath, "utf-8");
    const poiData = JSON.parse(jsonFile);

    if (poiData?.every((point: any) => point.index !== 0)) {
      console.log(jsonFilePath + " Index already set - exiting ...");

      return;
    }

    const parser = new Parser();
    const directory = await unzipper.Open.file(zipFilePath);
    const gpxFile = await directory.files[0].buffer();

    const result = await parser.parseStringPromise(gpxFile);

    const coordinates: Coords[] = result.gpx.trk[0].trkseg[0].trkpt.map((pt: any) => {
      const lon = parseFloat(pt.$.lon);
      const lat = parseFloat(pt.$.lat);
      return {
        lat,
        lon,
      };
    });

    const poiDataToWrite: any[] = [];

    poiData.forEach((poi: any) => {
      const nearestIndex = findNearestCordsIndex({ lat: poi.lat, lon: poi.lon }, coordinates);
      console.log(nearestIndex);
      poiDataToWrite.push({ ...poi, index: nearestIndex });
    });

    await writeFile(jsonFilePath, JSON.stringify(poiDataToWrite));

    console.log("Operation successful for " + jsonFilePath);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
  }
}

function findNearestCordsIndex(target: Coords, coordinates: Coords[]) {
  const distances = coordinates.map((coords) => haversineDistance(target, coords));
  return distances.indexOf(Math.min(...distances));
}
