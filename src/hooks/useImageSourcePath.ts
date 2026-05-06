import Config from "Config";

export function useImageSourcePath() {
  return function ({ id, filename, hdImagesToDisplay }: { id: string; filename: string; hdImagesToDisplay: Array<string | undefined> }): {
    src: string;
    thumbSrc: string;
  } {
    // const isProd = process.env.NODE_ENV === "production";
    const isProd = true;
    const isNewPostDevMode = process.env.NEXT_PUBLIC_NEW_POST_ID;

    // const isProd = true;
    function getProdParams() {
      const src = `${Config.S3_BUCKET}/posts-v2/${id}/${filename}.${Config.DEFAULT_IMAGE_EXTENSION}`;
      const thumbSrc = `${Config.S3_BUCKET}/posts-v2/${id}/${filename}-thumb.${Config.DEFAULT_IMAGE_EXTENSION}`;

      return { src, thumbSrc };
    }

    function getPostUploadParams() {
      const src = `/${id}/${filename}.${Config.DEFAULT_IMAGE_EXTENSION}`;
      // const hdImageSrc = hdImagesToDisplay.includes(filename) ? `/${id}/${filename}-HD.${Config.DEFAULT_IMAGE_EXTENSION}` : src;
      const thumbSrc = `/${id}/${filename}-thumb.${Config.DEFAULT_IMAGE_EXTENSION}`;

      return { src, thumbSrc };
    }

    function getDevParams() {
      const src = `/placeholder.${Config.DEFAULT_IMAGE_EXTENSION}`;
      const thumbSrc = `/placeholder.${Config.DEFAULT_IMAGE_EXTENSION}`;

      return { src, thumbSrc };
    }

    if (isProd) return getProdParams();
    return isNewPostDevMode ? getPostUploadParams() : getDevParams();
  };
}
