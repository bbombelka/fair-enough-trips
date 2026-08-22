import path from "path";
import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import readlineSync from "readline-sync";
import Config from "../../src/Config";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

(async () => {
  const id = readlineSync.question("Enter the post ID of the S3 directory to remove: ").trim();

  if (!id) {
    console.error("❌ Post ID must be provided.");
    process.exit(1);
  }

  // Double check confirmation
  const confirmation = readlineSync.question(`⚠️ Are you sure you want to permanently delete all S3 objects under prefix "${Config.S3_POST_IMAGES_PREFIX}/${id}/"? (y/N): `).trim().toLowerCase();

  if (confirmation !== "y" && confirmation !== "yes") {
    console.log("Deletion cancelled.");
    process.exit(0);
  }

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

  const prefix = `${Config.S3_POST_IMAGES_PREFIX}/${id}/`;

  try {
    console.log(`🔍 Listing S3 objects under prefix "${prefix}"...`);
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    });
    const listedObjects = await s3.send(listCommand);

    if (listedObjects.Contents && listedObjects.Contents.length > 0) {
      console.log(`🗑️ Found ${listedObjects.Contents.length} objects. Deleting...`);

      for (const obj of listedObjects.Contents) {
        if (!obj.Key) continue;
        console.log(`   Deleting s3://${bucketName}/${obj.Key}...`);
        await s3.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: obj.Key,
          })
        );
      }
      console.log(`\n🎉 Successfully removed all S3 objects under prefix "${prefix}"`);
    } else {
      console.log(`⚠️ No objects found in S3 under prefix "${prefix}". Nothing to delete.`);
    }
  } catch (err) {
    console.error("❌ Deletion failed:", err);
    process.exit(1);
  }
})();
