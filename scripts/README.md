# Validation Scripts

Automated validation tools to ensure blog links and content integrity.

## Blog Link Validator

Validates all blog post links in `data/posts.json` against actual files.

### Usage

```bash
# Run the validator
python3 scripts/validate-blog-links.py

# Or use the shell script
./scripts/validate-all-links.sh
```

### What It Checks

- ✅ All URLs in `posts.json` point to existing files
- ✅ Files exist in `blog/posts/` or `blog/` directories
- ✅ HTML files don't contain broken links
- ✅ Suggests fixes for broken links

### Output

- **Green ✓**: Success - file found
- **Red ✗**: Error - broken link found
- **Yellow ⚠**: Warning - potential issue
- **Blue ℹ**: Info - validation step

### Exit Codes

- `0`: All links valid
- `1`: Issues found (broken links detected)

## GitHub Actions

The validator runs automatically:
- On every push to `main` branch
- On pull requests
- Weekly on Mondays at 9 AM UTC
- Manually via workflow_dispatch

## Pre-commit Hook (Optional)

To run validation before every commit:

```bash
# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
python3 scripts/validate-blog-links.py
if [ $? -ne 0 ]; then
    echo "❌ Link validation failed. Fix broken links before committing."
    exit 1
fi
EOF

chmod +x .git/hooks/pre-commit
```

## Fixing Broken Links

When the validator finds broken links:

1. Check the suggested fixes in the output
2. Update `data/posts.json` with the correct file path
3. Or move/create the missing file
4. Re-run the validator to confirm

## Example Output

```
╔════════════════════════════════════════╗
║   Blog Link Validator v1.0            ║
╚════════════════════════════════════════╝

✓ Loaded 99 posts from posts.json
✓ Found 87 actual post files
ℹ Validating post URLs...
ℹ Checking HTML files for broken links...

Validation Results:

✓ All links are valid! No issues found.
```
