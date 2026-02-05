/**
 * Tools Library Analytics & Feedback System
 * Tracks tool usage and collects user feedback
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'tools_analytics';
    const FEEDBACK_STORAGE_KEY = 'tools_feedback';

    // ═══════════════════════════════════════════════════════════════
    // ANALYTICS
    // ═══════════════════════════════════════════════════════════════

    /**
     * Get analytics data
     */
    function getAnalytics() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch (e) {
            return {};
        }
    }

    /**
     * Save analytics data
     */
    function saveAnalytics(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save analytics:', e);
        }
    }

    /**
     * Track tool usage
     */
    function trackToolUsage(toolName, action = 'view') {
        const analytics = getAnalytics();
        const toolKey = toolName.toLowerCase().replace(/\s+/g, '_');
        
        if (!analytics[toolKey]) {
            analytics[toolKey] = {
                views: 0,
                uses: 0,
                lastUsed: null,
                firstUsed: new Date().toISOString()
            };
        }
        
        if (action === 'view') {
            analytics[toolKey].views++;
        } else if (action === 'use') {
            analytics[toolKey].uses++;
        }
        
        analytics[toolKey].lastUsed = new Date().toISOString();
        saveAnalytics(analytics);
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'tool_' + action, {
                tool_name: toolName,
                event_category: 'Tools'
            });
        }
    }

    /**
     * Get tool stats
     */
    function getToolStats(toolName) {
        const analytics = getAnalytics();
        const toolKey = toolName.toLowerCase().replace(/\s+/g, '_');
        return analytics[toolKey] || { views: 0, uses: 0, lastUsed: null };
    }

    /**
     * Get popular tools
     */
    function getPopularTools(limit = 5) {
        const analytics = getAnalytics();
        return Object.entries(analytics)
            .map(([key, stats]) => ({
                name: key.replace(/_/g, ' '),
                ...stats,
                total: stats.views + stats.uses
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, limit);
    }

    // ═══════════════════════════════════════════════════════════════
    // FEEDBACK SYSTEM
    // ═══════════════════════════════════════════════════════════════

    /**
     * Get feedback data
     */
    function getFeedback() {
        try {
            return JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }

    /**
     * Save feedback
     */
    function saveFeedback(feedback) {
        try {
            const allFeedback = getFeedback();
            allFeedback.push({
                ...feedback,
                timestamp: new Date().toISOString(),
                id: Date.now().toString()
            });
            localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(allFeedback));
        } catch (e) {
            console.error('Failed to save feedback:', e);
        }
    }

    /**
     * Create feedback widget
     */
    function createFeedbackWidget(toolName) {
        const widget = document.createElement('div');
        widget.className = 'tool-feedback-widget';
        widget.innerHTML = `
            <div class="feedback-trigger" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
                <button id="feedback-btn" style="padding: 12px 20px; background: var(--gold-primary, #D4AF37); color: #000; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                    💬 Feedback
                </button>
            </div>
            <div id="feedback-modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10000; align-items: center; justify-content: center;">
                <div style="background: var(--bg-card, #0a0a0f); border: 1px solid var(--gold-border, rgba(212, 175, 55, 0.3)); border-radius: 16px; padding: 32px; max-width: 500px; width: 90%;">
                    <h3 style="color: var(--gold-primary, #D4AF37); margin-bottom: 24px;">Share Your Feedback</h3>
                    <form id="feedback-form">
                        <input type="hidden" name="tool" value="${toolName}">
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: var(--text-secondary, #8b8573); margin-bottom: 8px;">Rating</label>
                            <div class="rating" style="display: flex; gap: 8px;">
                                ${[1,2,3,4,5].map(i => `<button type="button" class="rating-btn" data-rating="${i}" style="padding: 8px 12px; background: transparent; border: 1px solid var(--gold-border, rgba(212, 175, 55, 0.3)); border-radius: 6px; color: var(--text-secondary, #8b8573); cursor: pointer;">⭐</button>`).join('')}
                            </div>
                            <input type="hidden" name="rating" id="feedback-rating" required>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: var(--text-secondary, #8b8573); margin-bottom: 8px;">Comments</label>
                            <textarea name="comments" rows="4" style="width: 100%; padding: 12px; background: var(--bg-deep, #050508); border: 1px solid var(--gold-border, rgba(212, 175, 55, 0.3)); border-radius: 8px; color: var(--text-primary, #f0e6d3); resize: vertical;" placeholder="What did you think? Any suggestions?"></textarea>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <button type="submit" style="flex: 1; padding: 12px; background: var(--gold-primary, #D4AF37); color: #000; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Submit</button>
                            <button type="button" id="feedback-cancel" style="padding: 12px 20px; background: transparent; border: 1px solid var(--gold-border, rgba(212, 175, 55, 0.3)); border-radius: 8px; color: var(--text-secondary, #8b8573); cursor: pointer;">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(widget);
        
        // Bind events
        const trigger = document.getElementById('feedback-btn');
        const modal = document.getElementById('feedback-modal');
        const form = document.getElementById('feedback-form');
        const cancel = document.getElementById('feedback-cancel');
        const ratingBtns = document.querySelectorAll('.rating-btn');
        const ratingInput = document.getElementById('feedback-rating');
        
        trigger.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
        
        cancel.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        ratingBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const rating = btn.dataset.rating;
                ratingInput.value = rating;
                ratingBtns.forEach((b, i) => {
                    if (i < rating) {
                        b.style.background = 'var(--gold-primary, #D4AF37)';
                        b.style.color = '#000';
                    } else {
                        b.style.background = 'transparent';
                        b.style.color = 'var(--text-secondary, #8b8573)';
                    }
                });
            });
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const feedback = {
                tool: formData.get('tool'),
                rating: parseInt(formData.get('rating')),
                comments: formData.get('comments')
            };
            
            saveFeedback(feedback);
            
            // Show success message
            form.innerHTML = '<p style="color: var(--gold-primary, #D4AF37); text-align: center; padding: 20px;">Thank you for your feedback! 🙏</p>';
            setTimeout(() => {
                modal.style.display = 'none';
                form.reset();
            }, 2000);
        });
    }

    /**
     * Auto-track tool views
     */
    function autoTrackToolViews() {
        const toolName = document.title || window.location.pathname.split('/').pop();
        trackToolUsage(toolName, 'view');
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    function init() {
        // Auto-track current tool
        autoTrackToolViews();
        
        // Create feedback widget if on a tool page
        if (window.location.pathname.includes('/tools/')) {
            const toolName = document.title || 'Tool';
            createFeedbackWidget(toolName);
        }
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for global use
    window.ToolsAnalytics = {
        trackToolUsage,
        getToolStats,
        getPopularTools,
        saveFeedback,
        getFeedback
    };

})();
