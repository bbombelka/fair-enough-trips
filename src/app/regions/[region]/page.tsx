import { Metadata } from "next";
import { Footer, Layout, Navbar, PostCard } from "components";
import CardList from "components/card-list/CardList";
import { Post } from "types/common.types";
import mongoClientConnectPromise from "MongoClient";
import { getLatestPosts, getPathsPosts } from "server/shared/posts";
import Config from "Config";
import { CategoriesEnum, Regions } from "enums/categories";
import { CategoryCard } from "components/category-card/CategoryCard";
import { TripNotes } from "components/trip-notes/TripNotes";
import { TripNote } from "types/database.types";
import { Box } from "components/box/Box";
import { shuffleBackgroundImage } from "server/utils/ShuffleImage";
import prepareRegionRichData from "server/utils/prepare-region-rich-data";

async function getRegionData(regionUrl: string) {
  const mongoClient = await mongoClientConnectPromise;
  const region = Regions.find((act) => act.url === regionUrl);
  const code = region?.code;

  const posts = await getLatestPosts({ ["category.region"]: code, parentId: { $exists: false } });
  const notes = await mongoClient.db(Config.DB_NAME).collection(Config.REGION_NOTES_COLLECTION).findOne({ id: code });

  const id = shuffleBackgroundImage(posts.map(({ id }) => id));
  const richData = prepareRegionRichData(code as string, posts);

  return {
    posts,
    code,
    notes: notes?.notes ?? [],
    imageId: id ?? null,
    base64Image: posts.find((post) => post.id === id)?.base64Image ?? null,
    richData,
    region,
  };
}

export async function generateStaticParams() {
  const posts = await getPathsPosts();
  return Array.from(new Set(posts.map(({ category }) => category.region).flat()))
    .map((code) => Regions.find((act) => act.code === code)?.url)
    .filter(Boolean)
    .map((region) => ({ region }));
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region: regionUrl } = await params;
  const { region } = await getRegionData(regionUrl);

  return {
    title: `${region?.name} @ Fair Enough Trips`,
    description: `Fair Enough Trips in ${region?.name} page`,
    alternates: {
      canonical: `https://${Config.DOMAIN}/regions/${region?.url}`,
    },
  };
}

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region: regionUrl } = await params;
  const { posts, code, notes, base64Image, imageId, richData, region } = await getRegionData(regionUrl);

  if (!region) return null;

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(richData) }} />
      <Navbar />
      <main>
        <CategoryCard
          id={imageId}
          blurDataURL={base64Image}
          isMainCard
          postIds={posts.map(({ id }) => id)}
          categoryType={CategoriesEnum.Regions}
          category={region}
          areNotesPresent={Boolean(notes.length)}
          buttonLabel="Region info"
        />
        {Boolean(notes.length) && (
          <Layout>
            <Box margin="0 0 32px">
              <TripNotes notes={notes} title="Region info" />
            </Box>
          </Layout>
        )}
        {Boolean(posts.length) && (
          <CardList listTitle={`Latest trips in ${region.name}`}>
            {posts.map((post) => (
              <PostCard post={post} key={post.id} />
            ))}
          </CardList>
        )}
      </main>
      <Footer />
    </div>
  );
}
