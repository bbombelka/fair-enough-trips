import { Post } from "components/post-card-list/PostCardList.types";

export type PostCardProps = {
  post: Post;
  isMainPostCard?: boolean;
  displayScrollDownButton?: boolean;
};
