import { Metadata } from "next";
import { Footer, Navbar, PostCard } from "components";
import Config from "Config";
import CardList from "components/card-list/CardList";
import { getLatestPosts } from "server/shared/posts";

export const metadata: Metadata = {
  title: "Fair Enough Trips Homepage",
  description: "Mountain blog covering hiking trails, climbing routes and via-ferrata across Europe. Includes maps, downloadable gps tracks, route schemes, topo schemes, profile elevations, high quality images and trip tips.",
  alternates: {
    canonical: `https://${Config.DOMAIN}/`,
  },
  openGraph: {
    title: "Fair Enough Trips - mountain guiding blog",
    description: "Find your perfect hiking trail, climbing route or via-ferrata in Europe. Maps, downloadable gps tracks, route schemes, topo schemes, profile elevations, high quality images and trip tips included. Fair enough ?",
    url: `https://${Config.DOMAIN}/`,
    siteName: "Fair Enough Trips Homepage",
    locale: "en_GB",
    type: "website",
  },
};

export default async function Home() {
  const posts = await getLatestPosts({ parentId: null }, Config.POST_COUNT_HOME_PAGE + 1);
  const mainPost = posts[0];
  const latestPosts = posts.slice(1, Config.POST_COUNT_HOME_PAGE + 1);

  return (
    <div>
      <Navbar />
      <main>
        <PostCard isMainPostCard post={mainPost} />
        <CardList listTitle="Latest trip posts">
          {latestPosts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </CardList>
      </main>
      <Footer />
    </div>
  );
}
