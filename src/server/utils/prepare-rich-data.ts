import { FullPost } from "types/pages/post.types";
import { PropertyValue, Trip, Article, BreadcrumbList, Graph } from "schema-dts";
import Config from "Config";
import { Activities, Regions } from "enums/categories";

export default function preparePostRichData(post: FullPost) {
  const statsSummary = post.stats ? `${post.stats.distance}km / ${post.stats.up}m / ${post.stats.duration}h` : "";
  const postContent = `${post.title} - ${post.subTitle}${statsSummary ? ` [${statsSummary}]` : ""}`;

  const activity = Activities.find((activity) => activity.code === post.category.activity[0]);
  const region = Regions.find((region) => region.code === post.category.region[0]);

  const breadcrumbList: BreadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Homepage",
        item: `https://${Config.DOMAIN}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: region?.name,
        item: `https://${Config.DOMAIN}/regions/${region?.url}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: activity?.name,
        item: `https://${Config.DOMAIN}/activity/${activity?.url}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: post.title,
        item: `https://${Config.DOMAIN}/posts/${post.id}`,
      },
    ],
  };

  const article: Article = {
    "@type": "Article",
    headline: post.title,
    articleSection: "Mountaineering",
    mainEntityOfPage: `https://${Config.DOMAIN}/posts/${post.id}`,
    description: postContent,
    image: `https://${Config.DOMAIN}/${post.id}/main.${Config.DEFAULT_IMAGE_EXTENSION}`,
    datePublished: post.postDate as unknown as string,
    author: {
      "@type": "Person",
      name: "Fair Enough Trips",
      url: `https://${Config.DOMAIN}`,
    },
    about: {
      "@type": "Trip",
      name: post.title,
      description: post.subTitle,
      tripOrigin: {
        "@type": "Place",
        name: post.startingPoint,
        hasMap: post.iframeUrl,
      },
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "distance (km)",
          value: post.stats.distance,
        },
        {
          "@type": "PropertyValue",
          name: "ascent (m)",
          value: post.stats.up,
        },
        {
          "@type": "PropertyValue",
          name: "descent (m)",
          value: post.stats.down,
        },
        {
          "@type": "PropertyValue",
          name: "duration (h)",
          value: post.stats.duration,
        },
      ],
    } as Trip & { additionalProperty: PropertyValue[] },
  };

  const richData: Graph & { "@context": string } = {
    "@context": "https://schema.org",
    "@graph": [article, breadcrumbList],
  };

  return richData;
}
