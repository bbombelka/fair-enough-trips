import { Navbar, Footer } from "components";
import Head from "next/head";
import { NextPage } from "next";
import { RatingSection } from "components/sections/about/rating-section/RatingSection";
import { Divider } from "components/divider/Divider";
import { Paragraph } from "components/paragraph/Paragraph";

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>About @ Fair Enough Trips</title>
        <meta name="description" content="Fair Enough Trips About Page" />
      </Head>
      <div>
        <Navbar />
        <main className="layout">
          <Divider title="Genesis" />
          <Paragraph
            body={[
              "I created this blog to provide substantial and strictly factual information from the trips I have ventured. It happened to me very often to be looking for hiking tips on specific region, mountain and the internet is rich with blog information on that. Problem is I need to dig down through the wall of text to extract the basic and essential information. I want to save you that trouble and give only the facts, trying to keep emotions out (though I can’t be objective 100% cases).",
              "My aim is to give information detailed enough to persuade you into a trip not because of great views during it but because it is more predictable and safe. I rely mostly on gps device and assume you would do the same. That’s why I don’t cover the whole path with detailed description, I limit only to show the key moments that require attention or are interesting in another aspects. I try to add any additional information about the terrain, ascents but it’s just a wordy description and not a map per se. To get as much reliability as you need I would advise to follow the gpx track and even better try to prepare a mental model of the trip in your mind by analysing the track before you get into the field. Gps is still only a device that can let you down. I try to upload only the gps track I have hiked myself therefore giving you certainty it is not just a line on the map but actual and viable walk-through.",
              "Having said that keep in mind that most of the conditions I present have a volatile tendency. Some paths may change over time, prices, timetables are being altered. Still I think it is valuable to add this info to get an overall picture because we should all assess trip making decisions on our past experiences - especially those that require certain set of skills that in key moments can cost us our lives.",
              "Know your body, know your gear, know your skills, get to know the trip - and enjoy it ",
            ]}
          />
          <RatingSection />
        </main>
        <Footer isSticky />
      </div>
    </>
  );
};

export default AboutPage;
