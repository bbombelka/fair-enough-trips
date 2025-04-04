export type GPXChartProps = {
  id: string;
};

export type HoverData = {
  altitude: number;
  distance: number;
  lat: number;
  lon: number;
  time: string; // ISO 8601 format date string
  xPos: number;
  yPos: number;
};
