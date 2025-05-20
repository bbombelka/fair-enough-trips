import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Footer, Layout, Navbar, PostCard } from "components";
import CardList from "components/card-list/CardList";
import { Post, PostDocument } from "components/card-list/CardList.types";
import { mongoClient } from "MongoClient";
import Config from "Config";
import { CategoriesEnum, Regions } from "enums/categories";
import { CategoryCard } from "components/category-card/CategoryCard";
import { TripNotes } from "components/trip-notes/TripNotes";
import { TripNote } from "components/trip-notes/TripNotes.types";
import { Box } from "components/box/Box";
import { shuffleBackgroundImage } from "server/utils/ShuffleImage";

type HomePageProps = {
  posts: Post[];
  code: string;
  notes: TripNote[];
  imageId: string;
  base64Image: string;
};

const Category: NextPage<HomePageProps> = ({ posts, code, notes, base64Image, imageId }) => {
  const region = Regions.find((act) => act.code === code)!;

  return (
    <div>
      <Head>
        <title>{region.name} @ Fair Enough Trips</title>
        <meta name="description" content={`Fair Enough Trips in ${region.name} page`} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={`https://${Config.DOMAIN}/regions/${region.url}`} />
      </Head>
      <Navbar />
      <main>
        <CategoryCard
          id={imageId}
          blurDataURL={base64Image}
          isMainCard
          postIds={posts.map(({ id }) => id)}
          categoryType={CategoriesEnum.Regions}
          category={region}
          areNotesPresent={Boolean(notes.length)}
        />
        {Boolean(notes.length) && (
          <Layout>
            <Box margin="0 0 32px">
              <TripNotes notes={notes} />
            </Box>
          </Layout>
        )}
        {Boolean(posts.length) && (
          <CardList listTitle={`Latest trips in ${region.name}`}>
            {posts.map((post) => (
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

  const types = Array.from(new Set(posts.map(({ category }) => category.region).flat()))
    .map((code) => Regions.find((act) => act.code === code)?.url)
    .map((path) => ({ params: { region: path } }));
  return {
    paths: types,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  await mongoClient.connect();

  const code = Regions.find((act) => act.url === params?.region)?.code;

  const posts = await mongoClient
    .db(Config.DB_NAME)
    .collection(Config.POSTS_COLLECTION)
    .find({ ["category.region"]: code, published: true })
    .project<PostDocument>({ id: true, title: true, category: true, isTop: true, postDate: true, _id: false, base64Image: true })
    .sort({ postDate: -1 })
    .toArray();

  const notes = await mongoClient.db(Config.DB_NAME).collection(Config.REGION_NOTES_COLLECTION).findOne({ id: code });

  const id = shuffleBackgroundImage(posts.map(({ id }) => id));

  const serializedPosts: Post[] = posts.map((post) => ({
    ...post,
    postDate: post.postDate.toISOString(),
  }));

  await mongoClient.close();

  return {
    props: {
      posts: serializedPosts,
      code,
      notes: notes?.notes ?? [],
      imageId: id,
      base64Image: posts.find((post) => post.id === id)?.base64Image,
    },
  };
};
