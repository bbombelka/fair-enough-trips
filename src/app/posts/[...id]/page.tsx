import { Metadata } from "next";
import { Navbar, Footer } from "components";
import Config from "Config";
import { access } from "fs/promises";
import mongoClientConnectPromise from "MongoClient";
import { FullPost, BreadcrumbParentPostData } from "types/pages/post.types";
import { removeSelectedProps } from "utils";
import routeSchemeExists from "server/shared/route-scheme-exists";
import preparePostRichData from "server/utils/prepare-rich-data";
import { PostTemplate } from "components/templates/PostTemplate";
import { getLatestPosts, getPathsPosts } from "server/shared/posts";
import { PostMultidayTemplate } from "components/templates/multiday/PostMultidayTemplate";

async function getPostData(idArray: string[]) {
  const mongoClient = await mongoClientConnectPromise;

  const dbQueryId = idArray.length === 2 ? idArray[1] : idArray[0];
  const filesPath = `./public/content/posts/${idArray.length === 2 ? idArray.join("/") : idArray[0]}`;

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

  const serializedPosts = await getLatestPosts(
    {
      postDate: { $lt: new Date(parsedPost.postDate) },
      ...(parsedPost.parentId ? { id: { $ne: parsedPost.parentId }, parentId: { $ne: parsedPost.parentId } } : { parentId: { $exists: false } }),
    },
    4,
  );

  const isParentPost = Boolean(parsedPost.subIds?.length);
  const isSubPost = Boolean(parsedPost.parentId);

  const subPostsData = isParentPost || isSubPost ? await getLatestPosts({ parentId: isParentPost ? parsedPost.id : parsedPost.parentId }, undefined, 1) : [];

  let parentData: BreadcrumbParentPostData = { id: "", title: "" };
  if (isSubPost) {
    const data = await mongoClient
      .db(Config.DB_NAME)
      .collection(Config.POSTS_COLLECTION)
      .find({ id: parsedPost.parentId })
      .project<BreadcrumbParentPostData>({ id: true, title: true, _id: false })
      .toArray();
    parentData = data[0] || { id: "", title: "" };
  }

  return {
    post: parsedPost as FullPost,
    posts: serializedPosts,
    subPosts: subPostsData,
    parentPostData: parentData,
    hasRouteScheme,
    controlDisplayLinks: {
      displayGpxChart: await displayGpxChartPromise,
      gpxDownloadLink: await gpxDownloadLinkPromise,
      topoDownloadLink: await topoDownloadLinkPromise,
    },
    richData: preparePostRichData(parsedPost),
  };
}

export async function generateStaticParams() {
  const posts = await getPathsPosts();

  return posts.map((post) => {
    if (post.parentId) {
      return { id: [post.parentId, post.id] };
    }
    return { id: [post.id] };
  });
}

export async function generateMetadata({ params }: { params: Promise<{ id: string[] }> }): Promise<Metadata> {
  const { id } = await params;
  const { post } = await getPostData(id);

  const postTitle = post.title;
  const statsSummary = post.stats ? `${post.stats.distance}km / ${post.stats.up}m / ${post.stats.duration}h` : "";
  const pageLink = `https://${Config.DOMAIN}/posts/${post.id}`;

  return {
    title: postTitle,
    description: `${postTitle} ${statsSummary ? `[${statsSummary}]` : ""} - description with photos, map, gps track.`,
    alternates: {
      canonical: pageLink,
    },
    openGraph: {
      title: postTitle,
      description: post.subTitle,
      url: pageLink,
      siteName: "Fair Enough Trips",
      locale: "en_GB",
      type: "article",
      images: [
        {
          url: `https://${Config.DOMAIN}/content/posts/${post.id}/main.webp`,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ id: string[] }> }) {
  const { id } = await params;
  const data = await getPostData(id);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data.richData) }} />
      <Navbar />
      {Boolean(data.parentPostData?.id) ? (
        <PostTemplate
          post={data.post}
          controlDisplayLinks={data.controlDisplayLinks}
          hasRouteScheme={data.hasRouteScheme}
          posts={data.posts}
          parentPostData={data.parentPostData}
          subPosts={data.subPosts}
        />
      ) : (
        <PostMultidayTemplate
          post={data.post}
          controlDisplayLinks={data.controlDisplayLinks}
          hasRouteScheme={data.hasRouteScheme}
          posts={data.posts}
          subPosts={data.subPosts}
        />
      )}
      <Footer isSticky />
    </>
  );
}
