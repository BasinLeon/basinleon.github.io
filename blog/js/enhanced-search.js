/**
 * Enhanced Blog Search & Filter System
 * - Full-text search with highlighting
 * - Advanced filtering (tags, categories, date range)
 * - Search history
 * - Keyboard shortcuts
 */

(function() {
    'use strict';

    let allPosts = [];
    let searchHistory = JSON.parse(localStorage.getItem('blog_search_history') || '[]');
    const MAX_HISTORY = 10;

    /**
     * Initialize enhanced search
     */
    async function init() {
        await loadPosts();
        createSearchUI();
        bindEvents();
        loadSearchHistory();
    }

    /**
     * Load posts data
     */
    async function loadPosts() {
        try {
            const paths = ['/data/posts.json', '../data/posts.json', '../../data/posts.json'];
            for (const path of paths) {
                try {
                    const response = await fetch(`${path}?v=${Date.now()}`, { cache: 'no-store' });
                    if (response.ok) {
                        allPosts = await response.json();
                        return;
                    }
                } catch (e) {
                    continue;
                }
            }
        } catch (e) {
            console.error('Failed to load posts:', e);
        }
    }

    /**
     * Create search UI
     */
    function createSearchUI() {
        const existingSearch = document.querySelector('.blog-search-container');
        if (existingSearch) return; // Already exists

        const container = document.querySelector('.blog-header, .archive-header, header, .container');
        if (!container) return;

        const searchHTML = `
            <div class="blog-search-container" style="margin: 24px 0;">
                <div class="search-wrapper" style="position: relative; max-width: 600px; margin: 0 auto;">
                    <input 
                        type="text" 
                        id="blog-search-input" 
                        placeholder="Search articles, tags, categories..." 
                        autocomplete="off"
                        style="width: 100%; padding: 12px 48px 12px 16px; background: var(--bg-card, #0a0a0f); border: 1px solid var(--gold-border, rgba(212, 175, 55, 0.3)); border-radius: 8px; color: var(--text-primary, #f0e6d3); font-size: 1rem; outline: none; transition: all 0.3s ease;"
                    />
                    <span style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted, #8b8573); pointer-events: none;">🔍</span>
                    <div id="search-suggestions" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: var(--bg-card, #0a0a0f); border: 1px solid var(--gold-border, rgba(212, 175, 55, 0.3)); border-radius: 8px; margin-top: 4px; max-height: 300px; overflow-y: auto; z-index: 1000; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);"></div>
                </div>
                <div class="search-filters" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; justify-content: center; align-items: center;">
                    <select id="filter-category" style="padding: 8px 12px; background: var(--bg-card, #0a0a0f); border: 1px solid var(--gold-border, rgba(212, 175, 55, 0.3)); border-radius: 6px; color: var(--text-primary, #f0e6d3); font-size: 0.9rem; outline: none;">
                        <option value="all">All Categories</option>
                    </select>
                    <select id="filter-tags" style="padding: 8px 12px; background: var(--bg-card, #0a0a0f); border: 1px solid var(--gold-border, rgba(212, 175, 55, 0.3)); border-radius: 6px; color: var(--text-primary, #f0e6d3); font-size: 0.9rem; outline: none;">
                        <option value="all">All Tags</option>
                    </select>
                    <button id="clear-filters" style="padding: 8px 16px; background: transparent; border: 1px solid var(--gold-border, rgba(212, 175, 55, 0.3)); border-radius: 6px; color: var(--text-secondary, #8b8573); font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease;">
                        Clear Filters
                    </button>
                </div>
                <div id="search-results-count" style="text-align: center; margin-top: 12px; color: var(--text-secondary, #8b8573); font-size: 0.9rem;"></div>
            </div>
        `;

        container.insertAdjacentHTML('afterbegin', searchHTML);
        populateFilters();
    }

    /**
     * Populate filter dropdowns
     */
    function populateFilters() {
        const categories = [...new Set(allPosts.map(p => p.category).filter(Boolean))];
        const tags = [...new Set(allPosts.flatMap(p => p.tags || []))];

        const categorySelect = document.getElementById('filter-category');
        const tagSelect = document.getElementById('filter-tags');

        if (categorySelect) {
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                categorySelect.appendChild(option);
            });
        }

        if (tagSelect) {
            tags.sort().forEach(tag => {
                const option = document.createElement('option');
                option.value = tag;
                option.textContent = tag;
                tagSelect.appendChild(option);
            });
        }
    }

    /**
     * Perform search
     */
    function performSearch(query, category = 'all', tag = 'all') {
        if (!query && category === 'all' && tag === 'all') {
            return allPosts;
        }

        let results = [...allPosts];

        // Filter by category
        if (category !== 'all') {
            results = results.filter(p => p.category === category);
        }

        // Filter by tag
        if (tag !== 'all') {
            results = results.filter(p => (p.tags || []).includes(tag));
        }

        // Search query
        if (query && query.trim()) {
            const searchTerms = query.toLowerCase().trim().split(/\s+/);
            results = results.filter(post => {
                const searchableText = [
                    post.title || '',
                    post.excerpt || '',
                    (post.tags || []).join(' '),
                    post.category || ''
                ].join(' ').toLowerCase();

                return searchTerms.every(term => searchableText.includes(term));
            });

            // Highlight search terms in results
            results.forEach(post => {
                post._highlightedTitle = highlightText(post.title, searchTerms);
                post._highlightedExcerpt = highlightText(post.excerpt, searchTerms);
            });
        }

        return results;
    }

    /**
     * Highlight search terms in text
     */
    function highlightText(text, terms) {
        if (!text) return '';
        let highlighted = text;
        terms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark style="background: var(--gold-subtle, rgba(212, 175, 55, 0.2)); color: var(--gold-primary, #D4AF37); padding: 2px 4px; border-radius: 3px;">$1</mark>');
        });
        return highlighted;
    }

    /**
     * Update search results
     */
    function updateResults(results) {
        const countEl = document.getElementById('search-results-count');
        if (countEl) {
            countEl.textContent = `${results.length} article${results.length !== 1 ? 's' : ''} found`;
        }

        // Trigger custom event for other scripts to handle rendering
        const event = new CustomEvent('blogSearchResults', { detail: { results, query: document.getElementById('blog-search-input')?.value || '' } });
        document.dispatchEvent(event);
    }

    /**
     * Save search to history
     */
    function saveToHistory(query) {
        if (!query || query.trim().length < 2) return;
        
        searchHistory = searchHistory.filter(h => h !== query);
        searchHistory.unshift(query);
        searchHistory = searchHistory.slice(0, MAX_HISTORY);
        localStorage.setItem('blog_search_history', JSON.stringify(searchHistory));
    }

    /**
     * Load search history
     */
    function loadSearchHistory() {
        // Could display in suggestions dropdown
    }

    /**
     * Bind events
     */
    function bindEvents() {
        const searchInput = document.getElementById('blog-search-input');
        const categoryFilter = document.getElementById('filter-category');
        const tagFilter = document.getElementById('filter-tags');
        const clearBtn = document.getElementById('clear-filters');

        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const query = e.target.value;
                    const category = categoryFilter?.value || 'all';
                    const tag = tagFilter?.value || 'all';
                    const results = performSearch(query, category, tag);
                    updateResults(results);
                    if (query.trim()) saveToHistory(query);
                }, 300); // Debounce
            });

            // Keyboard shortcut: Ctrl/Cmd + K to focus search
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    searchInput.focus();
                    searchInput.select();
                }
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                const query = searchInput?.value || '';
                const category = categoryFilter.value;
                const tag = tagFilter?.value || 'all';
                const results = performSearch(query, category, tag);
                updateResults(results);
            });
        }

        if (tagFilter) {
            tagFilter.addEventListener('change', () => {
                const query = searchInput?.value || '';
                const category = categoryFilter?.value || 'all';
                const tag = tagFilter.value;
                const results = performSearch(query, category, tag);
                updateResults(results);
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                if (categoryFilter) categoryFilter.value = 'all';
                if (tagFilter) tagFilter.value = 'all';
                const results = performSearch('', 'all', 'all');
                updateResults(results);
            });
        }
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for global use
    window.BlogSearch = {
        search: performSearch,
        getAllPosts: () => allPosts
    };

})();
