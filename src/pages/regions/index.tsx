import { Footer, Layout, Navbar } from "components";
import { CategoryCard } from "components/category-card/CategoryCard";
import { Post } from "components/card-list/CardList.types";
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
    tripCount: number;
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
          <CardList listTitle="Find the trip by region">
            {regions.map(({ region, tripCount }) => (
              <CategoryCard
                key={region.code}
                categoryType={CategoriesEnum.Regions}
                category={region}
                tripCount={tripCount}
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

export const getStaticProps: GetStaticProps<RegionsPageProps> = async ({
  params,
}) => {
  await mongoClient.connect();

  const postsCollection = mongoClient
    .db(Config.DB_NAME)
    .collection(Config.COLLECTION_NAME);
  const posts = await postsCollection.find().toArray();
  const parsedPosts: FullPost[] = JSON.parse(JSON.stringify(posts));

  const regions = Regions.map((region) => ({
    region,
    tripCount: parsedPosts.filter(({ category }) =>
      category.region.includes(region.code),
    ).length,
  })).filter(({ tripCount }) => tripCount);

  return {
    props: {
      regions,
    },
  };
};
