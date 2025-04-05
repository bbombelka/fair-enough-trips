import { isMobileDevice } from "utils";
import wrap from "word-wrap";

export type Orientation = "up" | "down" | "up-elongated" | "down-elongated";

const POI_MUTUAL_MIN_DISTANCE = 100;
const POI_MUTUAL_MIN_DISTANCE_MOBILE = 50;

export const getOrientation = (xPos: number, yPos: number) => {
  const baseYOffset = 25;
  const orientation = {
    up: {
      line: {
        x1: xPos,
        x2: xPos,
        y1: yPos - 25,
        y2: yPos - baseYOffset - 20,
      },
      text: {
        x: xPos,
        y: yPos - baseYOffset - 30,
      },
      image: {
        x: xPos - 10,
        y: yPos - 20,
      },
    },
    ["up-elongated"]: {
      line: {
        x1: xPos,
        x2: xPos,
        y1: yPos - 25,
        y2: yPos - baseYOffset - 40,
      },
      text: {
        x: xPos,
        y: yPos - baseYOffset - 50,
      },
      image: {
        x: xPos - 10,
        y: yPos - 20,
      },
    },
    down: {
      line: {
        x1: xPos,
        x2: xPos,
        y1: yPos + 10,
        y2: yPos + baseYOffset + 20,
      },
      text: {
        x: xPos,
        y: yPos + baseYOffset + 30,
      },
      image: {
        x: xPos - 10,
        y: yPos - 20,
      },
    },
    ["down-elongated"]: {
      line: {
        x1: xPos,
        x2: xPos,
        y1: yPos + 10,
        y2: yPos + baseYOffset + 40,
      },
      text: {
        x: xPos,
        y: yPos + baseYOffset + 50,
      },
      image: {
        x: xPos - 10,
        y: yPos - 20,
      },
    },
  };

  return orientation;
};

export const determineOrientation = (appliedOrientation: Orientation[], index: number): Orientation => {
  const previousPoiOrientation = appliedOrientation[index - 1];

  switch (previousPoiOrientation) {
    case "up":
      return "down-elongated";
    case "down-elongated":
      return "up-elongated";
    case "up-elongated":
      return "down";
    case "down":
      return "up";
  }
};

export const isBelowMinimalPoiDistance = (distance: number) => distance < (isMobileDevice() ? POI_MUTUAL_MIN_DISTANCE_MOBILE : POI_MUTUAL_MIN_DISTANCE);

export const splitPoiNames = (poiName?: string) => {
  if (!poiName) return [];

  return wrap(poiName, { width: 15, trim: true })
    .split("\n")
    .map((el) => el.trim());
};

export const getChartDimensions = () => {
  const mobileDimensions = {
    width: 850,
    height: 400,
    margin: { top: 60, right: 35, bottom: 40, left: 35 },
  };

  const desktopDimensions = {
    width: 1200,
    height: 480,
    margin: { top: 75, right: 30, bottom: 50, left: 50 },
  };

  return isMobileDevice() ? mobileDimensions : desktopDimensions;
};

export const getTextGroupColor = (orientationType: Orientation): string => {
  switch (orientationType) {
    case "up":
    case "up-elongated":
      return "white";
    case "down":
    case "down-elongated":
      return "var(--color-grey)";
  }
};
