import { Parser } from "xml2js";
import { NextApiRequest, NextApiResponse } from "next";
import haversineDistance from "haversine-distance";
import unzipper from "unzipper";
import { readFile } from "fs/promises";

export interface TrackPoint {
  lat: number;
  lon: number;
  altitude: number;
  time: string;
  distance: number;
  poi?: {
    name: string;
    type: string;
  };
}

export type ParseGpxResponse = {
  trackPoints: TrackPoint[];
  misc: {
    highestAltitude: number;
    lowestAltitude: number;
  };
};

type PoiData = {
  name: string;
  lat: number;
  lon: number;
  index: number;
  type: PoiType;
};

type PoiType = "parking" | "water" | "peak" | "signpost" | "pass" | "hut" | "ferrata";

type ErrorResponse = { status: string; error: string };

export default async function handler({ query }: NextApiRequest, res: NextApiResponse<ParseGpxResponse | ErrorResponse>) {
  const zipFilePath = `./public/${query.id}/track.zip`;
  const jsonFilePath = `./public/${query.id}/poi.json`;

  try {
    const jsonFile = await readFile(jsonFilePath, "utf-8");
    const poiData: PoiData[] = JSON.parse(jsonFile);
    const directory = await unzipper.Open.file(zipFilePath);
    const gpxFile = await directory.files[0].buffer();

    const parser = new Parser();

    // parses XML file buffer into JS object
    parser.parseString(gpxFile, (err, result) => {
      if (err) {
        throw new Error("Error during parsing of " + zipFilePath + " file");
      }

      let totalDistance = 0;
      const trackPoints: TrackPoint[] = result.gpx.trk[0].trkseg[0].trkpt.map((pt: any, i: number, arr: any) => {
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

        return {
          altitude: parseFloat(pt.ele[0]),
          distance: getDistance(),
          lat,
          lon,
          time: pt.time ? new Date(pt.time[0]).toISOString() : null,
        };
      });

      const altitudePoints = trackPoints.map(({ altitude }) => altitude);
      const highestAltitude = Math.max(...altitudePoints);
      const lowestAltitude = Math.min(...altitudePoints);

      poiData.forEach((point) => {
        trackPoints[point.index].poi = point;
      });

      res.json({ trackPoints, misc: { lowestAltitude, highestAltitude } });
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: "Failed to parse GPX", error: JSON.stringify(error) });
  }
}
