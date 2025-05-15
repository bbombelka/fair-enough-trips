import { Footer, Layout, Navbar } from "components";
import { CategoryCard } from "components/category-card/CategoryCard";
import Config from "Config";
import { CategoriesEnum, Countries } from "enums/categories";
import { mongoClient } from "MongoClient";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Category } from "types/PostPage.types";
import CardList from "components/card-list/CardList";
import { CategoryDocument } from "components/category-card/CategoryCard.types";
import { shuffleBackgroundImage } from "server/utils/ShuffleImage";

type CountriesPageProps = {
  countries: Array<{
    country: Category & { originalName: string };
    postIds: string[];
    blurDataURL: string;
    id: string;
  }>;
};

const CountriesPage: NextPage<CountriesPageProps> = ({ countries }) => {
  return (
    <>
      <Head>
        <title>Countries @ Fair Enough Trips</title>
        <meta name="description" content="Find your trip by selecting a country" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={`https://${Config.DOMAIN}/countries`} />
      </Head>
      <div>
        <Navbar />
        <Layout>
          <CardList listTitle="Find trip in country">
            {countries.map(({ country, postIds, blurDataURL, id }) => (
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
    </>
  );
};

export default CountriesPage;

export const getStaticProps: GetStaticProps<CountriesPageProps> = async () => {
  await mongoClient.connect();

  const postsCollection = mongoClient.db(Config.DB_NAME).collection(Config.POSTS_COLLECTION);
  const posts = await postsCollection
    .find()
    .project<CategoryDocument<"country">>({ id: true, ["category.country"]: true, base64Image: true })
    .toArray();

  const countries = Countries.sort((a, b) => a.name.localeCompare(b.name))
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

  return {
    props: {
      countries,
    },
  };
};
