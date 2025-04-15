import { PoiType } from "pages/api/parse-gpx";

export type DistanceGraphPoint = {
  distance: number;
  altitude: number;
  name: string;
  type: PoiType;
  timeElapsed: string;
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
