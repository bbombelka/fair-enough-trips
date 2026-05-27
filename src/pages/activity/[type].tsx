import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Footer, Navbar, PostCard } from "components";
import CardList from "components/card-list/CardList";
import { Post } from "components/card-list/CardList.types";
import Config from "Config";
import { Activities } from "enums/categories";
import prepareActivityRichData from "server/utils/prepare-activity-rich-data";
import { getLatestPosts, getPathsPosts } from "server/shared/posts";

type HomePageProps = {
  mainPost: Post;
  latestPosts: Post[];
  code: string;
  richData: any[];
};

const Category: NextPage<HomePageProps> = ({ mainPost, latestPosts, code, richData }) => {
  const activity = Activities.find((act) => act.code === code);
  const postTitle = `${activity?.name} @ Fair Enough Trips`;

  return (
    <div>
      <Head>
        <title>{postTitle}</title>
        <meta name="description" content={`Fair Enough Trips - ${activity?.name} page`} />
        <link rel="canonical" href={`https://${Config.DOMAIN}/activity/${activity?.url}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(richData) }} />
      </Head>
      <Navbar />
      <main>
        <PostCard isMainPostCard post={mainPost} displayScrollDownButton={Boolean(latestPosts.length)} />
        {Boolean(latestPosts.length) && (
          <CardList listTitle={`Latest ${activity?.name} posts`}>
            {latestPosts.map((post) => (
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

  const types = Array.from(new Set(posts.map(({ category }) => category.activity).flat()))
    .map((code) => Activities.find((act) => act.code === code)?.url)
    .map((path) => ({ params: { type: path } }));

  return {
    paths: types,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const code = Activities.find((act) => act.url === params?.type)?.code;

  const latestPosts = await getLatestPosts({ ["category.activity"]: code, parentId: null });

  const richData = prepareActivityRichData(code as string, latestPosts);

  return {
    props: {
      mainPost: { ...latestPosts[0] },
      latestPosts: latestPosts.slice(1),
      code,
      richData,
    },
  };
};
