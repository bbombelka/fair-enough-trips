import React from "react";
import { render, screen } from "@testing-library/react";
import { RouteSchemeGraphTooltipPointContent } from "./RouteSchemeGraphTooltipPointContent";
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

describe("RouteSchemeGraphTooltipPointContent Component", () => {
  const mockPoint: RouteSchemePoint = {
    distance: 5000,
    altitude: 1200,
    timeElapsed: 3600000,
    elevationGain: 400,
    index: 0,
    name: "Summit View",
    type: "peak",
    images: ["img1.webp"],
    paragraphs: [1],
  };

  it("renders tooltip content with details and icons", () => {
    render(<RouteSchemeGraphTooltipPointContent point={mockPoint} />);

    expect(screen.getByText("Summit View")).toBeInTheDocument();
    expect(screen.getByText("5.00 km")).toBeInTheDocument();

    const imageIcon = screen.getByAltText("Place image");
    expect(imageIcon).toBeInTheDocument();
    expect(imageIcon.getAttribute("src")).toBe("/assets/image.svg");

    const paragraphIcon = screen.getByAltText("Read paragraph");
    expect(paragraphIcon).toBeInTheDocument();
    expect(paragraphIcon.getAttribute("src")).toBe("/assets/paragraph.svg");
  });
});
