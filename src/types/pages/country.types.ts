import { Post } from "../common.types";
import { TripNote } from "../database.types";

export type CountryPageProps = {
  posts: Post[];
  code?: string;
  notes: TripNote[];
  imageId?: string;
  base64Image?: string;
  richData: any[];
};
