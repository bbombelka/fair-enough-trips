import { Category } from "../common.types";

export type CountriesPageProps = {
  countries: Array<{
    country: Category & { originalName: string };
    postIds: string[];
    blurDataURL: string;
    id: string;
  }>;
};
