import { Activities } from "enums/categories";

const activtiesLinks = Activities.map((act) => ({ name: act.name, href: `/activity/${act.url}` }));

export type LinkData = {
  name: string;
  href: string;
  nestedLinks?: LinkData[];
};

export const navbarLinks: LinkData[] = [
  { name: "activities", href: "", nestedLinks: activtiesLinks },
  { name: "countries", href: "/countries" },
  { name: "regions", href: "/regions" },
  { name: "search", href: "/search" },
];

export const footerLinks: LinkData[] = [
  {
    name: "about",
    href: "/about",
  },
  {
    name: "contact via e-mail",
    href: "mailto:FairEnoughTrips@gmail.com",
  },
];

export const menuLinks: LinkData[] = [{ name: "home", href: "/" }, ...navbarLinks, { name: " ", href: "" }, ...footerLinks];
