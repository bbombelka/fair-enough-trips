import { rename, readFile, writeFile } from "fs/promises";
import path from "path";
import { MongoClient, ServerApiVersion } from "mongodb";
import { S3Client, ListObjectsV2Command, CopyObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import readlineSync from "readline-sync";
import fs from "fs";
import Config from "../../src/Config";
import { POSTS_ROOT } from "../utils";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });
const MONGODB_URI = process.env.DB_URI;

(async () => {
  const oldId = readlineSync.question("Enter the actual post ID (old ID): ").trim();
  const newId = readlineSync.question("Enter the new post ID: ").trim();

  if (!oldId || !newId) {
    console.error("❌ Both old ID and new ID must be provided.");
    process.exit(1);
  }

  if (oldId === newId) {
    console.error("❌ Old ID and new ID are identical.");
    process.exit(1);
  }

  console.log(`\n🚀 Starting ID change from "${oldId}" to "${newId}"...\n`);

  // ==========================================
  // 1. S3 Operations
  // ==========================================
  const bucketName = process.env.S3_BUCKET_NAME;
  if (!bucketName) {
    console.error("❌ S3_BUCKET_NAME is not defined in .env.local");
    process.exit(1);
  }

  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const oldPrefix = `${Config.S3_POST_IMAGES_PREFIX}/${oldId}/`;
  const newPrefix = `${Config.S3_POST_IMAGES_PREFIX}/${newId}/`;

  try {
    console.log(`🔍 Listing S3 objects with prefix "${oldPrefix}"...`);
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: oldPrefix,
    });
    const listedObjects = await s3.send(listCommand);

    if (listedObjects.Contents && listedObjects.Contents.length > 0) {
      console.log(`📦 Found ${listedObjects.Contents.length} objects in S3. Copying...`);

      for (const obj of listedObjects.Contents) {
        if (!obj.Key) continue;
        const filename = obj.Key.substring(oldPrefix.length);
        const newKey = `${newPrefix}${filename}`;

        // S3 Copy Object expects source to be "/bucket-name/key"
        const copySource = `/${bucketName}/${obj.Key}`;

        console.log(`   Copying s3://${bucketName}/${obj.Key} ➡️ s3://${bucketName}/${newKey}...`);
        await s3.send(
          new CopyObjectCommand({
            Bucket: bucketName,
            CopySource: copySource,
            Key: newKey,
          }),
        );
      }
      console.log("✅ S3 directory copy completed successfully.\n");
    } else {
      console.log(`⚠️ No S3 objects found under prefix "${oldPrefix}". Skipping S3 copy.\n`);
    }
  } catch (err) {
    console.error("❌ S3 operation failed:", err);
    process.exit(1);
  }

  // ==========================================
  // 2. MongoDB Operations
  // ==========================================
  if (!MONGODB_URI) {
    console.error("❌ DB_URI is not defined in .env.local");
    process.exit(1);
  }

  const mongoClient = new MongoClient(MONGODB_URI, {
    serverApi: ServerApiVersion.v1,
  });

  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoClient.connect();
    const db = mongoClient.db(Config.DB_NAME);

    // 2.1 Update Post ID in posts collection
    const postsCollection = db.collection(Config.POSTS_COLLECTION);

    console.log(`📝 Updating post ID in "${Config.POSTS_COLLECTION}" collection...`);
    const postUpdateResult = await postsCollection.updateOne({ id: oldId }, { $set: { id: newId } });
    console.log(`   Matches: ${postUpdateResult.matchedCount}, Modified: ${postUpdateResult.modifiedCount}`);

    // 2.2 Update parentId inside sub-posts
    console.log(`📝 Updating parentId inside sub-posts...`);
    const parentIdResult = await postsCollection.updateMany({ parentId: oldId }, { $set: { parentId: newId } });
    console.log(`   Matches: ${parentIdResult.matchedCount}, Modified: ${parentIdResult.modifiedCount}`);

    // 2.3 Update subIds inside parent posts
    console.log(`📝 Updating subIds inside parent posts...`);
    const subIdsResult = await postsCollection.updateMany({ subIds: oldId }, { $set: { "subIds.$": newId } });
    console.log(`   Matches: ${subIdsResult.matchedCount}, Modified: ${subIdsResult.modifiedCount}`);

    // 2.4 Update tripsUsed in gear collection
    const gearCollection = db.collection("gear");
    console.log(`📝 Updating tripsUsed inside "gear" collection...`);
    const gearResult = await gearCollection.updateMany({ tripsUsed: oldId }, { $set: { "tripsUsed.$": newId } });
    console.log(`   Matches: ${gearResult.matchedCount}, Modified: ${gearResult.modifiedCount}`);

    // 2.5 Update id inside route-scheme-points collection
    const routeSchemeCollection = db.collection(Config.ROUTE_SCHEME_POINTS);
    console.log(`📝 Updating ID inside "${Config.ROUTE_SCHEME_POINTS}" collection...`);
    const routeSchemeResult = await routeSchemeCollection.updateOne({ id: oldId }, { $set: { id: newId } });
    console.log(`   Matches: ${routeSchemeResult.matchedCount}, Modified: ${routeSchemeResult.modifiedCount}`);

    console.log("✅ MongoDB updates completed successfully.\n");
  } catch (err) {
    console.error("❌ MongoDB operation failed:", err);
    await mongoClient.close();
    process.exit(1);
  } finally {
    await mongoClient.close();
  }

  // ==========================================
  // 3. Local Filesystem Operations
  // ==========================================
  const oldLocalPath = path.join(POSTS_ROOT, oldId);
  const newLocalPath = path.join(POSTS_ROOT, newId);

  if (fs.existsSync(oldLocalPath)) {
    console.log(`📁 Local directory found at "${oldLocalPath}"`);

    // 3.1 Update post.json ID inside directory
    const postJsonPath = path.join(oldLocalPath, "post.json");
    if (fs.existsSync(postJsonPath)) {
      try {
        console.log(`📝 Updating ID inside local "post.json"...`);
        const rawJson = await readFile(postJsonPath, "utf-8");
        const jsonData = JSON.parse(rawJson);

        jsonData.id = newId;

        // If this is a parent post, also update parentId for subIds or parent relations if present
        if (jsonData.parentId === oldId) {
          jsonData.parentId = newId;
        }
        if (jsonData.subIds && Array.isArray(jsonData.subIds)) {
          jsonData.subIds = jsonData.subIds.map((subId: string) => (subId === oldId ? newId : subId));
        }

        await writeFile(postJsonPath, JSON.stringify(jsonData, null, 2), "utf-8");
        console.log(`   Updated "id" to "${newId}" inside local post.json`);
      } catch (err) {
        console.error("❌ Failed to update local post.json contents:", err);
        process.exit(1);
      }
    }

    // 3.3 Rename the directory
    try {
      console.log(`📁 Renaming directory to "${newLocalPath}"...`);
      await rename(oldLocalPath, newLocalPath);
      console.log("✅ Local directory renamed successfully.\n");
    } catch (err) {
      console.error("❌ Failed to rename local directory:", err);
      process.exit(1);
    }
  } else {
    console.log(`⚠️ Local directory "${oldLocalPath}" not found. Skipping local folder rename.\n`);
  }

  console.log(`🎉 ID change from "${oldId}" to "${newId}" completed successfully!`);
})();
