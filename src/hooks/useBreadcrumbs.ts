import { Categories } from "types/PostPage.types";
import { Activities, Countries, Regions } from "enums/categories";

export const useBreadcrumbs = (category: Categories) => {
  const activity = Activities.find((activity) => activity.code === category.activity[0]);
  const region = Regions.find((region) => region.code === category.region[0]);
  const country = Countries.find((country) => country.code === category.country[0]);

  return [
    { name: activity?.name, url: `activity/${activity?.url}` },
    { name: region?.name, url: `regions/${region?.url}` },
    { name: country?.name, url: `countries/${country?.url}` },
  ];
};
