//@ts-nocheck
import { Activities, Countries, Regions } from "enums/categories";
import { readFile } from "fs/promises";
import { Parser } from "xml2js";
import archiver from "archiver";

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Categories data
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

(async () => {
  try {
    const id = await ask("Enter ID (used as directory name in /public): ");
    const dirPath = path.join(__dirname, "public", id);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Created directory: ${dirPath}`);
    }

    const templatePath = path.join(__dirname, "post.json");
    if (!fs.existsSync(templatePath)) {
      throw new Error("Base post.json file not found.");
    }

    const post = JSON.parse(fs.readFileSync(templatePath, "utf-8"));

    await ask("Upload gpx file to post directory");
    const gpxFilePath = `${dirPath}/track.gpx`;

    const parser = new Parser();
    const gpxFile = await readFile(gpxFilePath);
    const result = await parser.parseStringPromise(gpxFile);
    const tripTime = result.gpx?.trk[0]?.trkseg[0]?.trkpt[0]?.time[0];
    const { season, period, month, year } = parseIsoToDateObject(tripTime);
    const isoDate = new Date().toISOString();

    zipFile(gpxFilePath, `${dirPath}/track.zip`);
    post.postDate = { $date: isoDate };
    post.date = {
      season,
      period,
      month,
      year,
    };

    post.id = id;
    post.title = await ask("Enter title: ");
    post.attractiveness = parseInt(await ask("Enter attractiveness (1–5): "), 10);
    post.condition = parseInt(await ask("Enter condition (1–5): "), 10);
    post.difficulty = await ask("Enter difficulty: ");
    post.terrain = await ask("Enter terrain: ");

    // Category selections
    post.category = {
      region: await promptSelectMultiple("region", Regions),
      country: await promptSelectMultiple("country", Countries),
      activity: await promptSelectMultiple("activity", Activities),
    };

    const outPath = path.join(dirPath, "post.json");
    fs.writeFileSync(outPath, JSON.stringify(post, null, 2));
    console.log(`✅ Saved: ${outPath}`);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  } finally {
    rl.close();
  }
})();

function parseIsoToDateObject(isoString) {
  const date = new Date(isoString);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  let season;
  const mmdd = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  if (mmdd >= "03-21" && mmdd <= "06-20") {
    season = 1; // Spring
  } else if (mmdd >= "06-21" && mmdd <= "09-22") {
    season = 2; // Summer
  } else if (mmdd >= "09-23" && mmdd <= "12-20") {
    season = 3; // Autumn
  } else {
    season = 4; // Winter
  }

  let period;
  if (day <= 10) {
    period = 1;
  } else if (day <= 20) {
    period = 2;
  } else {
    period = 3;
  }

  return {
    season,
    period,
    month,
    year,
  };
}

function zipFile(sourceFilePath, outputZipPath) {
  const output = fs.createWriteStream(outputZipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    console.log(`Zipped ${archive.pointer()} total bytes`);
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.file(sourceFilePath, { name: require("path").basename(sourceFilePath) });
  archive.finalize();
}

async function promptSelectMultiple(title, options) {
  console.log(`\n📋 Select ${title} (comma-separated numbers):`);
  options.forEach((item, i) => {
    console.log(`${i + 1}. ${item.name}`);
  });

  const input = await ask(`Enter your choices for ${title}: `);
  const indices = input.split(",").map((i) => parseInt(i.trim(), 10) - 1);
  const selected = indices.map((i) => options[i]?.code).filter(Boolean);
  return selected;
}
