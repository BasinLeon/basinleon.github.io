const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('data/posts.json', 'utf8'));

// Find posts with url: '#' that have dates
const stubs = posts.filter(p => p.url === '#' && p.date);
console.log('Found', stubs.length, 'posts needing HTML files');

// Generate slug from title
function slugify(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 50);
}

// Format date
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Create each HTML file
stubs.forEach(post => {
    const slug = slugify(post.title);
    const filename = 'blog/posts/' + slug + '.html';
    const tags = post.tags && post.tags.length > 0 ? post.tags.join(' • ') : 'Archive';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} | Leon Basin</title>
    <meta name="description" content="${post.excerpt.replace(/"/g, '&quot;')}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --gold-primary: #D4AF37; --gold-border: rgba(212, 175, 55, 0.3); --bg-deep: #050508; --text-primary: #f0e6d3; --text-secondary: #8b8573; --text-muted: #5a584f; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'JetBrains Mono', monospace; background: radial-gradient(ellipse at top, rgba(212, 175, 55, 0.03) 0%, transparent 50%), linear-gradient(180deg, #050508 0%, #0a0a0f 50%, #050508 100%); color: var(--text-primary); line-height: 2; min-height: 100vh; }
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: rgba(5, 5, 8, 0.95); backdrop-filter: blur(10px); border-bottom: 1px solid var(--gold-border); padding: 16px 24px; }
        .nav-container { max-width: 700px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .nav-logo { font-family: 'Orbitron', sans-serif; font-size: 1rem; font-weight: 700; color: var(--gold-primary); text-decoration: none; letter-spacing: 2px; }
        .nav-links a { font-family: 'Orbitron', sans-serif; font-size: 0.75rem; color: var(--text-secondary); text-decoration: none; letter-spacing: 1px; text-transform: uppercase; margin-left: 24px; }
        .nav-links a:hover { color: var(--gold-primary); }
        main { max-width: 700px; margin: 0 auto; padding: 120px 24px 80px; }
        .post-meta { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; }
        h1 { font-family: 'Orbitron', sans-serif; font-size: 1.8rem; color: var(--gold-primary); margin-bottom: 32px; line-height: 1.3; }
        .post-content { font-size: 1rem; color: var(--text-primary); }
        .post-content p { margin-bottom: 24px; }
        .archive-notice { background: rgba(212, 175, 55, 0.1); border: 1px solid var(--gold-border); border-radius: 8px; padding: 24px; margin-bottom: 32px; }
        .archive-notice h3 { color: var(--gold-primary); font-family: 'Orbitron', sans-serif; font-size: 0.9rem; margin-bottom: 12px; }
        .archive-notice p { color: var(--text-secondary); font-size: 0.9rem; margin: 0; }
        .back-link { display: inline-block; margin-top: 48px; color: var(--gold-primary); text-decoration: none; font-size: 0.85rem; letter-spacing: 1px; }
        .back-link:hover { text-decoration: underline; }
        footer { border-top: 1px solid var(--gold-border); padding: 40px 24px; text-align: center; background: var(--bg-deep); }
        .footer-copyright { font-size: 0.75rem; color: var(--text-muted); }
    </style>
</head>
<body>
    <nav class="nav">
        <div class="nav-container">
            <a href="https://basinleon.github.io" class="nav-logo">LEON BASIN</a>
            <div class="nav-links">
                <a href="https://basinleon.github.io">Home</a>
                <a href="../index.html">Blog</a>
            </div>
        </div>
    </nav>
    <main>
        <div class="post-meta">${formatDate(post.date)} • ${tags}</div>
        <h1>${post.title}</h1>
        <div class="archive-notice">
            <h3>📜 Archived Content</h3>
            <p>This post was originally published on <a href="https://basinleon.github.io" style="color: var(--gold-primary);">basinleon.github.io</a>. Full content migration in progress.</p>
        </div>
        <div class="post-content">
            <p>${post.excerpt}</p>
            <p>This piece explores themes central to my work: the intersection of technology, strategy, and human meaning.</p>
        </div>
        <a href="../index.html" class="back-link">← Back to Archive</a>
    </main>
    <footer>
        <div class="footer-copyright">© 2025 Leon Basin. Signal. Architecture. Revenue.</div>
    </footer>
    <script src="../js/blog-analytics.js"></script>
    <script src="../../widgets/leon-logic-bot.js"></script>
</body>
</html>`;

    if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename, html);
        console.log('Created:', slug + '.html');
    } else {
        console.log('Exists:', slug + '.html');
    }

    // Update the post's URL in the array
    post.url = 'posts/' + slug + '.html';
});

// Save updated posts.json
fs.writeFileSync('data/posts.json', JSON.stringify(posts, null, 4));
console.log('\n✓ Updated posts.json with new URLs');
