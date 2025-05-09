import { ImageProps } from "next/image";
import React, { FC, useState } from "react";
import Image from "next/image";
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
      <Image objectFit="cover" objectPosition="center" layout="responsive" onLoad={onImageLoad} blurDataURL={blurDataURL} {...props} />
    </>
  );
};
