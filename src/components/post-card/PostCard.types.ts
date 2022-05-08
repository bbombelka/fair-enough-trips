import { Post } from "components/card-list/CardList.types";

export type PostCardProps = {
  post: Post;
  isMainPostCard?: boolean;
  displayScrollDownButton?: boolean;
};
