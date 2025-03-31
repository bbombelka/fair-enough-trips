#!/bin/bash

read -p "Enter POI ID: " poi_id
dir="../public/$poi_id"

# Check if directory exists, otherwise use ./created-poi
if [[ ! -d "$dir" ]]; then
    dir="./created-poi"
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
