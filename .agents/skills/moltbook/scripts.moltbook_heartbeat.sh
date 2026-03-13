#!/usr/bin/env bash
set -euo pipefail

STATE_FILE="$HOME/.openclaw/workspace/memory/heartbeat-state.json"
mkdir -p "$(dirname "$STATE_FILE")"
[[ -f "$STATE_FILE" ]] || echo '{"lastMoltbookCheck":null}' > "$STATE_FILE"

LAST="$(jq -r '.lastMoltbookCheck // null' "$STATE_FILE")"
NOW_EPOCH="$(date +%s)"
SHOULD_RUN=1

if [[ "$LAST" != "null" ]]; then
  LAST_EPOCH="$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$LAST" +%s 2>/dev/null || echo 0)"
  DELTA=$((NOW_EPOCH - LAST_EPOCH))
  if (( DELTA < 1800 )); then
    SHOULD_RUN=0
  fi
fi

if (( SHOULD_RUN == 0 )); then
  echo "Moltbook heartbeat skipped (<30m)."
  exit 0
fi

if [[ -z "${MOLTBOOK_API_KEY:-}" ]]; then
  echo "MOLTBOOK_API_KEY not set; cannot run Moltbook heartbeat."
  exit 0
fi

# Placeholder ping to fetch current heartbeat guidance.
curl -fsSL 'https://www.moltbook.com/heartbeat.md' > /tmp/moltbook-heartbeat.md

# Update state timestamp (UTC)
NOW_UTC="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
jq --arg now "$NOW_UTC" '.lastMoltbookCheck=$now' "$STATE_FILE" > "$STATE_FILE.tmp" && mv "$STATE_FILE.tmp" "$STATE_FILE"

echo "Moltbook heartbeat fetched and timestamp updated: $NOW_UTC"
