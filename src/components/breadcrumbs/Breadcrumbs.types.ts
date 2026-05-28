import { Categories } from "types/common.types";
import { BreadcrumbParentPostData } from "types/pages/post.types";

export type BreadcrumbsProps = {
  category: Categories;
  postTitle: string;
  parentData?: BreadcrumbParentPostData;
};
