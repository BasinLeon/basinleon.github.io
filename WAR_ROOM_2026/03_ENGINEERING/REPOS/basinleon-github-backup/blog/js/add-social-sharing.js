// Auto-add social sharing to all blog posts
(function() {
    function addSocialSharing() {
        // Check if we're on a blog post page
        if (!window.location.pathname.includes('/blog/posts/')) return;
        
        // Check if social sharing already exists
        if (document.querySelector('.social-share-container')) return;
        
        // Find the article content or conclusion section
        const article = document.querySelector('article');
        if (!article) return;
        
        // Look for conclusion, back-link, or end of article
        const conclusion = article.querySelector('h2:last-of-type');
        const backLink = article.querySelector('.back-link');
        const insertPoint = backLink || conclusion || article.lastElementChild;
        
        if (!insertPoint) return;
        
        // Create social sharing HTML
        const socialHTML = `
            <!-- Social Sharing -->
            <div class="social-share-container">
                <span class="social-share-label">Share:</span>
                <a href="#" class="social-share-btn twitter">🐦 Twitter</a>
                <a href="#" class="social-share-btn linkedin">💼 LinkedIn</a>
                <a href="#" class="social-share-btn facebook">📘 Facebook</a>
                <a href="#" class="social-share-btn copy">📋 Copy Link</a>
            </div>
        `;
        
        // Insert before back-link or at end
        if (backLink) {
            backLink.insertAdjacentHTML('beforebegin', socialHTML);
        } else {
            article.insertAdjacentHTML('beforeend', socialHTML);
        }
        
        // Ensure CSS is loaded
        if (!document.querySelector('link[href*="social-share.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '../css/social-share.css';
            document.head.appendChild(link);
        }
        
        // Ensure JS is loaded
        if (!document.querySelector('script[src*="social-share.js"]')) {
            const script = document.createElement('script');
            script.src = '../js/social-share.js';
            document.body.appendChild(script);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addSocialSharing);
    } else {
        addSocialSharing();
    }
})();
