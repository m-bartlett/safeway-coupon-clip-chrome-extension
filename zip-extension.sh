#!/usr/bin/env bash
set -o errexit
set -o nounset

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR/src"
OUTPUT_ZIP="$SCRIPT_DIR/extension.zip"

INCLUDE_FILES=(
    icon.png
    manifest.json
    popup.html
    popup.js
)

cd "$SOURCE_DIR"
zip "$OUTPUT_ZIP" "${INCLUDE_FILES[@]}"