/**
 * Reading Time Calculator
 * Estimates reading time based on word count
 */

(function() {
    'use strict';

    // Average reading speed: 200-250 words per minute
    const WORDS_PER_MINUTE = 225;

    /**
     * Calculate reading time from text content
     */
    function calculateReadingTime(text) {
        if (!text) return 0;
        
        // Remove HTML tags
        const cleanText = text.replace(/<[^>]*>/g, ' ');
        
        // Count words
        const words = cleanText.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        
        // Calculate minutes
        const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
        
        return {
            minutes: minutes,
            wordCount: wordCount,
            text: minutes === 1 ? '1 min read' : `${minutes} min read`
        };
    }

    /**
     * Add reading time to blog posts
     */
    function addReadingTimeToPosts() {
        // Find all article content
        const articles = document.querySelectorAll('article, .post-content, .blog-content, main');
        
        articles.forEach(article => {
            // Skip if already has reading time
            if (article.querySelector('.reading-time')) return;
            
            // Get text content
            const text = article.textContent || article.innerText;
            const readingTime = calculateReadingTime(text);
            
            if (readingTime.minutes > 0) {
                // Find where to insert (usually near date or title)
                const meta = article.querySelector('.post-meta, .article-meta, .blog-meta, time');
                const readingTimeEl = document.createElement('span');
                readingTimeEl.className = 'reading-time';
                readingTimeEl.textContent = readingTime.text;
                readingTimeEl.setAttribute('data-word-count', readingTime.wordCount);
                readingTimeEl.style.cssText = 'color: var(--text-muted, #8b8573); font-size: 0.85rem; margin-left: 8px;';
                
                if (meta) {
                    meta.appendChild(readingTimeEl);
                } else {
                    // Insert at top of article
                    article.insertBefore(readingTimeEl, article.firstChild);
                }
            }
        });
    }

    /**
     * Add reading time to blog index cards
     */
    function addReadingTimeToCards() {
        const cards = document.querySelectorAll('.post-card, .blog-card');
        
        cards.forEach(card => {
            if (card.querySelector('.reading-time')) return;
            
            // Try to get excerpt or title for estimation
            const excerpt = card.querySelector('.post-excerpt, .blog-excerpt, .excerpt');
            const title = card.querySelector('.post-title, .blog-title, h3, h2');
            
            let text = '';
            if (excerpt) text = excerpt.textContent;
            else if (title) text = title.textContent; // Rough estimate from title
            
            // For cards, estimate based on typical post length if no excerpt
            if (!excerpt && title) {
                // Estimate: average blog post is 800-1200 words
                const estimatedWords = 1000;
                const minutes = Math.ceil(estimatedWords / WORDS_PER_MINUTE);
                text = 'x'.repeat(estimatedWords); // Dummy text for calculation
            }
            
            const readingTime = calculateReadingTime(text);
            
            if (readingTime.minutes > 0 || text.length > 0) {
                const readingTimeEl = document.createElement('span');
                readingTimeEl.className = 'reading-time';
                readingTimeEl.textContent = readingTime.minutes > 0 ? readingTime.text : '~5 min read';
                readingTimeEl.style.cssText = 'color: var(--text-muted, #8b8573); font-size: 0.75rem; margin-left: 8px; display: inline-block;';
                
                const meta = card.querySelector('.post-meta, .blog-meta, .post-date');
                if (meta) {
                    meta.appendChild(readingTimeEl);
                }
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addReadingTimeToPosts();
            addReadingTimeToCards();
        });
    } else {
        addReadingTimeToPosts();
        addReadingTimeToCards();
    }

    // Export for use in other scripts
    window.ReadingTime = {
        calculate: calculateReadingTime,
        addToPosts: addReadingTimeToPosts,
        addToCards: addReadingTimeToCards
    };

})();
