import { Parser } from "xml2js";
import { NextApiRequest, NextApiResponse } from "next";

import unzipper from "unzipper";

interface TrackPoint {
  lat: number;
  lon: number;
  altitude: number;
  time: string;
}

export type ParseGpxResponse = {
  trackPoints: TrackPoint[];
  misc: {
    highestAltitude: number;
    lowestAltitude: number;
  };
};

type ErrorResponse = { status: string };

export default async function handler({ query }: NextApiRequest, res: NextApiResponse<ParseGpxResponse | ErrorResponse>) {
  const zipFilePath = `./public/${query.id}/track.zip`;
  try {
    const directory = await unzipper.Open.file(zipFilePath);
    const gpxFile = await directory.files[0].buffer();

    const parser = new Parser();

    // parses XML file buffer into JS object
    parser.parseString(gpxFile, (err, result) => {
      if (err) {
        throw new Error("Error during parsing of " + zipFilePath + " file");
      }

      const trackPoints: TrackPoint[] = result.gpx.trk[0].trkseg[0].trkpt.map((pt: any) => ({
        lat: parseFloat(pt.$.lat),
        lon: parseFloat(pt.$.lon),
        altitude: parseFloat(pt.ele[0]),
        time: pt.time ? new Date(pt.time[0]).toISOString() : null,
      }));

      const altitudePoints = trackPoints.map(({ altitude }) => altitude);
      const highestAltitude = Math.max(...altitudePoints);
      const lowestAltitude = Math.min(...altitudePoints);

      res.json({ trackPoints, misc: { lowestAltitude, highestAltitude } });
    });
  } catch (error) {
    return res.json({ status: "Failed to parse GPX" });
  }
}
