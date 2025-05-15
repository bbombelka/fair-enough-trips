import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Footer, Navbar, PostCard } from "components";
import CardList from "components/card-list/CardList";
import { Post } from "components/card-list/CardList.types";
import { mongoClient } from "MongoClient";
import Config from "Config";
import { Activities } from "enums/categories";

type HomePageProps = {
  mainPost: Post;
  latestPosts: Post[];
  code: string;
};

const Category: NextPage<HomePageProps> = ({ mainPost, latestPosts, code }) => {
  const activity = Activities.find((act) => act.code === code);

  return (
    <div>
      <Head>
        <title>{activity?.name} @ Fair Enough Trips</title>
        <meta name="description" content={`Fair Enough Trips - ${activity?.name} page`} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={`https://${Config.DOMAIN}/activity/${activity?.url}`} />
      </Head>
      <Navbar />
      <main>
        <PostCard isMainPostCard post={mainPost} displayScrollDownButton={Boolean(latestPosts.length)} />
        {Boolean(latestPosts.length) && (
          <CardList listTitle={`Latest ${activity?.name} posts`}>
            {latestPosts.map((post) => (
              <PostCard post={post} key={post.id} />
            ))}
          </CardList>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Category;

export const getStaticPaths: GetStaticPaths = async () => {
  await mongoClient.connect();

  const collection = mongoClient.db(Config.DB_NAME).collection(Config.POSTS_COLLECTION);

  const posts = await collection.find().toArray();
  await mongoClient.close();

  const types = Array.from(new Set(posts.map(({ category }) => category.activity).flat()))
    .map((code) => Activities.find((act) => act.code === code)?.url)
    .map((path) => ({ params: { type: path } }));

  return {
    paths: types,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  await mongoClient.connect();

  const code = Activities.find((act) => act.url === params?.type)?.code;

  const latestPosts = await mongoClient
    .db(Config.DB_NAME)
    .collection(Config.POSTS_COLLECTION)
    .find({ ["category.activity"]: code })
    .sort({ postDate: -1 })
    .toArray();

  const jsonParsed = JSON.parse(JSON.stringify(latestPosts));

  return {
    props: {
      mainPost: { ...jsonParsed[0] },
      latestPosts: jsonParsed.slice(1),
      code,
    },
  };
};
