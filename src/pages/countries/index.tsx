import { Footer, Layout, Navbar } from "components";
import { CategoryCard } from "components/category-card/CategoryCard";
import Config from "Config";
import { CategoriesEnum, Countries } from "enums/categories";
import { mongoClient } from "MongoClient";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Category, FullPost } from "types/PostPage.types";
import CardList from "components/card-list/CardList";

type CountriesPageProps = {
  countries: Array<{
    country: Category & { originalName: string };
    postIds: string[];
  }>;
};

const CountriesPage: NextPage<CountriesPageProps> = ({ countries }) => {
  return (
    <>
      <Head>
        <title>Countries @ Fair Enough Trips</title>
        <meta
          name="description"
          content="Find your trip by selecting a country"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div>
        <Navbar />
        <Layout>
          <CardList listTitle="Find trip in country">
            {countries.map(({ country, postIds }) => (
              <CategoryCard
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

  const postsCollection = mongoClient
    .db(Config.DB_NAME)
    .collection(Config.POSTS_COLLECTION);
  const posts = await postsCollection.find().toArray();
  const parsedPosts: FullPost[] = JSON.parse(JSON.stringify(posts));

  const countries = Countries.sort((a, b) => a.name.localeCompare(b.name))
    .map((country) => ({
      country: { ...country, originalName: "" },
      postIds: parsedPosts
        .filter(({ category }) => category.country.includes(country.code))
        .map((post) => post.id),
    }))
    .filter(({ postIds }) => postIds.length);

  return {
    props: {
      countries,
    },
  };
};
