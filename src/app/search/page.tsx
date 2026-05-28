import { Metadata } from "next";
import { Footer, Navbar } from "components";
import { SearchTemplate } from "components/templates/search/SearchTemplate";
import Config from "Config";

export const metadata: Metadata = {
  title: "Search @ Fair Enough Trips",
  description: "Search for a trip @ Fair Enough Trips",
  alternates: {
    canonical: `https://${Config.DOMAIN}/search`,
  },
};

export default function SearchPage() {
  return (
    <div>
      <Navbar />
      <SearchTemplate />
      <Footer isSticky />
    </div>
  );
}
