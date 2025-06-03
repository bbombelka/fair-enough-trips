import { readFile } from "fs/promises";
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
  const filePath = path.resolve(__dirname, `../../public/${id}/post.json`);

  try {
    // 1. Read and parse JSON
    const raw = await readFile(filePath, "utf-8");
    const jsonData = JSON.parse(raw);

    if (!jsonData.id) {
      console.error("❌ JSON file must include an 'id' field.");
      process.exit(1);
    }

    jsonData.postDate = new Date(jsonData.postDate);

    const mongoClient = new MongoClient(String(MONGODB_URI), {
      serverApi: ServerApiVersion.v1,
    });

    await mongoClient.connect();
    const db = mongoClient.db(Config.DB_NAME);
    const collection = db.collection(Config.POSTS_COLLECTION);
    const filter = { id: jsonData.id }; // or use { _id: jsonData.id } if you're storing as _id
    const update = { $set: jsonData };
    const options = { upsert: true };

    const result = await collection.updateOne(filter, update, options);
    console.log("✅ Upload complete:", result.upsertedId ?? "updated existing");

    await mongoClient.close();
  } catch (err) {
    console.error("❌ Failed to upload post.json to MongoDB:", err);
    process.exit(1);
  }
})();
