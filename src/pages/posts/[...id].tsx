import { Navbar, Footer } from "components";
import Config from "Config";
import { access } from "fs/promises";
import mongoClientConnectPromise from "MongoClient";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { PostPageProps, FullPost, BreadcrumbParentPostData } from "types/PostPage.types";
import { removeSelectedProps } from "utils";
import routeSchemeExists from "server/shared/route-scheme-exists";
import preparePostRichData from "server/utils/prepare-rich-data";
import { useMappedCategoriesNames } from "hooks/useMappedCategories";
import { PostTemplate } from "components/templates/PostTemplate";
import { Post, PostDocument } from "components/card-list/CardList.types";
import { PostMultidayTemplate } from "components/templates/multiday/PostMultidayTemplate";

const PostPage: NextPage<PostPageProps> = ({ post, controlDisplayLinks, hasRouteScheme, richData, posts, subPosts, parentPostData }) => {
  const [activities, regions, countries] = useMappedCategoriesNames(post.category);
  const shouldIncludeTripDifficulty = post.category.activity.some((activityCode) => ["002", "003", "004"].includes(activityCode));

  const postTitle = `${post.title} ${shouldIncludeTripDifficulty ? `(${post.difficulty.replace(/ /g, "")})` : ""} | ${activities} in ${regions}, ${countries}`;
  const statsSummary = post.stats ? `${post.stats.distance}km / ${post.stats.up}m / ${post.stats.duration}h` : "";
  const postContent = `${post.title} - ${post.subTitle}${statsSummary ? ` [${statsSummary}]` : ""}`;
  const pageLink = `https://${Config.DOMAIN}/posts/${post.id}`;
  const hasTopo = controlDisplayLinks.topoDownloadLink;

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
      {Boolean(subPosts?.length) ? (
        <PostMultidayTemplate post={post} controlDisplayLinks={controlDisplayLinks} hasRouteScheme={hasRouteScheme} posts={posts} subPosts={subPosts} />
      ) : (
        <PostTemplate post={post} controlDisplayLinks={controlDisplayLinks} hasRouteScheme={hasRouteScheme} posts={posts} parentPostData={parentPostData} />
      )}
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
    paths: posts.map((post) => {
      if (post.parentId) {
        return { params: { id: [post.parentId, post.id] } };
      }
      return { params: { id: [post.id] } };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostPageProps> = async ({ params }) => {
  const mongoClient = await mongoClientConnectPromise;
  const isProd = process.env.NODE_ENV === "production";

  const idArray = (params?.id as string[]) || [];
  const dbQueryId = idArray.length === 2 ? idArray[1] : idArray[0];
  const filesPath = `./public/${idArray.length === 2 ? idArray.join("/") : idArray[0]}`;

  const displayGpxChartPromise = access(`${filesPath}/poi.json`).then(
    () => true,
    () => false,
  );

  const gpxDownloadLinkPromise = access(`${filesPath}/track.zip`).then(
    () => `${filesPath}/track.zip`.replace("./public", ""),
    () => "",
  );

  const topoDownloadLinkPromise = access(`${filesPath}/topo.webp`).then(
    () => `${filesPath}/topo.webp`.replace("./public", ""),
    () => "",
  );

  const postsCollection = mongoClient.db(Config.DB_NAME).collection(Config.POSTS_COLLECTION);
  const dbPost = await postsCollection.findOne({ id: dbQueryId });

  const post: FullPost | {} = dbPost ? removeSelectedProps(dbPost, ["_id"]) : {};

  const hasRouteScheme = await routeSchemeExists(dbQueryId);

  const parsedPost = JSON.parse(JSON.stringify(post));

  const posts = await mongoClient
    .db(Config.DB_NAME)
    .collection(Config.POSTS_COLLECTION)
    .find({
      postDate: { $lt: new Date(parsedPost.postDate) },
      ...(isProd ? { published: true } : {}),
      ...(parsedPost.parentId ? { id: { $ne: parsedPost.parentId } } : {}),
    })
    .project<PostDocument>({ id: true, title: true, category: true, isTop: true, postDate: true, _id: false, base64Image: true })
    .sort({ postDate: -1 })
    .limit(4)
    .toArray();

  const serializedPosts: Post[] = posts.map((p) => ({
    ...p,
    postDate: p.postDate.toISOString(),
  }));

  const subPosts = async () => {
    const subPosts = await mongoClient
      .db(Config.DB_NAME)
      .collection(Config.POSTS_COLLECTION)
      .find({ parentId: parsedPost.id, ...(isProd ? { published: true } : {}) })
      .project<PostDocument>({ id: true, title: true, category: true, isTop: true, postDate: true, _id: false, base64Image: true })
      .sort({ postDate: -1 })
      .toArray();

    return subPosts.map((p) => ({
      ...p,
      postDate: p.postDate.toISOString(),
    }));
  };

  const parentPostData = async () => {
    const data = await mongoClient
      .db(Config.DB_NAME)
      .collection(Config.POSTS_COLLECTION)
      .find({ id: parsedPost.parentId })
      .project<BreadcrumbParentPostData>({ id: true, title: true, _id: false })
      .toArray();

    return data[0];
  };

  return {
    props: {
      subPosts: Boolean(parsedPost.subIds?.length) ? await subPosts() : [],
      posts: serializedPosts,
      richData: preparePostRichData(parsedPost),
      post: { ...parsedPost } as FullPost,
      parentPostData: Boolean(parsedPost.parentId) ? await parentPostData() : { id: "", title: "" },
      hasRouteScheme,
      controlDisplayLinks: {
        displayGpxChart: await displayGpxChartPromise,
        gpxDownloadLink: await gpxDownloadLinkPromise,
        topoDownloadLink: await topoDownloadLinkPromise,
      },
    },
  };
};
