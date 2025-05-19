import sharp from "sharp";
import path from "path";
import { readdir } from "fs/promises";
import { readFile, writeFile } from "fs/promises";

const args = process.argv.slice(2);
const id = args[0];

if (!id) {
  console.error("Error: No POI ID provided.");
  process.exit(1);
}

const imageFilenamesForPostJson: Record<string, unknown>[] = [];

(async () => {
  const folderPath = path.resolve(`../../public/${id}`);
  const files = await readdir(folderPath);
  const imageFiles = files.filter((file) => file.includes(".jpg") || file.includes(".jpeg"));

  const processingPromises = imageFiles.map((file) => processImages(id, file));
  await Promise.all(processingPromises);

  // Read and update post.json
  updatePostJson(id, imageFilenamesForPostJson);
  async function updatePostJson(id: string, newImagesArray: any[]) {
    const jsonPath = path.resolve(`../../public/${id}/post.json`);

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
  const imagePath = path.resolve(`../../public/${id}/${filename}`);

  const highResSetting = { quality: 60, output: "-HD.webp" };
  const regularSetting = { quality: 60, output: ".webp" };
  const regularLandscapeDimensions = { width: 1066, height: 800 };
  const regularPortraitDimension = { width: 800, height: 1066 };

  const variants = {
    portrait: [highResSetting, { ...regularPortraitDimension, ...regularSetting }],
    landscape: [highResSetting, { ...regularLandscapeDimensions, ...regularSetting }],
  };

  const isMain = imagePath.includes("main.jpg") || imagePath.includes("main.jpeg");

  if (isMain) {
    const quality = 45;
    const outputs = [
      {
        path: path.resolve(`../../public/${id}/main.webp`),
        width: 1920,
        height: 1080,
      },
      {
        path: path.resolve(`../../public/${id}/main-mobile.webp`),
        width: 720,
        height: 1280,
      },
      {
        path: path.resolve(`../../public/${id}/thumb_main.webp`),
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
          .catch(console.error)
      )
    );
  } else {
    try {
      const metadata = await sharp(imagePath).metadata();
      const { width = 0, height = 0 } = metadata;

      const isPortrait = height > width;
      const variant = isPortrait ? "portrait" : "landscape";
      const finalVariants = variants[variant];
      const fileName = path.basename(filename).split(".")[0];

      imageFilenamesForPostJson.push({
        desc: "",
        filename: fileName.split(".").at(0),
        isVertical: isPortrait,
      });

      await Promise.all(
        finalVariants.map(({ width: w, height: h, quality, output }) =>
          sharp(imagePath)
            .resize({ width: w ?? width, height: h ?? height })
            .webp({ quality })
            .toFile(path.resolve(`../../public/${id}/${fileName}${output}`))
            .then(() => console.log(`Created ${fileName}${output}`))
            .catch(console.error)
        )
      );
    } catch (err) {
      console.error(`Failed to process ${filename}:`, err);
    }
  }
}
