import { Navbar, Footer } from "components";
import Config from "Config";
import { access } from "fs/promises";
import mongoClientConnectPromise from "MongoClient";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { PostPageProps, FullPost } from "types/PostPage.types";
import { removeSelectedProps } from "utils";
import routeSchemeExists from "server/shared/route-scheme-exists";
import readBucketFiles from "server/shared/aws/readBucketFiles";
import preparePostRichData from "server/utils/prepare-rich-data";
import { Article } from "schema-dts";
import { useMappedCategories } from "hooks/useMappedCategories";
import { PostTemplate } from "components/templates/PostTemplate";

const PostPage: NextPage<PostPageProps<Article>> = ({ post, controlDisplayLinks, hasRouteScheme, hdImagesToDisplay, richData }) => {
  const [activities, regions, countries] = useMappedCategories(post.category);
  const shouldIncludeTripDifficulty = post.category.activity.some((activityCode) => ["002", "003", "004"].includes(activityCode));

  const postTitle = `${post.title} ${shouldIncludeTripDifficulty ? `(${post.difficulty.replace(/ /g, "")})` : ""} | ${activities} in ${regions}, ${countries}`;
  const statsSummary = post.stats ? `${post.stats.distance}km / ${post.stats.up}m / ${post.stats.duration}h` : "";
  const postContent = `${post.title} - ${post.subTitle}${statsSummary ? ` [${statsSummary}]` : ""}`;
  const pageLink = `https://${Config.DOMAIN}/posts/${post.id}`;
  const hasTopo = false; // need to be added

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
      <PostTemplate post={post} controlDisplayLinks={controlDisplayLinks} hasRouteScheme={hasRouteScheme} hdImagesToDisplay={hdImagesToDisplay} />
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

export const getStaticProps: GetStaticProps<PostPageProps<Article>> = async ({ params }) => {
  const mongoClient = await mongoClientConnectPromise;

  const displayGpxChartPromise = access(`./public/${params?.id}/poi.json`).then(
    () => true,
    () => false,
  );

  const displayGpxDownloadPromise = access(`./public/${params?.id}/track.zip`).then(
    () => true,
    () => false,
  );

  const availableHDImagesPromise = readBucketFiles(params?.id as string);

  const postsCollection = mongoClient.db(Config.DB_NAME).collection(Config.POSTS_COLLECTION);
  const dbPost = await postsCollection.findOne({ id: params?.id });

  const post: FullPost | {} = dbPost ? removeSelectedProps(dbPost, ["_id"]) : {};

  const hasRouteScheme = await routeSchemeExists(params?.id);

  const parsedPost = JSON.parse(JSON.stringify(post));

  return {
    props: {
      richData: preparePostRichData(parsedPost),
      post: { ...parsedPost } as FullPost,
      hasRouteScheme,
      hdImagesToDisplay: (await availableHDImagesPromise)
        .filter((img) => img?.includes("-HD"))
        .map((img) => img?.split("-HD").at(0)?.split("/").at(-1))
        .filter((img) => img),
      controlDisplayLinks: {
        displayGpxChart: await displayGpxChartPromise,
        displayGpxDownload: await displayGpxDownloadPromise,
      },
    },
  };
};
