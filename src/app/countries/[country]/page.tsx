import { Metadata } from "next";
import { Footer, Layout, Navbar, PostCard } from "components";
import CardList from "components/card-list/CardList";
import { Post } from "types/common.types";
import mongoClientConnectPromise from "MongoClient";
import { getLatestPosts, getPathsPosts } from "server/shared/posts";
import Config from "Config";
import { CategoriesEnum, Countries } from "enums/categories";
import { CategoryCard } from "components/category-card/CategoryCard";
import { parse } from "utils";
import { Box } from "components/box/Box";
import { TripNotes } from "components/trip-notes/TripNotes";
import { TripNote } from "types/database.types";
import { shuffleBackgroundImage } from "server/utils/ShuffleImage";
import prepareCountryRichData from "server/utils/prepare-country-rich-data";

async function getCountryData(countryUrl: string) {
  const mongoClient = await mongoClientConnectPromise;
  const country = Countries.find(({ url }) => url === countryUrl);
  const code = country?.code;

  const posts = await getLatestPosts({ ["category.country"]: code, parentId: { $exists: false } });
  const notes = await mongoClient.db(Config.DB_NAME).collection(Config.COUNTRY_NOTES_COLLECTION).findOne({ id: code });

  const id = shuffleBackgroundImage(posts.map(({ id }) => id));
  const notesParsed = parse(notes);
  const richData = prepareCountryRichData(code as string, posts);

  return {
    posts,
    code,
    notes: notesParsed?.notes ?? [],
    imageId: id,
    base64Image: posts.find((post) => post.id === id)?.base64Image,
    richData,
    country,
  };
}

export async function generateStaticParams() {
  const posts = await getPathsPosts();
  return Array.from(new Set(posts.map(({ category }) => category.country).flat()))
    .map((code) => Countries.find((act) => act.code === code)?.url)
    .filter(Boolean)
    .map((country) => ({ country }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country: countryUrl } = await params;
  const { country } = await getCountryData(countryUrl);

  return {
    title: `${country?.name} @ Fair Enough Trips`,
    description: `Fair Enough Trips - ${country?.name} page.`,
    alternates: {
      canonical: `https://${Config.DOMAIN}/countries/${country?.url}`,
    },
  };
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: countryUrl } = await params;
  const { posts, notes, code, imageId, base64Image, richData, country } = await getCountryData(countryUrl);

  if (!country) return null;

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(richData) }} />
      <Navbar />
      <main>
        <CategoryCard
          isMainCard
          postIds={posts.map(({ id }) => id)}
          categoryType={CategoriesEnum.Countries}
          category={{ ...country, originalName: "" }}
          areNotesPresent={Boolean(notes.length)}
          id={imageId}
          blurDataURL={base64Image}
          buttonLabel="Country info"
        />
        {Boolean(notes.length) && (
          <Layout>
            <Box margin="0 0 32px">
              <TripNotes notes={notes} title="Country info" />
            </Box>
          </Layout>
        )}
        {Boolean(posts.length) && (
          <CardList listTitle={`Latest trips in ${country.name}`}>
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
