import React, { useEffect, useRef, useState, MouseEvent } from "react";
import * as d3 from "d3";
import { splitPoiNames } from "../gpx-chart/GpxChart.options";
import { GraphTooltip } from "components/graph-tooltip/GraphTooltip";
import { RouteSchemePoint, MappedRouteSchemePoint, PathData, RouteSchemeChartModes } from "./RouteScheme.types";
import { RouteSchemeGraphTooltipPointContent } from "./tooltip/RouteSchemeGraphTooltipPointContent";
import { RouteSchemeGraphTooltipRouteContent } from "./tooltip/RouteSchemeGraphTooltipRouteContent";
import { getMaxDomainValue, mapXAxisData } from "./RouteScheme.utils";
import styles from "styles/RouteScheme.module.css";
import { useWindowSize } from "hooks/useWindowSize";
import ButtonGroup from "components/button-group/ButtonGroup";

type CurrentPointData = {
  index: number;
  x: number;
  y: number;
};

const RouteScheme = ({ points, disabledCharts }: { points: RouteSchemePoint[]; disabledCharts: RouteSchemeChartModes[] }) => {
  const svgRef = useRef(null);
  const width = 1200;
  const height = 150;
  const [selectedPointData, setSelectedPointData] = useState<CurrentPointData | undefined>();
  const [isRouteSelected, setIsRouteSelected] = useState<boolean>(false);
  const [chartMode, setChartMode] = useState<RouteSchemeChartModes>(RouteSchemeChartModes.BASIC);
  const { isDesktop } = useWindowSize();

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
      const scaleY = height;
      drawMeasureScaleLine(scaleY);

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

        const tickGroup = drawTickGroup({ x, scaleY, strokeWidth, tickLength });

        if (d % 1 === 0) {
          appendTickText({ x, scaleY, tickLength, tickGroup, text: `${d} km` });
        }
      }
    };

    const appendTimeMeasureScale = () => {
      const scaleY = height;
      const msPerHour = 60 * 60 * 1000;
      const msPerHalfHour = 30 * 60 * 1000;
      const msPerQuarterHour = 15 * 60 * 1000;

      drawMeasureScaleLine(scaleY);

      const maxTime = maxDomainValue; // Assume maxDistance is now time in ms
      for (let t = 0; t <= maxTime; t += msPerQuarterHour) {
        const x = scale(t);
        let tickLength = 4;
        let strokeWidth = 1;

        if (t % msPerHour === 0) {
          tickLength = 12;
          strokeWidth = 2;
        } else if (t % msPerHalfHour === 0) {
          tickLength = 8;
        }

        const tickGroup = drawTickGroup({ x, scaleY, strokeWidth, tickLength });

        if (t % msPerHour === 0) {
          const hours = t / msPerHour;
          appendTickText({ x, scaleY, tickLength, tickGroup, text: `${hours} h` });
        }
      }
    };

    const drawTickGroup = ({ x, scaleY, tickLength, strokeWidth }: { x: number; scaleY: number; tickLength: number; strokeWidth: number }) => {
      const tickGroup = svg.append("g");
      tickGroup
        .append("line")
        .attr("x1", x)
        .attr("y1", scaleY)
        .attr("x2", x)
        .attr("y2", scaleY - tickLength)
        .attr("stroke", "black")
        .attr("stroke-width", strokeWidth);

      return tickGroup;
    };

    const drawMeasureScaleLine = (scaleY: number) => {
      svg
        .append("line")
        .attr("x1", scale(0))
        .attr("y1", scaleY)
        .attr("x2", scale(maxDomainValue))
        .attr("y2", scaleY)
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    };

    const appendTickText = ({
      x,
      scaleY,
      tickLength,
      tickGroup,
      text,
    }: {
      tickGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
      x: number;
      scaleY: number;
      tickLength: number;
      text: string;
    }) => {
      tickGroup
        .append("text")
        .attr("x", x)
        .attr("y", scaleY - tickLength - 2)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .text(text);
    };

    const appendDistancePoint = (xAxisData: number, index: number) => {
      svg
        .append("circle")
        .attr("cx", scale(xAxisData))
        .attr("cy", height / 2)
        .attr("r", 5)
        .attr("stroke-width", 1);
    };

    const appendText = (xAxisData: number, name: string, index: number, type: string) => {
      const upperSetting = (lines: number) => height / 2 - 45 - lines * 12.5;
      const lowerSetting = () => height / 2 + 45;
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
        .attr("y", index % 2 === 0 ? height / 2 - iconSize - 5 : height / 2 + 10)
        .attr("width", iconSize)
        .attr("height", iconSize)
        .attr("xlink:href", `/${type}.svg`)
        .style("cursor", "pointer")
        .on("click", onPointClick(index, false));
    };

    const appendRouteDescription = (distance: number, path: PathData, index: number, arr: MappedRouteSchemePoint[]) => {
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

      if (path.name && chartMode === RouteSchemeChartModes.BASIC) {
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

    if (chartMode === RouteSchemeChartModes.DISTANCE) {
      appendDistanceMeasureScale();
    }
    if (chartMode === RouteSchemeChartModes.TIME) {
      appendTimeMeasureScale();
    }
  };

  useEffect(() => {
    drawChart();
  }, [points, chartMode]);

  return (
    <div style={{ position: "relative" }}>
      <div className={styles["mode-group-buttons"]}>
        <span>Mode: </span>
        <ButtonGroup
          options={[RouteSchemeChartModes.BASIC, RouteSchemeChartModes.DISTANCE, RouteSchemeChartModes.TIME].filter((mode) => !disabledCharts.includes(mode))}
          onSelect={(option) => setChartMode(option)}
          selectedOption={chartMode}
        />
      </div>
      <div className={styles["graph-container"]}>
        <svg className={styles["graph-svg"]} ref={svgRef} width={width} height={height} />
      </div>

      {selectedPointData !== undefined ? (
        <GraphTooltip
          left={isDesktop ? selectedPointData.x + 10 : window.innerWidth / 2}
          top={selectedPointData.y - 50}
          onClickAway={() => setSelectedPointData(undefined)}
        >
          {isRouteSelected ? (
            <RouteSchemeGraphTooltipRouteContent point={points[selectedPointData.index]} />
          ) : (
            <RouteSchemeGraphTooltipPointContent point={points[selectedPointData.index]} />
          )}
        </GraphTooltip>
      ) : null}
    </div>
  );
};

export default RouteScheme;
