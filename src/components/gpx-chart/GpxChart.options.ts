import wrap from "word-wrap";

export type Orientation = "up" | "down" | "up-elongated" | "down-elongated";

const POI_MUTUAL_MIN_DISTANCE = 100;

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

export const determineOrientation = (appliedOrientation: Orientation[], index: number) => {
  const previousPoiOrientation = appliedOrientation[index - 1];

  return previousPoiOrientation === "up" ? "down-elongated" : "up";
};

export const isBelowMinimalPoiDistance = (distance: number) => distance < POI_MUTUAL_MIN_DISTANCE;

export const splitPoiNames = (poiName?: string) => {
  if (!poiName) return [];

  return wrap(poiName, { width: 15, trim: true })
    .split("\n")
    .map((el) => el.trim());
};
