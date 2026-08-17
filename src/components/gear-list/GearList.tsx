import React, { FC } from "react";
import NextLink from "next/link";
import { GearListProps } from "./GearList.types";
import { GearMap } from "enums/gear";

export const GearList: FC<GearListProps> = ({ gear }) => {
  if (!gear || gear.length === 0) return null;

  return (
    <span key="gear">
      {gear.map((item, index) => {
        const isLast = index === gear.length - 1;
        const suffix = isLast ? "" : ", ";

        if (typeof item === "string") {
          return (
            <React.Fragment key={index}>
              {item}
              {suffix}
            </React.Fragment>
          );
        } else {
          const quantityPrefix = item.quantity && item.quantity > 1 ? `${item.quantity} x ` : "";
          const brandPrefix = item.brand ? `${item.brand} ` : "";
          const gearTypeLabel = GearMap.get(item.type) || item.type;
          const displayName = `${quantityPrefix}${gearTypeLabel} - ${brandPrefix}${item.name}`;
          return (
            <React.Fragment key={index}>
              <NextLink style={{ textDecoration: "underline" }} href={`/gear/${item.slug}`}>
                {displayName}
              </NextLink>
              {suffix}
            </React.Fragment>
          );
        }
      })}
    </span>
  );
};
