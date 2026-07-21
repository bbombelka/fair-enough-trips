import React, { FC } from "react";
import { Layout, Navbar, Footer } from "components";
import { Paragraph } from "components/paragraph/Paragraph";
import { Divider } from "components/divider/Divider";
import { GearMap } from "enums/gear";
import { GearTemplateProps } from "./GearTemplate.types";
import { GearTable } from "./components/GearTable";
import { GearProsCons } from "./components/GearProsCons";
import { GearGallery } from "./components/GearGallery";
import { ReferencedTrips } from "./components/ReferencedTrips";

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
        {usage && <Paragraph id="gear-usage" title="Mostly used for" body={[usage]} />}
        <GearProsCons gearName={title} pros={pros} cons={cons} order={orderCounter++} />
        {referencedTrips.length > 0 && (
          <>
            <Divider
              title={`${referencedTrips.length} Trip${referencedTrips.length === 1 ? "" : "s"} ${title} was used in`}
              order={orderCounter++}
              stickyScrollToElementId="gear-used-in"
            />
            <div id="gear-used-in" data-testid="gear-used-in">
              <ReferencedTrips referencedTrips={referencedTrips} />
            </div>
          </>
        )}

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
