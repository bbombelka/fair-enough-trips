import { LinkHTMLAttributes, ReactNode } from "react";

export interface LinkProps extends LinkHTMLAttributes<HTMLAnchorElement> {
  name: string | ReactNode;
  href: string;
}
