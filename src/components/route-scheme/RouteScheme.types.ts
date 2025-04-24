import { PoiType } from "pages/api/parse-gpx";

export type RouteSchemePoint = {
  distance: number;
  altitude: number;
  name: string;
  type: PoiType;
  timeElapsed: number;
  elevationGain: number;
  index: number;
  paragraphs?: number[];
  images?: string[];
  path?: PathData;
};

export type PathData = {
  difficulty: string;
  images: string[];
  paragraphs: number[];
  name?: string;
};

export type MappedRouteSchemePoint = RouteSchemePoint & { xAxisData: number };

export enum RouteSchemeChartModes {
  BASIC = "BASIC",
  DISTANCE = "DISTANCE",
  TIME = "TIME",
  ELEVATION = "ELEVATION",
}
