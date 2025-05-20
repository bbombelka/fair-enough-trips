import Config from "Config";

export function useBucketSourcePath({ id, filename, hdImagesToDisplay }: { id: string; filename: string; hdImagesToDisplay: Array<string | undefined> }) {
  const isProd = process.env.NODE_ENV === "production";

  function getProdParams() {
    const src = `${Config.S3_BUCKET}/posts/${id}/${filename}.${Config.DEFAULT_IMAGE_EXTENSION}`;
    const hdImageSrc = hdImagesToDisplay.includes(filename) ? `${Config.S3_BUCKET}/posts/${id}/${filename}-HD.${Config.DEFAULT_IMAGE_EXTENSION}` : src;

    return { src, hdImageSrc };
  }

  function getDevParams() {
    const src = `/placeholder.${Config.DEFAULT_IMAGE_EXTENSION}`;
    const hdImageSrc = `/placeholder.${Config.DEFAULT_IMAGE_EXTENSION}`;

    return { src, hdImageSrc };
  }

  return isProd ? getProdParams() : getDevParams();
}
