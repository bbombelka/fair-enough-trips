import { Categories } from "types/common.types";
import { Activities, Regions } from "enums/categories";

export const useBreadcrumbs = (category: Categories) => {
  const activity = Activities.find((activity) => activity.code === category.activity[0]);
  const region = Regions.find((region) => region.code === category.region[0]);

  return [
    { name: region?.name, url: `regions/${region?.url}` },
    { name: activity?.name, url: `activity/${activity?.url}` },
  ];
};
