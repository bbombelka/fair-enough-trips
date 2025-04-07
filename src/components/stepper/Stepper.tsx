import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useGPXData } from "pages/api/hooks/useGpxData";

const DistanceGraph = ({ points }) => {
  const svgRef = useRef(null);
  const width = 1200;
  const height = 100;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous SVG content

    const maxDistance = Math.max(...points.map((p) => p.distance));
    const scale = d3
      .scaleLinear()
      .domain([0, maxDistance])
      .range([40, width - 40]);

    // Draw base line
    svg
      .append("line")
      .attr("x1", scale(0))
      .attr("y1", height / 2)
      .attr("x2", scale(maxDistance))
      .attr("y2", height / 2)
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    // Draw milestone circles
    svg
      .selectAll("circle")
      .data(points)
      .enter()
      .append("circle")
      .attr("cx", (d) => scale(d.distance))
      .attr("cy", height / 2)
      .attr("r", 5)
      .attr("stroke-width", 1);

    // Draw milestone labels
    svg
      .selectAll("text.label")
      .data(points)
      .enter()
      .append("text")
      .attr("x", (d) => scale(d.distance))
      .attr("y", (d, i) => (i % 2 === 0 ? height / 2 - 20 : height / 2 + 35))
      .attr("text-anchor", "middle")
      .text((d) => d.name)
      .style("font-size", "12px")
      .style("fill", "#333");

    // Add section labels between each point
    points.forEach((point, index) => {
      if (index < points.length - 1) {
        const midX = (scale(point.distance) + scale(points[index + 1].distance)) / 2;
        svg
          .append("text")
          .attr("x", midX)
          .attr("y", height - 60)
          // .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .text("II"); // difficulty
      }
    });
  }, [points]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

const DistanceGraphContainer = () => {
  const { data } = useGPXData({ isEnabled: true, id: "triglav-plemenice" });

  const distanceGraphPoints = data?.trackPoints
    .filter((p) => p.poi)
    .map((p) => ({
      distance: p.distance,
      altitude: p.altitude,
      name: p.poi?.name,
      type: p.poi?.type,
      time: "04:20",
      difficulty: "A",
    }));

  return (
    <div>
      <DistanceGraph points={distanceGraphPoints} />
    </div>
  );
};

export default DistanceGraphContainer;
