import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Footer, Navbar, PostCard } from "components";
import { Post, PostDocument } from "components/card-list/CardList.types";
import { mongoClient } from "MongoClient";
import Config from "Config";
import dynamic from "next/dynamic";
import { useServiceWorker } from "hooks/useServiceWorker";

type HomePageProps = {
  mainPost: Post;
  latestPosts: Post[];
};

const CardList = dynamic(() => import("components/card-list/CardList"), {
  ssr: false,
});

const Home: NextPage<HomePageProps> = ({ mainPost, latestPosts }) => {
  useServiceWorker();

  return (
    <div>
      <Head>
        <title>Fair Enough Trips</title>
        <meta name="description" content="Blog about trekking, scrambling, alpine climbing and via-ferrata with maps, gps tracks, images and trip tips" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" />
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

  const posts = await mongoClient
    .db(Config.DB_NAME)
    .collection(Config.POSTS_COLLECTION)
    .find()
    .project<PostDocument>({ id: true, title: true, category: true, isTop: true, postDate: true, _id: false, base64Image: true })
    .sort({ postDate: -1 })
    .limit(Config.POST_COUNT_HOME_PAGE + 1)
    .toArray();

  const serializedPosts: Post[] = posts.map((post) => ({
    ...post,
    postDate: post.postDate.toISOString(),
  }));

  return {
    props: {
      mainPost: { ...serializedPosts[0] },
      latestPosts: serializedPosts.slice(1, Config.POST_COUNT_HOME_PAGE + 1),
    },
  };
};
