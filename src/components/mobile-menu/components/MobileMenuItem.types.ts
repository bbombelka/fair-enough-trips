import { LinkData } from "app-links";

export type MobileMenuItemProps = {
  href: string;
  onClickCallback: () => void;
  name: string;
  nestedItems?: LinkData[];
};
