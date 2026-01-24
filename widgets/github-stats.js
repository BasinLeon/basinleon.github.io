/**
 * GitHub Stats Fetcher
 * ═══════════════════════════════════════════════════════════════
 *
 * Fetches and displays GitHub repository statistics
 * Shows stars, forks, last commit date, and language
 *
 * Built for basinleon.github.io | January 2026
 */

(function () {
    'use strict';

    const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
    const GITHUB_API_BASE = 'https://api.github.com/repos/BasinLeon/';

    /**
     * Fetch repo stats from GitHub API
     */
    async function fetchRepoStats(repoName) {
        try {
            const url = `${GITHUB_API_BASE}${repoName}`;
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                                return null;
            }

            const data = await response.json();

            return {
                stars: data.stargazers_count,
                forks: data.forks_count,
                language: data.language,
                lastPush: data.pushed_at,
                isPrivate: data.private,
                timestamp: Date.now()
            };

        } catch (error) {
            console.error(`[GitHubStats] Failed to fetch ${repoName}:`, error);
            return null;
        }
    }

    /**
     * Get cached stats or fetch fresh
     */
    async function getStats(repoName) {
        const cacheKey = `github-stats-${repoName}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
        }

        // Fetch fresh stats
        const stats = await fetchRepoStats(repoName);
        if (stats) {
            localStorage.setItem(cacheKey, JSON.stringify({
                data: stats,
                timestamp: Date.now()
            }));
        }

        return stats;
    }

    /**
     * Format relative time
     */
    function getRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (years > 0) return `${years}y ago`;
        if (months > 0) return `${months}mo ago`;
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'just now';
    }

    /**
     * Update metrics display
     */
    function updateMetrics(element, stats) {
        if (!stats) {
            element.innerHTML = '<span class="metric">⚠️ Stats unavailable</span>';
            return;
        }

        if (stats.isPrivate) {
            element.innerHTML = '<span class="metric">🔒 Private repo</span>';
            return;
        }

        const starsHTML = `<span class="metric">⭐ ${stats.stars}</span>`;
        const forksHTML = stats.forks > 0 ? `<span class="metric">🔱 ${stats.forks}</span>` : '';
        const updatedHTML = `<span class="metric">📅 ${getRelativeTime(stats.lastPush)}</span>`;
        const langHTML = stats.language ? `<span class="metric">🔵 ${stats.language}</span>` : '';

        element.innerHTML = [starsHTML, forksHTML, updatedHTML, langHTML]
            .filter(Boolean)
            .join('');
    }

    /**
     * Load stats for all projects
     */
    async function loadAllStats() {
        const metricsElements = document.querySelectorAll('[data-repo]');

        for (const element of metricsElements) {
            const repoName = element.getAttribute('data-repo');

            // Fetch stats
            const stats = await getStats(repoName);
            updateMetrics(element, stats);
        }

            }

    /**
     * Initialize
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadAllStats);
        } else {
            loadAllStats();
        }

            }

    // Auto-initialize
    init();

    // Expose API
    window.GitHubStats = {
        refresh: loadAllStats,
        clearCache: () => {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('github-stats-')) {
                    localStorage.removeItem(key);
                }
            });
                    }
    };

})();
