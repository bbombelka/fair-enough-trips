import { Category } from "types/PostPage.types";

export type PostCardListProps = {
  listTitle: string;
  posts: Post[];
};

export type Post = {
  id: string;
  title: string;
  category: Category;
  isTop?: boolean;
};
