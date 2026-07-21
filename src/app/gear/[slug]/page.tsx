import { Metadata } from "next";
import { notFound } from "next/navigation";
import mongoClientConnectPromise from "MongoClient";
import Config from "Config";
import { GearTemplate } from "components/templates/gear/GearTemplate";
import prepareGearRichData from "server/utils/prepare-gear-rich-data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  const client = await mongoClientConnectPromise;
  const db = client.db(Config.DB_NAME);

  const gearItem = await db.collection("gear").findOne({ slug: slug });

  if (!gearItem) {
    return {};
  }

  const titleName = `${gearItem.brand} ${gearItem.name}`;

  return {
    title: `${titleName} Review @ Fair Enough Trips`,
    description: `Long-term review of the ${titleName} after real mountain use. Pros, cons, photos, and the trips where I tested it.`,
    alternates: {
      canonical: `https://${Config.DOMAIN}/gear/${slug}`,
    },
  };
}

export default async function GearPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const client = await mongoClientConnectPromise;
  const db = client.db(Config.DB_NAME);

  const gearItem = await db.collection("gear").findOne({ slug: slug });

  if (!gearItem) {
    notFound();
    return null;
  }

  // Convert MongoDB ObjectID to string to avoid serialization issues
  const { _id, ...safeGearItem } = gearItem as any;
  const { tripsUsed } = safeGearItem;

  let referencedTrips: any[] = [];
  if (tripsUsed && Array.isArray(tripsUsed) && tripsUsed.length > 0) {
    const postsCollection = db.collection(Config.POSTS_COLLECTION);
    const trips = await postsCollection
      .find({ id: { $in: tripsUsed } })
      .project({ id: 1, title: 1, parentId: 1, category: 1, difficulty: 1, postDate: 1 })
      .toArray();

    // Sort chronologically (latest first)
    trips.sort((a, b) => {
      const dateA = a.postDate ? new Date(a.postDate).getTime() : 0;
      const dateB = b.postDate ? new Date(b.postDate).getTime() : 0;
      return dateB - dateA;
    });

    referencedTrips = trips.map((trip) => {
      return {
        id: trip.id,
        title: trip.title,
        parentId: trip.parentId,
        category: trip.category,
        difficulty: trip.difficulty,
      };
    });
  }

  const richData = prepareGearRichData(safeGearItem, referencedTrips);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(richData) }} />
      <GearTemplate gearItem={safeGearItem} referencedTrips={referencedTrips} />
    </>
  );
}
