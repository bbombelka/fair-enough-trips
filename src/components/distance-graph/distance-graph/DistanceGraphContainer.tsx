import React from "react";
import { DistanceGraphPoint } from "../DistanceGraph.types";
import { DistanceGraph } from "./DistanceGraph";

export const DistanceGraphContainer = () => {
  //   const { data } = useGPXData({ isEnabled: true, id: "triglav-plemenice" });

  //   const distanceGraphPoints: DistanceGraphPoint[] =
  //     data?.trackPoints
  //       .filter((p) => p.poi)
  //       .map((p, i) => ({
  //         distance: i === 0 ? 0 : p.distance,
  //         altitude: p.altitude,
  //         name: p.poi?.name,
  //         type: p.poi?.type,
  //         time: "04:20",
  //         images: ["luknja_pass_ascent", "triglav_plemenice_ferrata"],
  //         paragraphs: [1, 2],
  //         path: i > 0 ? p.poi.path : undefined,
  //       })) ?? [];
  //   console.log(distanceGraphPoints);

  const data: DistanceGraphPoint[] = [
    { name: "Aljažev dom v Vratih", type: "parking", elevationGain: 0, index: 0, timeElapsed: "00:00", distance: 0.0, altitude: 1015 },
    { name: "Luknja", type: "pass", elevationGain: 450, index: 1, timeElapsed: "01:15", distance: 3.245, altitude: 1465 },
    {
      name: "Plemenice",
      type: "peak",
      elevationGain: 1250,
      index: 2,
      timeElapsed: "03:45",
      distance: 5.78,
      altitude: 2265,
      images: ["luknja_pass_ascent", "triglav_plemenice_ferrata"],
      paragraphs: [2, 3],
      path: { difficulty: "II / C", name: "Čez Plemenice", images: ["luknja_pass_ascent", "triglav_plemenice_ferrata"], paragraphs: [2, 3] },
    },
    {
      name: "Triglav (2864m)",
      type: "peak",
      elevationGain: 2050,
      index: 3,
      timeElapsed: "06:30",
      distance: 8.92,
      altitude: 2864,
      path: { difficulty: "II / C", name: "Čez Plemenice", images: ["luknja_pass_ascent", "triglav_plemenice_ferrata"], paragraphs: [2, 3] },
    },
    { name: "Mali Triglav (2739m)", type: "peak", elevationGain: 1950, index: 4, timeElapsed: "05:45", distance: 7.65, altitude: 2739 },
    { name: "Triglavski dom na Kredarici", type: "hut", elevationGain: 1800, index: 5, timeElapsed: "05:15", distance: 6.43, altitude: 2515 },
    { name: "Kredarica (2541m)", type: "peak", elevationGain: 1650, index: 6, timeElapsed: "04:45", distance: 5.89, altitude: 2541 },
    { name: "Tominškova Pot / Pot Čez Prag", type: "signpost", elevationGain: 750, index: 7, timeElapsed: "02:30", distance: 2.34, altitude: 1320 },
    { name: "Aljažev dom v Vratih", type: "parking", elevationGain: 0, index: 8, timeElapsed: "07:15", distance: 10.5, altitude: 1015 },
  ];

  return <DistanceGraph points={data} />;
};
