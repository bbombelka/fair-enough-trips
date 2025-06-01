import path from "path";
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import Config from "../../src/Config";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });
const MONGODB_URI = process.env.DB_URI;

const args = process.argv.slice(2);
const id = args[0];

if (!id) {
  console.error("❌ Error: No POI ID provided.");
  process.exit(1);
}

(async () => {
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
    console.log("✅ Upload complete:", result.upsertedId ?? "updated existing");

    const routeSchemePointResult = await db.collection(Config.ROUTE_SCHEME_POINTS).updateOne({ id }, { $set: { published: true } }, { upsert: false });

    if (routeSchemePointResult.matchedCount === 0) {
      console.log("Document not found. No update performed.");
    } else {
      console.log("Route scheme point published for " + id);
    }

    await mongoClient.close();

    fetch(`https://${process.env.PUBLISH_DEPLOY}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  } catch (err) {
    console.error("❌ Failed to upload post.json to MongoDB:", err);
    process.exit(1);
  }
})();
