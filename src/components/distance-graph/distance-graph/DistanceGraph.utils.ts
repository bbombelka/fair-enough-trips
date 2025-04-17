import { DistanceGraphPoint, MappedDistanceGraphPoint, DistanceChartModes } from "../DistanceGraph.types";

export const mapXAxisData =
  (chartMode: DistanceChartModes) =>
  (graphPoint: DistanceGraphPoint, index: number): MappedDistanceGraphPoint => {
    switch (chartMode) {
      case DistanceChartModes.BASIC:
        return { ...graphPoint, xAxisData: index };
      case DistanceChartModes.DISTANCE:
        return { ...graphPoint, xAxisData: graphPoint.distance };
      case DistanceChartModes.ELEVATION:
        return { ...graphPoint, xAxisData: graphPoint.elevationGain };
      case DistanceChartModes.TIME:
        return { ...graphPoint, xAxisData: graphPoint.timeElapsed };
      default: {
        return { ...graphPoint, xAxisData: index };
      }
    }
  };

export const getMaxDomainValue = (chartMode: DistanceChartModes, points: DistanceGraphPoint[]): number => {
  switch (chartMode) {
    case DistanceChartModes.BASIC:
      return points.length - 1;
    case DistanceChartModes.DISTANCE:
      return Math.max(...points.map((p) => p.distance));
    case DistanceChartModes.ELEVATION:
      return Math.max(...points.map((p) => p.elevationGain));
    case DistanceChartModes.TIME:
      return Math.max(...points.map((p) => p.timeElapsed));
    default: {
      return points.length - 1;
    }
  }
};

export const formatTimeElapsed = (ms: number): string => {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}h:${minutes.toString().padStart(2, "0")}m`;
};
