import { ImageProps } from "next/image";
import React, { FC, useState } from "react";
import NextImage from "next/image";
import { Loader } from "components/loader/Loader";

export const FETImage: FC<ImageProps> = ({ onLoad, blurDataURL, ...props }) => {
  const [isLoading, setIsLoading] = useState(!Boolean(blurDataURL));

  const onImageLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
    onLoad?.(event);
    if (!blurDataURL) {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!blurDataURL && <Loader isLoading={isLoading} loadingHeading="Loading image" hasExternalBorder isImage />}
      <NextImage
        style={{ objectFit: "cover", objectPosition: "center" }}
        onLoad={onImageLoad}
        blurDataURL={`data:image/webp;base64,${blurDataURL}`}
        {...props}
      />
    </>
  );
};
