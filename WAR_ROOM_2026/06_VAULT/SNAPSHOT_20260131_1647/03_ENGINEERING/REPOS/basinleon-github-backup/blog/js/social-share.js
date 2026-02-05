// Social Sharing Functionality
(function() {
    function initSocialShare() {
        const shareContainers = document.querySelectorAll('.social-share-container');
        
        shareContainers.forEach(container => {
            // Twitter share
            const twitterBtn = container.querySelector('.social-share-btn.twitter');
            if (twitterBtn) {
                twitterBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const url = encodeURIComponent(window.location.href);
                    const text = encodeURIComponent(document.title);
                    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=550,height=420');
                    
                    // Track share event
                    if (window.gtag) {
                        gtag('event', 'share', {
                            'method': 'Twitter',
                            'content_type': 'article',
                            'item_id': window.location.pathname
                        });
                    }
                });
            }
            
            // LinkedIn share
            const linkedinBtn = container.querySelector('.social-share-btn.linkedin');
            if (linkedinBtn) {
                linkedinBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const url = encodeURIComponent(window.location.href);
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=550,height=420');
                    
                    // Track share event
                    if (window.gtag) {
                        gtag('event', 'share', {
                            'method': 'LinkedIn',
                            'content_type': 'article',
                            'item_id': window.location.pathname
                        });
                    }
                });
            }
            
            // Facebook share
            const facebookBtn = container.querySelector('.social-share-btn.facebook');
            if (facebookBtn) {
                facebookBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const url = encodeURIComponent(window.location.href);
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=550,height=420');
                    
                    // Track share event
                    if (window.gtag) {
                        gtag('event', 'share', {
                            'method': 'Facebook',
                            'content_type': 'article',
                            'item_id': window.location.pathname
                        });
                    }
                });
            }
            
            // Copy link
            const copyBtn = container.querySelector('.social-share-btn.copy');
            if (copyBtn) {
                copyBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        const originalText = copyBtn.innerHTML;
                        copyBtn.innerHTML = '✓ Copied!';
                        setTimeout(() => {
                            copyBtn.innerHTML = originalText;
                        }, 2000);
                    });
                    
                    // Track copy event
                    if (window.gtag) {
                        gtag('event', 'share', {
                            'method': 'Copy Link',
                            'content_type': 'article',
                            'item_id': window.location.pathname
                        });
                    }
                });
            }
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSocialShare);
    } else {
        initSocialShare();
    }
})();
