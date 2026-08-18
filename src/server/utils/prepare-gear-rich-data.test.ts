import prepareGearRichData from "./prepare-gear-rich-data";
import { GearItem, ReferencedTrip } from "components/templates/gear/GearTemplate.types";
import Config from "Config";

describe("prepareGearRichData", () => {
  const fakeGearItem: GearItem = {
    id: "thule-stir-20l",
    slug: "thule-stir-20l",
    brand: "Thule",
    name: "Stir 20l",
    type: "RUCKSACK_20L",
    description: "The Thule Stir 20L is a lightweight and durable daypack.",
    usage: "Single day climbing, scrambling and hiking trips.",
    statsGeneral: {
      price: 60,
      weight: 535,
      rating: 8,
      purchased: "2025-09-26T13:57:00.330+00:00",
    },
    pros: ["Lightweight", "Durable"],
    cons: ["Hard to reach pockets"],
    images: {
      general: [{ isVertical: false, desc: "test" }],
    },
  };

  const fakeReferencedTrips: ReferencedTrip[] = [
    {
      id: "trip-1",
      title: "Trip One",
      category: {} as any,
      difficulty: "III",
    },
  ];

  it("should build structured product and breadcrumbs rich data correctly", () => {
    const result = prepareGearRichData(fakeGearItem, fakeReferencedTrips);

    expect(result).toEqual({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          name: "Thule Stir 20l",
          image: `${Config.S3_BUCKET}/${Config.S3_GEAR_PREFIX}/thule-stir-20l-1.${Config.DEFAULT_IMAGE_EXTENSION}`,
          description: "The Thule Stir 20L is a lightweight and durable daypack.",
          brand: {
            "@type": "Brand",
            name: "Thule",
          },
          review: {
            "@type": "Review",
            author: {
              "@type": "Organization",
              name: "Fair Enough Trips",
              url: `https://${Config.DOMAIN}`,
            },
            datePublished: "2025-09-26T13:57:00.330+00:00",
            reviewBody: "The Thule Stir 20L is a lightweight and durable daypack.\n\nMostly used for:\nSingle day climbing, scrambling and hiking trips.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "8",
              bestRating: "10",
              worstRating: "1",
            },
          },
          positiveNotes: {
            "@type": "ItemList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Lightweight",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Durable",
              },
            ],
          },
          negativeNotes: {
            "@type": "ItemList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Hard to reach pockets",
              },
            ],
          },
        },
        {
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
              name: "Thule Stir 20l",
              item: `https://${Config.DOMAIN}/gear/thule-stir-20l`,
            },
          ],
        },
      ],
    });
  });

  it("should handle missing optional fields and fallback to defaults", () => {
    const minimalGear: GearItem = {
      id: "simple-gear",
      slug: "simple-gear",
      brand: "Brand",
      name: "Simple",
      type: "TYPE",
      description: "Simple description.",
      usage: "",
      statsGeneral: {},
      pros: [],
      cons: [],
      images: {
        general: [],
      },
    };

    const result = prepareGearRichData(minimalGear, []);

    // Verify main fields and fallback canonical / fallback image
    const product = result["@graph"][0] as any;
    expect(product.image).toBe("https://fair-enough-trips.s3.eu-central-1.amazonaws.com/gear/simple-gear-1.webp");
    expect(product.review.reviewRating).toBeUndefined();
    expect(product.positiveNotes).toBeUndefined();
    expect(product.negativeNotes).toBeUndefined();
    expect(product.review.reviewBody).toBe("Simple description.");
  });
});
