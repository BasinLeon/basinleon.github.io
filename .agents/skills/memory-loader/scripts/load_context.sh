#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/basin/Desktop/Basin & Associates 🌍"

FILES=(
  "$ROOT/Basin-Consulting-Vault/JOB_SEARCH_FAST_TRACK.md"
  "$ROOT/ACTIVE_PIPELINE.md"
  "$ROOT/Basin-Consulting-Vault/08_LOG_VAULT/SPRINT14_MASTER_PIPELINE_2026-02-17.md"
  "$ROOT/Basin-Consulting-Vault/08_LOG_VAULT/CA_FAST_SUBMIT_CHECKLIST_2026-02-16.md"
  "$ROOT/Basin-Consulting-Vault/08_LOG_VAULT/BasinLeon-profile-README.md"
)

print_section() {
  local label="$1"
  local file="$2"
  printf "\n=== %s ===\n" "$label"
  echo "FILE: $file"
  if [[ -f "$file" ]]; then
    sed -n '1,80p' "$file"
  else
    echo "MISSING"
  fi
}

echo "Memory snapshot generated: $(date '+%Y-%m-%d %H:%M:%S %Z')"
print_section "Lane" "${FILES[0]}"
print_section "Active Pipeline" "${FILES[1]}"
print_section "Sprint Plan" "${FILES[2]}"
print_section "Today Checklist" "${FILES[3]}"
print_section "Profile Positioning" "${FILES[4]}"
