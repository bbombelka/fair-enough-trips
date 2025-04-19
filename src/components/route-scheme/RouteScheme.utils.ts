import { RouteSchemePoint, MappedRouteSchemePoint, RouteSchemeChartModes } from "./RouteScheme.types";

export const mapXAxisData =
  (chartMode: RouteSchemeChartModes) =>
  (graphPoint: RouteSchemePoint, index: number): MappedRouteSchemePoint => {
    switch (chartMode) {
      case RouteSchemeChartModes.BASIC:
        return { ...graphPoint, xAxisData: index };
      case RouteSchemeChartModes.DISTANCE:
        return { ...graphPoint, xAxisData: graphPoint.distance };
      case RouteSchemeChartModes.ELEVATION:
        return { ...graphPoint, xAxisData: graphPoint.elevationGain };
      case RouteSchemeChartModes.TIME:
        return { ...graphPoint, xAxisData: graphPoint.timeElapsed };
      default: {
        return { ...graphPoint, xAxisData: index };
      }
    }
  };

export const getMaxDomainValue = (chartMode: RouteSchemeChartModes, points: RouteSchemePoint[]): number => {
  switch (chartMode) {
    case RouteSchemeChartModes.BASIC:
      return points.length - 1;
    case RouteSchemeChartModes.DISTANCE:
      return Math.max(...points.map((p) => p.distance));
    case RouteSchemeChartModes.ELEVATION:
      return Math.max(...points.map((p) => p.elevationGain));
    case RouteSchemeChartModes.TIME:
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
