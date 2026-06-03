import { readdir, unlink } from "fs/promises";
import path from "path";
import { getOrSelectId, POSTS_ROOT } from "../utils";

(async () => {
  const args = process.argv.slice(2);
  const id = await getOrSelectId(args[0]);

  const dirPath = path.join(POSTS_ROOT, id);
  const keepFiles = new Set(["main.webp", "mobile-main.webp", "track.zip", "poi.json", "thumb_main.webp", "topo.webp"]);

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
