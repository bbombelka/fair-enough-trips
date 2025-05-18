import { Divider } from "components/divider/Divider";
import Config from "Config";
import React, { FC } from "react";
import { FETImage } from "components/fet-image/FETImage";
import styles from "styles/PostImages.module.css";
import { PostImage } from "types/PostPage.types";
import { useBucketSourcePath } from "hooks/useBucketSourcePath";

type PostImagesProps = {
  id: string;
  images: PostImage[];
  order?: number;
  hdImagesToDisplay: Array<string | undefined>;
};

export const PostImages: FC<PostImagesProps> = ({ id, images, order, hdImagesToDisplay }) => {
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
            <span className={styles.caption}>{desc}</span>
          </div>
        );
      })}
    </div>
  );
};
