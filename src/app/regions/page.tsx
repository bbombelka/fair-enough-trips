import { Footer, Layout, Navbar } from "components";
import { CategoryCard } from "components/category-card/CategoryCard";
import Config from "Config";
import { CategoriesEnum, Regions } from "enums/categories";
import mongoClientConnectPromise from "MongoClient";
import { Metadata } from "next";
import CardList from "components/card-list/CardList";
import { CategoryDocument } from "types/database.types";
import { shuffleBackgroundImage } from "server/utils/ShuffleImage";

export const metadata: Metadata = {
  title: "Regions @ Fair Enough Trips",
  description: "Find your trip by selecting a region",
  alternates: {
    canonical: `https://${Config.DOMAIN}/regions`,
  },
};

export default async function RegionsPage() {
  const mongoClient = await mongoClientConnectPromise;
  const isProd = process.env.NODE_ENV === "production";

  const postsCollection = mongoClient.db(Config.DB_NAME).collection(Config.POSTS_COLLECTION);
  const posts = await postsCollection
    .find({ ...(isProd ? { published: true } : {}), parentId: { $exists: false } })
    .project<CategoryDocument<"region">>({ id: true, ["category.region"]: true, base64Image: true })
    .toArray();

  const regionsData = Regions.sort((a, b) => a.name.localeCompare(b.name))
    .map((region) => {
      const postIds = posts.filter(({ category }) => category.region.includes(region.code)).map((post) => post.id);
      const id = shuffleBackgroundImage(postIds);
      const blurDataURL = posts.find((post) => post.id === id)?.base64Image ?? "";

      return {
        region,
        postIds,
        id,
        blurDataURL,
      };
    })
    .filter(({ postIds }) => postIds.length);

  return (
    <div>
      <Navbar />
      <Layout>
        <CardList listTitle="Find trip in region">
          {regionsData.map(({ region, postIds, blurDataURL, id }) => (
            <CategoryCard
              key={region.code}
              categoryType={CategoriesEnum.Regions}
              category={region}
              postIds={postIds}
              isMainCard={false}
              blurDataURL={blurDataURL}
              id={id}
            />
          ))}
        </CardList>
      </Layout>
      <Footer isSticky />
    </div>
  );
}
