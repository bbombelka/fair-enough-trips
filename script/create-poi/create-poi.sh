#!/bin/bash

# Base directory for all posts
POSTS_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../public/content/posts" && pwd)"

# Check if a POI ID was provided as an argument
if [ -z "$1" ]; then
    echo "No POI ID provided. Select from existing directories:"
    
    # List directories in public/content/posts
    cd "$POSTS_ROOT"
    dirs=($(ls -d */ 2>/dev/null | xargs -n 1 basename))
    
    if [ ${#dirs[@]} -eq 0 ]; then
        echo "❌ No post directories found in $POSTS_ROOT"
        read -p "Enter new POI ID: " poi_id
    else
        # Show selection menu
        PS3="Select a post (or 'Enter new ID'): "
        select choice in "${dirs[@]}" "Enter new ID"; do
            if [ "$choice" == "Enter new ID" ]; then
                read -p "Enter new POI ID: " poi_id
                break
            elif [ -n "$choice" ]; then
                poi_id=$choice
                break
            fi
        done
    fi
else
    poi_id=$1
fi

dir="$POSTS_ROOT/$poi_id"

# Check if directory exists, otherwise use ./created-poi
if [[ ! -d "$dir" ]]; then
    echo "Directory $dir does not exist. Saving to ./created-poi/$poi_id"
    dir="./created-poi/$poi_id"
    mkdir -p "$dir"
fi

output_file="$dir/poi.json"

# Find a non-colliding filename if poi.json exists
if [[ -f "$output_file" ]]; then
    i=1
    while [[ -f "$dir/poi_$i.json" ]]; do
        ((i++))
    done
    output_file="$dir/poi_$i.json"
fi

pois=()

while true; do
    read -p "Enter name: " name
    read -p "Enter type: " type
    read -p "Enter coordinates (lat, lon in format 46.3769747N, 13.8429506E): " coords

    # Remove N/S/E/W from coordinates and split them
    lat=$(echo "$coords" | sed -E 's/([0-9\.]+)[NS], ([0-9\.]+)[EW]/\1/')
    lon=$(echo "$coords" | sed -E 's/([0-9\.]+)[NS], ([0-9\.]+)[EW]/\2/')

    # Append JSON object as a string
    pois+=("{\"name\": \"$name\", \"type\": \"$type\", \"lat\": $lat, \"lon\": $lon, \"index\": 0}")

    read -p "Add another POI? (yes/no): " add_more
    if [[ "$add_more" != "yes" ]]; then
        break
    fi
done

# Join JSON objects correctly into an array
json_output=$(printf ",%s" "${pois[@]}")
json_output="[${json_output:1}]"  # Remove leading comma and wrap in []

# Save to file
echo "$json_output" | jq '.' > "$output_file"

echo "Saved to $output_file"
