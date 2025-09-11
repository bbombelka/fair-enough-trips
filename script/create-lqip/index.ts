import lqip from "lqip-modern";
import path from "path";
import { readFile, writeFile } from "fs/promises";

const args = process.argv.slice(2); // Get arguments passed to script
const id = args[0]; // First argument is the POI ID

if (!id) {
  console.error("Error: No ID provided.");
  process.exit(1);
}

(async function createLqip() {
  const { metadata } = await lqip(path.resolve(__dirname, `../../public/${id}/main.webp`), { resize: 64 });
  const base64Image = metadata.dataURIBase64;
  console.log(base64Image);
  await updatePostJson(id, base64Image);
})();

async function updatePostJson(id: string, base64Image: string) {
  const jsonPath = path.resolve(__dirname, `../../public/${id}/post.json`);

  try {
    const jsonText = await readFile(jsonPath, "utf-8");
    const data = JSON.parse(jsonText);
    await writeFile(jsonPath, JSON.stringify({ ...data, base64Image }, null, 2), "utf-8");

    console.log(`✅ Updated post.json with ${base64Image} images`);
  } catch (err) {
    console.error("❌ Error reading or writing post.json:", err);
  }
}
