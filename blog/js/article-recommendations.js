// AI-Powered Article Recommendation System
(function() {
    const RecommendationEngine = {
        async getRecommendations(currentPostUrl) {
            try {
                // Load posts data
                const response = await fetch('/data/posts.json');
                const posts = await response.json();
                
                // Get current post
                const currentPost = posts.find(p => {
                    const postUrl = p.url.replace(/^\//, '');
                    return currentPostUrl.includes(postUrl) || postUrl.includes(currentPostUrl.split('/').pop());
                });
                
                if (!currentPost) return [];
                
                // Extract tags from current post
                const currentTags = (currentPost.tags || []).map(t => t.toLowerCase());
                const currentTitle = (currentPost.title || '').toLowerCase();
                
                // Score other posts
                const scoredPosts = posts
                    .filter(p => p.url !== currentPost.url)
                    .map(post => {
                        let score = 0;
                        const postTags = (post.tags || []).map(t => t.toLowerCase());
                        const postTitle = (post.title || '').toLowerCase();
                        
                        // Tag matching (higher weight)
                        currentTags.forEach(tag => {
                            if (postTags.includes(tag)) score += 3;
                        });
                        
                        // Title keyword matching
                        const currentWords = currentTitle.split(/\s+/);
                        currentWords.forEach(word => {
                            if (word.length > 4 && postTitle.includes(word)) score += 2;
                        });
                        
                        // Category matching
                        if (currentPost.category && post.category === currentPost.category) {
                            score += 2;
                        }
                        
                        return { post, score };
                    })
                    .filter(item => item.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map(item => item.post);
                
                return scoredPosts;
            } catch (error) {
                console.error('Error getting recommendations:', error);
                return [];
            }
        },
        
        renderRecommendations(container, recommendations) {
            if (!recommendations || recommendations.length === 0) return;
            
            const html = `
                <div class="article-recommendations">
                    <h4 class="recommendations-title">Related Articles</h4>
                    <div class="recommendations-grid">
                        ${recommendations.map(post => `
                            <a href="${post.url}" class="recommendation-card">
                                <div class="recommendation-title">${post.title}</div>
                                <div class="recommendation-meta">
                                    ${post.tags ? post.tags.slice(0, 2).map(tag => `<span class="recommendation-tag">${tag}</span>`).join('') : ''}
                                </div>
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
            
            container.innerHTML = html;
        }
    };
    
    // Initialize on blog post pages
    if (window.location.pathname.includes('/blog/posts/')) {
        const initRecommendations = async () => {
            const container = document.getElementById('article-recommendations');
            if (!container) return;
            
            const recommendations = await RecommendationEngine.getRecommendations(window.location.pathname);
            RecommendationEngine.renderRecommendations(container, recommendations);
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initRecommendations);
        } else {
            initRecommendations();
        }
    }
    
    window.RecommendationEngine = RecommendationEngine;
})();
