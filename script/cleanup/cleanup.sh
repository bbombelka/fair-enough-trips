#!/bin/bash
read -p "Enter ID: " poi_id
npx tsx index.ts "$poi_id"