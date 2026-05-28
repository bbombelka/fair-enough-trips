import { Post } from "../common.types";
import { TripNote } from "../database.types";

export type RegionPageProps = {
  posts: Post[];
  code?: string;
  notes: TripNote[];
  imageId?: string | null;
  base64Image?: string | null;
  richData: any[];
};
