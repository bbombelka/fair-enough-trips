import { ImageProps } from "next/image";
import React, { FC, useState } from "react";
import NextImage from "next/image";
import { Loader } from "components/loader/Loader";

import styles from "styles/FETImage.module.css";

export const FETImage: FC<ImageProps & { sizes?: string }> = ({ onLoad, blurDataURL, sizes = "100vw", className, ...props }) => {
  const [isLoading, setIsLoading] = useState(!Boolean(blurDataURL));
  const [isLoaded, setIsLoaded] = useState(false);

  const onImageLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
    onLoad?.(event);
    setIsLoaded(true);
    if (!blurDataURL) {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!blurDataURL && <Loader isLoading={isLoading} loadingHeading="Loading image" hasExternalBorder isImage />}
      <NextImage
        style={{ objectFit: "cover", objectPosition: "center", margin: "0 auto" }}
        onLoad={onImageLoad}
        blurDataURL={`data:image/webp;base64,${blurDataURL}`}
        sizes={sizes}
        className={`${className} ${isLoaded ? styles["liven-up"] : ""}`}
        {...props}
      />
    </>
  );
};
