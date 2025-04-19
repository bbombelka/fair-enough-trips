import { DistanceGraphPoint } from "components/distance-graph/DistanceGraph.types";
import { NextApiRequest, NextApiResponse } from "next";
import getRouteSchemePoints from "server/shared/route-scheme-get";
import { ErrorResponse } from "./parse-gpx";

export type RouteSchemePointsResponse = {
  id: string;
  published: boolean;
  points: DistanceGraphPoint[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<RouteSchemePointsResponse | ErrorResponse>) {
  try {
    const schemePoints = await getRouteSchemePoints(req.query.id);

    return res.status(200).json(JSON.parse(JSON.stringify(schemePoints)));
  } catch (error) {
    return res.status(500).json({ status: "Failed to get scheme points", error: JSON.stringify(error) });
  }
}
