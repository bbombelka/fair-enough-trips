import { Navbar, PostLayout, Map, Footer } from "components";
import { Divider } from "components/divider/Divider";
import { Paragraph } from "components/paragraph/Paragraph";
import { PostImages } from "components/post-images/PostImages";
import Config from "Config";
import { mongoClient } from "MongoClient";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { PostPageProps, FullPost } from "types/PostPage.types";
import { removeSelectedProps } from "utils";

const PostPage: NextPage<PostPageProps> = ({ post }) => {
  return (
    <>
      <Head>
        <title>{post.title} @ Fair Enough Trips</title>
        <meta name="description" content={post.subTitle} />
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
        <PostLayout title={post.title}>
          <Map post={post} />
          <Divider title="Overview" />
          <Paragraph
            body={post.shortDescription}
            links={post.links["shortDescription"]}
          />
          <Divider title="Trip conditions" />
          <Paragraph body={post.weather} title="Weather" />
          <Paragraph body={post.trailCondition} title="Trail" />
          <Divider title="General" />
          <Paragraph
            links={post.links["accomodation"]}
            body={post.accomodation}
            title="Accommodation"
          />
          <Paragraph
            links={post.links["transportation"]}
            body={post.transportation}
            title="Transportation"
          />
          <Divider title="Other" />
          <Paragraph links={post.links["other"]} body={post.other} />
          <Paragraph
            links={post.links["dangers"]}
            body={post.dangers}
            title="Dangers"
          />
          <Paragraph
            links={post.links["gear"]}
            body={post.gear}
            title="Gear used"
          />
          {Boolean(post.images.length) && (
            <PostImages images={post.images} id={post.id} />
          )}
        </PostLayout>
        <Footer isSticky />
      </div>
    </>
  );
};

export default PostPage;

export const getStaticPaths: GetStaticPaths = async () => {
  await mongoClient.connect();

  const collection = mongoClient
    .db(Config.DB_NAME)
    .collection(Config.COLLECTION_NAME);

  const posts = await collection.find().toArray();
  mongoClient.close();

  return {
    paths: posts.map(({ id }) => ({ params: { id } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostPageProps> = async ({
  params,
}) => {
  await mongoClient.connect();

  const postsCollection = mongoClient
    .db(Config.DB_NAME)
    .collection(Config.COLLECTION_NAME);
  const dbPost = await postsCollection.findOne({ id: params?.id });

  const post: FullPost | {} = dbPost
    ? removeSelectedProps(dbPost, ["_id"])
    : {};
  mongoClient.close();

  const parsedPost = JSON.parse(JSON.stringify(post));

  return {
    props: {
      post: parsedPost as FullPost,
    },
  };
};
