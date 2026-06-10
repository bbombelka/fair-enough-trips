import React, { FC } from "react";
import NextLink from "next/link";
import { GearListProps } from "./GearList.types";

export const GearList: FC<GearListProps> = ({ gear }) => {
  if (!gear || gear.length === 0) return null;

  return (
    <span key="gear">
      {gear.map((item, index) => {
        const isLast = index === gear.length - 1;
        const suffix = isLast ? "" : ", ";
        
        if (typeof item === "string") {
          return <React.Fragment key={index}>{item}{suffix}</React.Fragment>;
        } else {
          return (
            <React.Fragment key={index}>
              <NextLink href={`/gear/${item.id}`}>{item.type || item.name}</NextLink>
              {suffix}
            </React.Fragment>
          );
        }
      })}
    </span>
  );
};
