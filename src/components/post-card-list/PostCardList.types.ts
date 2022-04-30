import { Categories } from "types/PostPage.types";

export type PostCardListProps = {
  listTitle: string;
  posts: Post[];
};

export type Post = {
  id: string;
  title: string;
  category: Categories;
  isTop?: boolean;
  postDate: string;
};
