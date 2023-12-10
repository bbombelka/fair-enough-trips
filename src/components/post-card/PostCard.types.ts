import { Post } from "components/card-list/CardList.types";
import { Dispatch, SetStateAction } from "react";

export type PostCardProps = {
  post: Post;
  setImageLoaded?: Dispatch<SetStateAction<boolean>>;
  isMainPostCard?: boolean;
  displayScrollDownButton?: boolean;
};
