import { CategoriesEnum } from "enums/categories";
import { Category } from "types/PostPage.types";

export type CategoryCardProps = {
  category: Category & { originalName: string };
  postIds: string[];
  isMainCard: boolean;
  categoryType: CategoriesEnum;
  areNotesPresent?: boolean;
  blurDataURL: string;
  id: string;
};

export type CategoryDocument<T extends "region" | "country"> = {
  category: { [K in T]: string[] };
  id: string;
  base64Image: string;
};

export type CategoryRegionDocument = Pick<CategoryDocument<"region">, "id" | "base64Image">;
