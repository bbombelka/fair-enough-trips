import { ImageProps } from "next/image";

export type FETImageProps = ImageProps & {
  sizes?: string;
};
