/**
 * Status Checker for Live Demos
 * ═══════════════════════════════════════════════════════════════
 *
 * Checks if Streamlit apps and other demos are online
 * Displays live/offline badges on project cards
 *
 * Built for basinleon.github.io | January 2026
 */

(function () {
    'use strict';

    // Cache duration: 5 minutes
    const CACHE_DURATION = 5 * 60 * 1000;
    const TIMEOUT_MS = 5000; // 5 second timeout for checks

    // Demo endpoints to check
    const DEMO_ENDPOINTS = {
        'basin-nexus': 'https://basin-nexus.streamlit.app',
        'headline-forge': 'https://linkedin-headline-generator-5f5esbxxbunyr8nxtkjzce.streamlit.app',
        'labyrinth': 'https://labyrinthofthemind-pzaxk5g8jds8xtihxepjvu.streamlit.app'
    };

    /**
     * Check if a URL is accessible
     * Uses fetch with no-cors mode to avoid CORS issues
     */
    async function checkDemoStatus(url) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

            const response = await fetch(url, {
                method: 'HEAD',
                mode: 'no-cors', // Bypass CORS restrictions
                cache: 'no-cache',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // With no-cors, we get an opaque response
            // If the fetch doesn't throw, assume it's online
            return { status: 'live', timestamp: Date.now() };

        } catch (error) {
                        return { status: 'offline', timestamp: Date.now() };
        }
    }

    /**
     * Get cached status or check fresh
     */
    async function getStatus(demoId) {
        const cacheKey = `demo-status-${demoId}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
            const { status, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return status;
            }
        }

        // Check fresh status
        const url = DEMO_ENDPOINTS[demoId];
        if (!url) return 'unknown';

        const result = await checkDemoStatus(url);
        localStorage.setItem(cacheKey, JSON.stringify(result));

        return result.status;
    }

    /**
     * Update badge UI
     */
    function updateBadge(element, status) {
        const badge = element.querySelector('.status-badge');
        if (!badge) return;

        badge.classList.remove('status-live', 'status-offline', 'status-checking');

        if (status === 'live') {
            badge.classList.add('status-live');
            badge.innerHTML = '● LIVE';
        } else if (status === 'offline') {
            badge.classList.add('status-offline');
            badge.innerHTML = '● OFFLINE';
        } else {
            badge.classList.add('status-checking');
            badge.innerHTML = '● CHECKING...';
        }
    }

    /**
     * Check all demos on the page
     */
    async function checkAllDemos() {
        // Find all elements with data-demo-id attribute
        const demoElements = document.querySelectorAll('[data-demo-id]');

        for (const element of demoElements) {
            const demoId = element.getAttribute('data-demo-id');

            // Set checking state
            updateBadge(element, 'checking');

            // Check status
            const status = await getStatus(demoId);
            updateBadge(element, status);
        }

            }

    /**
     * Initialize status checker
     */
    function init() {
        // Check on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkAllDemos);
        } else {
            checkAllDemos();
        }

        // Re-check every 5 minutes
        setInterval(checkAllDemos, CACHE_DURATION);

            }

    // Auto-initialize
    init();

    // Expose API for manual checks
    window.StatusChecker = {
        check: checkAllDemos,
        clearCache: () => {
            Object.keys(DEMO_ENDPOINTS).forEach(id => {
                localStorage.removeItem(`demo-status-${id}`);
            });
                    }
    };

})();
