import Config from "Config";

export function useBucketSourcePath({ id, filename, hdImagesToDisplay }: { id: string; filename: string; hdImagesToDisplay: Array<string | undefined> }) {
  const isProd = process.env.NODE_ENV === "production";

  function getProdParams() {
    const s3BucketUrl = String(process.env.S3_BUCKET);
    const src = `${s3BucketUrl}/posts/${id}/${filename}.${Config.DEFAULT_IMAGE_EXTENSION}`;
    const hdImageSrc = hdImagesToDisplay.includes(filename) ? `${s3BucketUrl}/posts/${id}/${filename}-HD.${Config.DEFAULT_IMAGE_EXTENSION}` : src;

    return { src, hdImageSrc };
  }

  function getDevParams() {
    const src = `/placeholder.${Config.DEFAULT_IMAGE_EXTENSION}`;
    const hdImageSrc = `/placeholder.${Config.DEFAULT_IMAGE_EXTENSION}`;

    return { src, hdImageSrc };
  }

  return isProd ? getProdParams() : getDevParams();
}
