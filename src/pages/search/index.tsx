import { Footer, Layout, Navbar } from "components";
import Config from "Config";
import { Regions } from "enums/categories";
import { mongoClient } from "MongoClient";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Category, FullPost } from "types/PostPage.types";
import { useSearch } from "pages/api/hooks/useSearch";
import { SearchBar } from "components/search-bar/SearchBar";
import { SearchResults } from "components/search-results/SearchResults";
import { useEffect } from "react";

type RegionsPageProps = {
  regions: Array<{
    region: Category & { originalName: string };
    postIds: string[];
  }>;
};

const RegionsPage: NextPage<RegionsPageProps> = ({ regions }) => {
  const { data } = useSearch({ isEnabled: true });

  return (
    <>
      <Head>
        <title>Search @ Fair Enough Trips</title>
        <meta name="description" content="Search for a trip @ Fair Enough Trips" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <div>
        <Navbar />
        <SearchBar />
        <Layout>
          <SearchResults searchResults={data} />
        </Layout>
        <Footer isSticky />
      </div>
    </>
  );
};

export default RegionsPage;

export const getStaticProps: GetStaticProps<RegionsPageProps> = async () => {
  await mongoClient.connect();

  const postsCollection = mongoClient.db(Config.DB_NAME).collection(Config.POSTS_COLLECTION);
  const posts = await postsCollection.find().toArray();
  const parsedPosts: FullPost[] = JSON.parse(JSON.stringify(posts));

  const regions = Regions.sort((a, b) => a.name.localeCompare(b.name))
    .map((region) => ({
      region,
      postIds: parsedPosts.filter(({ category }) => category.region.includes(region.code)).map((post) => post.id),
    }))
    .filter(({ postIds }) => postIds.length);

  return {
    props: {
      regions,
    },
  };
};
