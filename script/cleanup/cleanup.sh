#!/bin/bash

# Get absolute path of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run TypeScript with full path
npx tsx "$SCRIPT_DIR/index.ts" "$@"
