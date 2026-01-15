/**
 * BLOG ANALYTICS & RELATED POSTS
 * Read tracking, view counts, and related post recommendations
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // READ ANALYTICS - localStorage-based tracking
    // ═══════════════════════════════════════════════════════════════

    const STORAGE_KEY = 'nexus_blog_analytics';

    // Get analytics data
    function getAnalytics() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch {
            return {};
        }
    }

    // Save analytics data
    function saveAnalytics(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch {
            console.warn('Could not save blog analytics');
        }
    }

    // Track page view
    function trackView() {
        const path = window.location.pathname;
        const data = getAnalytics();

        if (!data[path]) {
            data[path] = { views: 0, firstVisit: Date.now(), lastVisit: null };
        }

        data[path].views++;
        data[path].lastVisit = Date.now();

        saveAnalytics(data);
        console.log(`📊 View tracked: ${path} (${data[path].views} total)`);

        return data[path].views;
    }

    // Get view count for a path
    function getViewCount(path) {
        const data = getAnalytics();
        return (data[path] && data[path].views) || 0;
    }

    // Get popular posts (sorted by views)
    function getPopularPosts(limit = 5) {
        const data = getAnalytics();
        return Object.entries(data)
            .filter(([path]) => path.includes('/posts/'))
            .map(([path, stats]) => ({ path, ...stats }))
            .sort((a, b) => b.views - a.views)
            .slice(0, limit);
    }

    // ═══════════════════════════════════════════════════════════════
    // RELATED POSTS - Tag-based matching
    // ═══════════════════════════════════════════════════════════════

    let allPosts = [];

    // Load posts data
    async function loadPostsData() {
        if (allPosts.length) return allPosts;

        try {
            // Try relative path first (works from post pages)
            let response = await fetch('../../data/posts.json');
            if (!response.ok) {
                response = await fetch('../data/posts.json');
            }
            if (!response.ok) {
                response = await fetch('/data/posts.json');
            }
            if (response.ok) {
                allPosts = await response.json();
                return allPosts.filter(p => p.url && p.url !== '#');
            }
        } catch (e) {
            console.warn('Could not load posts for related posts');
        }
        return [];
    }

    // Find related posts based on current post's tags
    function findRelatedPosts(currentTags, currentUrl, limit = 3) {
        if (!allPosts.length || !currentTags || !currentTags.length) return [];

        const currentTagsLower = currentTags.map(t => t.toLowerCase());

        const scored = allPosts
            .filter(p => p.url !== currentUrl && p.url && p.url !== '#')
            .map(post => {
                const postTags = (post.tags || []).map(t => t.toLowerCase());
                let score = 0;

                for (const tag of currentTagsLower) {
                    if (postTags.includes(tag)) score += 2;
                    if (postTags.some(t => t.includes(tag) || tag.includes(t))) score += 1;
                }

                return { post, score };
            });

        return scored
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(s => s.post);
    }

    // ═══════════════════════════════════════════════════════════════
    // UI COMPONENTS
    // ═══════════════════════════════════════════════════════════════

    // Inject related posts section
    async function injectRelatedPosts(containerSelector, currentTags, currentUrl) {
        await loadPostsData();

        const related = findRelatedPosts(currentTags, currentUrl);
        if (!related.length) return;

        const container = document.querySelector(containerSelector);
        if (!container) return;

        const html = `
            <section class="related-posts" style="
                margin-top: 48px;
                padding-top: 32px;
                border-top: 1px dotted rgba(212, 175, 55, 0.3);
            ">
                <h3 style="
                    font-family: 'Orbitron', sans-serif;
                    font-size: 0.75rem;
                    color: #D4AF37;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    margin-bottom: 16px;
                ">🔗 You Might Also Like</h3>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${related.map(post => `
                        <a href="${post.url}" style="
                            display: block;
                            padding: 12px 16px;
                            background: rgba(212, 175, 55, 0.05);
                            border: 1px solid rgba(212, 175, 55, 0.2);
                            border-radius: 6px;
                            text-decoration: none;
                            transition: all 0.2s;
                        " onmouseover="this.style.borderColor='#D4AF37'" onmouseout="this.style.borderColor='rgba(212,175,55,0.2)'">
                            <div style="
                                font-family: 'Crimson Pro', Georgia, serif;
                                font-size: 1rem;
                                color: #f0e6d3;
                                margin-bottom: 4px;
                            ">${post.title}</div>
                            <div style="
                                font-family: 'JetBrains Mono', monospace;
                                font-size: 0.65rem;
                                color: #8b8573;
                            ">${(post.tags || []).slice(0, 2).join(' • ')}</div>
                        </a>
                    `).join('')}
                </div>
            </section>
        `;

        container.insertAdjacentHTML('beforeend', html);
        console.log(`🔗 Injected ${related.length} related posts`);
    }

    // Display view count badge
    function showViewBadge(views) {
        if (views < 2) return; // Don't show for first view

        const badge = document.createElement('div');
        badge.innerHTML = `👁 ${views} views`;
        badge.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 24px;
            padding: 6px 12px;
            background: rgba(8, 8, 12, 0.95);
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 16px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.65rem;
            color: #D4AF37;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(badge);

        setTimeout(() => badge.style.opacity = '1', 100);
        setTimeout(() => {
            badge.style.opacity = '0';
            setTimeout(() => badge.remove(), 300);
        }, 3000);
    }

    // ═══════════════════════════════════════════════════════════════
    // AUTO-INIT
    // ═══════════════════════════════════════════════════════════════

    function init() {
        // Track this page view
        const views = trackView();

        // Show view badge on post pages
        if (window.location.pathname.includes('/posts/')) {
            showViewBadge(views);
        }
    }

    // Export for external use
    window.BlogAnalytics = {
        trackView,
        getViewCount,
        getPopularPosts,
        loadPostsData,
        findRelatedPosts,
        injectRelatedPosts,
        showViewBadge
    };

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
