export const navbarLinks = [
  { name: "scrambling", href: "/activity/scrambling" },
  { name: "trekking", href: "/activity/trekking" },
  { name: "via-ferrata", href: "/activity/via-ferrata" },
  { name: "alpine climbing", href: "/activity/alpine-climbing" },
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
