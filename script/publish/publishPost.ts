import { Db } from "mongodb";
import { readFile } from "fs/promises";
import path from "path";
import Config from "../../src/Config";

export interface PublishPostOptions {
  db: Db;
  id: string;
  postsRoot?: string;
}

export interface PublishPostResult {
  id: string;
  subIds: string[];
  mainPostUpsertedId?: string | null;
  subPostsMatchedCount: number;
  subPostsModifiedCount: number;
  mainRouteSchemeMatchedCount: number;
  childRouteSchemesMatchedCount: number;
}

export async function publishPost({
  db,
  id,
  postsRoot,
}: PublishPostOptions): Promise<PublishPostResult> {
  const postsCollection = db.collection(Config.POSTS_COLLECTION);
  const targetPost = await postsCollection.findOne({ id });

  const subIdsSet = new Set<string>();

  if (targetPost && Array.isArray(targetPost.subIds)) {
    targetPost.subIds.forEach((s: unknown) => {
      if (typeof s === "string" && s.trim()) {
        subIdsSet.add(s.trim());
      }
    });
  }

  // Fallback to local post.json if present
  if (postsRoot) {
    try {
      const postJsonPath = path.join(postsRoot, id, "post.json");
      const raw = await readFile(postJsonPath, "utf-8");
      const localPost = JSON.parse(raw);
      if (Array.isArray(localPost.subIds)) {
        localPost.subIds.forEach((s: unknown) => {
          if (typeof s === "string" && s.trim()) {
            subIdsSet.add(s.trim());
          }
        });
      }
    } catch {
      // Local post.json not found or not readable, which is expected if cleaned up
    }
  }

  // Check for any sub-posts referencing this post via parentId
  const childPostsFromDb = await postsCollection.find({ parentId: id }).project({ id: 1 }).toArray();
  childPostsFromDb.forEach((childDoc: any) => {
    if (childDoc.id && typeof childDoc.id === "string" && childDoc.id.trim()) {
      subIdsSet.add(childDoc.id.trim());
    }
  });

  // Also check nested subIds for any sub-posts
  if (subIdsSet.size > 0) {
    const childSubPosts = await postsCollection
      .find({ id: { $in: Array.from(subIdsSet) } })
      .project({ subIds: 1 })
      .toArray();
    childSubPosts.forEach((doc: any) => {
      if (Array.isArray(doc.subIds)) {
        doc.subIds.forEach((s: unknown) => {
          if (typeof s === "string" && s.trim()) {
            subIdsSet.add(s.trim());
          }
        });
      }
    });
  }

  // Remove self if accidentally included
  subIdsSet.delete(id);
  const subIds = Array.from(subIdsSet);

  // 1. Update desired post
  const filter = { id };
  const update = {
    $set: {
      published: true,
    },
  };
  const options = { upsert: true };

  const mainResult = await postsCollection.updateOne(filter, update, options);
  const upsertedId = mainResult.upsertedId ? String(mainResult.upsertedId) : null;
  console.log("✅ Update complete:", upsertedId ?? "updated existing");

  // 2. Update sub-posts from subIds array
  let subPostsMatchedCount = 0;
  let subPostsModifiedCount = 0;

  if (subIds.length > 0) {
    const subPostsResult = await postsCollection.updateMany(
      { $or: [{ id: { $in: subIds } }, { parentId: id }] },
      { $set: { published: true } }
    );
    subPostsMatchedCount = subPostsResult.matchedCount;
    subPostsModifiedCount = subPostsResult.modifiedCount;
    console.log(
      `✅ Sub-posts published for subIds [${subIds.join(", ")}]: ${subPostsMatchedCount} matched, ${subPostsModifiedCount} updated.`
    );
  }

  // 3. Update main route scheme
  const routeSchemeCollection = db.collection(Config.ROUTE_SCHEME_POINTS);
  const mainRouteSchemeResult = await routeSchemeCollection.updateOne(
    { id },
    { $set: { published: true } },
    { upsert: false }
  );

  if (mainRouteSchemeResult.matchedCount === 0) {
    console.log("Document not found in route-scheme-points. No update performed.");
  } else {
    console.log("Route scheme point published for " + id);
  }

  // 4. Update child route schemes
  let childRouteSchemesMatchedCount = 0;

  if (subIds.length > 0) {
    const childRouteSchemeResult = await routeSchemeCollection.updateMany(
      { $or: [{ id: { $in: subIds } }, { parentId: id }] },
      { $set: { published: true } },
      { upsert: false }
    );
    childRouteSchemesMatchedCount = childRouteSchemeResult.matchedCount;

    if (childRouteSchemeResult.matchedCount === 0) {
      console.log("No child route schemes found in route-scheme-points. No update performed.");
    } else {
      console.log(
        `Child route scheme points published for subIds (${childRouteSchemeResult.matchedCount} matched).`
      );
    }
  }

  return {
    id,
    subIds,
    mainPostUpsertedId: upsertedId,
    subPostsMatchedCount,
    subPostsModifiedCount,
    mainRouteSchemeMatchedCount: mainRouteSchemeResult.matchedCount,
    childRouteSchemesMatchedCount,
  };
}
