import { CategoriesEnum } from "enums/categories";
import { Category } from "types/PostPage.types";

export type CategoryCardProps = {
  category: Category & { originalName: string };
  postIds: string[];
  categoryType: CategoriesEnum;
  blurDataURL: string;
  id: string;
} & (
  | { isMainCard: true; areNotesPresent: true; buttonLabel: string }
  | { isMainCard: true; areNotesPresent?: false; buttonLabel?: string }
  | { isMainCard: false; areNotesPresent?: boolean; buttonLabel?: string }
);

export type CategoryDocument<T extends "region" | "country"> = {
  category: { [K in T]: string[] };
  id: string;
  base64Image: string;
};

export type CategoryRegionDocument = Pick<CategoryDocument<"region">, "id" | "base64Image">;
