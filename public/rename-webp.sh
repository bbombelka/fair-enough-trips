#!/bin/bash

# --- Configuration ---
# The target directory is the one where this script is executed.
TARGET_DIR="."
OLD_FILENAME="main-mobile.webp"
NEW_FILENAME="mobile-main.webp"
# --- End Configuration ---

# Enable strict mode: exit on error, treat unset variables as error, pipefail
set -euo pipefail

echo "Starting rename script..."
echo "Working in directory: $(pwd)" # Shows the actual current path
echo "Renaming '$OLD_FILENAME' to '$NEW_FILENAME' in this directory and its subdirectories."
echo "-------------------------------------"

# The check for TARGET_DIR existence is good practice, even if it's '.'
if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: The directory '$TARGET_DIR' does not exist."
    exit 1
fi

# Find all files named OLD_FILENAME within TARGET_DIR and its subdirectories
find "$TARGET_DIR" -type f -name "$OLD_FILENAME" | while IFS= read -r file_path; do
    # Get the directory part of the file path
    dir_path=$(dirname "$file_path")

    # Construct the new full file path
    new_file_path="$dir_path/$NEW_FILENAME"

    # --- DRY RUN MODE (uncomment the 'mv' line below to perform the actual rename) ---
    echo "  Would rename: '$file_path' -> '$new_file_path'"
    mv "$file_path" "$new_file_path" # Uncomment this line to enable actual renaming
done

echo "-------------------------------------"
echo "Script finished."
echo "If you saw 'Would rename:' messages, those are the files that would have been processed."
echo "To perform the actual rename, uncomment the 'mv' line in the script."
echo "-------------------------------------"