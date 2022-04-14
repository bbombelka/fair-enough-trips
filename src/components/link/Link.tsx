import React, { FC } from "react";
import NextLink from "next/link";

type LinkProps = {
  name: string;
  href: string;
  leftMargin?: number;
};

export const Link: FC<LinkProps> = ({ name, href, leftMargin }) => {
  const marginLeft = leftMargin ? `${leftMargin}px` : "";

  return (
    <span style={{ marginLeft }}>
      <NextLink href={href}>
        <a>{name}</a>
      </NextLink>
    </span>
  );
};
