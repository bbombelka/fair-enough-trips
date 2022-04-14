export const navbarLinks = [
  { name: "scrambling", href: "/scrambling" },
  { name: "trekking", href: "/trekking" },
  { name: "via-ferrata", href: "/ferrata" },
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

export const menuLinks = [
  ...navbarLinks,
  { name: " ", href: "" },
  ...footerLinks,
];
