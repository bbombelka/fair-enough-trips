import path from "path";
import setPoiIndex from "./setPoiIndex";

const args = process.argv.slice(2); // Get arguments passed to script
const poiId = args[0]; // First argument is the POI ID

if (!poiId) {
  console.error("Error: No POI ID provided.");
  process.exit(1);
}

console.log(`Processing POI ID: ${poiId}`);

setPoiIndex(path.resolve(`../../public/${poiId}/track.zip`), path.resolve(`../../public/${poiId}/poi.json`));
