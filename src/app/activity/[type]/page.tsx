import { Metadata } from "next";
import { Footer, Navbar, PostCard } from "components";
import CardList from "components/card-list/CardList";
import Config from "Config";
import { Activities } from "enums/categories";
import prepareActivityRichData from "server/utils/prepare-activity-rich-data";
import { getLatestPosts, getPathsPosts } from "server/shared/posts";

async function getActivityData(type: string) {
  const activity = Activities.find((act) => act.url === type);
  const code = activity?.code;

  const latestPosts = await getLatestPosts({ ["category.activity"]: code, parentId: null });
  const richData = prepareActivityRichData(code as string, latestPosts);

  return {
    mainPost: { ...latestPosts[0] },
    latestPosts: latestPosts.slice(1),
    code,
    richData,
    activity,
  };
}

export async function generateStaticParams() {
  const posts = await getPathsPosts();
  return Array.from(new Set(posts.map(({ category }) => category.activity).flat()))
    .map((code) => Activities.find((act) => act.code === code)?.url)
    .filter(Boolean)
    .map((type) => ({ type }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  const { activity } = await getActivityData(type);

  return {
    title: `${activity?.name} @ Fair Enough Trips`,
    description: `Fair Enough Trips - ${activity?.name} page`,
    alternates: {
      canonical: `https://${Config.DOMAIN}/activity/${activity?.url}`,
    },
  };
}

export default async function ActivityPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const { mainPost, latestPosts, activity, richData } = await getActivityData(type);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(richData) }} />
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
}
