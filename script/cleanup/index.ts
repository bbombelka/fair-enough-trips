import { readdir, unlink } from "fs/promises";
import path from "path";

const args = process.argv.slice(2);
const id = args[0];

if (!id) {
  console.error("❌ Error: No POI ID provided.");
  process.exit(1);
}

const dirPath = path.resolve(__dirname, `../../public/content/posts/${id}`);
const keepFiles = new Set(["main.webp", "mobile-main.webp", "track.zip", "poi.json", "thumb_main.webp", "topo.webp"]);

(async () => {
  try {
    const files = await readdir(dirPath);

    const deletions = files.map(async (file) => {
      if (!keepFiles.has(file)) {
        const fullPath = path.join(dirPath, file);
        await unlink(fullPath);
        console.log(`🗑️ Deleted: ${file}`);
      }
    });

    await Promise.all(deletions);
    console.log("✅ Cleanup complete.");
  } catch (err) {
    console.error("❌ Error during cleanup:", err);
  }
})();
