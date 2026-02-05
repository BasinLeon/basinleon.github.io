// AI-Powered Article Recommendation System
(function() {
    const RecommendationEngine = {
        async getRecommendations(currentPostUrl) {
            try {
                // Load posts data
                const response = await fetch('/data/posts.json');
                if (!response.ok) {
                    console.error('Failed to load posts.json');
                    return [];
                }
                const posts = await response.json();
                
                if (!posts || !Array.isArray(posts)) {
                    console.error('Invalid posts.json format');
                    return [];
                }
                
                // Get current post - try multiple matching strategies
                const urlParts = currentPostUrl.split('/');
                const currentSlug = urlParts[urlParts.length - 1].replace('.html', '');
                
                const currentPost = posts.find(p => {
                    if (!p.url) return false;
                    const postUrl = p.url.replace(/^\//, '').replace(/^blog\//, '').replace(/^posts\//, '');
                    const postSlug = postUrl.split('/').pop().replace('.html', '');
                    return postSlug === currentSlug || 
                           currentPostUrl.includes(postUrl) || 
                           postUrl.includes(currentSlug);
                });
                
                if (!currentPost) {
                    console.log('Current post not found in posts.json:', currentSlug);
                    return [];
                }
                
                // Extract tags from current post
                const currentTags = (currentPost.tags || []).map(t => t.toLowerCase());
                const currentTitle = (currentPost.title || '').toLowerCase();
                const currentCategory = (currentPost.category || '').toLowerCase();
                
                // Score other posts
                const scoredPosts = posts
                    .filter(p => {
                        if (!p.url) return false;
                        return p.url !== currentPost.url && p.title !== currentPost.title;
                    })
                    .map(post => {
                        let score = 0;
                        const postTags = (post.tags || []).map(t => t.toLowerCase());
                        const postTitle = (post.title || '').toLowerCase();
                        const postCategory = (post.category || '').toLowerCase();
                        
                        // Tag matching (higher weight)
                        currentTags.forEach(tag => {
                            if (postTags.includes(tag)) score += 3;
                        });
                        
                        // Title keyword matching (longer words = more relevant)
                        const currentWords = currentTitle.split(/\s+/).filter(w => w.length > 4);
                        currentWords.forEach(word => {
                            if (postTitle.includes(word)) score += 2;
                        });
                        
                        // Category matching
                        if (currentCategory && postCategory && currentCategory === postCategory) {
                            score += 2;
                        }
                        
                        // Description keyword matching
                        const currentDesc = (currentPost.description || '').toLowerCase();
                        const postDesc = (post.description || '').toLowerCase();
                        const descWords = currentDesc.split(/\s+/).filter(w => w.length > 5);
                        descWords.forEach(word => {
                            if (postDesc.includes(word)) score += 1;
                        });
                        
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
