import sharp from "sharp";
import path from "path";
import { readdir } from "fs";

const args = process.argv.slice(2); // Get arguments passed to script
const id = args[0]; // First argument is the POI ID

if (!id) {
  console.error("Error: No POI ID provided.");
  process.exit(1);
}

readdir(path.resolve(`../../public/${id}`), (err, files) => {
  files
    .filter((file) => file.includes(".jpg") || file.includes(".jpeg"))
    .forEach((file) => {
      processImages(id, file);
    });
});

function processImages(id: string, filename: string) {
  const imagePath = path.resolve(`../../public/${id}/${filename}`);

  const highResSetting = { quality: 60, output: "-HD.webp" };
  const regularSetting = { quality: 60, output: ".webp" };
  const regularLandscapeDimensions = { width: 1066, height: 800 };
  const regularPortraitDimension = { width: 800, height: 1066 };

  const variants = {
    portrait: [highResSetting, { ...regularPortraitDimension, ...regularSetting }],
    landscape: [highResSetting, { ...regularLandscapeDimensions, ...regularSetting }],
  };

  if (imagePath.includes("main.jpg") || imagePath.includes("main.jpeg")) {
    const quality = 45;
    // main big
    sharp(imagePath)
      .resize({ width: 1920, height: 1080, fit: "cover" })
      .webp({ quality })
      .toFile(path.resolve(`../../public/${id}/main.webp`))
      .then(() => console.log(`Created main.webp`))
      .catch(console.error);

    // main mobile
    sharp(imagePath)
      .resize({ width: 720, height: 1280, fit: "cover" })
      .webp({ quality })
      .toFile(path.resolve(`../../public/${id}/main-mobile.webp`))
      .then(() => console.log(`Created main-mobile.webp`))
      .catch(console.error);

    // thumbnail
    sharp(imagePath)
      .resize({ width: 584, height: 360, fit: "cover" })
      .webp({ quality: 75 })
      .toFile(path.resolve(`../../public/${id}/thumb_main.webp`))
      .then(() => console.log(`Created thumb-main.webp`))
      .catch(console.error);
  } else {
    // processess all other photos
    sharp(imagePath)
      .metadata()
      .then((metadata) => {
        const { width = 0, height = 0 } = metadata;

        if (width > height) {
          console.log("Image is horizontal (landscape)", imagePath);
          runProcessing(width, height, "landscape");
        } else if (height > width) {
          console.log("Image is vertical (portrait)", imagePath);
          runProcessing(width, height, "portrait");
        } else {
          console.log("Image is square");
        }
      })
      .catch(console.error);
  }

  function runProcessing(originalWidth, originalHeight, variant) {
    const finalVariants = variants[variant];

    finalVariants.forEach(({ width, height, quality, output }) => {
      const fileName = imagePath.split("/").at(-1)?.split(".").at(0);
      sharp(imagePath)
        .resize({ width: width ?? originalWidth, height: height ?? originalHeight })
        .webp({ quality })
        .toFile(path.resolve(`../../public/${id}/${fileName}${output}`))
        .then(() => console.log(`Created ${fileName}${output}`))
        .catch(console.error);
    });
  }
}
