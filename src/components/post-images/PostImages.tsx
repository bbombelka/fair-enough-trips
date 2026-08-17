"use client";

import React, { FC } from "react";
import { useImageSourcePath } from "hooks/useImageSourcePath";
import { ImageGallery } from "components/image-gallery/ImageGallery";
import { PostImagesProps } from "./PostImages.types";

export const PostImages: FC<PostImagesProps> = ({ id, images, videos }) => {
  const getImageSourcePath = useImageSourcePath();

  return (
    <ImageGallery
      id={id}
      images={images}
      videos={videos}
      getImageSourcePath={getImageSourcePath}
    />
  );
};
