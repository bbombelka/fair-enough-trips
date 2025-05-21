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
  const filePath = path.resolve(__dirname, `../../public/${id}/route-scheme-points.json`);

  try {
    // 1. Read and parse JSON
    const raw = await readFile(filePath, "utf-8");
    const routeScheme = JSON.parse(raw);

    if (!routeScheme.id) {
      console.error("❌ JSON file must include an 'id' field.");
      process.exit(1);
    }

    const optimizedPoints = routeScheme.points.map((point) => stripEmpty(point));

    const mongoClient = new MongoClient(String(MONGODB_URI), {
      serverApi: ServerApiVersion.v1,
    });

    await mongoClient.connect();
    const db = mongoClient.db(Config.DB_NAME);
    const collection = db.collection(Config.ROUTE_SCHEME_POINTS);
    const filter = { id: routeScheme.id };
    const update = { $set: { ...routeScheme, points: optimizedPoints } };
    const options = { upsert: true };

    const result = await collection.updateOne(filter, update, options);
    console.log("✅ Upload complete:", result.upsertedId ?? "updated existing");

    await mongoClient.close();
  } catch (err) {
    console.error("❌ Failed to upload post.json to MongoDB:", err);
    process.exit(1);
  }
})();

function stripEmpty(obj) {
  if (Array.isArray(obj)) {
    // Clean each item in the array
    return obj.map(stripEmpty).filter((item) => !(item === undefined || (typeof item === "object" && item !== null && Object.keys(item).length === 0)));
  } else if (obj !== null && typeof obj === "object") {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = stripEmpty(value);

      const isEmptyObject = typeof cleanedValue === "object" && cleanedValue !== null && !Array.isArray(cleanedValue) && Object.keys(cleanedValue).length === 0;
      const isEmptyArray = Array.isArray(cleanedValue) && cleanedValue.length === 0;
      const isEmptyString = cleanedValue === "";

      if (!(isEmptyObject || isEmptyArray || isEmptyString)) {
        cleaned[key] = cleanedValue;
      }
    }
    return cleaned;
  }

  return obj;
}
