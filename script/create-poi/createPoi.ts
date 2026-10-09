import fs from "fs";

import path from "path";
import readlineSync from "readline-sync";
import { PoiType } from "../../src/pages/api/parse-gpx";
import { POSTS_ROOT, getOrSelectId } from "../utils";

export const POI_TYPES: readonly PoiType[] = ["parking", "water", "peak", "signpost", "pass", "hut", "ferrata"] as const;

export type Poi = {
  name: string;
  type: PoiType;
  lat: number;
  lon: number;
  index: number;
};

export type Coordinates = {
  lat: number;
  lon: number;
};

function parseCoordinatePart(part: string): { val: number; dir?: "N" | "S" | "E" | "W" } | null {
  const dirMatch = part.match(/[NSEW]/i);
  const dir = dirMatch ? (dirMatch[0].toUpperCase() as "N" | "S" | "E" | "W") : undefined;

  // Check DMS format (e.g. 46° 22' 37.1" or 46°22'37.1")
  const dmsMatch = part.match(/([+-]?\d+(?:\.\d+)?)[°\s]+(\d+(?:\.\d+)?)['′\s]+(?:(\d+(?:\.\d+)?)["″\s]*)?/);
  if (dmsMatch) {
    const deg = parseFloat(dmsMatch[1]);
    const min = parseFloat(dmsMatch[2]);
    const sec = dmsMatch[3] ? parseFloat(dmsMatch[3]) : 0;
    let val = Math.abs(deg) + min / 60 + sec / 3600;
    if (deg < 0 || dir === "S" || dir === "W") {
      val = -val;
    }
    return { val, dir };
  }

  // Check decimal degrees with optional letters or symbols stripped
  const clean = part.replace(/[°NSEWnsew]/g, "").trim();
  const num = parseFloat(clean);
  if (isNaN(num)) {
    return null;
  }

  let val = num;
  if (dir === "S" || dir === "W") {
    val = -Math.abs(num);
  } else if (dir === "N" || dir === "E") {
    val = Math.abs(num);
  }

  return { val, dir };
}

/**
 * Parses user-provided coordinates in various formats into decimal lat/lon.
 * Supports:
 * - 46.3769747, 13.8429506
 * - 46.3769747N, 13.8429506E (and variations with/without spaces)
 * - 46.3769747S, 13.8429506W
 * - 46°22'37.1"N, 13°50'34.6"E (DMS)
 */
export function parseCoordinates(input: string): Coordinates | null {
  if (!input || typeof input !== "string") {
    return null;
  }

  const raw = input.trim();
  let parts: string[] | null = null;

  if (raw.includes(",")) {
    parts = raw.split(",").map((p) => p.trim());
  } else if (/[NSEWnsew]/.test(raw)) {
    const splitMatch = raw.match(/^(.*?([NSEWnsew]))\s*(.*)$/i);
    if (splitMatch) {
      parts = [splitMatch[1].trim(), splitMatch[3].trim()];
    }
  } else {
    parts = raw.split(/\s+/).map((p) => p.trim());
  }

  if (!parts || parts.length !== 2) {
    return null;
  }

  const p1 = parseCoordinatePart(parts[0]);
  const p2 = parseCoordinatePart(parts[1]);
  if (!p1 || !p2) {
    return null;
  }

  let lat: number;
  let lon: number;

  // Handle swapped order if cardinal directions specify longitude first
  if ((p1.dir === "E" || p1.dir === "W") && (p2.dir === "N" || p2.dir === "S")) {
    lon = p1.val;
    lat = p2.val;
  } else {
    lat = p1.val;
    lon = p2.val;
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return null;
  }

  return {
    lat: Number(lat.toFixed(7)),
    lon: Number(lon.toFixed(7)),
  };
}

/**
 * Determines output directory for the given post ID:
 * - If public/content/posts/<id> exists, uses it.
 * - Otherwise falls back to created-poi/<id>.
 */
export function resolvePoiDirectory(
  poiId: string,
  postsRoot: string = POSTS_ROOT,
  createdPoiRoot: string = path.resolve(postsRoot, "../../../created-poi"),
): string {
  const postDir = path.join(postsRoot, poiId);
  if (fs.existsSync(postDir)) {
    return postDir;
  }
  return path.join(createdPoiRoot, poiId);
}

/**
 * Checks if target directory has existing POI file and whether it has data.
 */
export function inspectExistingPoiFile(targetDir: string): {
  filePath: string;
  exists: boolean;
  pois: Poi[];
} {
  const filePath = path.join(targetDir, "poi.json");
  if (!fs.existsSync(filePath)) {
    return { filePath, exists: false, pois: [] };
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8").trim();
    if (content.length === 0) {
      return { filePath, exists: true, pois: [] };
    }
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return { filePath, exists: true, pois: parsed };
    }
  } catch {
    // Malformed JSON counts as existing without valid POIs
  }

  return { filePath, exists: true, pois: [] };
}

/**
 * Finds the next available non-colliding file name (poi_1.json, poi_2.json, ...).
 */
export function getNonCollidingFilePath(targetDir: string): string {
  let i = 1;
  while (fs.existsSync(path.join(targetDir, `poi_${i}.json`))) {
    i++;
  }
  return path.join(targetDir, `poi_${i}.json`);
}

/**
 * Writes POI array safely to disk as formatted JSON.
 */
export function savePoiFile(filePath: string, pois: Poi[]): void {
  const targetDir = path.dirname(filePath);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(pois, null, 2) + "\n", "utf-8");
}

