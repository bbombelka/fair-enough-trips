import { Parser } from "xml2js";
import haversineDistance from "haversine-distance";
import unzipper from "unzipper";
import { readFile, writeFile } from "fs/promises";

type Coords = {
  lat: number;
  lon: number;
};

// improve typing !!!

const GPX_ELEVATION_INACCURACY_MARGIN = 7;

export default async function setPoiIndex(zipFilePath: string, jsonFilePath: string, poiId: string) {
  console.log("Running prepare route scheme for " + zipFilePath);

  try {
    const jsonFile = await readFile(jsonFilePath, "utf-8");
    const poiData = JSON.parse(jsonFile);
    const parser = new Parser();
    const directory = await unzipper.Open.file(zipFilePath);
    const gpxFile = await directory.files[0].buffer();
    const result = await parser.parseStringPromise(gpxFile);

    const maximumIndex = result.gpx.trk[0].trkseg[0].trkpt.length - 1;

    console.log("Maximum index is:" + maximumIndex);

    const nearestIndexes = poiData.map((e: any, index: number, arr: any[]) => {
      if (index === 0) {
        return 0;
      } else if (index === arr.length - 1) {
        return maximumIndex;
      } else return e.index;
    });

    const timeElapsedValues = calculateElapsedTime(result, nearestIndexes);
    const distanceValues = calculateDistance(result, nearestIndexes);
    const alitudeValues = getAltitude(result, nearestIndexes);
    const elevationGain = calculateAccumulatedElevationGain(result, nearestIndexes);

    const mappedData = poiData.map((poi: any, i: number) => ({
      type: poi.type,
      name: poi.name,
      index: poi.index,
      timeElapsed: timeElapsedValues[i],
      distance: parseInt(String(distanceValues[i])),
      altitude: alitudeValues[i],
      elevationGain: elevationGain[i],
    }));

    const dataToWrite = {
      id: poiId,
      published: false,
      points: mappedData,
    };

    await writeFile(process.cwd() + "/generated/" + poiId + ".json", JSON.stringify(dataToWrite));

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

function calculateElapsedTime(parseResult: any, nearestIndexes: number[]) {
  const result: number[] = parseResult.gpx.trk[0].trkseg[0].trkpt
    .filter((pt: any, i: number, arr: any) => {
      return nearestIndexes.includes(i);
    })
    .map((pt: any) => new Date(pt.time[0]).getTime())
    .map((timeInMs: number, i: number, arr: number[]) => {
      if (i === 0) {
        return 0;
      } else {
        return timeInMs - arr[0];
      }
    });

  return result;
}

function calculateDistance(parseResult: any, nearestIndexes: number[]) {
  let totalDistance = 0;
  const distancePoints: number[] = parseResult.gpx.trk[0].trkseg[0].trkpt
    .map((pt: any, i: number, arr: any) => {
      const lon = parseFloat(pt.$.lon);
      const lat = parseFloat(pt.$.lat);

      // this aggregates a total distance coming from Haversine equation which compares two sets of cooridinates
      const getDistance = () => {
        if (i === 0) {
          return 0;
        }

        const currentDistance = haversineDistance({ latitude: arr[i - 1].$.lat, longitude: arr[i - 1].$.lon }, { latitude: lat, longitude: lon });
        totalDistance += currentDistance;
        return totalDistance;
      };

      return getDistance();
    })
    .filter((pt: any, i: number, arr: any) => {
      return nearestIndexes.includes(i);
    });

  return distancePoints;
}

function getAltitude(parseResult: any, nearestIndexes: number[]) {
  return parseResult.gpx.trk[0].trkseg[0].trkpt.filter((e, i) => nearestIndexes.includes(i)).map((e) => parseInt(e.ele[0]));
}

function calculateAccumulatedElevationGain(parseResult: any, nearestIndexes: number[]) {
  const elevationData = parseResult.gpx.trk[0].trkseg[0].trkpt.map((e) => parseInt(e.ele));

  if (!elevationData || elevationData.length === 0) {
    return [];
  }

  const accumulatedGain = [0]; // First point has 0 gain

  for (let i = 1; i < elevationData.length; i++) {
    const prevElev = elevationData[i - 1];
    const currentElev = elevationData[i];

    if (currentElev > prevElev) {
      const gain = currentElev - prevElev;
      accumulatedGain.push(accumulatedGain[accumulatedGain.length - 1] + gain);
    } else {
      accumulatedGain.push(accumulatedGain[accumulatedGain.length - 1]);
    }
  }

  return accumulatedGain.filter((e, i) => nearestIndexes.includes(i)).map((e) => parseInt(String(e * ((100 - GPX_ELEVATION_INACCURACY_MARGIN) / 100))));
}

// this will evaluate against gpx file once again. Use when indexes are unset or incorrectly set.
function getNewNearestIndexes(result: any, poiData: any) {
  const coordinates: Coords[] = result.gpx.trk[0].trkseg[0].trkpt.map((pt: any) => {
    const lon = parseFloat(pt.$.lon);
    const lat = parseFloat(pt.$.lat);
    return {
      lat,
      lon,
    };
  });

  const nearestIndexes = poiData.map((poi: any) => {
    return findNearestCordsIndex({ lat: poi.lat, lon: poi.lon }, coordinates);
  });

  return nearestIndexes;
}
