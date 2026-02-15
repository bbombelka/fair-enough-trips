import { Footer, Navbar } from "components";
import { SearchTemplate } from "components/templates/search/SearchTemplate";
import Config from "Config";
import { NextPage } from "next";
import Head from "next/head";

const SearchPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Search @ Fair Enough Trips</title>
        <meta name="description" content="Search for a trip @ Fair Enough Trips" />
        <link rel="canonical" href={`https://${Config.DOMAIN}/search`} />
      </Head>
      <Navbar />
      <SearchTemplate />
      <Footer isSticky />
    </>
  );
};

export default SearchPage;
