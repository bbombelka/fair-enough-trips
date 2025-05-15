import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Footer, Layout, Navbar, PostCard } from "components";
import CardList from "components/card-list/CardList";
import { Post, PostDocument } from "components/card-list/CardList.types";
import { mongoClient } from "MongoClient";
import Config from "Config";
import { CategoriesEnum, Countries } from "enums/categories";
import { CategoryCard } from "components/category-card/CategoryCard";
import { parse } from "utils";
import { Box } from "components/box/Box";
import { TripNotes } from "components/trip-notes/TripNotes";
import { TripNote } from "components/trip-notes/TripNotes.types";
import { shuffleBackgroundImage } from "server/utils/ShuffleImage";

type HomePageProps = {
  posts: Post[];
  code: string;
  notes: TripNote[];
  imageId: string;
  base64Image: string;
};

const Category: NextPage<HomePageProps> = ({ posts, notes, code, imageId, base64Image }) => {
  const country = Countries.find((act) => act.code === code)!;

  return (
    <div>
      <Head>
        <title>{country.name} @ Fair Enough Trips</title>
        <meta name="description" content={`Fair Enough Trips -  ${country.name} page.`} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={`https://${Config.DOMAIN}/countries/${country.url}`} />
      </Head>
      <Navbar />
      <main>
        <CategoryCard
          isMainCard
          postIds={posts.map(({ id }) => id)}
          categoryType={CategoriesEnum.Countries}
          category={{ ...country, originalName: "" }}
          areNotesPresent={Boolean(notes.length)}
          id={imageId}
          blurDataURL={base64Image}
        />
        {Boolean(notes.length) && (
          <Layout>
            <Box margin="0 0 32px">
              <TripNotes notes={notes} />
            </Box>
          </Layout>
        )}
        {Boolean(posts.length) && (
          <CardList listTitle={`Latest trips in ${country.name}`}>
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

  const types = Array.from(new Set(posts.map(({ category }) => category.country).flat()))
    .map((code) => Countries.find((act) => act.code === code)?.url)
    .map((path) => ({ params: { country: path } }));
  return {
    paths: types,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  await mongoClient.connect();

  const code = Countries.find(({ url }) => url === params?.country)?.code;

  const posts = await mongoClient
    .db(Config.DB_NAME)
    .collection(Config.POSTS_COLLECTION)
    .find({ ["category.country"]: code })
    .project<PostDocument>({ id: true, title: true, category: true, isTop: true, postDate: true, _id: false, base64Image: true })
    .sort({ postDate: -1 })
    .toArray();

  const notes = await mongoClient.db(Config.DB_NAME).collection(Config.COUNTRY_NOTES_COLLECTION).findOne({ id: code });

  const id = shuffleBackgroundImage(posts.map(({ id }) => id));

  const serializedPosts: Post[] = posts.map((post) => ({
    ...post,
    postDate: post.postDate.toISOString(),
  }));

  const notesParsed = parse(notes);

  return {
    props: {
      posts: serializedPosts,
      code,
      notes: notesParsed?.notes ?? [],
      imageId: id,
      base64Image: posts.find((post) => post.id === id)?.base64Image,
    },
  };
};
