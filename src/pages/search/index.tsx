import { Footer, Navbar } from "components";
import { SearchTemplate } from "components/templates/search/SearchTemplate";
import { NextPage } from "next";
import Head from "next/head";

const SearchPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Search @ Fair Enough Trips</title>
        <meta name="description" content="Search for a trip @ Fair Enough Trips" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <Navbar />
      <SearchTemplate />
      <Footer isSticky />
    </>
  );
};

export default SearchPage;
