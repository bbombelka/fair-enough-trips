import { MetadataRoute } from "next";
import { getPathsPosts } from "server/shared/posts";
import { Activities, Countries, Regions } from "enums/categories";
import Config from "Config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPathsPosts();
  const domain = `https://${Config.DOMAIN}`;

  // Extract active category codes from all posts
  const activeActivityCodes = new Set(posts.map((post) => post.category.activity).flat());
  const activeCountryCodes = new Set(posts.map((post) => post.category.country).flat());
  const activeRegionCodes = new Set(posts.map((post) => post.category.region).flat());

  const postRoutes = posts.map((post) => ({
    url: `${domain}/posts/${post.id}`,
    lastModified: new Date(),
  }));

  const activityRoutes = Activities
    .filter((activity) => activeActivityCodes.has(activity.code))
    .map((activity) => ({
      url: `${domain}/activity/${activity.url}`,
      lastModified: new Date(),
    }));

  const countryRoutes = Countries
    .filter((country) => activeCountryCodes.has(country.code))
    .map((country) => ({
      url: `${domain}/countries/${country.url}`,
      lastModified: new Date(),
    }));

  const regionRoutes = Regions
    .filter((region) => activeRegionCodes.has(region.code))
    .map((region) => ({
      url: `${domain}/regions/${region.url}`,
      lastModified: new Date(),
    }));

  const staticRoutes = ["", "/about", "/countries", "/regions", "/search"].map((route) => ({
    url: `${domain}${route}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...postRoutes, ...activityRoutes, ...countryRoutes, ...regionRoutes];
}
