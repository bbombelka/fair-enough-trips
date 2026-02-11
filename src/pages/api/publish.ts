import Config from "Config";
import triggerDeployment from "server/shared/trigger-deployment";
import type { NextApiRequest, NextApiResponse } from "next";
import mongoClientConnectPromise from "MongoClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.secret !== process.env.CRON_SECRET) {
    return res.status(401).end();
  }
  const shouldTriggerDeployment = await performDBChanges();

  if (shouldTriggerDeployment) {
    await triggerDeployment();
    return res.status(200).json("Deployment triggered");
  }

  res.status(200).json("No deployment happened");

  async function performDBChanges() {
    try {
      const mongoClient = await mongoClientConnectPromise;
      const db = mongoClient.db(Config.DB_NAME);
      const collection = db.collection(Config.POSTS_COLLECTION);

      const now = new Date();

      const docsToUpdate = await collection
        .find({
          published: false,
          postDate: { $lt: now },
        })
        .project({ id: true })
        .toArray();

      const ids = docsToUpdate.map((doc) => doc.id);

      if (ids.length === 0) {
        console.log("No documents to update.");
        return false;
      }

      const result = await collection.updateMany({ id: { $in: ids } }, { $set: { published: true } });

      console.log("Found IDs:", ids, "Number of modified documents:", result.modifiedCount);

      const routeSchemePointResult = await db
        .collection(Config.ROUTE_SCHEME_POINTS)
        .updateMany({ id: { $in: ids } }, { $set: { published: true } }, { upsert: false });

      if (routeSchemePointResult.matchedCount === 0) {
        console.log("Document not found in route scheme points collection. No update performed.");
      } else {
        console.log("Route scheme point published");
      }

      return Boolean(ids?.length);
    } catch (err) {
      console.error("❌ Failed to upload post.json to MongoDB:", err);
      return false;
    }
  }
}
