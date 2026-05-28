import { PostImage, PostVideo } from "types/common.types";

export type PostImagesProps = {
  id: string;
  images: PostImage[];
  videos: PostVideo[];
};
