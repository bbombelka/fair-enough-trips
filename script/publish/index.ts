import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import Config from "../../src/Config";
import { getOrSelectId, POSTS_ROOT } from "../utils";
import { publishPost } from "./publishPost";

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

    await publishPost({ db, id, postsRoot: POSTS_ROOT });

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
