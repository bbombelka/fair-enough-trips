import { publishPost } from "../../script/publish/publishPost";
import Config from "../Config";
import fs from "fs";
import path from "path";
import os from "os";

describe("publishPost", () => {
  let mockPostsCollection: any;
  let mockRouteSchemeCollection: any;
  let mockDb: any;
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "publish-post-test-"));

    mockPostsCollection = {
      findOne: jest.fn(),
      find: jest.fn().mockReturnValue({
        project: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([]),
        }),
      }),
      updateOne: jest.fn().mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
        upsertedId: null,
      }),
      updateMany: jest.fn().mockResolvedValue({
        matchedCount: 2,
        modifiedCount: 2,
      }),
    };

    mockRouteSchemeCollection = {
      updateOne: jest.fn().mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      }),
      updateMany: jest.fn().mockResolvedValue({
        matchedCount: 2,
        modifiedCount: 2,
      }),
    };

    mockDb = {
      collection: jest.fn((name: string) => {
        if (name === Config.POSTS_COLLECTION) {
          return mockPostsCollection;
        }
        if (name === Config.ROUTE_SCHEME_POINTS) {
          return mockRouteSchemeCollection;
        }
        throw new Error(`Unexpected collection name: ${name}`);
      }),
    };
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    jest.clearAllMocks();
  });

  it("should publish a single post without subIds", async () => {
    mockPostsCollection.findOne.mockResolvedValueOnce({
      id: "solo-trip",
      subIds: [],
    });

    const result = await publishPost({
      db: mockDb as any,
      id: "solo-trip",
      postsRoot: tempDir,
    });

    expect(result.id).toBe("solo-trip");
    expect(result.subIds).toEqual([]);
    expect(result.subPostsMatchedCount).toBe(0);
    expect(result.childRouteSchemesMatchedCount).toBe(0);

    // Target post update
    expect(mockPostsCollection.updateOne).toHaveBeenCalledWith(
      { id: "solo-trip" },
      { $set: { published: true } },
      { upsert: true }
    );

    // No sub-posts update
    expect(mockPostsCollection.updateMany).not.toHaveBeenCalled();

    // Main route scheme update
    expect(mockRouteSchemeCollection.updateOne).toHaveBeenCalledWith(
      { id: "solo-trip" },
      { $set: { published: true } },
      { upsert: false }
    );

    // No child route schemes update
    expect(mockRouteSchemeCollection.updateMany).not.toHaveBeenCalled();
  });

  it("should publish post, its subIds, and child route schemes when subIds exist in DB", async () => {
    mockPostsCollection.findOne.mockResolvedValueOnce({
      id: "parent-trip",
      subIds: ["stage-1", "stage-2"],
    });

    const result = await publishPost({
      db: mockDb as any,
      id: "parent-trip",
      postsRoot: tempDir,
    });

    expect(result.id).toBe("parent-trip");
    expect(result.subIds).toEqual(["stage-1", "stage-2"]);
    expect(result.subPostsMatchedCount).toBe(2);
    expect(result.childRouteSchemesMatchedCount).toBe(2);

    // Target post updated
    expect(mockPostsCollection.updateOne).toHaveBeenCalledWith(
      { id: "parent-trip" },
      { $set: { published: true } },
      { upsert: true }
    );

    // Sub-posts updated
    expect(mockPostsCollection.updateMany).toHaveBeenCalledWith(
      { $or: [{ id: { $in: ["stage-1", "stage-2"] } }, { parentId: "parent-trip" }] },
      { $set: { published: true } }
    );

    // Main route scheme updated
    expect(mockRouteSchemeCollection.updateOne).toHaveBeenCalledWith(
      { id: "parent-trip" },
      { $set: { published: true } },
      { upsert: false }
    );

    // Child route schemes updated
    expect(mockRouteSchemeCollection.updateMany).toHaveBeenCalledWith(
      { $or: [{ id: { $in: ["stage-1", "stage-2"] } }, { parentId: "parent-trip" }] },
      { $set: { published: true } },
      { upsert: false }
    );
  });

  it("should fallback to local post.json if DB target post lacks subIds", async () => {
    mockPostsCollection.findOne.mockResolvedValueOnce({
      id: "local-multiday",
    });

    const postDir = path.join(tempDir, "local-multiday");
    fs.mkdirSync(postDir, { recursive: true });
    fs.writeFileSync(
      path.join(postDir, "post.json"),
      JSON.stringify({
        id: "local-multiday",
        subIds: ["day-1", "day-2", "day-3"],
      }),
      "utf-8"
    );

    const result = await publishPost({
      db: mockDb as any,
      id: "local-multiday",
      postsRoot: tempDir,
    });

    expect(result.subIds).toEqual(["day-1", "day-2", "day-3"]);
    expect(mockPostsCollection.updateMany).toHaveBeenCalledWith(
      { $or: [{ id: { $in: ["day-1", "day-2", "day-3"] } }, { parentId: "local-multiday" }] },
      { $set: { published: true } }
    );
    expect(mockRouteSchemeCollection.updateMany).toHaveBeenCalledWith(
      { $or: [{ id: { $in: ["day-1", "day-2", "day-3"] } }, { parentId: "local-multiday" }] },
      { $set: { published: true } },
      { upsert: false }
    );
  });

  it("should include child posts from DB that have matching parentId", async () => {
    mockPostsCollection.findOne.mockResolvedValueOnce({
      id: "parent-with-children",
      subIds: ["child-1"],
    });

    mockPostsCollection.find.mockReturnValueOnce({
      project: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([{ id: "child-2" }]),
      }),
    });

    const result = await publishPost({
      db: mockDb as any,
      id: "parent-with-children",
      postsRoot: tempDir,
    });

    expect(result.subIds).toContain("child-1");
    expect(result.subIds).toContain("child-2");
    expect(mockPostsCollection.updateMany).toHaveBeenCalledWith(
      { $or: [{ id: { $in: ["child-1", "child-2"] } }, { parentId: "parent-with-children" }] },
      { $set: { published: true } }
    );
  });

  it("should handle route-scheme-points not found gracefully", async () => {
    mockPostsCollection.findOne.mockResolvedValueOnce({
      id: "no-route-schemes",
      subIds: ["child-1"],
    });

    mockRouteSchemeCollection.updateOne.mockResolvedValueOnce({
      matchedCount: 0,
      modifiedCount: 0,
    });
    mockRouteSchemeCollection.updateMany.mockResolvedValueOnce({
      matchedCount: 0,
      modifiedCount: 0,
    });

    const result = await publishPost({
      db: mockDb as any,
      id: "no-route-schemes",
      postsRoot: tempDir,
    });

    expect(result.mainRouteSchemeMatchedCount).toBe(0);
    expect(result.childRouteSchemesMatchedCount).toBe(0);
  });
});