export async function runCreatePoiCli(): Promise<void> {
  const args = process.argv.slice(2);
  const poiId = await getOrSelectId(args[0]);

  const targetDir = resolvePoiDirectory(poiId);
  console.log(`\n📁 Target directory: ${targetDir}`);

  const existing = inspectExistingPoiFile(targetDir);
  let outputFilePath = existing.filePath;
  let pois: Poi[] = [];

  if (existing.exists && existing.pois.length > 0) {
    console.log(`\n⚠️  Found existing poi.json with ${existing.pois.length} POI(s).`);
    console.log("[1] Append new POIs to existing poi.json");
    console.log("[2] Overwrite existing poi.json");
    console.log("[3] Save to a new file (e.g. poi_1.json)");
    console.log("[0] Cancel");

    const option = readlineSync.questionInt("\nEnter choice (1-3, 0 to cancel): ", {
      min: 0,
      max: 3,
    });

    if (option === 0) {
      console.log("Exiting...");
      process.exit(0);
    } else if (option === 1) {
      pois = [...existing.pois];
      outputFilePath = existing.filePath;
    } else if (option === 2) {
      pois = [];
      outputFilePath = existing.filePath;
    } else if (option === 3) {
      pois = [];
      outputFilePath = getNonCollidingFilePath(targetDir);
    }
  }

  while (true) {
    let name = "";
    while (!name) {
      name = readlineSync.question("Enter name: ").trim();
      if (!name) {
        console.log("❌ Name cannot be empty.");
      }
    }

    console.log("\nSelect POI category:");
    POI_TYPES.forEach((t, i) => console.log(`[${i + 1}] ${t}`));
    const typeIdx =
      readlineSync.questionInt(`Choose category (1-${POI_TYPES.length}): `, {
        min: 1,
        max: POI_TYPES.length,
      }) - 1;
    const selectedType = POI_TYPES[typeIdx];

    let coords: Coordinates | null = null;
    while (!coords) {
      const input = readlineSync.question("Enter coordinates (lat, lon, e.g. 46.3769747, 13.8429506 or 46.3769747N, 13.8429506E): ").trim();
      coords = parseCoordinates(input);
      if (!coords) {
        console.log("❌ Invalid coordinates format. Please enter as 'lat, lon' (e.g. 46.3769747, 13.8429506).");
      }
    }

    pois.push({
      name,
      type: selectedType,
      lat: coords.lat,
      lon: coords.lon,
      index: 0,
    });

    console.log(`\n✅ Added: "${name}" (${selectedType}) at [${coords.lat}, ${coords.lon}]`);

    const moreInput = readlineSync.question("\nAdd another POI? (y/n) [n]: ").trim().toLowerCase();
    if (moreInput !== "y" && moreInput !== "yes") {
      break;
    }
  }

  savePoiFile(outputFilePath, pois);
  console.log(`\n🎉 Successfully saved ${pois.length} POI(s) to ${outputFilePath}\n`);
}
