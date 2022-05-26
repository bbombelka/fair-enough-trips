import { Footer, Layout, Navbar } from "components";
import { CategoryCard } from "components/category-card/CategoryCard";
import Config from "Config";
import { CategoriesEnum, Regions } from "enums/categories";
import { mongoClient } from "MongoClient";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Category, FullPost } from "types/PostPage.types";
import { CardList } from "components/card-list/CardList";

type RegionsPageProps = {
  regions: Array<{
    region: Category & { originalName: string };
    postIds: string[];
  }>;
};

const RegionsPage: NextPage<RegionsPageProps> = ({ regions }) => {
  return (
    <>
      <Head>
        <title>Regions @ Fair Enough Trips</title>
        <meta
          name="description"
          content="Find your trip by selecting a region"
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
          <CardList listTitle="Find trip in region">
            {regions.map(({ region, postIds }) => (
              <CategoryCard
                key={region.code}
                categoryType={CategoriesEnum.Regions}
                category={region}
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

export default RegionsPage;

export const getStaticProps: GetStaticProps<RegionsPageProps> = async () => {
  await mongoClient.connect();

  const postsCollection = mongoClient
    .db(Config.DB_NAME)
    .collection(Config.POSTS_COLLECTION);
  const posts = await postsCollection.find().toArray();
  const parsedPosts: FullPost[] = JSON.parse(JSON.stringify(posts));

  const regions = Regions.sort((a, b) => a.name.localeCompare(b.name))
    .map((region) => ({
      region,
      postIds: parsedPosts
        .filter(({ category }) => category.region.includes(region.code))
        .map((post) => post.id),
    }))
    .filter(({ postIds }) => postIds.length);

  return {
    props: {
      regions,
    },
  };
};
