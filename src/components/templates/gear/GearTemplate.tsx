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
import { GearGallery } from "./components/GearGallery";

export const GearTemplate: FC<GearTemplateProps> = ({ gearItem, referencedTrips }) => {
  const { slug, brand, name, type, description, usage, statsGeneral, statsSpecific, pros, cons, images } = gearItem;

  let orderCounter = 1;
  const title = `${brand} ${name}`;
  const hasImages = Boolean(images?.general?.length || images?.timeline?.length);

  return (
    <>
      <Navbar />
      <Layout title={title} subTitle={GearMap.get(type as any)}>
        <GearTable statsGeneral={statsGeneral} statsSpecific={statsSpecific} />
        <Divider title={`Review of ${title}`} order={orderCounter++} stickyScrollToElementId="gear-description" />
        <Paragraph id="gear-description" body={[description]} />
        <Paragraph id="gear-usage" title="Mostly used for" body={[usage]} />
        {referencedTrips.length > 0 && (
          <Paragraph
            id="gear-used-in"
            title={`Used on these ${referencedTrips.length === 1 ? "trip" : "trips"}`}
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
        <GearProsCons gearName={title} pros={pros} cons={cons} order={orderCounter++} />

        {hasImages && (
          <>
            <Divider title={`Images of ${title}`} order={orderCounter++} stickyScrollToElementId="gear-images" />
            <GearGallery slug={slug} images={images} />
          </>
        )}
      </Layout>
      <Footer />
    </>
  );
};
