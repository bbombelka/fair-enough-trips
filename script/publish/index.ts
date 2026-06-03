import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import Config from "../../src/Config";
import { getOrSelectId } from "../utils";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });
const MONGODB_URI = process.env.DB_URI;

(async () => {
  const args = process.argv.slice(2);
  const id = await getOrSelectId(args[0]);

  try {
    const mongoClient = new MongoClient(String(MONGODB_URI), {
      serverApi: ServerApiVersion.v1,
    });

    await mongoClient.connect();
    const db = mongoClient.db(Config.DB_NAME);
    const collection = db.collection(Config.POSTS_COLLECTION);
    const filter = { id };
    const update = {
      $set: {
        published: true,
      },
    };
    const options = { upsert: true };

    const result = await collection.updateOne(filter, update, options);
    console.log("✅ Update complete:", result.upsertedId ?? "updated existing");

    const routeSchemePointResult = await db.collection(Config.ROUTE_SCHEME_POINTS).updateOne({ id }, { $set: { published: true } }, { upsert: false });

    if (routeSchemePointResult.matchedCount === 0) {
      console.log("Document not found in route-scheme-points. No update performed.");
    } else {
      console.log("Route scheme point published for " + id);
    }

    await mongoClient.close();

    if (process.env.PUBLISH_DEPLOY) {
      fetch(`https://${process.env.PUBLISH_DEPLOY}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((res) => console.log(res));
    } else {
      console.log("⚠️ PUBLISH_DEPLOY not defined, skipping deployment trigger.");
    }
  } catch (err) {
    console.error("❌ Failed to publish post:", err);
    process.exit(1);
  }
})();
