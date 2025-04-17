import React from "react";
import { DistanceGraphPoint } from "../DistanceGraph.types";
import { DistanceGraph } from "./DistanceGraph";

export const DistanceGraphContainer = () => {
  const data: DistanceGraphPoint[] = [
    { name: "Aljažev dom v Vratih", type: "parking", elevationGain: 0, index: 0, timeElapsed: 0, distance: 0.0, altitude: 1015 },
    { name: "Luknja", type: "pass", elevationGain: 750, index: 1, timeElapsed: 4500000, distance: 3.245, altitude: 1465 },
    {
      name: "Plemenice",
      type: "peak",
      elevationGain: 1250,
      index: 2,
      timeElapsed: 13500000,
      distance: 5.78,
      altitude: 2265,
      images: ["luknja_pass_ascent", "triglav_plemenice_ferrata"],
      paragraphs: [2, 3],
      path: {
        difficulty: "II / C",
        name: "Čez Plemenice",
        images: ["luknja_pass_ascent", "triglav_plemenice_ferrata"],
        paragraphs: [2, 3],
      },
    },
    {
      name: "Triglav (2864m)",
      type: "peak",
      elevationGain: 1850,
      index: 3,
      timeElapsed: 23400000,
      distance: 8.92,
      altitude: 2864,
      path: {
        difficulty: "II / C",
        name: "Čez Plemenice",
        images: ["luknja_pass_ascent", "triglav_plemenice_ferrata"],
        paragraphs: [2, 3],
      },
    },
    {
      name: "Mali Triglav (2739m)",
      type: "peak",
      elevationGain: 1950,
      index: 4,
      timeElapsed: 20700000,
      distance: 7.65,
      altitude: 2739,
    },
    {
      name: "Triglavski dom na Kredarici",
      type: "hut",
      elevationGain: 1950,
      index: 5,
      timeElapsed: 18900000,
      distance: 6.43,
      altitude: 2515,
    },
    {
      name: "Kredarica (2541m)",
      type: "peak",
      elevationGain: 2050,
      index: 6,
      timeElapsed: 17100000,
      distance: 5.89,
      altitude: 2541,
    },
    {
      name: "Tominškova Pot / Pot Čez Prag",
      type: "signpost",
      elevationGain: 2050,
      index: 7,
      timeElapsed: 9000000,
      distance: 2.34,
      altitude: 1320,
    },
    {
      name: "Aljažev dom v Vratih",
      type: "parking",
      elevationGain: 2050,
      index: 8,
      timeElapsed: 26100000,
      distance: 10.5,
      altitude: 1015,
    },
  ];

  return <DistanceGraph points={data} />;
};
