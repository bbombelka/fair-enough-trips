import sitemap from "./sitemap";
import { getPathsPosts } from "server/shared/posts";

jest.mock("server/shared/posts", () => ({
  getPathsPosts: jest.fn(),
}));

describe("Sitemap Generator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate nested URLs for sub-posts and flat URLs for standalone posts", async () => {
    const mockPosts = [
      {
        id: "standalone-post",
        category: {
          activity: ["001"],
          country: ["001"],
          region: ["001"],
        },
      },
      {
        id: "sub-post",
        parentId: "parent-post",
        category: {
          activity: ["002"],
          country: ["002"],
          region: ["002"],
        },
      },
    ];

    (getPathsPosts as jest.Mock).mockResolvedValueOnce(mockPosts);

    const result = await sitemap();

    // Verify static routes are present
    const staticUrls = result.filter(
      (r) =>
        !r.url.includes("/posts/") &&
        !r.url.includes("/activity/") &&
        !r.url.includes("/countries/") &&
        !r.url.includes("/regions/"),
    );
    expect(staticUrls.length).toBe(5); // "", "/about", "/countries", "/regions", "/search"

    // Verify post routes
    const standalonePostRoute = result.find((r) => r.url.endsWith("/posts/standalone-post"));
    const subPostRoute = result.find((r) => r.url.endsWith("/posts/parent-post/sub-post"));

    expect(standalonePostRoute).toBeDefined();
    expect(subPostRoute).toBeDefined();

    // Also assert that the sub-post is NOT generated as a flat URL
    const incorrectFlatRoute = result.find((r) => r.url.endsWith("/posts/sub-post"));
    expect(incorrectFlatRoute).toBeUndefined();
  });
});
