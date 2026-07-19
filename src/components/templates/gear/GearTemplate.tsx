import React, { FC } from "react";
import { Layout, Navbar, Footer } from "components";
import { Paragraph } from "components/paragraph/Paragraph";
import { Divider } from "components/divider/Divider";
import { Link } from "components/link/Link";
import paragraphStyles from "styles/Paragraph.module.css";
import { GearMap } from "enums/gear";
import { GearTemplateProps } from "./GearTemplate.types";
import { GearTable } from "./components/GearTable";
import { GearProsCons } from "./components/GearProsCons";

export const GearTemplate: FC<GearTemplateProps> = ({ gearItem, referencedTrips }) => {
  const { brand, name, type, description, usage, statsGeneral, statsSpecific, pros, cons } = gearItem;

  let orderCounter = 1;
  const title = `${brand} ${name}`;

  return (
    <>
      <Navbar />
      <Layout title={title} subTitle={GearMap.get(type as any)}>
        <GearTable statsGeneral={statsGeneral} statsSpecific={statsSpecific} />
        <Divider title={`${title} - review`} order={orderCounter++} stickyScrollToElementId="gear-description" />
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
        <GearProsCons brand={brand} name={name} pros={pros} cons={cons} order={orderCounter++} />
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
};
