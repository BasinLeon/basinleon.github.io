#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "Usage: $0 /absolute/path/to/skill-dir" >&2
  exit 1
fi

SKILL_FILE="$TARGET/SKILL.md"
if [[ ! -f "$SKILL_FILE" ]]; then
  echo "FAIL: SKILL.md missing at $SKILL_FILE" >&2
  exit 1
fi

echo "Checking: $SKILL_FILE"

# Frontmatter checks
if ! head -n 20 "$SKILL_FILE" | rg -q '^---'; then
  echo "FAIL: YAML frontmatter missing opening ---" >&2
  exit 1
fi

if ! head -n 40 "$SKILL_FILE" | rg -q '^name:'; then
  echo "FAIL: frontmatter missing 'name'" >&2
  exit 1
fi

if ! head -n 40 "$SKILL_FILE" | rg -q '^description:'; then
  echo "FAIL: frontmatter missing 'description'" >&2
  exit 1
fi

DESC="$(head -n 40 "$SKILL_FILE" | rg '^description:' | sed 's/^description:\s*//')"
if ! echo "$DESC" | rg -q 'Use when|use when'; then
  echo "WARN: description should usually start with 'Use when...'" >&2
fi

if ! head -n 40 "$SKILL_FILE" | rg -q '^---$' -m 2; then
  echo "WARN: frontmatter closing --- not found in first 40 lines" >&2
fi

NAME="$(head -n 40 "$SKILL_FILE" | rg '^name:' | sed 's/^name:\s*//' | sed 's/^"//;s/"$//' | tr -d "'" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
if ! echo "$NAME" | rg -q '^[A-Za-z0-9-]+$'; then
  echo "WARN: name should usually use letters/numbers/hyphens only" >&2
fi

if ! rg -q '^##\s+Overview' "$SKILL_FILE"; then
  echo "WARN: missing '## Overview' section" >&2
fi

if ! rg -q '^##\s+When to Use' "$SKILL_FILE"; then
  echo "WARN: missing '## When to Use' section" >&2
fi

if rg -q 'API_KEY|secret|token' "$SKILL_FILE"; then
  if ! rg -q 'env|environment variable|MOLTBOOK_API_KEY|OPENAI_API_KEY' "$SKILL_FILE"; then
    echo "WARN: references to secrets found without explicit env-var guidance" >&2
  fi
fi

if [[ -f "$TARGET/agents/openai.yaml" ]]; then
  echo "INFO: found optional agents/openai.yaml"
else
  echo "INFO: no agents/openai.yaml (optional)"
fi

echo "PASS: quick structural checks complete."
