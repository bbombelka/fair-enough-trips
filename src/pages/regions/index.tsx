import { Footer, Layout, Navbar } from "components";
import { CategoryCard } from "components/category-card/CategoryCard";
import Config from "Config";
import { CategoriesEnum, Regions } from "enums/categories";
import mongoClientConnectPromise from "MongoClient";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Category } from "types/PostPage.types";
import CardList from "components/card-list/CardList";
import { shuffleBackgroundImage } from "server/utils/ShuffleImage";
import { CategoryDocument } from "components/category-card/CategoryCard.types";

type RegionsPageProps = {
  regions: Array<{
    region: Category & { originalName: string };
    postIds: string[];
    blurDataURL: string;
    id: string;
  }>;
};

const RegionsPage: NextPage<RegionsPageProps> = ({ regions }) => {
  return (
    <>
      <Head>
        <title>Regions @ Fair Enough Trips</title>
        <meta name="description" content="Find your trip by selecting a region" />
        <link rel="canonical" href={`https://${Config.DOMAIN}/regions`} />
      </Head>
      <div>
        <Navbar />
        <Layout>
          <CardList listTitle="Find trip in region">
            {regions.map(({ region, postIds, blurDataURL, id }) => (
              <CategoryCard
                key={region.code}
                categoryType={CategoriesEnum.Regions}
                category={region}
                postIds={postIds}
                isMainCard={false}
                blurDataURL={blurDataURL}
                id={id}
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
  const mongoClient = await mongoClientConnectPromise;
  const isProd = process.env.NODE_ENV === "production";

  const postsCollection = mongoClient.db(Config.DB_NAME).collection(Config.POSTS_COLLECTION);
  const posts = await postsCollection
    .find(isProd ? { published: true } : {})
    .project<CategoryDocument<"region">>({ id: true, ["category.region"]: true, base64Image: true })
    .toArray();

  const regions = Regions.sort((a, b) => a.name.localeCompare(b.name))
    .map((region) => {
      const postIds = posts.filter(({ category }) => category.region.includes(region.code)).map((post) => post.id);
      const id = shuffleBackgroundImage(postIds);
      const blurDataURL = posts.find((post) => post.id === id)?.base64Image ?? "";

      return {
        region,
        postIds,
        id,
        blurDataURL,
      };
    })
    .filter(({ postIds }) => postIds.length);

  return {
    props: {
      regions,
    },
  };
};
