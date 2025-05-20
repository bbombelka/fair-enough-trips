const fs = require("fs");
const path = require("path");
const exifParser = require("exif-parser");

const directoryPath = __dirname;
const outputPath = "./poi.json";

// place the images in the same dir as script

// image format  name.type.extension

function extractCoordinates() {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err.message);
      return;
    }

    const imageFiles = files.filter((f) => /\.(jpe?g|tiff?)$/i.test(f));
    const coordinates: Record<string, unknown>[] = [];

    imageFiles.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      try {
        const buffer = fs.readFileSync(filePath);
        const parser = exifParser.create(buffer);
        const result = parser.parse();

        const gps = result.tags;
        if (gps.GPSLatitude && gps.GPSLongitude) {
          const lat = Number(gps.GPSLatitude.toFixed(7));
          const lon = Number(gps.GPSLongitude.toFixed(7));

          coordinates.push({
            name: file.split(".").at(0),
            type: file.split(".").at(1),
            lat,
            lon,
            index: 0,
          });
        }
      } catch (err) {
        console.warn(`Failed to process ${file}:`, err.message);
      }
    });

    fs.writeFile(outputPath, JSON.stringify(coordinates, null, 2), (err) => {
      if (err) {
        console.error("Error writing output file:", err.message);
      } else {
        console.log(`Coordinates written to ${outputPath}`);
      }
    });
  });
}

extractCoordinates();
