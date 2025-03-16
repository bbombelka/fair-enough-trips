import { ImageProps } from "next/image";
import React, { FC, useState } from "react";
import Image from "next/image";
import { Loader } from "components/loader/Loader";

interface FETImageProps extends ImageProps {
  isMainImage?: boolean;
}

export const FETImage: FC<FETImageProps> = ({ isMainImage, onLoad, ...props }) => {
  const [isLoading, setIsLoading] = useState(() => (isMainImage ? false : true));

  const onImageLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
    onLoad?.(event);
    setIsLoading(false);
  };

  return (
    <>
      <Loader isLoading={isLoading} loadingHeading="Loading image" hasExternalBorder />
      <Image objectFit="cover" objectPosition="center" layout="responsive" onLoad={onImageLoad} {...props} />
    </>
  );
};
