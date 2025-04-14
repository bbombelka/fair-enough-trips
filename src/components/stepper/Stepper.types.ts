import { PoiType } from "pages/api/parse-gpx";

export type DistanceGraphPoint = {
  distance: number;
  altitude: number;
  name: string;
  type: PoiType;
  time: string;
  description: string;
  images: string[];
  paragraphs: number[];
  path?: PathData;
};

export type PathData = {
  difficulty: string;
  name?: string;
  images: string[];
  paragraphs: number[];
};
