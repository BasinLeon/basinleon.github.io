#!/bin/bash
# Image Optimization Script - Convert PNG/JPG to WebP
# Requires: cwebp (install via: brew install webp)

echo "🖼️  Starting image optimization..."

# Directory to process
IMAGES_DIR="../assets"
OUTPUT_DIR="../assets/webp"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Counter
converted=0
skipped=0

# Convert PNG files
for file in "$IMAGES_DIR"/*.png; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" .png)
        output="$OUTPUT_DIR/${filename}.webp"
        
        if [ ! -f "$output" ]; then
            echo "Converting: $filename.png → $filename.webp"
            cwebp -q 85 "$file" -o "$output"
            converted=$((converted + 1))
        else
            echo "Skipping: $filename.webp (already exists)"
            skipped=$((skipped + 1))
        fi
    fi
done

# Convert JPG files
for file in "$IMAGES_DIR"/*.jpg "$IMAGES_DIR"/*.jpeg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" .jpg)
        filename=$(basename "$filename" .jpeg)
        output="$OUTPUT_DIR/${filename}.webp"
        
        if [ ! -f "$output" ]; then
            echo "Converting: $filename.jpg → $filename.webp"
            cwebp -q 85 "$file" -o "$output"
            converted=$((converted + 1))
        else
            echo "Skipping: $filename.webp (already exists)"
            skipped=$((skipped + 1))
        fi
    fi
done

# Process subdirectories
for dir in "$IMAGES_DIR"/*/; do
    if [ -d "$dir" ]; then
        dirname=$(basename "$dir")
        mkdir -p "$OUTPUT_DIR/$dirname"
        
        for file in "$dir"*.png "$dir"*.jpg "$dir"*.jpeg; do
            if [ -f "$file" ]; then
                filename=$(basename "$file")
                ext="${filename##*.}"
                name="${filename%.*}"
                output="$OUTPUT_DIR/$dirname/${name}.webp"
                
                if [ ! -f "$output" ]; then
                    echo "Converting: $dirname/$filename → $dirname/$name.webp"
                    cwebp -q 85 "$file" -o "$output"
                    converted=$((converted + 1))
                fi
            fi
        done
    fi
done

echo ""
echo "✅ Optimization complete!"
echo "   Converted: $converted files"
echo "   Skipped: $skipped files"
echo ""
echo "📝 Next steps:"
echo "   1. Update HTML to use .webp files with fallbacks"
echo "   2. Test images load correctly"
echo "   3. Verify file sizes are smaller"
