import lqip from "lqip-modern";
import path from "path";
import { readFile, writeFile } from "fs/promises";
import { getOrSelectId, POSTS_ROOT } from "../utils";

(async function createLqip() {
  const args = process.argv.slice(2);
  const id = await getOrSelectId(args[0]);

  const mainImagePath = path.join(POSTS_ROOT, id, "main.webp");

  try {
    const { metadata } = await lqip(mainImagePath, { resize: 64 });
    const base64Image = metadata.dataURIBase64;
    console.log("LQIP generated successfully.");
    await updatePostJson(id, base64Image);
  } catch (err) {
    console.error(`❌ Failed to create LQIP for ${id}:`, err);
  }
})();

async function updatePostJson(id: string, base64Image: string) {
  const jsonPath = path.join(POSTS_ROOT, id, "post.json");

  try {
    const jsonText = await readFile(jsonPath, "utf-8");
    const data = JSON.parse(jsonText);
    await writeFile(jsonPath, JSON.stringify({ ...data, base64Image }, null, 2), "utf-8");

    console.log(`✅ Updated post.json for ${id} with base64Image`);
  } catch (err) {
    console.error("❌ Error reading or writing post.json:", err);
  }
}
