import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Footer, Layout, Navbar, PostCard } from "components";
import CardList from "components/card-list/CardList";
import { Post } from "components/card-list/CardList.types";
import mongoClientConnectPromise from "MongoClient";
import { getLatestPosts, getPathsPosts } from "server/shared/posts";
import Config from "Config";
import { CategoriesEnum, Countries } from "enums/categories";
import { CategoryCard } from "components/category-card/CategoryCard";
import { parse } from "utils";
import { Box } from "components/box/Box";
import { TripNotes } from "components/trip-notes/TripNotes";
import { TripNote } from "components/trip-notes/TripNotes.types";
import { shuffleBackgroundImage } from "server/utils/ShuffleImage";
import prepareCountryRichData from "server/utils/prepare-country-rich-data";

type HomePageProps = {
  posts: Post[];
  code: string;
  notes: TripNote[];
  imageId: string;
  base64Image: string;
  richData: any[];
};

const Category: NextPage<HomePageProps> = ({ posts, notes, code, imageId, base64Image, richData }) => {
  const country = Countries.find((act) => act.code === code)!;
  const postTitle = `${country.name} @ Fair Enough Trips`;

  return (
    <div>
      <Head>
        <title>{postTitle}</title>
        <meta name="description" content={`Fair Enough Trips -  ${country.name} page.`} />
        <link rel="canonical" href={`https://${Config.DOMAIN}/countries/${country.url}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(richData) }} />
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
          buttonLabel="Country info"
        />
        {Boolean(notes.length) && (
          <Layout>
            <Box margin="0 0 32px">
              <TripNotes notes={notes} title="Country info" />
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
  const posts = await getPathsPosts();

  const types = Array.from(new Set(posts.map(({ category }) => category.country).flat()))
    .map((code) => Countries.find((act) => act.code === code)?.url)
    .map((path) => ({ params: { country: path } }));
  return {
    paths: types,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const mongoClient = await mongoClientConnectPromise;
  await mongoClient.connect();

  const code = Countries.find(({ url }) => url === params?.country)?.code;

  const posts = await getLatestPosts({ ["category.country"]: code, parentId: { $exists: false } });

  const notes = await mongoClient.db(Config.DB_NAME).collection(Config.COUNTRY_NOTES_COLLECTION).findOne({ id: code });

  const id = shuffleBackgroundImage(posts.map(({ id }) => id));

  const notesParsed = parse(notes);
  const richData = prepareCountryRichData(code as string, posts);

  return {
    props: {
      posts,
      code,
      notes: notesParsed?.notes ?? [],
      imageId: id,
      base64Image: posts.find((post) => post.id === id)?.base64Image,
      richData,
    },
  };
};
