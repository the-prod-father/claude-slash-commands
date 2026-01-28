#!/bin/bash
# Sync local JSON data to deployed Command Center
# Usage: SYNC_SECRET=xxx ./scripts/sync-to-vercel.sh

PROD_URL="${COMMAND_CENTER_URL:-https://command-center-tau-five.vercel.app}"
DATA_DIR="$HOME/clawd/command-center-data"

if [ -z "$SYNC_SECRET" ]; then
  echo "Error: SYNC_SECRET env var required"
  exit 1
fi

# Build JSON payload from local files
PAYLOAD=$(jq -n \
  --slurpfile drafts "$DATA_DIR/drafts.json" \
  --slurpfile tasks "$DATA_DIR/tasks.json" \
  --slurpfile activity "$DATA_DIR/activity.json" \
  --slurpfile inbox "$DATA_DIR/inbox-status.json" \
  '{drafts: $drafts[0], tasks: $tasks[0], activity: $activity[0], inboxStatus: $inbox[0]}')

echo "Syncing to $PROD_URL/api/sync..."
curl -s -X POST "$PROD_URL/api/sync" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SYNC_SECRET" \
  -d "$PAYLOAD" | jq .
