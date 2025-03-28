import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useGPXData } from "pages/api/hooks/useGpxData";
import { TrackPoint } from "pages/api/parse-gpx";

type GPXChartProps = {
  id: string;
};

export function GPXChart({ id }: GPXChartProps) {
  const { data } = useGPXData({ isEnabled: true, id });
  const trackData = data?.trackPoints;
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [hoverData, setHoverData] = useState<TrackPoint | null>(null);

  const width = 1200;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };

  useEffect(() => {
    if (!trackData || trackData.length === 0) return;

    // Select the SVG element
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous chart

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(trackData, (d) => d.distance)])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([data.misc.lowestAltitude - 100, data.misc.highestAltitude + 100])
      .range([height - margin.bottom, margin.top]);

    // Create line generator
    const line = d3
      .line()
      .x((d) => xScale(d.distance))
      .y((d) => yScale(d.altitude))
      .curve(d3.curveMonotoneX);

    // Append path (line)
    svg.append("path").datum(trackData).attr("fill", "var(--color-grey)").attr("stroke", "var(--color-dark-grey)").attr("stroke-width", 1).attr("d", line);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat((d) => `${(d / 1000).toFixed(1)} km`)); // Convert to km

    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(yScale));

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text("Distance (km)");

    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Altitude (m above sea level)");

    const focus = svg.append("g").style("display", "none");

    focus.append("circle").attr("r", 5).attr("fill", "red");

    const xLine = focus
      .append("line")
      .attr("stroke", "gray")
      .attr("stroke-dasharray", "4")
      .attr("y1", height - margin.bottom)
      .attr("y2", margin.top);

    const yLine = focus
      .append("line")
      .attr("stroke", "gray")
      .attr("stroke-dasharray", "4")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right);

    // Mouse Event Handlers
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .on("mousemove", function (event) {
        const [mouseX] = d3.pointer(event, this);
        const closest = d3.least(trackData, (d) => Math.abs(xScale(d.distance) - mouseX));

        if (closest) {
          setHoverData(closest);
          focus.style("display", null);
          focus.attr("transform", `translate(${xScale(closest.distance)}, ${yScale(closest.altitude)})`);
          xLine.attr("x1", xScale(closest.distance)).attr("x2", xScale(closest.distance));
          yLine.attr("y1", yScale(closest.altitude)).attr("y2", yScale(closest.altitude));
        }
      })
      .on("mouseleave", () => {
        setHoverData(null);
        focus.style("display", "none");
      });
  }, [trackData]); // Runs when trackData changes

  return (
    <div style={{ position: "relative", width }}>
      <svg ref={svgRef} width={width} height={height}></svg>
      {hoverData && (
        <div
          ref={tooltipRef}
          style={{
            position: "absolute",
            left: `${
              d3.select(svgRef?.current).node().getBoundingClientRect().left +
              d3.select(svgRef?.current).node().getBoundingClientRect().width * (hoverData.distance / d3.max(trackData, (d) => d.distance))
            }px`,
            top: `${
              d3.select(svgRef.current).node().getBoundingClientRect().top +
              d3.select(svgRef.current).node().getBoundingClientRect().height *
                (1 -
                  (hoverData.altitude - d3.min(trackData, (d) => d.altitude)) / (d3.max(trackData, (d) => d.altitude) - d3.min(trackData, (d) => d.altitude)))
            }px`,
            transform: "translate(-50%, -100%)",
            backgroundColor: "white",
            padding: "5px",
            border: "1px solid gray",
            borderRadius: "4px",
            fontSize: "12px",
            pointerEvents: "none",
          }}
        >
          <strong>{(hoverData.distance / 1000).toFixed(2)} km</strong>
          <br />
          Altitude: {hoverData.altitude.toFixed(1)} m
        </div>
      )}
    </div>
  );
}
