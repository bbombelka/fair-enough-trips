import sharp from "sharp";
import path from "path";
import { readdir } from "fs/promises";
import { readFile, writeFile } from "fs/promises";

const __dirname = path.dirname(__filename);
const args = process.argv.slice(2);
const id = args[0];

if (!id) {
  console.error("Error: No POI ID provided.");
  process.exit(1);
}

const dirPath = path.resolve(__dirname, `../../public/${id}`);
const imageFilenamesForPostJson: Record<string, unknown>[] = [];

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function getWatermarkSvg(imageHeight: number): Buffer {
  const fontSize = Math.max(12, Math.floor(imageHeight * 0.02));
  const svgWidth = Math.floor(fontSize * 15);
  const svgHeight = Math.floor(fontSize * 1.5);
  const padding = Math.max(10, Math.floor(fontSize * 0.5));
  const xPos = svgWidth - padding;

  const svgImage = `
    <svg width="${svgWidth}" height="${svgHeight}">
      <style>
        .title { 
          fill: rgba(255, 255, 255, 0.5); /* White text with 50% opacity */
          font-size: ${fontSize}px; 
          font-weight: bold;
          font-family: Arial, sans-serif;
        }
      </style>
      <text x="${xPos}" y="${fontSize}" text-anchor="end" class="title">© fairenoughtrips.com</text>
    </svg>
  `;
  return Buffer.from(svgImage);
}

(async () => {
  const files = await readdir(dirPath);
  const imageFiles = files.filter((file) => file.includes(".jpg") || file.includes(".jpeg")).sort(naturalSort);

  const processingPromises = imageFiles.map((file) => processImages(id, file));
  await Promise.all(processingPromises);

  // Read and update post.json
  updatePostJson(id, imageFilenamesForPostJson);
  async function updatePostJson(id: string, newImagesArray: any[]) {
    const jsonPath = path.resolve(`${dirPath}/post.json`);

    try {
      // 1. Read the file
      const jsonText = await readFile(jsonPath, "utf-8");

      // 2. Parse it
      const data = JSON.parse(jsonText);
      console.log(data, imageFilenamesForPostJson);

      // 3. Modify it

      await writeFile(jsonPath, JSON.stringify({ ...data, images: imageFilenamesForPostJson }, null, 2), "utf-8");

      console.log(`✅ Updated post.json with ${newImagesArray.length} images`);
    } catch (err) {
      console.error("❌ Error reading or writing post.json:", err);
    }
  }
})();

async function processImages(id: string, filename: string): Promise<void> {
  const imagePath = path.resolve(`${dirPath}/${filename}`);

  const longerDimension = 2000;
  const shorterDimension = 1600;
  const thumbRatio = 5;

  const highResSetting = { quality: 60, output: "-HD.webp" };
  const regularSetting = { quality: 75, output: ".webp" };
  const thumbnailSetting = { quality: 75, output: "-thumb.webp" };
  const regularLandscapeDimensions = { width: longerDimension, height: shorterDimension };
  const regularPortraitDimension = { width: shorterDimension, height: longerDimension };
  const thumbnailLandscapeDimensions = { width: Math.floor(longerDimension / thumbRatio), height: Math.floor(shorterDimension / thumbRatio) };
  const thumbnailPortraitDimension = { width: Math.floor(shorterDimension / thumbRatio), height: Math.floor(longerDimension / thumbRatio) };

  const variants = {
    portrait: [highResSetting, { ...regularPortraitDimension, ...regularSetting }, { ...thumbnailPortraitDimension, ...thumbnailSetting }],
    landscape: [highResSetting, { ...regularLandscapeDimensions, ...regularSetting }, { ...thumbnailLandscapeDimensions, ...thumbnailSetting }],
  };

  const isMain = imagePath.includes("main.jpg") || imagePath.includes("main.jpeg");

  if (isMain) {
    const quality = 75;
    const outputs = [
      {
        path: path.resolve(`${dirPath}/main.webp`),
        width: 1920,
        height: 1080,
      },
      {
        path: path.resolve(`${dirPath}/mobile-main.webp`),
        width: 720,
        height: 1280,
      },
      {
        path: path.resolve(`${dirPath}/thumb_main.webp`),
        width: 584,
        height: 360,
        quality: 75,
      },
    ];

    await Promise.all(
      outputs.map(({ path: outPath, width, height, quality: q }) =>
        sharp(imagePath)
          .resize({ width, height, fit: "cover" })
          .webp({ quality: q ?? quality })
          .toFile(outPath)
          .then(() => console.log(`Created ${outPath}`))
          .catch(console.error),
      ),
    );
  } else {
    try {
      const metadata = await sharp(imagePath).metadata();
      const { width = 0, height = 0 } = metadata;

      const isPortrait = height > width;
      const variant = isPortrait ? "portrait" : "landscape";
      const finalVariants = variants[variant];
      const fileName = path.basename(filename).split(".").at(1);

      imageFilenamesForPostJson.push({
        desc: "",
        filename: fileName,
        isVertical: isPortrait,
      });

      await Promise.all(
        //@ts-ignore
        finalVariants.map(({ width: w, height: h, quality, output }) => {
          const targetWidth = w ?? width;
          const targetHeight = h ?? height;

          const sharpInstance = sharp(imagePath).resize({ width: targetWidth, height: targetHeight });

          if (!output.includes("-thumb.webp")) {
            sharpInstance.composite([{ input: getWatermarkSvg(targetHeight), gravity: "southeast" }]);
          }

          sharpInstance
            .webp({ quality })
            .toFile(path.resolve(`${dirPath}/${fileName}${output}`))
            .then(() => console.log(`Created ${fileName}${output}`))
            .catch(console.error);
        }),
      );
    } catch (err) {
      console.error(`Failed to process ${filename}:`, err);
    }
  }
}
