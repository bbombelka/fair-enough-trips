import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Footer, Navbar, PostCard } from "components";
import { PostCardList } from "components/post-card-list/PostCardList";
import { Post } from "components/post-card-list/PostCardList.types";
import { mongoClient } from "MongoClient";
import Config from "Config";
import { mapCategories } from "utils";
import { CodedCategory, FullPost } from "types/PostPage.types";

type HomePageProps = {
  mainPost: Post;
  latestPosts: Post[];
};

const Home: NextPage<HomePageProps> = ({ mainPost, latestPosts }) => {
  return (
    <div>
      <Head>
        <title>Fair Enough Trips</title>
        <meta
          name="description"
          content="Blog about trekking, scrambling, alpine climbing and via-ferrata with maps, gps tracks, images and trip tips"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Navbar />
      <main>
        <PostCard isMainPostCard post={mainPost} />
        <PostCardList listTitle="Latest trip posts" posts={latestPosts} />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  await mongoClient.connect();

  const latestPosts = await mongoClient
    .db(Config.DB_NAME)
    .collection(Config.COLLECTION_NAME)
    .find()
    .sort({ postDate: -1 })
    .limit(Config.POST_COUNT_HOME_PAGE + 1)
    .toArray();

  const jsonParsed = JSON.parse(JSON.stringify(latestPosts));

  return {
    props: {
      mainPost: { ...jsonParsed[0] },
      latestPosts: jsonParsed.slice(1, Config.POST_COUNT_HOME_PAGE + 1),
    },
  };
};
