import { Divider } from "components/divider/Divider";
import Config from "Config";
import React, { FC } from "react";
import Image from "next/image";
import { PostImage } from "pages/posts/[id]";
import styles from "styles/PostImages.module.css";

type PostImagesProps = {
  id: string;
  images: PostImage[];
};

export const PostImages: FC<PostImagesProps> = ({ id, images }) => {
  return (
    <>
      <Divider title="Visual" />
      {images.map(({ filename, desc, isVertical }, imageId) => {
        const width = isVertical ? Config.SHORT_STRETCH : Config.LONG_STRETCH;
        const height = isVertical ? Config.LONG_STRETCH : Config.SHORT_STRETCH;
        return (
          <div key={imageId} className={styles.images}>
            <Image
              src={`/${id}/${filename}.${Config.DEFAULT_EXTENSION}`}
              alt={desc}
              width={width}
              height={height}
            />
            <span className={styles.caption}>{desc}</span>
          </div>
        );
      })}
    </>
  );
};
