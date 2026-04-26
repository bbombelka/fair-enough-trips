import { ImageProps } from "next/image";
import React, { FC, useState } from "react";
import NextImage from "next/image";
import { Loader } from "components/loader/Loader";

export const FETImage: FC<ImageProps & { sizes?: string; enableLoader?: boolean }> = ({
  onLoad,
  blurDataURL,
  sizes = "100vw",
  enableLoader = true,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(!Boolean(blurDataURL));

  const onImageLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
    onLoad?.(event);
    if (!blurDataURL) {
      setIsLoading(false);
    }
  };

  return (
    <>
      {enableLoader && !blurDataURL && <Loader isLoading={isLoading} loadingHeading="Loading image" hasExternalBorder isImage />}
      <NextImage
        style={{ objectFit: "cover", objectPosition: "center", margin: "0 auto" }}
        onLoad={onImageLoad}
        blurDataURL={`data:image/webp;base64,${blurDataURL}`}
        sizes={sizes}
        {...props}
      />
    </>
  );
};
