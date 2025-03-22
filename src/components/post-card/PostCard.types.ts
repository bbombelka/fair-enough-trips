import { Post } from "components/card-list/CardList.types";
import { Dispatch, SetStateAction } from "react";
import { SearchPostType } from "types/PostPage.types";

export type PostCardProps = {
  post: Post | SearchPostType;
  setImageLoaded?: Dispatch<SetStateAction<boolean>>;
  isMainPostCard?: boolean;
  displayScrollDownButton?: boolean;
};
