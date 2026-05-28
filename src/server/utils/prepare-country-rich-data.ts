import { CollectionPage, ItemList, BreadcrumbList, WithContext } from "schema-dts";
import Config from "Config";
import { Post } from "types/common.types";
import { Countries } from "enums/categories";

export default function prepareCountryRichData(code: string, posts: Post[]) {
  const country = Countries.find((act) => act.code === code);
  
  const collectionPage: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${country?.name} - Fair Enough Trips`,
    description: `Latest trips and routes in ${country?.name}.`,
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
        name: "Countries",
        item: `https://${Config.DOMAIN}/countries`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: country?.name || "",
        item: `https://${Config.DOMAIN}/countries/${country?.url}`,
      },
    ],
  };

  return [collectionPage, itemList, breadcrumbList];
}
