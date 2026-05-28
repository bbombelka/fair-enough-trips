import React, { FC } from "react";
import NextLink from "next/link";
import { LinkProps } from "./Link.types";

export const Link: FC<LinkProps> = ({ name, href, className, ...rest }) => {
  return (
    <span className={className}>
      <NextLink href={href} {...rest}>
        {name}
      </NextLink>
    </span>
  );
};
