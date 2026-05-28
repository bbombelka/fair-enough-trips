import { Footer, Layout, Navbar } from "components";
import { CategoryCard } from "components/category-card/CategoryCard";
import Config from "Config";
import { CategoriesEnum, Countries } from "enums/categories";
import mongoClientConnectPromise from "MongoClient";
import { Metadata } from "next";
import CardList from "components/card-list/CardList";
import { CategoryDocument } from "types/database.types";
import { shuffleBackgroundImage } from "server/utils/ShuffleImage";

export const metadata: Metadata = {
  title: "Countries @ Fair Enough Trips",
  description: "Find your trip by selecting a country",
  alternates: {
    canonical: `https://${Config.DOMAIN}/countries`,
  },
};

export default async function CountriesPage() {
  const mongoClient = await mongoClientConnectPromise;
  const isProd = process.env.NODE_ENV === "production";

  const postsCollection = mongoClient.db(Config.DB_NAME).collection(Config.POSTS_COLLECTION);
  const posts = await postsCollection
    .find({ ...(isProd ? { published: true } : {}), parentId: { $exists: false } })
    .project<CategoryDocument<"country">>({ id: true, ["category.country"]: true, base64Image: true })
    .toArray();

  const countriesData = Countries.sort((a, b) => a.name.localeCompare(b.name))
    .map((country) => {
      const postIds = posts.filter(({ category }) => category.country.includes(country.code)).map((post) => post.id);
      const id = shuffleBackgroundImage(postIds);
      const blurDataURL = posts.find((post) => post.id === id)?.base64Image ?? "";

      return {
        country: { ...country, originalName: "" },
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
        <CardList listTitle="Find trip in country">
          {countriesData.map(({ country, postIds, blurDataURL, id }) => (
            <CategoryCard
              id={id}
              blurDataURL={blurDataURL}
              key={country.code}
              categoryType={CategoriesEnum.Countries}
              category={country}
              postIds={postIds}
              isMainCard={false}
            />
          ))}
        </CardList>
      </Layout>
      <Footer isSticky />
    </div>
  );
}
