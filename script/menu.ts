import readlineSync from "readline-sync";
import { spawnSync } from "child_process";
import path from "path";

const tasks = [
  { name: "Build Post", script: "build-post.ts", type: "ts" },
  { name: "Process Images", script: "script/process-images/index.ts", type: "ts" },
  { name: "Upload Images", script: "script/upload-images/index.ts", type: "ts" },
  { name: "Create LQIP", script: "script/create-lqip/index.ts", type: "ts" },
  { name: "Set POI Index", script: "script/set-poi-index/index.ts", type: "ts" },
  { name: "Prepare Route Scheme", script: "script/prepare-route-scheme/index.ts", type: "ts" },
  { name: "Upload Post to DB", script: "script/upload-post/index.ts", type: "ts" },
  { name: "Publish Post", script: "script/publish/index.ts", type: "ts" },
  { name: "Cleanup Directory", script: "script/cleanup/index.ts", type: "ts" },
  { name: "Create POI (Interactive)", script: "script/create-poi/create-poi.sh", type: "sh" },
  { name: "Create POI from Image EXIF", script: "script/create-poi-from-image/index.ts", type: "ts" },
];

function main() {
  console.log("\n🚀 Fair Enough Trips - Master CLI\n");
  
  const options = tasks.map(t => t.name);
  const index = readlineSync.keyInSelect(options, "What would you like to do?");

  if (index === -1) {
    console.log("Goodbye!");
    process.exit(0);
  }

  const task = tasks[index];
  const scriptPath = path.resolve(__dirname, "../", task.script);

  console.log(`\nExecuting: ${task.name}...\n`);

  let command: string;
  let args: string[];

  if (task.type === "ts") {
    command = "npx";
    args = ["tsx", scriptPath];
  } else {
    command = "bash";
    args = [scriptPath];
  }

  const result = spawnSync(command, args, { stdio: "inherit", shell: true });

  if (result.error) {
    console.error(`❌ Execution failed: ${result.error.message}`);
  }

  // Loop back to menu
  main();
}

main();
