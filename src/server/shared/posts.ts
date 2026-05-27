import mongoClientConnectPromise from "MongoClient";
import Config from "Config";
import { Filter } from "mongodb";
import { Post, PostDocument } from "components/card-list/CardList.types";

export const getLatestPosts = async (
  query: Filter<PostDocument> = {},
  limit?: number,
  sortDirection: 1 | -1 = -1
): Promise<Post[]> => {
  const mongoClient = await mongoClientConnectPromise;
  const isProd = process.env.NODE_ENV === "production";

  let cursor = mongoClient
    .db(Config.DB_NAME)
    .collection(Config.POSTS_COLLECTION)
    .find({
      ...query,
      ...(isProd ? { published: true } : {}),
    })
    .project<PostDocument>({ id: true, title: true, category: true, isTop: true, postDate: true, _id: false, base64Image: true })
    .sort({ postDate: sortDirection });

  if (limit) {
    cursor = cursor.limit(limit);
  }

  const posts = await cursor.toArray();

  return posts.map((post) => ({
    ...post,
    postDate: post.postDate.toISOString(),
  }));
};

export const getPathsPosts = async () => {
  const mongoClient = await mongoClientConnectPromise;
  const isProd = process.env.NODE_ENV === "production";

  return mongoClient
    .db(Config.DB_NAME)
    .collection(Config.POSTS_COLLECTION)
    .find(isProd ? { published: true } : {})
    .project({ id: true, parentId: true, category: true, _id: false })
    .toArray();
};
