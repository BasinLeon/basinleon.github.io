#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="${0:A:h}"
cd "$SCRIPT_DIR"

echo "Running Basin site checks..."
npm --prefix analytics-worker test

echo "Applying the private contact-intake migration..."
npm --prefix analytics-worker run db:remote

echo "Deploying Basin Site Insights..."
npm --prefix analytics-worker run deploy

echo "Publishing basinleon.github.io..."
git push origin main

echo "Release complete. Contact intake is live."
read "?Press Return to close."
