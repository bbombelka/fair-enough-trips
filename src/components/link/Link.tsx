import React, { FC, LinkHTMLAttributes, ReactNode } from "react";
import NextLink from "next/link";

interface LinkProps extends LinkHTMLAttributes<HTMLAnchorElement> {
  name: string | ReactNode;
  href: string;
}

export const Link: FC<LinkProps> = ({ name, href, className, ...rest }) => {
  return (
    <span className={className}>
      <NextLink href={href} {...rest}>
        {name}
      </NextLink>
    </span>
  );
};
