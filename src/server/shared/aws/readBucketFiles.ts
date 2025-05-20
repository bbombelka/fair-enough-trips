import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function listFilesInPostDirectory(postFolder: string) {
  const prefix = `posts/${postFolder}/`;

  const command = new ListObjectsV2Command({
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: prefix,
  });

  try {
    const response = await s3.send(command);
    const files = response.Contents?.map((obj) => obj.Key).filter((key) => key !== prefix) || [];

    return files;
  } catch (error) {
    console.error(`Error listing files in ${prefix}:`, error);
    return [];
  }
}
