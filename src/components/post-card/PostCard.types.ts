import { Post } from "types/common.types";
import { SearchPostType } from "types/pages/post.types";


export type PostCardProps = {
  post: Post | SearchPostType;
  isMainPostCard?: boolean;
  displayScrollDownButton?: boolean;
};
