import { CollectionPage, ItemList, BreadcrumbList, WithContext } from "schema-dts";
import Config from "Config";
import { Post } from "components/card-list/CardList.types";
import { Regions } from "enums/categories";

export default function prepareRegionRichData(code: string, posts: Post[]) {
  const region = Regions.find((act) => act.code === code);
  
  const collectionPage: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${region?.name} - Fair Enough Trips`,
    description: `Latest trips and routes in ${region?.name}.`,
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
        name: "Regions",
        item: `https://${Config.DOMAIN}/regions`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: region?.name || "",
        item: `https://${Config.DOMAIN}/regions/${region?.url}`,
      },
    ],
  };

  return [collectionPage, itemList, breadcrumbList];
}
