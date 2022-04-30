import { Activities, Countries, Regions } from "enums/categories";
import { useMemo } from "react";
import { Categories } from "types/PostPage.types";

export const useMappedCategories = (category: Categories) => {
  const [activities, regions, countries] = useMemo(() => {
    return [
      mapActivityToName(category.activity),
      mapRegionToName(category.region),
      mapCountryToName(category.country),
    ];
  }, [category]);

  return [activities, regions, countries];
};

function mapActivityToName(activities: string[]) {
  const mapped = activities.map(
    (code) => Activities.find((act) => act.code === code)?.name,
  );

  return mapped.length ? mapped.filter(Boolean) : ["Activity"];
}

function mapCountryToName(countries: string[]) {
  const mapped = countries.map(
    (code) => Countries.find((country) => country.code === code)?.name,
  );
  return mapped.length ? mapped.filter(Boolean) : ["Country"];
}

function mapRegionToName(regions: string[]) {
  const mapped = regions.map(
    (code) => Regions.find((region) => region.code === code)?.name,
  );
  return mapped.length ? mapped.filter(Boolean) : ["Region"];
}
