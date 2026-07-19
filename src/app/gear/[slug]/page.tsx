import { notFound } from "next/navigation";
import mongoClientConnectPromise from "MongoClient";
import Config from "Config";
import { GearTemplate } from "components/templates/gear/GearTemplate";

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

  let referencedTrips: { id: string; title: string; parentId?: string }[] = [];
  if (tripsUsed && Array.isArray(tripsUsed) && tripsUsed.length > 0) {
    const postsCollection = db.collection(Config.POSTS_COLLECTION);
    const trips = await postsCollection
      .find({ id: { $in: tripsUsed } })
      .project({ id: 1, title: 1, parentId: 1 })
      .toArray();

    referencedTrips = tripsUsed.map((id: string) => {
      const trip = trips.find((t) => t.id === id);
      return {
        id,
        title: trip?.title || id,
        parentId: trip?.parentId,
      };
    });
  }

  return (
    <GearTemplate
      gearItem={safeGearItem}
      referencedTrips={referencedTrips}
    />
  );
}
