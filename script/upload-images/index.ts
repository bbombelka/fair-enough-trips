import { readdir, readFile } from "fs/promises";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import Config from "../../src/Config";
import { getOrSelectId, POSTS_ROOT } from "../utils";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

(async () => {
  const args = process.argv.slice(2);
  const id = await getOrSelectId(args[0]);

  const dirPath = path.join(POSTS_ROOT, id);
  const keepFiles = new Set(["main.webp", "mobile-main.webp", "track.zip", "poi.json", "thumb_main.webp"]);

  const bucketName = process.env.S3_BUCKET_NAME;
  const s3Prefix = `${Config.S3_POST_IMAGES_PREFIX}/${id}/`;

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

  try {
    const files = await readdir(dirPath);
    const webpFiles = files.filter((f) => f.endsWith(".webp") && !keepFiles.has(f));

    if (webpFiles.length === 0) {
      console.log("No .webp files to upload.");
      return;
    }

    for (const file of webpFiles) {
      const filePath = path.join(dirPath, file);
      const fileBuffer = await readFile(filePath);

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `${s3Prefix}${file}`,
        Body: fileBuffer,
        ContentType: "image/webp",
      });

      await s3.send(command);
      console.log(`✅ Uploaded ${file}`);
    }

    console.log("🎉 All .webp files uploaded.");
  } catch (err) {
    console.error("❌ Upload failed:", err);
  }
})();
