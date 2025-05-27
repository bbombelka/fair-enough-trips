import { Divider } from "components/divider/Divider";
import Config from "Config";
import React, { FC } from "react";
import { FETImage } from "components/fet-image/FETImage";
import styles from "styles/PostImages.module.css";
import { PostImage, PostVideo } from "types/PostPage.types";
import { useBucketSourcePath } from "hooks/useBucketSourcePath";
import { YoutubeIframe } from "components/yt-iframe/YoutubeIframe";

type PostImagesProps = {
  id: string;
  images: PostImage[];
  videos: PostVideo[];
  order?: number;
  hdImagesToDisplay: Array<string | undefined>;
};

export const PostImages: FC<PostImagesProps> = ({ id, images, order, hdImagesToDisplay, videos }) => {
  const isProd = process.env.NODE_ENV === "production";

  const copy = (e: any) => {
    navigator.clipboard.writeText(`"${e.currentTarget.innerText}"`);
  };

  return (
    <div>
      <Divider title="Visual" order={order} stickyScrollToElementId="post-images" />
      {images.map(({ filename, desc, isVertical }, imageId) => {
        const width = isVertical ? Config.SHORT_STRETCH : Config.LONG_STRETCH;
        const height = isVertical ? Config.LONG_STRETCH : Config.SHORT_STRETCH;
        const { src, hdImageSrc } = useBucketSourcePath({ id, filename, hdImagesToDisplay });

        return (
          <div id="post-images" key={imageId} className={styles.images} style={{ maxWidth: width }}>
            <a href={hdImageSrc} target="_blank" rel="noopener noreferrer">
              <FETImage
                id={filename}
                className={styles.image}
                src={src}
                alt={desc}
                quality="100"
                width={width}
                height={height}
                sizes="50vw"
                layout="responsive"
                unoptimized
              />
            </a>
            {!isProd && <span onClick={copy}>{filename}</span>}
            <span className={styles.caption}>{desc}</span>
          </div>
        );
      })}
      {videos?.map(({ src, desc }) => (
        <YoutubeIframe src={src} description={desc} />
      ))}
    </div>
  );
};
