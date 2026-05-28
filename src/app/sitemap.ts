import { MetadataRoute } from "next";
import { getPathsPosts } from "server/shared/posts";
import { Activities, Countries, Regions } from "enums/categories";
import Config from "Config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPathsPosts();
  const domain = `https://${Config.DOMAIN}`;

  const postRoutes = posts.map((post) => ({
    url: `${domain}/posts/${post.id}`,
    lastModified: new Date(),
  }));

  const activityRoutes = Activities.map((activity) => ({
    url: `${domain}/activity/${activity.url}`,
    lastModified: new Date(),
  }));

  const countryRoutes = Countries.map((country) => ({
    url: `${domain}/countries/${country.url}`,
    lastModified: new Date(),
  }));

  const regionRoutes = Regions.map((region) => ({
    url: `${domain}/regions/${region.url}`,
    lastModified: new Date(),
  }));

  const staticRoutes = ["", "/about", "/countries", "/regions", "/search"].map((route) => ({
    url: `${domain}${route}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...postRoutes, ...activityRoutes, ...countryRoutes, ...regionRoutes];
}
