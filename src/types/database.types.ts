import { Categories, PostLink } from "./common.types";

export type PostDocument = {
  id: string;
  title: string;
  category: Categories;
  isTop?: boolean;
  postDate: Date;
  base64Image: string;
};

export type CategoryDocument<T extends "region" | "country"> = {
  category: { [K in T]: string[] };
  id: string;
  base64Image: string;
};

export type CategoryRegionDocument = Pick<CategoryDocument<"region">, "id" | "base64Image">;

export type TripNote = {
  title: string;
  paragraph: string[];
  links: PostLink[];
};

export type TripNoteDocument = {
  id: string;
  notes: TripNote[];
};
