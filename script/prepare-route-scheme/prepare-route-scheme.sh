#!/bin/bash

# Get absolute path of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Prompt for ID
read -p "Enter ID: " poi_id

# Run the first TypeScript file
npx tsx "$SCRIPT_DIR/index.ts" "$poi_id"

# Message to the user
echo "Creating route scheme points finished."
echo "Make corrections and add image, paragraph, and path information."
read -p "Once finished, type Y to upload them: " confirm

if [[ "$(echo "$confirm" | tr '[:upper:]' '[:lower:]')" == "y" ]]; then
  npx tsx "$SCRIPT_DIR/upload-route-scheme.ts" "$poi_id"
else
  echo "Upload aborted."
fi