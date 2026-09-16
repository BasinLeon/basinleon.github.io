/**
 * BASIN::NEXUS Archive Engine
 * Handles dynamic fetching, rendering, and filtering of blog posts.
 * "Stories as code. Archives as memory."
 */

document.addEventListener('DOMContentLoaded', () => {
    initArchive();
});

let allPosts = [];

async function initArchive() {
    const container = document.getElementById('archive-container');
    const searchInput = document.getElementById('archive-search');
    const countDisplay = document.getElementById('archive-count');

    if (!container) return;

    try {
        // Fetch Data
        // Cache-busting with timestamp to ensure freshness
        const response = await fetch('../data/posts.json?v=' + new Date().getTime());
        if (!response.ok) throw new Error('Failed to load archive data');

        allPosts = await response.json();

        // Initial Render
        renderPosts(allPosts);
        updateStats(allPosts.length);

        // Event Listeners
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                filterPosts(query);
            });
        }

    } catch (error) {
        console.error('Archive Error:', error);
        container.innerHTML = `<div style="color: var(--gold-primary); text-align: center; padding: 40px; font-family: 'Orbitron', sans-serif;">
            [SYSTEM ERROR]: UNABLE TO ACCESS ARCHIVE MEMORY.<br>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Please refresh signal connection.</span>
        </div>`;
    }
}

function filterPosts(query) {
    const filtered = allPosts.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(query);
        const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(query));
        const excerptMatch = post.excerpt && post.excerpt.toLowerCase().includes(query);
        return titleMatch || tagMatch || excerptMatch;
    });

    renderPosts(filtered);
    updateStats(filtered.length);
}

function updateStats(count) {
    const statEl = document.getElementById('archive-count-value');
    if (statEl) {
        // Animate counter
        let current = parseInt(statEl.innerText) || 0;
        const step = count > current ? 1 : -1;

        if (current === count) return;

        const timer = setInterval(() => {
            current += step;
            statEl.innerText = current;
            if (current === count) clearInterval(timer);
        }, 10);

        // Instant update fallback if animation is too slow
        setTimeout(() => { statEl.innerText = count; clearInterval(timer); }, 500);
    }
}

function renderPosts(posts) {
    const container = document.getElementById('archive-container');
    container.innerHTML = '';

    if (posts.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-muted);">
            NO SIGNALS DETECTED.
        </div>`;
        return;
    }

    // Group by Year
    const postsByYear = posts.reduce((acc, post) => {
        const year = post.date ? post.date.substring(0, 4) : 'ARCHIVE';
        if (!acc[year]) acc[year] = [];
        acc[year].push(post);
        return acc;
    }, {});

    // Sort years descending
    const years = Object.keys(postsByYear).sort((a, b) => b - a);

    years.forEach(year => {
        // Year Header
        const yearHeader = document.createElement('h2');
        yearHeader.className = 'archive-year-header';
        yearHeader.innerText = year;
        container.appendChild(yearHeader);

        // Grid
        const grid = document.createElement('div');
        grid.className = 'archive-grid';

        postsByYear[year].forEach(post => {
            const card = createPostCard(post);
            grid.appendChild(card);
        });

        container.appendChild(grid);
    });
}

function createPostCard(post) {
    const article = document.createElement('article');
    article.className = 'archive-card';

    // Parse Date
    let displayDate = 'Unknown Date';
    if (post.date) {
        const dateObj = new Date(post.date + 'T12:00:00'); // No timezone shift
        displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // Fix relative URL pathing
    // post.url is like "posts/slug.html"
    // We are in blog/index.html, so "./posts/slug.html" is correct.
    const linkUrl = './' + post.url;

    article.innerHTML = `
        <a href="${linkUrl}" class="archive-link">
            <div class="archive-card-header">
                <span class="archive-date">${displayDate}</span>
                <div class="archive-tags">
                    ${post.tags.slice(0, 2).map(tag => `<span class="archive-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <h3 class="archive-title">${post.title}</h3>
            <p class="archive-excerpt">${post.excerpt || 'Signal detected. Click to decode.'}</p>
        </a>
    `;

    return article;
}
