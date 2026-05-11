import { Parser } from "xml2js";
import { NextApiRequest, NextApiResponse } from "next";
import haversineDistance from "haversine-distance";
import unzipper from "unzipper";

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

export type PoiType = "parking" | "water" | "peak" | "signpost" | "pass" | "hut" | "ferrata";

export type ErrorResponse = { status: string; error: string };

export default async function handler({ query, headers }: NextApiRequest, res: NextApiResponse<ParseGpxResponse | ErrorResponse>) {
  try {
    const protocol = headers["x-forwarded-proto"] || (headers.host?.includes("localhost") ? "http" : "https");
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${headers.host}`;

    const jsonUrl = `${baseUrl}/${query.id}/poi.json`;
    const zipUrl = `${baseUrl}/${query.id}/track.zip`;

    const jsonResponse = await fetch(jsonUrl);
    if (!jsonResponse.ok) throw new Error(`Failed to fetch ${jsonUrl}`);
    const poiData: PoiData[] = await jsonResponse.json();

    const zipResponse = await fetch(zipUrl);
    if (!zipResponse.ok) throw new Error(`Failed to fetch ${zipUrl}`);
    const zipBuffer = Buffer.from(await zipResponse.arrayBuffer());
    const directory = await unzipper.Open.buffer(zipBuffer);
    const gpxFile = await directory.files[0].buffer();

    const parser = new Parser();

    // parses XML file buffer into JS object
    parser.parseString(gpxFile, (err, result) => {
      if (err) {
        throw new Error("Error during parsing of the GPX file");
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
    return res.status(500).json({ status: "Failed to parse GPX", error: JSON.stringify(error) });
  }
}
