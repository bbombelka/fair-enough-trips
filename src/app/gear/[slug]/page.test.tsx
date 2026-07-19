import React from "react";
import { render, screen } from "@testing-library/react";
import GearPage from "./page";
import { notFound } from "next/navigation";

// Declare mock functions that will be referenced lazily
const mockFindOne = jest.fn();
const mockToArray = jest.fn();

jest.mock("MongoClient", () => {
  return Promise.resolve({
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockImplementation((name) => {
        if (name === "gear") {
          return {
            findOne: (query: any) => mockFindOne(query),
          };
        }
        if (name === "posts" || name === "posts-test") {
          return {
            find: jest.fn().mockReturnThis(),
            project: jest.fn().mockReturnThis(),
            toArray: () => mockToArray(),
          };
        }
        return {};
      }),
    }),
  });
});

// Mock next/navigation
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

// Mock components
jest.mock("components", () => ({
  Layout: ({ children, title }: any) => <div data-testid="layout" title={title}>{children}</div>,
  Navbar: () => <div data-testid="navbar">Navbar</div>,
  Footer: () => <div data-testid="footer">Footer</div>,
}), { virtual: true });

jest.mock("components/paragraph/Paragraph", () => ({
  Paragraph: ({ id, title, body }: any) => (
    <div data-testid={id} data-title={title}>
      {body}
    </div>
  ),
}));

// Mock next/link to just render a regular anchor tag for testing
jest.mock("next/link", () => {
  return ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
});

jest.mock("components/star-rate/StarRate", () => ({
  StarRate: ({ rate }: any) => <span data-testid="star-rate" data-rate={rate}>Stars: {rate}</span>,
}));

describe("GearPage Server Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should trigger notFound when gear item does not exist", async () => {
    mockFindOne.mockResolvedValueOnce(null);

    const params = Promise.resolve({ slug: "non-existent" });
    const element = await GearPage({ params });
    render(element);

    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("should render gear stats, description, usage, and trips used when they exist", async () => {
    const fakeGearItem = {
      id: "thule-stir-20l",
      slug: "thule-stir-20l",
      brand: "Thule",
      name: "Stir 20l",
      description: "Great minimalist daypack.",
      usage: "Single day climbing and hiking.",
      tripsUsed: ["trip-1", "trip-2"],
      statsGeneral: {
        price: 60,
        weight: 535,
        rating: 8,
        frequency: "very often",
        purchased: "2025-09-26T13:57:00.330+00:00",
      },
      statsSpecific: {
        volume: "20 L",
      },
    };

    mockFindOne.mockResolvedValueOnce(fakeGearItem);

    // Mock corresponding post documents from DB
    mockToArray.mockResolvedValueOnce([
      { id: "trip-1", title: "Trip One Title", parentId: "parent-1" },
      { id: "trip-2", title: "Trip Two Title" },
    ]);

    const params = Promise.resolve({ slug: "thule-stir-20l" });
    const element = await GearPage({ params });
    render(element);

    expect(notFound).not.toHaveBeenCalled();

    // Verify Title inside Layout
    expect(screen.getByTestId("layout")).toHaveAttribute("title", "Thule Stir 20l");

    // Verify stats are rendered
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("€60")).toBeInTheDocument();
    expect(screen.getByText("Weight")).toBeInTheDocument();
    expect(screen.getByText("535 g")).toBeInTheDocument();
    expect(screen.getByText("Rating")).toBeInTheDocument();
    expect(screen.getByText("Stars: 4")).toBeInTheDocument();
    expect(screen.getByText("Times used")).toBeInTheDocument();
    expect(screen.getByText("very often")).toBeInTheDocument();
    expect(screen.getByText("Used since")).toBeInTheDocument();
    expect(screen.getByText("Sep 2025")).toBeInTheDocument();
    expect(screen.getByText("Volume")).toBeInTheDocument();
    expect(screen.getByText("20 L")).toBeInTheDocument();

    // Verify description paragraph
    expect(screen.getByTestId("gear-description")).toHaveTextContent("Great minimalist daypack.");

    // Verify usage paragraph
    const usageParagraph = screen.getByTestId("gear-usage");
    expect(usageParagraph).toHaveAttribute("data-title", "Mostly used for");
    expect(usageParagraph).toHaveTextContent("Single day climbing and hiking.");

    // Verify used-in paragraph
    const usedInParagraph = screen.getByTestId("gear-used-in");
    expect(usedInParagraph).toHaveAttribute("data-title", "Used in");

    // Verify the correct links and their paths
    const link1 = screen.getByRole("link", { name: "Trip One Title" });
    expect(link1).toHaveAttribute("href", "/posts/parent-1/trip-1");

    const link2 = screen.getByRole("link", { name: "Trip Two Title" });
    expect(link2).toHaveAttribute("href", "/posts/trip-2");
  });

  it("should not render usage or used-in if they are missing in database document", async () => {
    const fakeGearItemNoUsage = {
      id: "simple-gear",
      slug: "simple-gear",
      brand: "Brand",
      name: "Simple",
      description: "Simple description.",
    };

    mockFindOne.mockResolvedValueOnce(fakeGearItemNoUsage);

    const params = Promise.resolve({ slug: "simple-gear" });
    const element = await GearPage({ params });
    render(element);

    expect(notFound).not.toHaveBeenCalled();
    expect(screen.getByTestId("gear-description")).toHaveTextContent("Simple description.");
    expect(screen.queryByTestId("gear-usage")).not.toBeInTheDocument();
    expect(screen.queryByTestId("gear-used-in")).not.toBeInTheDocument();
  });
});
