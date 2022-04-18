import { Navbar, PostLayout, Map, Footer } from "components";
import { Divider } from "components/divider/Divider";
import { Paragraph } from "components/paragraph/Paragraph";
import { PostImages } from "components/post-images/PostImages";
import Config from "Config";
import { mongoClient } from "MongoClient";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { PostPageProps, FullPost } from "types/PostPage.types";
import { removeSelectedProps } from "utils";

const PostPage: NextPage<PostPageProps> = ({ post }) => {
  return (
    <div>
      <Navbar />
      <PostLayout title={post.title}>
        <Map post={post} />
        <Divider title="Overview" />
        <Paragraph body={post.shortDescription} />
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

  const post = dbPost ? removeSelectedProps(dbPost, ["_id"]) : {};
  mongoClient.close();

  return {
    props: {
      post: post as FullPost,
    },
  };
};
