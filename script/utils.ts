import { readdir } from "fs/promises";
import path from "path";
import readlineSync from "readline-sync";

// Base directory for all posts
export const POSTS_ROOT = path.resolve(__dirname, "../public/content/posts");

/**
 * Lists directories in public/content/posts and allows the user to select one if an ID is not provided.
 * @param providedId The ID passed as a command-line argument.
 * @returns The selected or provided ID.
 */
export async function getOrSelectId(providedId: string | undefined): Promise<string> {
  if (providedId) {
    return providedId;
  }

  try {
    const entries = await readdir(POSTS_ROOT, { withFileTypes: true });
    const dirs = entries
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .sort();

    if (dirs.length === 0) {
      console.error(`❌ No post directories found in ${POSTS_ROOT}`);
      process.exit(1);
    }

    const index = readlineSync.keyInSelect(dirs, "Select a post ID:");
    if (index === -1) {
      console.log("Exiting...");
      process.exit(0);
    }

    return dirs[index];
  } catch (err) {
    console.error(`❌ Error reading post directories from ${POSTS_ROOT}:`, err);
    process.exit(1);
  }
}
