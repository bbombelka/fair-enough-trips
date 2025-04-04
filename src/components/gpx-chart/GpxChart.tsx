import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useGPXData } from "pages/api/hooks/useGpxData";
import { TrackPoint } from "pages/api/parse-gpx";
import { getOrientation, Orientation, isBelowMinimalPoiDistance, determineOrientation, splitPoiNames } from "./GpxChart.options";

type GPXChartProps = {
  id: string;
};

export function GPXChart({ id }: GPXChartProps) {
  const { data } = useGPXData({ isEnabled: true, id });
  const trackData = data?.trackPoints;
  const svgRef = useRef(null);
  const [hoverData, setHoverData] = useState<TrackPoint | null>(null);

  const width = 1200;
  const height = 480;
  const margin = { top: 75, right: 30, bottom: 50, left: 50 };

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
      .domain([data.misc.lowestAltitude, data.misc.highestAltitude + 100])
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
      .attr("y", 10)
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Altitude (m above sea level)");

    const focus = svg.append("g").style("display", "none");

    const hoverPoint = focus.append("circle").attr("r", 5).attr("fill", "red");

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
          const xPos = xScale(closest.distance);
          const yPos = yScale(closest.altitude);

          setHoverData({ ...closest, xPos, yPos });

          focus.style("display", null);
          hoverPoint.attr("cx", xPos).attr("cy", yPos);
          xLine
            .attr("x1", xPos)
            .attr("x2", xPos)
            .attr("y1", yPos)
            .attr("y2", height - margin.bottom);
          yLine.attr("x1", xPos).attr("x2", margin.left).attr("y1", yPos).attr("y2", yPos);
        }
      })
      .on("mouseleave", () => {
        setHoverData(null);
        focus.style("display", "none");
      });

    const appliedOrientation: Orientation[] = [];
    trackData
      .filter((d) => d.poi)
      .forEach((d, index, arr) => {
        if (d.poi) {
          const xPos = xScale(d.distance);
          const yPos = yScale(d.altitude) - 4;

          const drawPoi = (orientationType: Orientation = "up") => {
            const orientation = getOrientation(xPos, yPos);
            // const orientationType: Orientation = "down";
            appliedOrientation.push(orientationType);
            // Draw the label text
            if (xPos > 75) {
              // draws a line
              svg
                .append("line")
                .attr("x1", orientation[orientationType].line.x1)
                .attr("x2", orientation[orientationType].line.x2)
                .attr("y1", orientation[orientationType].line.y1)
                .attr("y2", orientation[orientationType].line.y2)
                .attr("stroke", "black")
                .attr("stroke-width", 1);

              const textGroup = svg.append("g");

              const rect = textGroup
                .append("rect")
                .attr("fill", orientationType === "up" ? "white" : "var(--color-grey)")
                // .attr("stroke", "yellow")
                .attr("rx", 5) // rounded corners
                .attr("ry", 5);

              const text = textGroup
                .append("text")
                .attr("x", orientation[orientationType].text.x)
                .attr("y", orientation[orientationType].text.y)
                .attr("text-anchor", "middle")
                .attr("font-size", "10px")
                .attr("fill", "black");

              const poiTextParts = splitPoiNames(d.poi?.name);

              poiTextParts.forEach((part, idx) => {
                text
                  .append("tspan")
                  .attr("x", orientation[orientationType].text.x)
                  // .attr("y", orientation[orientationType].text.y)
                  .attr("dy", String(idx * 15))
                  .text(part);
                updateRectSize();

                function updateRectSize() {
                  const bbox = text.node().getBBox();

                  rect
                    .attr("x", bbox.x - 2) // add some padding
                    .attr("y", bbox.y - 2)
                    .attr("width", bbox.width + 4)
                    .attr("height", bbox.height + 4);
                }
              });
            }
            // Draw the POI icon directly above the text
            svg
              .append("image")
              .attr("x", orientation[orientationType].image.x)
              .attr("y", orientation[orientationType].image.y) // Above text
              .attr("width", 20)
              .attr("height", 20)
              .attr("xlink:href", `/${d.poi?.type}.svg`);
          };

          if (index > 0) {
            const x1 = xScale(arr[index].distance);
            const x2 = xScale(arr[index - 1].distance);

            if (isBelowMinimalPoiDistance(x1 - x2)) {
              const orientation = determineOrientation(appliedOrientation, index);
              drawPoi(orientation);
            } else {
              drawPoi();
            }
          } else {
            drawPoi();
          }
        }
      });

    console.log(appliedOrientation);
  }, [trackData]); // Runs when trackData changes

  return (
    <div style={{ position: "relative", width }}>
      <svg ref={svgRef} width={width} height={height}></svg>
      {hoverData && (
        <div
          style={{
            position: "absolute",
            left: `${hoverData.xPos + 10}px`,
            top: `${hoverData.yPos - 30}px`,
            transform: "translate(-50%, -100%)",
            backgroundColor: "white",
            padding: "5px",
            border: "1px solid gray",
            borderRadius: "4px",
            fontSize: "12px",
            pointerEvents: "none",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
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
