import { Navbar, Footer } from "components";
import Config from "Config";
import { access } from "fs/promises";
import mongoClientConnectPromise from "MongoClient";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { PostPageProps, FullPost } from "types/PostPage.types";
import { removeSelectedProps } from "utils";
import routeSchemeExists from "server/shared/route-scheme-exists";
import preparePostRichData from "server/utils/prepare-rich-data";
import { useMappedCategoriesNames } from "hooks/useMappedCategories";
import { PostTemplate } from "components/templates/PostTemplate";
import { Post, PostDocument } from "components/card-list/CardList.types";

const PostPage: NextPage<PostPageProps> = ({ post, controlDisplayLinks, hasRouteScheme, richData, posts }) => {
  const [activities, regions, countries] = useMappedCategoriesNames(post.category);
  const shouldIncludeTripDifficulty = post.category.activity.some((activityCode) => ["002", "003", "004"].includes(activityCode));

  const postTitle = `${post.title} ${shouldIncludeTripDifficulty ? `(${post.difficulty.replace(/ /g, "")})` : ""} | ${activities} in ${regions}, ${countries}`;
  const statsSummary = post.stats ? `${post.stats.distance}km / ${post.stats.up}m / ${post.stats.duration}h` : "";
  const postContent = `${post.title} - ${post.subTitle}${statsSummary ? ` [${statsSummary}]` : ""}`;
  const pageLink = `https://${Config.DOMAIN}/posts/${post.id}`;
  const hasTopo = controlDisplayLinks.displayTopoLink;

  const metaDescriptionElements = [
    Boolean(post.videos?.length) && "videos",
    hasRouteScheme && "detailed route scheme and profile elevation",
    hasTopo && "climbing topo",
  ]
    .filter(Boolean)
    .join(", ");

  const metaDescription = `${postTitle} ${statsSummary ? `[${statsSummary}]` : ""} - description with photos, map, gps track,${metaDescriptionElements.length ? `, ${metaDescriptionElements}.` : "."}`;

  return (
    <>
      <Head>
        <title>{postTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="author" content="Fair Enough Trips" />
        <link rel="canonical" href={pageLink} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(richData) }} />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={postTitle} />
        <meta property="og:description" content={postContent} />
        <meta property="og:url" content={pageLink} />
        <meta property="og:site_name" content="Fair Enough Trips" />
        <meta property="og:image" content={`https://${Config.DOMAIN}/${post.id}/main.webp`} />
        <meta property="og:image:alt" content={post.title} />
        {post.postDate && <meta property="article:published_time" content={`${post.postDate}`} />}
        <meta property="article:section" content={activities.join(", ")} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={postTitle} />
        <meta name="twitter:description" content={postContent} />
        <meta name="twitter:image" content={`https://${Config.DOMAIN}/${post.id}/main.webp`} />
        <meta name="twitter:image:alt" content={post.title} />
        <meta name="robots" content="index, follow" />
      </Head>
      <Navbar />
      <PostTemplate post={post} controlDisplayLinks={controlDisplayLinks} hasRouteScheme={hasRouteScheme} posts={posts} />
      <Footer isSticky />
    </>
  );
};

export default PostPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const mongoClient = await mongoClientConnectPromise;
  const isProd = process.env.NODE_ENV === "production";

  const collection = mongoClient.db(Config.DB_NAME).collection(Config.POSTS_COLLECTION);

  const posts = await collection.find(isProd ? { published: true } : {}).toArray();

  return {
    paths: posts.map(({ id }) => ({ params: { id } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostPageProps> = async ({ params }) => {
  const mongoClient = await mongoClientConnectPromise;
  const isProd = process.env.NODE_ENV === "production";

  const displayGpxChartPromise = access(`./public/${params?.id}/poi.json`).then(
    () => true,
    () => false,
  );

  const displayGpxDownloadPromise = access(`./public/${params?.id}/track.zip`).then(
    () => true,
    () => false,
  );

  const displayTopoLinkPromise = access(`./public/${params?.id}/topo.webp`).then(
    () => true,
    () => false,
  );

  const postsCollection = mongoClient.db(Config.DB_NAME).collection(Config.POSTS_COLLECTION);
  const dbPost = await postsCollection.findOne({ id: params?.id });

  const post: FullPost | {} = dbPost ? removeSelectedProps(dbPost, ["_id"]) : {};

  const hasRouteScheme = await routeSchemeExists(params?.id);

  const parsedPost = JSON.parse(JSON.stringify(post));

  const posts = await mongoClient
    .db(Config.DB_NAME)
    .collection(Config.POSTS_COLLECTION)
    .find({ postDate: { $lt: new Date(parsedPost.postDate) }, ...(isProd ? { published: true } : {}) })
    .project<PostDocument>({ id: true, title: true, category: true, isTop: true, postDate: true, _id: false, base64Image: true })
    .sort({ postDate: -1 })
    .limit(4)
    .toArray();

  const serializedPosts: Post[] = posts.map((p) => ({
    ...p,
    postDate: p.postDate.toISOString(),
  }));

  return {
    props: {
      posts: serializedPosts,
      richData: preparePostRichData(parsedPost),
      post: { ...parsedPost } as FullPost,
      hasRouteScheme,
      controlDisplayLinks: {
        displayGpxChart: await displayGpxChartPromise,
        displayGpxDownload: await displayGpxDownloadPromise,
        displayTopoLink: await displayTopoLinkPromise,
      },
    },
  };
};
