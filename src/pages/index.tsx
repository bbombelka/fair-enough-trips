import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Footer, Navbar, PostCard } from "components";
import { CardList } from "components/card-list/CardList";
import { Post } from "components/card-list/CardList.types";
import { mongoClient } from "MongoClient";
import Config from "Config";

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
        <CardList listTitle="Latest trip posts">
          {latestPosts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </CardList>
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
    .collection(Config.POSTS_COLLECTION)
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
