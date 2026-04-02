import React, { FC, LinkHTMLAttributes, ReactNode } from "react";
import NextLink from "next/link";

interface LinkProps extends LinkHTMLAttributes<HTMLAnchorElement> {
  name: string | ReactNode;
  href: string;
  leftMargin?: number | string;
}

export const Link: FC<LinkProps> = ({ name, href, leftMargin, className, ...rest }) => {
  // remove it !!!
  const marginLeft = leftMargin ? `${leftMargin}px` : "";

  return (
    <span className={className} style={{ marginLeft, display: "block" }}>
      <NextLink href={href} {...rest}>
        {name}
      </NextLink>
    </span>
  );
};
