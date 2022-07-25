import { Divider } from "components/divider/Divider";
import Config from "Config";
import React, { FC } from "react";
import Image from "next/image";
import styles from "styles/PostImages.module.css";
import { PostImage } from "types/PostPage.types";

type PostImagesProps = {
  id: string;
  images: PostImage[];
};

export const PostImages: FC<PostImagesProps> = ({ id, images }) => {
  return (
    <div>
      <Divider title="Visual" />
      {images.map(({ filename, desc, isVertical }, imageId) => {
        const width = isVertical ? Config.SHORT_STRETCH : Config.LONG_STRETCH;
        const height = isVertical ? Config.LONG_STRETCH : Config.SHORT_STRETCH;
        const src = `/${id}/${filename}.${Config.DEFAULT_IMAGE_EXTENSION}`;
        return (
          <div
            key={imageId}
            className={styles.images}
            style={{ maxWidth: width }}
          >
            <a href={src} target="_blank" rel="noopener noreferrer">
              <Image
                className={styles.image}
                src={src}
                alt={desc}
                width={width}
                height={height}
                sizes="50vw"
                layout="responsive"
              />
            </a>
            <span className={styles.caption}>{desc}</span>
          </div>
        );
      })}
    </div>
  );
};
