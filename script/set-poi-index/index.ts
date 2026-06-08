import path from "path";
import setPoiIndex from "./setPoiIndex";
import { getOrSelectId, POSTS_ROOT } from "../utils";

(async () => {
  const args = process.argv.slice(2);
  const poiId = await getOrSelectId(args[0]);

  console.log(`Processing POI ID: ${poiId}`);

  setPoiIndex(
    path.join(POSTS_ROOT, poiId, "track.zip"),
    path.join(POSTS_ROOT, poiId, "poi.json")
  );
})();
