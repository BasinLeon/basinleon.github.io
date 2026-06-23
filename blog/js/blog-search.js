/**
 * Blog Search & Filter System
 * - Client-side full-text search
 * - Category filtering
 * - Tag filtering
 */

(function () {
    'use strict';

    let allPosts = [];
    let activeCategory = 'all';
    let searchQuery = '';

    // ═══════════════════════════════════════════════════════════════
    // INIT
    // ═══════════════════════════════════════════════════════════════
    async function init() {
        await loadPosts();
        createSearchUI();
        createCategoryFilters();
        bindEvents();
    }

    // ═══════════════════════════════════════════════════════════════
    // LOAD POSTS DATA
    // ═══════════════════════════════════════════════════════════════
    async function loadPosts() {
        try {
            // Try multiple paths with cache-busting
            const paths = [
                '/data/posts.json',
                '../data/posts.json',
                '../../data/posts.json'
            ];
            
            for (const path of paths) {
                try {
                    const url = `${path}?v=${Date.now()}`;
                    const response = await fetch(url, { 
                        cache: 'no-store',
                        headers: { 'Cache-Control': 'no-cache' }
                    });
                    if (response.ok) {
                        allPosts = await response.json();
                        console.log(`✅ Loaded ${allPosts.length} posts from ${path}`);
                        return;
                    }
                } catch (e) {
                    continue;
                }
            }
            throw new Error('All fetch paths failed');
        } catch (e) {
            console.error('Failed to load posts:', e);
            allPosts = [];
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // SEARCH UI
    // ═══════════════════════════════════════════════════════════════
    function createSearchUI() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        const searchSection = document.createElement('div');
        searchSection.className = 'search-section';
        searchSection.innerHTML = `
            <div class="search-box">
                <input type="text" 
                       id="blog-search" 
                       placeholder="Search posts..." 
                       autocomplete="off">
                <span class="search-icon">🔍</span>
            </div>
            <div class="search-results" id="search-results"></div>
        `;

        // Insert at top of sidebar
        sidebar.prepend(searchSection);
    }

    // ═══════════════════════════════════════════════════════════════
    // CATEGORY FILTERS
    // ═══════════════════════════════════════════════════════════════
    function createCategoryFilters() {
        const filterContainer = document.querySelector('.category-filters');
        if (!filterContainer) return;

        const categories = ['All', 'GTM', 'AI', 'Leadership', 'Creative', 'Security'];

        filterContainer.innerHTML = categories.map(cat => `
            <button class="cat-filter ${cat.toLowerCase() === 'all' ? 'active' : ''}" 
                    data-category="${cat.toLowerCase()}">
                ${cat}
            </button>
        `).join('');
    }

    // ═══════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════
    function bindEvents() {
        // Search input
        const searchInput = document.getElementById('blog-search');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 200));
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    searchInput.value = '';
                    clearSearchResults();
                }
            });
        }

        // Category filters
        document.querySelectorAll('.cat-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.cat-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeCategory = btn.dataset.category;
                filterPosts();
            });
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-section')) {
                clearSearchResults();
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // SEARCH LOGIC
    // ═══════════════════════════════════════════════════════════════
    function handleSearch(e) {
        searchQuery = e.target.value.toLowerCase().trim();

        if (searchQuery.length < 2) {
            clearSearchResults();
            return;
        }

        const results = allPosts.filter(post => {
            const title = (post.title || '').toLowerCase();
            const excerpt = (post.excerpt || '').toLowerCase();
            const tags = (post.tags || []).join(' ').toLowerCase();
            const category = (post.category || '').toLowerCase();

            return title.includes(searchQuery) ||
                excerpt.includes(searchQuery) ||
                tags.includes(searchQuery) ||
                category.includes(searchQuery);
        }).slice(0, 8); // Limit to 8 results

        displaySearchResults(results);
    }

    function displaySearchResults(results) {
        const container = document.getElementById('search-results');
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = `<div class="no-results">No posts found</div>`;
            container.classList.add('visible');
            return;
        }

        container.innerHTML = results.map(post => `
            <a href="${post.url}" class="search-result-item">
                <div class="result-title">${highlightMatch(post.title, searchQuery)}</div>
                <div class="result-meta">${post.category || 'Blog'}</div>
            </a>
        `).join('');

        container.classList.add('visible');
    }

    function highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    function clearSearchResults() {
        const container = document.getElementById('search-results');
        if (container) {
            container.innerHTML = '';
            container.classList.remove('visible');
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // FILTER POSTS BY CATEGORY
    // ═══════════════════════════════════════════════════════════════
    function filterPosts() {
        const postCards = document.querySelectorAll('.post-card, .mini-post');

        postCards.forEach(card => {
            const category = (card.dataset.category || '').toLowerCase();

            if (activeCategory === 'all' || category === activeCategory) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════════════════════════
    function debounce(fn, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // ═══════════════════════════════════════════════════════════════
    // KEYBOARD SHORTCUTS
    // ═══════════════════════════════════════════════════════════════
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('blog-search');
            if (searchInput) searchInput.focus();
        }
    });

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', init);

})();
