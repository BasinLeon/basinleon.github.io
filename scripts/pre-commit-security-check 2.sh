#!/bin/bash
# Pre-commit hook: Scan for sensitive content before allowing commits
# Install: cp scripts/pre-commit-security-check.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

echo "🔒 Running security scan..."

# Define sensitive patterns to block
PATTERNS=(
    '@gmail\.com'
    '@yahoo\.com'
    '@hotmail\.com'
    '\([0-9]{3}\) [0-9]{3}-[0-9]{4}'     # Phone: (408) 933-8269
    '[0-9]{3}-[0-9]{3}-[0-9]{4}'         # Phone: 408-933-8269
    '\$[12][0-9]{2}K.*\$[23][0-9]{2}K'   # Salary range: $180K-$350K (only ranges)
    'salary target|compensation target'
    'Alberto Farronato|LiveRamp'         # Sensitive company/person names
    'lbasin23'                           # Personal username
)

# Files to scan (staged HTML and Markdown files in blog/)
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(html|md)$' | grep -E '^blog/')

if [ -z "$STAGED_FILES" ]; then
    echo "✅ No blog files staged. Proceeding."
    exit 0
fi

BLOCKED=0

for FILE in $STAGED_FILES; do
    for PATTERN in "${PATTERNS[@]}"; do
        if grep -iEq "$PATTERN" "$FILE" 2>/dev/null; then
            echo "❌ BLOCKED: '$FILE' contains sensitive pattern: $PATTERN"
            BLOCKED=1
        fi
    done
done

if [ $BLOCKED -eq 1 ]; then
    echo ""
    echo "🚫 COMMIT BLOCKED: Sensitive content detected in blog files."
    echo "   Review the flagged files and remove personal data before committing."
    echo "   To bypass (emergency only): git commit --no-verify"
    exit 1
fi

echo "✅ Security scan passed. No sensitive content detected."
exit 0
