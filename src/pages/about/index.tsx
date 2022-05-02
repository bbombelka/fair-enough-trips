import { Navbar, Footer } from "components";
import Head from "next/head";
import { NextPage } from "next";
import { RatingSection } from "components/sections/about/rating-section/RatingSection";

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>About @ Fair Enough Trips</title>
        <meta name="description" content="Fair Enough Trips About Page" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div>
        <Navbar />
        <main className="layout">
          <RatingSection />
        </main>
        <Footer isSticky />
      </div>
    </>
  );
};

export default AboutPage;
