#!/bin/bash

# Get absolute path of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUBLIC_DIR="$SCRIPT_DIR/../../public"

# Temporarily change to public directory to list directories
pushd "$PUBLIC_DIR" > /dev/null || exit 1

# Get all directories (ignoring files) and remove the trailing slash
shopt -s nullglob
dirs=(*/)
dirs=("${dirs[@]%/}")
shopt -u nullglob

popd > /dev/null || exit 1

if [ ${#dirs[@]} -eq 0 ]; then
    echo "No directories found in $PUBLIC_DIR"
    exit 1
fi

echo "Select a POI ID:"
PS3="Enter the number of your choice: "
select poi_id in "${dirs[@]}"; do
    if [ -n "$poi_id" ]; then
        break
    else
        echo "Invalid selection. Please try again."
    fi
done

# Run TypeScript with full path
npx tsx "$SCRIPT_DIR/index.ts" "$poi_id"