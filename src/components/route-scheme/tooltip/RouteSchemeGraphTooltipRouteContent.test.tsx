import React from "react";
import { render, screen } from "@testing-library/react";
import { RouteSchemeGraphTooltipRouteContent } from "./RouteSchemeGraphTooltipRouteContent";
import { RouteSchemePoint } from "../RouteScheme.types";

jest.mock("hooks/useScrollForOutOfViewport", () => ({
  useScrollForOutOfViewport: () => ({ current: null }),
}));

jest.mock("hooks/useGlobalContext", () => ({
  useGlobalContext: () => ({
    setCurrentImage: jest.fn(),
    setOpenModal: jest.fn(),
  }),
}));

describe("RouteSchemeGraphTooltipRouteContent Component", () => {
  const mockPoint: RouteSchemePoint = {
    distance: 3000,
    altitude: 1000,
    timeElapsed: 1800000,
    elevationGain: 200,
    index: 1,
    name: "Path Section",
    type: "pass",
    path: {
      name: "Ridge Trail",
      difficulty: "T2",
      images: ["trail.webp"],
      paragraphs: [2],
    },
  };

  it("renders route tooltip content with difficulty and icons", () => {
    render(<RouteSchemeGraphTooltipRouteContent point={mockPoint} />);

    expect(screen.getByText("Ridge Trail")).toBeInTheDocument();
    expect(screen.getByText("T2")).toBeInTheDocument();

    const imageIcon = screen.getByAltText("Place image");
    expect(imageIcon).toBeInTheDocument();
    expect(imageIcon.getAttribute("src")).toBe("/assets/image.svg");

    const paragraphIcon = screen.getByAltText("Read paragraph");
    expect(paragraphIcon).toBeInTheDocument();
    expect(paragraphIcon.getAttribute("src")).toBe("/assets/paragraph.svg");
  });
});
