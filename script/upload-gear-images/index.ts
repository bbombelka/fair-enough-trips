import { readdir, readFile } from "fs/promises";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import readlineSync from "readline-sync";
import fs from "fs";
import Config from "../../src/Config";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const contentTypeMap: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

(async () => {
  const args = process.argv.slice(2);
  let dirPath = args[0];

  if (!dirPath) {
    dirPath = readlineSync.question("Enter the path to the local directory containing gear images: ");
  }

  if (!dirPath) {
    console.error("❌ No directory path provided.");
    process.exit(1);
  }

  const resolvedPath = path.resolve(dirPath);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`❌ Directory does not exist: ${resolvedPath}`);
    process.exit(1);
  }

  const stats = fs.statSync(resolvedPath);
  if (!stats.isDirectory()) {
    console.error(`❌ Path is not a directory: ${resolvedPath}`);
    process.exit(1);
  }

  const bucketName = process.env.S3_BUCKET_NAME;
  const s3Prefix = `${Config.S3_GEAR_PREFIX}/`;

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
    const files = await readdir(resolvedPath, { withFileTypes: true });
    const fileEntries = files.filter((entry) => entry.isFile());

    if (fileEntries.length === 0) {
      console.log("No files to upload.");
      return;
    }

    for (const entry of fileEntries) {
      const fileName = entry.name;
      const ext = path.extname(fileName).toLowerCase();
      const contentType = contentTypeMap[ext] || "application/octet-stream";

      const filePath = path.join(resolvedPath, fileName);
      const fileBuffer = await readFile(filePath);

      const s3Key = `${s3Prefix}${fileName}`;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: contentType,
      });

      console.log(`Uploading ${fileName} to s3://${bucketName}/${s3Key} (${contentType})...`);
      await s3.send(command);
      console.log(`✅ Uploaded ${fileName}`);
    }

    console.log("🎉 All files from the directory uploaded directly into gear dir in S3 bucket.");
  } catch (err) {
    console.error("❌ Upload failed:", err);
  }
})();
