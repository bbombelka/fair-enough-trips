import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Footer, Navbar, PostCard } from "components";
import { Post, PostDocument } from "components/card-list/CardList.types";
import mongoClientConnectPromise from "MongoClient";
import Config from "Config";
import CardList from "components/card-list/CardList";

type HomePageProps = {
  mainPost: Post;
  latestPosts: Post[];
};

const Home: NextPage<HomePageProps> = ({ mainPost, latestPosts }) => {
  const siteLink = `https://${Config.DOMAIN}/`;

  return (
    <div>
      <Head>
        <title>Fair Enough Trips Homepage</title>
        <meta
          name="description"
          content="Mountain blog covering hiking trails, climbing routes and via-ferrata across Europe. Includes maps, downloadable gps tracks, route schemes, topo schemes, profile elevations, high quality images and trip tips."
        />
        <link rel="canonical" href={siteLink} />
        <link rel="next" href={`https://${Config.DOMAIN}/posts/${mainPost.id}`} />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Fair Enough Trips - mountain guiding blog" />
        <meta
          property="og:description"
          content="Find your perfect hiking trail, climbing route or via-ferrata in Europe. Maps, downloadable gps tracks, route schemes, topo schemes, profile elevations, high quality images and trip tips included. Fair enough ?"
        />
        <meta property="og:url" content={siteLink} />
        <meta property="og:site_name" content="Fair Enough Trips Homepage" />
        <meta property="og:image" content={`https://${Config.DOMAIN}/${mainPost.id}/main.webp`} />
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
  const mongoClient = await mongoClientConnectPromise;
  const isProd = process.env.NODE_ENV === "production";

  const posts = await mongoClient
    .db(Config.DB_NAME)
    .collection(Config.POSTS_COLLECTION)
    .find(isProd ? { published: true } : {})
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
