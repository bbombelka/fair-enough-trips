import { Product, Review, BreadcrumbList, Graph } from "schema-dts";
import Config from "Config";
import { GearItem, ReferencedTrip } from "components/templates/gear/GearTemplate.types";

export default function prepareGearRichData(gearItem: GearItem, _referencedTrips: ReferencedTrip[]) {
  const { id, slug, brand, name, description, usage, statsGeneral, pros, cons, images } = gearItem;

  const titleName = `${brand} ${name}`;

  // Image URL selection
  const mainImageName = images?.general?.[0];
  const imageUrl = mainImageName
    ? `${Config.S3_BUCKET}/${Config.S3_GEAR_PREFIX}/${id}/${mainImageName}.${Config.DEFAULT_IMAGE_EXTENSION}`
    : `https://${Config.DOMAIN}/placeholder.webp`;

  // rating out of 10 in statsGeneral
  const ratingValue = typeof statsGeneral?.rating === "number" ? statsGeneral.rating : undefined;

  const breadcrumbList: BreadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Homepage",
        item: `https://${Config.DOMAIN}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: titleName,
        item: `https://${Config.DOMAIN}/gear/${slug}`,
      },
    ],
  };

  const review: Review = {
    "@type": "Review",
    author: {
      "@type": "Organization",
      name: "Fair Enough Trips",
      url: `https://${Config.DOMAIN}`,
    },
    datePublished: (statsGeneral?.purchased as string) || new Date().toISOString(),
    reviewBody: description + (usage ? `\n\nMostly used for:\n${usage}` : ""),
    ...(ratingValue && {
      reviewRating: {
        "@type": "Rating",
        ratingValue: ratingValue.toString(),
        bestRating: "10",
        worstRating: "1",
      },
    }),
  };

  const product: Product = {
    "@type": "Product",
    name: titleName,
    image: imageUrl,
    description: description,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    review: review,
    // Add positiveNotes and negativeNotes (Pros and Cons) for structured reviews
    ...(pros?.length > 0 && {
      positiveNotes: {
        "@type": "ItemList",
        itemListElement: pros.map((pro, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: pro,
        })),
      },
    }),
    ...(cons?.length > 0 && {
      negativeNotes: {
        "@type": "ItemList",
        itemListElement: cons.map((con, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: con,
        })),
      },
    }),
  };

  const richData: Graph & { "@context": string } = {
    "@context": "https://schema.org",
    "@graph": [product, breadcrumbList],
  };

  return richData;
}
