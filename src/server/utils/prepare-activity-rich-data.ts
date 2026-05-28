import { CollectionPage, ItemList, BreadcrumbList, WithContext } from "schema-dts";
import Config from "Config";
import { Post } from "types/common.types";
import { Activities } from "enums/categories";

export default function prepareActivityRichData(code: string, posts: Post[]) {
  const activity = Activities.find((act) => act.code === code);

  const collectionPage: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${activity?.name} - Fair Enough Trips`,
    description: `Latest ${activity?.name} posts and routes.`,
  };

  const itemList: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://${Config.DOMAIN}/posts/${post.id}`,
      name: post.title,
    })),
  };

  const breadcrumbList: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `https://${Config.DOMAIN}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: activity?.name || "",
        item: `https://${Config.DOMAIN}/activity/${activity?.url}`,
      },
    ],
  };

  return [collectionPage, itemList, breadcrumbList];
}
