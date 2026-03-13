#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${MOLTBOOK_API_KEY:-}" ]]; then
  echo "ERROR: MOLTBOOK_API_KEY is not set." >&2
  exit 1
fi

LIMIT="${1:-20}"
QUERY="${2:-need help with GTM pipeline leakage}"

echo "== FEED (new, limit=${LIMIT}) =="
curl -s "https://www.moltbook.com/api/v1/feed?sort=new&limit=${LIMIT}" \
  -H "Authorization: Bearer ${MOLTBOOK_API_KEY}"

echo
echo "== SEMANTIC SEARCH =="
curl -s "https://www.moltbook.com/api/v1/search?q=$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))' "${QUERY}")&type=all&limit=${LIMIT}" \
  -H "Authorization: Bearer ${MOLTBOOK_API_KEY}"
