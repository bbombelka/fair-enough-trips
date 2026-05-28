import { Category } from "../common.types";

export type RegionsPageProps = {
  regions: Array<{
    region: Category & { originalName: string };
    postIds: string[];
    blurDataURL: string;
    id: string;
  }>;
};
