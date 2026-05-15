import { Post } from "components/card-list/CardList.types";

import { SearchPostType } from "types/PostPage.types";

export type PostCardProps = {
  post: Post | SearchPostType;
  isMainPostCard?: boolean;
  displayScrollDownButton?: boolean;
};
