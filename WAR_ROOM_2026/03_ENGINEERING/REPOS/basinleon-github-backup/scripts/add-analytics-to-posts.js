/**
 * Batch add blog analytics to all post templates
 */
const fs = require('fs');
const path = require('path');

const postsDir = 'blog/posts';
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.html'));

let updated = 0;
let skipped = 0;

files.forEach(file => {
    const filepath = path.join(postsDir, file);
    let html = fs.readFileSync(filepath, 'utf8');

    // Skip if already has blog-analytics.js
    if (html.includes('blog-analytics.js')) {
        skipped++;
        return;
    }

    // Extract tags from post-meta or tag elements
    let tags = [];
    const tagMatch = html.match(/class="tag">([^<]+)</g);
    if (tagMatch) {
        tags = tagMatch.map(t => t.replace('class="tag">', '').replace('<', ''));
    } else {
        const metaMatch = html.match(/post-meta[^>]*>([^<]+)/);
        if (metaMatch) {
            const parts = metaMatch[1].split('•');
            if (parts.length > 1) {
                tags = parts.slice(1).map(t => t.trim());
            }
        }
    }

    // Create the script injection
    const postUrl = 'posts/' + file;
    const tagsArray = tags.length ? JSON.stringify(tags.slice(0, 3)) : '["Archive"]';

    const script = `
    <script src="../js/blog-analytics.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (window.BlogAnalytics) {
                window.BlogAnalytics.injectRelatedPosts('main, article', ${tagsArray}, '${postUrl}');
            }
        });
    </script>`;

    // Insert before </body>
    html = html.replace('</body>', script + '\n</body>');

    fs.writeFileSync(filepath, html);
    updated++;
    console.log('Updated:', file);
});

console.log(`\n✓ Updated ${updated} files`);
console.log(`⏭ Skipped ${skipped} files (already have analytics)`);
