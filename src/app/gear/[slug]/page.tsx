import { Layout, Navbar, Footer } from "components";
import { notFound } from "next/navigation";
import mongoClientConnectPromise from "MongoClient";
import Config from "Config";
import { Paragraph } from "components/paragraph/Paragraph";
import { Cell } from "components/table-data/components/Cell";
import tableStyles from "styles/TableData.module.css";
import { Divider } from "components/divider/Divider";
import { Link } from "components/link/Link";
import paragraphStyles from "styles/Paragraph.module.css";
import { GearMap } from "enums/gear";
import { StarRate } from "components/star-rate/StarRate";

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
  const { brand, name, description, statsGeneral, statsSpecific, pros, cons, usage, tripsUsed, type } = safeGearItem;

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
  };

  const uppercaseFirstLetter = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatGeneralStat = (key: string, value: any) => {
    if (value === undefined || value === null || value === "") return null;
    switch (key) {
      case "price":
        return { label: "Price", value: `€${value}` };
      case "weight":
        return { label: "Weight", value: `${value} g` };
      case "volume":
        return { label: "Volume", value: `${value} L` };
      case "purchased":
        return { label: "Used since", value: formatDate(value) };
      case "rating":
        return { label: "Rating", value: `${value}/10` };
      case "durability":
        return { label: "Durability", value: `${value}/10` };
      case "frequency":
        return { label: "Times used", value: `${value}` };
      default:
        return { label: uppercaseFirstLetter(key), value: String(value) };
    }
  };

  const generalKeysOrder = ["purchased", "price", "weight", "rating", "durability", "frequency"];

  let orderCounter = 1;

  return (
    <>
      <Navbar />
      <Layout title={`${brand} ${name}`} subTitle={GearMap.get(type)}>
        {(statsGeneral || statsSpecific) && (
          <div id="gear-stats" style={{ display: "flex", justifyContent: "center", padding: "0 24px" }}>
            <table className={tableStyles.container} style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
              <tbody className={tableStyles.table}>
                {statsGeneral &&
                  generalKeysOrder.map((key) => {
                    const val = statsGeneral[key];
                    if (val === undefined || val === null || val === "") return null;

                    if (key === "rating" || key === "durability") {
                      const label = key === "rating" ? "Rating" : "Durability";
                      return (
                        <Cell key={key} label={label}>
                          <a href="/about#rating">
                            <StarRate rate={val / 2} />
                          </a>
                        </Cell>
                      );
                    }

                    const formatted = formatGeneralStat(key, val);
                    if (!formatted) return null;
                    return <Cell key={key} label={formatted.label} value={formatted.value} />;
                  })}
                {statsSpecific &&
                  Object.entries(statsSpecific).map(([key, val]) => {
                    if (val === undefined || val === null || val === "") return null;
                    return <Cell key={key} label={uppercaseFirstLetter(key)} value={String(val)} />;
                  })}
              </tbody>
            </table>
          </div>
        )}
        <Divider title={`${brand} ${name} - review`} order={orderCounter++} stickyScrollToElementId="gear-description" />
        <Paragraph id="gear-description" body={[description]} />
        <Paragraph id="gear-usage" title="Mostly used for" body={[usage]} />
        {referencedTrips.length > 0 && (
          <Paragraph
            id="gear-used-in"
            title="Used in"
            body={[
              <ul key="used-in-list" className={`${paragraphStyles.list} ${paragraphStyles["list-unordered"]}`}>
                {referencedTrips.map((trip) => {
                  const href = trip.parentId ? `/posts/${trip.parentId}/${trip.id}` : `/posts/${trip.id}`;
                  return (
                    <li key={trip.id} className={paragraphStyles["list-item"]}>
                      <Link href={href} name={trip.title} />
                    </li>
                  );
                })}
              </ul>,
            ]}
          />
        )}
        {(pros?.length > 0 || cons?.length > 0) && (
          <>
            <Divider title={`${brand} ${name} - Pros & Cons`} order={orderCounter++} stickyScrollToElementId="gear-pros-cons" />
            <div
              id="gear-pros-cons"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                padding: "0 24px",
                maxWidth: "1000px",
                margin: "0 auto",
                gap: "24px",
              }}
            >
              {pros?.length > 0 && (
                <div style={{ flex: "1 1 300px" }}>
                  <Paragraph title="Pros" body={pros.map((pro: string) => ({ tag: "li", body: pro }))} />
                </div>
              )}
              {cons?.length > 0 && (
                <div style={{ flex: "1 1 300px" }}>
                  <Paragraph title="Cons" body={cons.map((con: string) => ({ tag: "li", body: con }))} />
                </div>
              )}
            </div>
          </>
        )}

        <Divider title="Images" order={orderCounter++} stickyScrollToElementId="gear-images" />
        <div
          id="gear-images"
          style={{ margin: "2rem auto", maxWidth: "1000px", textAlign: "center", padding: "4rem", background: "#f4f4f4", borderRadius: "8px" }}
        >
          <p style={{ color: "#666", fontSize: "1.2rem" }}>Image Gallery Placeholder</p>
        </div>
      </Layout>
      <Footer />
    </>
  );
}
