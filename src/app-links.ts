import { Activities, CategoriesEnum } from "enums/categories";

const activtiesLinks = Activities.map((act) => ({ name: act.name, href: `/activity/${act.url}` }));

export const navbarLinks = [
  ...activtiesLinks,
  { name: "regions", href: "/regions" },
  { name: "countries", href: "/countries" },
  { name: "search", href: "/search" },
];

export const footerLinks = [
  {
    name: "about",
    href: "/about",
  },
  {
    name: "contact via e-mail",
    href: "mailto:FairEnoughTrips@gmail.com",
  },
];

export const menuLinks = [{ name: "home", href: "/" }, ...navbarLinks, { name: " ", href: "" }, ...footerLinks];
