import Config from "Config";

export function useBucketSourcePath({ id, filename }: { id: string; filename: string }) {
  const isProd = process.env.NODE_ENV === "production";
  const newPostId = process.env.NEXT_PUBLIC_NEW_POST_ID;

  // const isProd = true;
  function getProdParams() {
    const src = `${Config.S3_BUCKET}/posts/${id}/${filename}.${Config.DEFAULT_IMAGE_EXTENSION}`;
    const hdImageSrc = `${Config.S3_BUCKET}/posts/${id}/${filename}-HD.${Config.DEFAULT_IMAGE_EXTENSION}`;

    return { src, hdImageSrc };
  }

  function getPostUploadParams() {
    const src = `${id}/${filename}.${Config.DEFAULT_IMAGE_EXTENSION}`;
    const hdImageSrc = `${id}/${filename}-HD.${Config.DEFAULT_IMAGE_EXTENSION}`;

    return { src, hdImageSrc };
  }

  function getDevParams() {
    const src = `/placeholder.${Config.DEFAULT_IMAGE_EXTENSION}`;
    const hdImageSrc = `/placeholder.${Config.DEFAULT_IMAGE_EXTENSION}`;

    return { src, hdImageSrc };
  }

  if (isProd) return getProdParams();
  return newPostId ? getPostUploadParams() : getDevParams();
}
