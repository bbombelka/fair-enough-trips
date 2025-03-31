#!/bin/bash

read -p "Enter POI ID: " poi_id
npx tsx index.ts "$poi_id"
