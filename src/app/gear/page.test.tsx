import React from "react";
import { render, screen } from "@testing-library/react";
import GearPage from "./page";

// Declare mock function
const mockToArray = jest.fn();

jest.mock("MongoClient", () => {
  return Promise.resolve({
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockImplementation((name) => {
        if (name === "gear") {
          return {
            find: jest.fn().mockReturnThis(),
            toArray: () => mockToArray(),
          };
        }
        return {};
      }),
    }),
  });
});

// Mock components
jest.mock("components", () => ({
  Layout: ({ children, title, subTitle }: any) => (
    <div data-testid="layout" title={title} data-subtitle={subTitle}>
      {children}
    </div>
  ),
  Navbar: () => <div data-testid="navbar">Navbar</div>,
  Footer: () => <div data-testid="footer">Footer</div>,
  GearCard: ({ gearItem }: any) => (
    <div data-testid="gear-card-mock">
      {gearItem.brand} - {gearItem.name}
    </div>
  ),
}), { virtual: true });

describe("GearPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render layout, title, and gear list sorted alphabetically by brand then name", async () => {
    const mockGearItems = [
      { id: "1", brand: "Patagonia", name: "Torrentshell", slug: "patagonia-torrentshell" },
      { id: "2", brand: "Arc'teryx", name: "Beta LT", slug: "arcteryx-beta-lt" },
      { id: "3", brand: "Patagonia", name: "R1", slug: "patagonia-r1" },
    ];

    mockToArray.mockResolvedValueOnce(mockGearItems);

    const element = await GearPage();
    render(element);

    // Verify title and subtitle on layout
    expect(screen.getByTestId("layout")).toHaveAttribute("title", "My Gear");
    expect(screen.getByTestId("layout")).toHaveAttribute("data-subtitle", "Long-term real-world gear reviews");

    // Verify gear cards are rendered
    const cards = screen.getAllByTestId("gear-card-mock");
    expect(cards).toHaveLength(3);

    // Verify correct sorting: brand "Arc'teryx" first, then brand "Patagonia" with names "R1" then "Torrentshell"
    expect(cards[0]).toHaveTextContent("Arc'teryx - Beta LT");
    expect(cards[1]).toHaveTextContent("Patagonia - R1");
    expect(cards[2]).toHaveTextContent("Patagonia - Torrentshell");
  });

  it("should handle empty gear items array gracefully", async () => {
    mockToArray.mockResolvedValueOnce([]);

    const element = await GearPage();
    render(element);

    expect(screen.queryByTestId("gear-card-mock")).not.toBeInTheDocument();
  });
});
