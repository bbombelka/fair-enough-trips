import { CategoriesEnum } from "enums/categories";
import { Category } from "types/PostPage.types";

export type CategoryCardProps = {
  category: Category & { originalName: string };
  postIds: string[];
  isMainCard: boolean;
  categoryType: CategoriesEnum;
  areNotesPresent?: boolean;
};
