//@ts-nocheck
import { Activities, Countries, Regions } from "./src/enums/categories";
import { readFile } from "fs/promises";
import { Parser } from "xml2js";
import archiver from "archiver";
import fs from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q: string) => new Promise<string>((resolve) => rl.question(q, resolve));

(async () => {
  try {
    const id = await ask("Enter ID (used as directory name in /public/content/posts): ");
    const dirPath = path.join(__dirname, "public", "content", "posts", id);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Created directory: ${dirPath}`);
    }

    const templatePath = path.join(__dirname, "post.json");
    if (!fs.existsSync(templatePath)) {
      throw new Error("Base post.json file not found.");
    }

    const post = JSON.parse(fs.readFileSync(templatePath, "utf-8"));

    await ask("Upload gpx file to post directory. Press Enter when done.");
    const gpxFilePath = path.join(dirPath, "track.gpx");

    if (!fs.existsSync(gpxFilePath)) {
      console.error(`❌ Error: track.gpx not found at ${gpxFilePath}`);
      await ask("Press Enter to return to the main menu...");
      return;
    }

    const parser = new Parser();
    const gpxFile = await readFile(gpxFilePath);
    const result = await parser.parseStringPromise(gpxFile);
    
    const isoDate = new Date().toISOString();
    const tripTime = result?.gpx?.trk?.[0]?.trkseg?.[0]?.trkpt?.[0]?.time?.[0];
    
    if (!tripTime) {
        console.warn("⚠️ Could not find trip time in GPX, using current date.");
    }
    
    const { season, period, month, year } = parseIsoToDateObject(tripTime || isoDate);

    await zipFile(gpxFilePath, path.join(dirPath, "track.zip"));
    post.postDate = isoDate;
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
    await ask("\nPress Enter to return to the main menu...");
  } catch (err: any) {
    console.error(`❌ Error: ${err.message}`);
    await ask("Press Enter to return to the main menu...");
  } finally {
    rl.close();
  }
})();

function parseIsoToDateObject(isoString: string) {
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

function zipFile(sourceFilePath: string, outputZipPath: string) {
  return new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(`Zipped ${archive.pointer()} total bytes`);
      resolve();
    });

    archive.on("error", (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.file(sourceFilePath, { name: path.basename(sourceFilePath) });
    archive.finalize();
  });
}

async function promptSelectMultiple(title: string, options: any[]) {
  console.log(`\n📋 Select ${title} (comma-separated numbers):`);
  options.forEach((item, i) => {
    console.log(`${i + 1}. ${item.name}`);
  });

  const input = await ask(`Enter your choices for ${title}: `);
  const indices = input.split(",").map((i) => parseInt(i.trim(), 10) - 1);
  const selected = indices.map((i) => options[i]?.code).filter(Boolean);
  return selected;
}
