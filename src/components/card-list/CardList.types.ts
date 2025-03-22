import { Categories } from "types/PostPage.types";

export type CardListProps = {
  listTitle: string;
  dropGrid?: boolean;
};

export type Post = {
  id: string;
  title: string;
  category: Categories;
  isTop?: boolean;
  postDate: string;
};
