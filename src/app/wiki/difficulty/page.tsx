import { Metadata } from "next";
import { Navbar, Footer, Layout } from "components";
import { Divider } from "components/divider/Divider";
import { Paragraph } from "components/paragraph/Paragraph";

export const metadata: Metadata = {
  title: "Difficulty Scales @ Fair Enough Trips",
  description: "Explanation of UIAA, Via Ferrata, and Alpine hiking difficulty scales.",
};

export default function DifficultyWikiPage() {
  return (
    <div>
      <Navbar />
      <Layout title="Difficulty Scales">
        <Paragraph
          body={[
            "Understanding the difficulty of a route is crucial for your safety and enjoyment. Here I explain the three main scales used on this site to grade different types of terrain: the UIAA scale for rock climbing, the Via Ferrata scale, and the SAC Alpine Hiking scale (T1-T6).",
          ]}
        />

        <Divider title="UIAA Scale (Rock Climbing)" />
        <Paragraph
          body={[
            "The UIAA (International Climbing and Mountaineering Federation) scale is used to grade free climbing difficulty. On this site, we generally encounter grades from I to VI in alpine environments:",
            { tag: "li", body: "I (First degree): Easiest form of climbing. Hands are used to support balance. Beginners should use a rope." },
            { tag: "li", body: "II (Second degree): Basic climbing. Three points of contact must be maintained. A rope is highly recommended for beginners." },
            {
              tag: "li",
              body: "III (Third degree): Moderate climbing. Holds are larger but vertical passages require good technique and strength. Rope is generally necessary.",
            },
            { tag: "li", body: "IV (Fourth degree): Advanced climbing. Holds are smaller and less obvious. Experience and good technique are required." },
            { tag: "li", body: "V (Fifth degree): Difficult climbing. Often vertical or overhanging. Requires specific training and fitness." },
            { tag: "li", body: "VI (Sixth degree): Very difficult. Very small holds, requires excellent technique and physical condition." },
          ]}
        />

        <Divider title="Via Ferrata Scale (A - F)" />
        <Paragraph
          body={[
            "Via Ferratas (iron paths) are protected climbing routes. We use the standard alphabetical scale from A to F:",
            {
              tag: "li",
              body: "A (Easy): Essentially a steep hike with cables for security. Can usually be done without via ferrata gear by experienced hikers.",
            },
            { tag: "li", body: "B (Moderate): Steeper terrain, some vertical sections. Ladders and pegs are common. Via ferrata gear is necessary." },
            {
              tag: "li",
              body: "C (Difficult): Steep to very steep rock, vertical or slightly overhanging sections. Good fitness and arm strength are required.",
            },
            { tag: "li", body: "D (Very Difficult): Vertical and often overhanging rock. Holds are sparse, requiring significant arm strength and endurance." },
            { tag: "li", body: "E (Extremely Difficult): Sustained overhanging sections, very demanding physically and mentally." },
            {
              tag: "li",
              body: "F (Beyond Extremely Difficult): Reserved for the absolute hardest, heavily overhanging athletic routes. Excellent physical shape is mandatory.",
            },
          ]}
        />

        <Divider title="SAC Alpine Hiking Scale (T1 - T6)" />
        <Paragraph
          body={[
            "The Swiss Alpine Club (SAC) scale is widely used in the Alps to grade hiking and mountain trails:",
            { tag: "li", body: "T1 (Hiking): Well-cleared path. Terrain is flat or slightly sloped. No danger of falling." },
            { tag: "li", body: "T2 (Mountain Hiking): Path with continuous line and balanced ascents. Sure-footedness recommended." },
            {
              tag: "li",
              body: "T3 (Challenging Mountain Hiking): Exposed path, sometimes without visible trail. Hands may be needed for balance. Requires good sure-footedness.",
            },
            {
              tag: "li",
              body: "T4 (Alpine Hiking): Trail trace not always visible. Terrain is quite exposed, includes grassy/rocky slopes and easy scree. Hands regularly needed. Requires alpine experience.",
            },
            {
              tag: "li",
              body: "T5 (Challenging Alpine Hiking): Often pathless. Exposed terrain, steep rocks, glaciers, and firn. Reliable sure-footedness, good alpine experience, and basic use of ice axe and rope required.",
            },
            {
              tag: "li",
              body: "T6 (Difficult Alpine Hiking): Usually pathless. Highly exposed terrain, steep and treacherous rock. Excellent alpine experience and familiarity with technical climbing equipment required.",
            },
          ]}
        />
      </Layout>
      <Footer isSticky />
    </div>
  );
}
