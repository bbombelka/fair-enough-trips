import React, { useEffect, useRef, useState, MouseEvent } from "react";
import * as d3 from "d3";
import { splitPoiNames } from "../../gpx-chart/GpxChart.options";
import { GraphTooltip } from "components/graph-tooltip/GraphTooltip";
import { DistanceGraphPoint, MappedDistanceGraphPoint, PathData, DistanceChartModes } from "../DistanceGraph.types";
import { DistanceGraphTooltipPointContent } from "../distance-graph-tooltip-point-content/DistanceGraphTooltipPointContent";
import { DistanceGraphTooltipRouteContent } from "../distance-graph-tooltip-route-content/DistanceGraphTooltipRouteContent";
import { getMaxDomainValue, mapXAxisData } from "./DistanceGraph.utils";

type CurrentPointData = {
  index: number;
  x: number;
  y: number;
};

export const DistanceGraph = ({ points }: { points: DistanceGraphPoint[] }) => {
  const svgRef = useRef(null);
  const width = 1200;
  const height = 150;
  const [selectedPointData, setSelectedPointData] = useState<CurrentPointData | undefined>();
  const [isRouteSelected, setIsRouteSelected] = useState<boolean>(false);
  const [chartMode, setChartMode] = useState<DistanceChartModes>(DistanceChartModes.SIMPLE);

  const onPointClick = (index: number, routeSection: boolean) => (e: MouseEvent<SVGElement>) => {
    setIsRouteSelected(routeSection);
    setSelectedPointData((v) => {
      if (v?.index !== index) {
        return {
          index,
          x: Number(e.currentTarget.getAttribute("x")),
          y: Number(e.currentTarget.getAttribute("y")),
        };
      }
    });
  };

  const drawChart = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous SVG content

    const maxDomainValue = getMaxDomainValue(chartMode, points);
    const scale = d3
      .scaleLinear()
      .domain([0, maxDomainValue])
      .range([40, width - 40]);

    const appendBaseLine = () => {
      svg
        .append("line")
        .attr("x1", scale(0))
        .attr("y1", height / 2)
        .attr("x2", scale(maxDomainValue))
        .attr("y2", height / 2)
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    };

    const appendDistanceMeasureScale = () => {
      if (chartMode === DistanceChartModes.SIMPLE) {
        return;
      }

      const scaleY = height;
      svg
        .append("line")
        .attr("x1", scale(0))
        .attr("y1", scaleY)
        .attr("x2", scale(maxDomainValue))
        .attr("y2", scaleY)
        .attr("stroke", "black")
        .attr("stroke-width", 1);

      const tickGroup = svg.append("g");
      const tickInterval = 0.25; // meters
      for (let d = 0; d <= maxDomainValue; d += tickInterval) {
        const x = scale(d);
        let tickLength = 4;
        let strokeWidth = 1;
        if (d % 1 === 0) {
          tickLength = 12;
          strokeWidth = 2;
        } else if (d % 0.5 === 0) {
          tickLength = 8;
          strokeWidth = 2;
        }

        tickGroup
          .append("line")
          .attr("x1", x)
          .attr("y1", scaleY)
          .attr("x2", x)
          .attr("y2", scaleY - tickLength)
          .attr("stroke", "black")
          .attr("stroke-width", strokeWidth);

        if (d % 1 === 0) {
          tickGroup
            .append("text")
            .attr("x", x)
            .attr("y", scaleY - tickLength - 2)
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .text(`${d} km`);
        }
      }
    };

    const appendDistancePoint = (xAxisData: number, index: number) => {
      svg
        .append("circle")
        .attr("cx", scale(xAxisData))
        .attr("cy", height / 2)
        .attr("r", 5)
        .attr("stroke-width", 1)
        .attr("fill", selectedPointData?.index === index ? "red" : "unset");
    };

    const appendText = (xAxisData: number, name: string, index: number, type: string) => {
      const upperSetting = (lines: number) => height / 2 - 45 - lines * 12.5;
      const lowerSetting = () => height / 2 + 37.5;
      const textGroup = svg.append("g");

      const rect = textGroup
        .append("rect")
        .attr("fill", "white")
        .attr("rx", 5) // rounded corners
        .attr("ry", 5);

      const poiTextParts = splitPoiNames(name);

      const text = textGroup
        .append("text")
        .attr("x", scale(xAxisData))
        .attr("y", index % 2 === 0 ? upperSetting(poiTextParts.length) + 25 : lowerSetting())
        .attr("text-anchor", "middle")
        .style("font-weight", 700)
        .attr("font-size", "10px");

      poiTextParts.forEach((part, idx) => {
        text
          .append("tspan")
          .style("user-select", "none")
          .attr("x", scale(xAxisData))
          .attr("dy", String(idx * 15))
          .text(part);

        updateRectSize();

        function updateRectSize() {
          const bbox = text.node()?.getBBox();

          if (bbox) {
            rect
              .attr("x", bbox.x - 2) // add some padding
              .attr("y", bbox.y - 2)
              .attr("width", bbox.width + 4)
              .attr("height", bbox.height + 4);
          }
        }
      });

      const iconSize = 20;
      svg
        .append("image")
        .attr("x", scale(xAxisData) - iconSize / 2)
        .attr("y", index % 2 === 0 ? height / 2 - iconSize - 5 : height / 2 + 5)
        .attr("width", iconSize)
        .attr("height", iconSize)
        .attr("xlink:href", `/${type}.svg`)
        .style("cursor", "pointer")
        .on("click", onPointClick(index, false));
    };

    const appendRouteDescription = (distance: number, path: PathData, index: number, arr: MappedDistanceGraphPoint[]) => {
      const midX = (scale(distance) + scale(arr[index - 1].xAxisData)) / 2;
      const text = svg
        .append("text")
        .attr("x", midX)
        .attr("y", height - 60)
        .style("font-size", "10px")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .style("cursor", "pointer")
        .on("click", onPointClick(index, true));

      text.append("tspan").text(path.difficulty);

      if (path.name) {
        text.append("tspan").text(path.name).attr("x", midX).attr("dy", 15);
      }
    };

    appendBaseLine();
    points.map(mapXAxisData(chartMode)).forEach(({ xAxisData, name, path, type }, i, arr) => {
      appendDistancePoint(xAxisData, i);
      appendText(xAxisData, name, i, type);
      if (path) {
        appendRouteDescription(xAxisData, path, i, arr);
      }
    });
    appendDistanceMeasureScale();
  };

  useEffect(() => {
    drawChart();
  }, [points, chartMode]);

  return (
    <div style={{ position: "relative" }}>
      <div>
        <span onClick={() => setChartMode(DistanceChartModes.DISTANCE)}>Measure mode</span>
        <span onClick={() => setChartMode(DistanceChartModes.SIMPLE)}>Simple mode</span>
      </div>

      <svg ref={svgRef} width={width} height={height}></svg>
      {selectedPointData !== undefined ? (
        <GraphTooltip left={selectedPointData.x + 10} top={selectedPointData.y - 30}>
          {isRouteSelected ? (
            <DistanceGraphTooltipRouteContent point={points[selectedPointData.index]} />
          ) : (
            <DistanceGraphTooltipPointContent point={points[selectedPointData.index]} />
          )}
        </GraphTooltip>
      ) : null}
    </div>
  );
};
