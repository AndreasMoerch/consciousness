#!/bin/bash

# Commit and push threads.json changes

# Navigate to the repository root
cd "$(dirname "$0")"

# Check if there are changes to threads.json
if git diff --quiet data/threads.json && git diff --cached --quiet data/threads.json; then
    echo "No changes to commit in data/threads.json"
    exit 0
fi

# Stage the threads.json file
git add data/threads.json

# Create commit message with timestamp
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
COMMIT_MSG="Update threads: $TIMESTAMP"

# Commit the changes
git commit -m "$COMMIT_MSG"

# Push to remote
git push origin main

echo "Successfully committed and pushed threads.json"
