const fs = require('fs');
let posts = JSON.parse(fs.readFileSync('data/posts.json', 'utf8'));

function slugify(t) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 50);
}

function fmtDate(d) {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

let created = 0;
posts.forEach((post, idx) => {
    if (post.url !== '#' || !post.date) return;

    const slug = slugify(post.title);
    const filepath = 'blog/posts/' + slug + '.html';
    const tags = (post.tags && post.tags.length) ? post.tags.join(' • ') : 'Archive';
    const excerpt = (post.excerpt || '').replace(/"/g, '&quot;');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${post.title} | Leon Basin</title>
<meta name="description" content="${excerpt}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--gold:#D4AF37;--gold-border:rgba(212,175,55,0.3);--bg:#050508;--text:#f0e6d3;--muted:#5a584f}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'JetBrains Mono',monospace;background:linear-gradient(180deg,#050508 0%,#0a0a0f 100%);color:var(--text);line-height:2;min-height:100vh}
.nav{position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(5,5,8,0.95);backdrop-filter:blur(10px);border-bottom:1px solid var(--gold-border);padding:16px 24px}
.nav-container{max-width:700px;margin:0 auto;display:flex;justify-content:space-between;align-items:center}
.nav-logo{font-family:Orbitron,sans-serif;font-size:1rem;font-weight:700;color:var(--gold);text-decoration:none;letter-spacing:2px}
.nav-links a{font-family:Orbitron,sans-serif;font-size:.75rem;color:#8b8573;text-decoration:none;letter-spacing:1px;text-transform:uppercase;margin-left:24px}
.nav-links a:hover{color:var(--gold)}
main{max-width:700px;margin:0 auto;padding:120px 24px 80px}
.post-meta{font-size:.8rem;color:var(--muted);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px}
h1{font-family:Orbitron,sans-serif;font-size:1.8rem;color:var(--gold);margin-bottom:32px;line-height:1.3}
.post-content p{margin-bottom:24px}
.archive-notice{background:rgba(212,175,55,0.1);border:1px solid var(--gold-border);border-radius:8px;padding:24px;margin-bottom:32px}
.archive-notice h3{color:var(--gold);font-family:Orbitron,sans-serif;font-size:.9rem;margin-bottom:12px}
.archive-notice p{color:#8b8573;font-size:.9rem;margin:0}
.back-link{display:inline-block;margin-top:48px;color:var(--gold);text-decoration:none;font-size:.85rem}
.back-link:hover{text-decoration:underline}
footer{border-top:1px solid var(--gold-border);padding:40px 24px;text-align:center;background:var(--bg)}
.footer-copyright{font-size:.75rem;color:var(--muted)}
</style>
</head>
<body>
<nav class="nav"><div class="nav-container"><a href="https://basinleon.github.io" class="nav-logo">LEON BASIN</a><div class="nav-links"><a href="https://basinleon.github.io">Home</a><a href="../index.html">Blog</a></div></div></nav>
<main>
<div class="post-meta">${fmtDate(post.date)} • ${tags}</div>
<h1>${post.title}</h1>
<div class="archive-notice"><h3>📜 Archived Content</h3><p>Originally published on <a href="https://basinleon.github.io" style="color:var(--gold)">basinleon.github.io</a>. Full migration in progress.</p></div>
<div class="post-content"><p>${post.excerpt || 'Content from the archive.'}</p></div>
<a href="../index.html" class="back-link">← Back to Archive</a>
</main>
<footer><div class="footer-copyright">© 2025 Leon Basin</div></footer>
<script src="../../widgets/leon-logic-bot.js"></script>
</body>
</html>`;

    fs.writeFileSync(filepath, html);
    posts[idx].url = 'posts/' + slug + '.html';
    created++;
    console.log('Created:', slug + '.html');
});

fs.writeFileSync('data/posts.json', JSON.stringify(posts, null, 4));
console.log('\n✓ Created', created, 'HTML files');
console.log('✓ Updated posts.json with new URLs');
