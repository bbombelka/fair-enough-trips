import { Navbar, Layout, Map, Footer } from "components";
import { Divider } from "components/divider/Divider";
import { Paragraph } from "components/paragraph/Paragraph";
import { PostImages } from "components/post-images/PostImages";
import Config from "Config";
import { access } from "fs/promises";
import { mongoClient } from "MongoClient";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { PostPageProps, FullPost } from "types/PostPage.types";
import { removeSelectedProps } from "utils";

const PostPage: NextPage<PostPageProps> = ({ post, controlDisplayLinks }) => {
  return (
    <>
      <Head>
        <title>{post.title} @ Fair Enough Trips</title>
        <meta name="description" content={post.subTitle} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <div>
        <Navbar />
        <Layout title={post.title}>
          <Map post={post} controlDisplayLinks={controlDisplayLinks} />
          <Divider title="Overview" order={1} stickyScrollToElementId="paragraph-overview" />
          <Paragraph id="paragraph-overview" body={post.shortDescription} links={post.links["shortDescription"]} />
          <Divider title="Trip conditions" order={2} stickyScrollToElementId="paragraph-conditions" />
          <Paragraph body={post.weather} title="Weather" id="paragraph-conditions" />
          <Paragraph body={post.trailCondition} title="Trail" />
          <Divider title="General" order={3} stickyScrollToElementId="paragraph-general" />
          <Paragraph links={post.links["accomodation"]} body={post.accomodation} title="Accommodation" id="paragraph-general" />
          <Paragraph links={post.links["transportation"]} body={post.transportation} title="Transportation" />
          <Divider title="Other" order={4} stickyScrollToElementId="paragraph-other" />
          <Paragraph links={post.links["other"]} body={post.other} id="paragraph-other" />
          <Paragraph links={post.links["dangers"]} body={post.dangers} title="Dangers" />
          <Paragraph links={post.links["gear"]} body={post.gear} title="Gear used" />
          {Boolean(post.images.length) && <PostImages images={post.images} id={post.id} order={5} />}
        </Layout>
        <Footer isSticky />
      </div>
    </>
  );
};

export default PostPage;

export const getStaticPaths: GetStaticPaths = async () => {
  await mongoClient.connect();

  const collection = mongoClient.db(Config.DB_NAME).collection(Config.POSTS_COLLECTION);

  const posts = await collection.find().toArray();
  await mongoClient.close();

  return {
    paths: posts.map(({ id }) => ({ params: { id } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostPageProps> = async ({ params }) => {
  await mongoClient.connect();

  const displayGpxChartPromise = access(`./public/${params?.id}/poi.json`).then(
    () => true,
    () => false
  );

  const displayGpxDownloadPromise = access(`./public/${params?.id}/track.zip`).then(
    () => true,
    () => false
  );

  const postsCollection = mongoClient.db(Config.DB_NAME).collection(Config.POSTS_COLLECTION);
  const dbPost = await postsCollection.findOne({ id: params?.id });

  const post: FullPost | {} = dbPost ? removeSelectedProps(dbPost, ["_id"]) : {};
  await mongoClient.close();

  const parsedPost = JSON.parse(JSON.stringify(post));

  return {
    props: {
      post: parsedPost as FullPost,
      controlDisplayLinks: {
        displayGpxChart: await displayGpxChartPromise,
        displayGpxDownload: await displayGpxDownloadPromise,
      },
    },
  };
};
