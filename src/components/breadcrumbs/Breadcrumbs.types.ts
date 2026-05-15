import { BreadcrumbParentPostData, Categories } from "types/PostPage.types";

export type BreadcrumbsProps = {
  category: Categories;
  postTitle: string;
  parentData?: BreadcrumbParentPostData;
};
