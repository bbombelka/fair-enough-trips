import { readdir, stat } from "fs/promises";
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
    const dirEntries = entries.filter((dirent) => dirent.isDirectory());

    // Sort by modification time (newest first) and limit to 100
    const dirsWithStats = await Promise.all(
      dirEntries.map(async (dirent) => {
        const fullPath = path.join(POSTS_ROOT, dirent.name);
        const stats = await stat(fullPath);
        return { name: dirent.name, mtime: stats.mtime };
      })
    );

    const sortedDirs = dirsWithStats
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
      .map((d) => d.name)
      .slice(0, 100);

    if (sortedDirs.length === 0) {
      console.error(`❌ No post directories found in ${POSTS_ROOT}`);
      process.exit(1);
    }

    console.log("\n📋 Select a post ID (latest 100):");
    sortedDirs.forEach((dir, i) => {
      console.log(`[${i + 1}] ${dir}`);
    });

    const choice = readlineSync.questionInt(`\nEnter selection (1-${sortedDirs.length}, 0 to cancel): `, {
      min: 0,
      max: sortedDirs.length,
    });

    if (choice === 0) {
      console.log("Exiting...");
      process.exit(0);
    }

    return sortedDirs[choice - 1];
  } catch (err) {
    console.error(`❌ Error reading post directories from ${POSTS_ROOT}:`, err);
    process.exit(1);
  }
}
