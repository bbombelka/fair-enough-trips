import React from "react";
import { render, screen } from "@testing-library/react";
import { GearCard } from "./GearCard";
import { GearItem } from "components/templates/gear/GearTemplate.types";

// Mock the image hook
const mockGetGearImageSourcePath = jest.fn();
jest.mock("hooks/useImageSourcePath", () => ({
  useGearImageSourcePath: () => mockGetGearImageSourcePath,
}));

describe("GearCard", () => {
  const fakeGearItem: GearItem = {
    id: "test-gear",
    slug: "test-gear-slug",
    brand: "TestBrand",
    name: "TestName",
    type: "RUCKSACK_20L",
    description: "Description",
    usage: "Usage",
    statsGeneral: {},
    pros: [],
    cons: [],
    images: {
      general: [{ isVertical: false, desc: "test" }],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the brand, name, mapped type, and link to the correct path", () => {
    mockGetGearImageSourcePath.mockReturnValue({ src: "/test-source-path.webp" });

    render(<GearCard gearItem={fakeGearItem} />);

    // Assert link contains the correct slug path
    const link = screen.getByTestId("gear-card");
    expect(link).toHaveAttribute("href", "/gear/test-gear-slug");

    // Assert name, brand and mapped category/type are rendered
    expect(screen.getByText("TestName")).toBeInTheDocument();
    expect(screen.getByText("TestBrand")).toBeInTheDocument();
    expect(screen.getByText("20l rucksack")).toBeInTheDocument(); // Mapped type via GearMap

    // Assert hook was called with proper args
    expect(mockGetGearImageSourcePath).toHaveBeenCalledWith({ id: "test-gear-slug", filename: "test-gear-slug-1" });
  });

  it.skip("should render placeholder image if general images are missing", () => {
    const minimalGear: GearItem = {
      ...fakeGearItem,
      images: {
        general: [],
      },
    };

    render(<GearCard gearItem={minimalGear} />);

    // Verify fallback placeholder image source
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/placeholder.webp");
    expect(mockGetGearImageSourcePath).not.toHaveBeenCalled();
  });
});
