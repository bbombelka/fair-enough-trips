import React from "react";
import { render } from "@testing-library/react";
import PostPage from "./[...id]/page";
import { notFound } from "next/navigation";

const mockFindOne = jest.fn();
const mockToArray = jest.fn();

jest.mock("MongoClient", () => {
  return Promise.resolve({
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockImplementation((name) => {
        if (name === "posts") {
          return {
            findOne: (query: any) => mockFindOne(query),
            find: jest.fn().mockReturnThis(),
            project: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            toArray: () => mockToArray(),
          };
        }
        if (name === "gear") {
          return {
            find: jest.fn().mockReturnThis(),
            toArray: () => Promise.resolve([]),
          };
        }
        return {};
      }),
    }),
  });
});

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("server/shared/route-scheme-exists", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(false),
}));

jest.mock("fs/promises", () => ({
  access: jest.fn().mockRejectedValue(new Error("File not found")),
}));

jest.mock("hooks/useGlobalContext", () => ({
  useGlobalContext: () => ({
    showModal: false,
    setOpenModal: jest.fn(),
    currentImage: "",
    setCurrentImage: jest.fn(),
  }),
}));

// Mock components
jest.mock("components", () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
  Footer: () => <div data-testid="footer">Footer</div>,
}), { virtual: true });

jest.mock("components/templates/PostTemplate", () => ({
  PostTemplate: () => <div data-testid="post-template">Post Template</div>,
}));

jest.mock("components/templates/multiday/PostMultidayTemplate", () => ({
  PostMultidayTemplate: () => <div data-testid="post-multiday-template">Post Multiday Template</div>,
}));

const mockPostCategory = {
  activity: ["001"],
  region: ["001"],
  country: ["001"]
};

const mockPostStats = {
  distance: 10,
  up: 1000,
  down: 1000,
  duration: "PT3H"
};

describe("PostPage Catch-all Routing Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToArray.mockResolvedValue([]);
  });

  it("should trigger notFound when post does not exist", async () => {
    mockFindOne.mockResolvedValueOnce(null);

    const params = Promise.resolve({ id: ["some-id"] });
    await PostPage({ params });

    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("should block a sub-post if accessed with a top-level URL (length 1)", async () => {
    mockFindOne.mockResolvedValueOnce({
      id: "bivak-na-jezerih",
      title: "Bivak na Jezerih",
      parentId: "veliki-oltar-visoki-rokav",
      postDate: "2025-05-10T03:17:22.554Z",
      category: mockPostCategory,
      stats: mockPostStats,
    });

    const params = Promise.resolve({ id: ["bivak-na-jezerih"] });
    await PostPage({ params });

    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("should block a sub-post if parent ID in URL does not match actual parentId", async () => {
    mockFindOne.mockResolvedValueOnce({
      id: "bivak-na-jezerih",
      title: "Bivak na Jezerih",
      parentId: "veliki-oltar-visoki-rokav",
      postDate: "2025-05-10T03:17:22.554Z",
      category: mockPostCategory,
      stats: mockPostStats,
    });

    const params = Promise.resolve({ id: ["wrong-parent-id", "bivak-na-jezerih"] });
    await PostPage({ params });

    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("should render sub-post successfully if accessed with matching parentId in URL (length 2)", async () => {
    mockFindOne.mockResolvedValueOnce({
      id: "bivak-na-jezerih",
      title: "Bivak na Jezerih",
      parentId: "veliki-oltar-visoki-rokav",
      postDate: "2025-05-10T03:17:22.554Z",
      category: mockPostCategory,
      stats: mockPostStats,
    });

    const params = Promise.resolve({ id: ["veliki-oltar-visoki-rokav", "bivak-na-jezerih"] });
    const element = await PostPage({ params });
    render(element);

    expect(notFound).not.toHaveBeenCalled();
  });

  it("should block a standalone post if accessed with a nested URL (length 2)", async () => {
    mockFindOne.mockResolvedValueOnce({
      id: "azonas",
      title: "Azonas",
      postDate: "2025-05-10T03:17:22.554Z",
      category: mockPostCategory,
      stats: mockPostStats,
    });

    const params = Promise.resolve({ id: ["some-parent", "azonas"] });
    await PostPage({ params });

    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("should render a standalone post successfully if accessed with a top-level URL (length 1)", async () => {
    mockFindOne.mockResolvedValueOnce({
      id: "azonas",
      title: "Azonas",
      postDate: "2025-05-10T03:17:22.554Z",
      category: mockPostCategory,
      stats: mockPostStats,
    });

    const params = Promise.resolve({ id: ["azonas"] });
    const element = await PostPage({ params });
    render(element);

    expect(notFound).not.toHaveBeenCalled();
  });
});
