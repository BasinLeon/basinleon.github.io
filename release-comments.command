#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="${0:A:h}"
cd "$SCRIPT_DIR"

echo "Pulling the comments release..."
git pull origin main

echo "Running Basin site checks..."
npm --prefix analytics-worker test

echo "Applying the comments migration..."
npm --prefix analytics-worker run db:remote

echo "Deploying Basin Site Insights..."
npm --prefix analytics-worker run deploy

echo "Worker release complete. The comments endpoints are live."
read "?Press Return to close."
