import { Footer, Layout, Navbar, GearCard } from "components";
import Config from "Config";
import mongoClientConnectPromise from "MongoClient";
import { Metadata } from "next";
import CardList from "components/card-list/CardList";
import { GearItem } from "components/templates/gear/GearTemplate.types";

export const metadata: Metadata = {
  title: "Gear Reviews @ Fair Enough Trips",
  description: "Long-term reviews of outdoor gear tested in real-world mountain conditions.",
  alternates: {
    canonical: `https://${Config.DOMAIN}/gear`,
  },
};

export default async function GearPage() {
  const mongoClient = await mongoClientConnectPromise;
  const db = mongoClient.db(Config.DB_NAME);

  const gearCollection = db.collection("gear");
  const gearItems = await gearCollection.find({}).toArray();

  // Convert MongoDB ObjectID to string to avoid serialization issues
  const safeGearItems = gearItems.map((item) => {
    const { _id, ...safeItem } = item as any;
    return safeItem as GearItem;
  });

  // Sort alphabetically by brand, then name
  safeGearItems.sort((a, b) => {
    const brandCompare = a.brand.localeCompare(b.brand);
    if (brandCompare !== 0) return brandCompare;
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <Navbar />
      <Layout title="My Gear" subTitle="Long-term real-world gear reviews">
        <CardList>
          {safeGearItems.map((gearItem) => (
            <GearCard key={gearItem.slug} gearItem={gearItem} />
          ))}
        </CardList>
      </Layout>
      <Footer isSticky />
    </div>
  );
}
