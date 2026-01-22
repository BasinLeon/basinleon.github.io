#!/bin/bash
# Comprehensive Link Validator
# Validates blog links, checks for broken references, and reports issues

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🔍 Running comprehensive link validation..."
echo ""

# Run Python validator
python3 "$SCRIPT_DIR/validate-blog-links.py"

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "✅ All links validated successfully!"
    exit 0
else
    echo ""
    echo "❌ Validation found issues. Please review and fix."
    exit 1
fi
