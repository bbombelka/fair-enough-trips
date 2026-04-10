import { FullPost } from "types/PostPage.types";
import { PropertyValue, WithContext, Trip, Article } from "schema-dts";
import Config from "Config";

export default function preparePostRichData(post: FullPost) {
  const statsSummary = post.stats ? `${post.stats.distance}km / ${post.stats.up}m / ${post.stats.duration}h` : "";
  const postContent = `${post.title} - ${post.subTitle}${statsSummary ? ` [${statsSummary}]` : ""}`;

  const richData: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
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

  return richData;
}
