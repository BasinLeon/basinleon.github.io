/**
 * SEO Enhancements
 * - Structured data for articles
 * - Breadcrumb navigation
 * - Internal linking improvements
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // STRUCTURED DATA
    // ═══════════════════════════════════════════════════════════════

    /**
     * Add Article structured data
     */
    function addArticleStructuredData() {
        // Check if we're on a blog post
        const article = document.querySelector('article, .post-content, .blog-content');
        if (!article) return;

        const title = document.querySelector('h1')?.textContent || document.title;
        const description = document.querySelector('meta[name="description"]')?.content || '';
        const url = window.location.href;
        const datePublished = document.querySelector('time[datetime], .post-date')?.getAttribute('datetime') || 
                             document.querySelector('time')?.textContent || 
                             new Date().toISOString();
        
        // Try to get author from page
        const author = document.querySelector('[rel="author"]')?.textContent || 
                      document.querySelector('.author')?.textContent || 
                      'Leon Basin';

        const articleData = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "url": url,
            "datePublished": datePublished,
            "author": {
                "@type": "Person",
                "name": author,
                "url": "https://basinleon.github.io"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Leon Basin",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://basinleon.github.io/assets/logo.png"
                }
            }
        };

        // Add image if available
        const image = document.querySelector('article img, .post-content img')?.src;
        if (image) {
            articleData.image = image;
        }

        // Inject structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(articleData);
        document.head.appendChild(script);
    }

    /**
     * Add BreadcrumbList structured data
     */
    function addBreadcrumbStructuredData(breadcrumbs) {
        const breadcrumbData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": crumb.name,
                "item": crumb.url
            }))
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbData);
        document.head.appendChild(script);
    }

    // ═══════════════════════════════════════════════════════════════
    // BREADCRUMB NAVIGATION
    // ═══════════════════════════════════════════════════════════════

    /**
     * Generate breadcrumbs from URL
     */
    function generateBreadcrumbs() {
        const path = window.location.pathname;
        const parts = path.split('/').filter(p => p && p !== 'index.html');
        const breadcrumbs = [
            { name: 'Home', url: 'https://basinleon.github.io/' }
        ];

        let currentPath = '';
        parts.forEach((part, index) => {
            currentPath += '/' + part;
            const name = part
                .replace(/-/g, ' ')
                .replace(/\.html$/, '')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            breadcrumbs.push({
                name: name,
                url: 'https://basinleon.github.io' + currentPath
            });
        });

        return breadcrumbs;
    }

    /**
     * Create breadcrumb navigation
     */
    function createBreadcrumbNav() {
        const breadcrumbs = generateBreadcrumbs();
        if (breadcrumbs.length <= 1) return; // Only home, no need for breadcrumbs

        const nav = document.createElement('nav');
        nav.className = 'breadcrumb-nav';
        nav.setAttribute('aria-label', 'Breadcrumb');
        nav.style.cssText = 'padding: 16px 24px; background: var(--bg-card, #0a0a0f); border-bottom: 1px solid var(--gold-border, rgba(212, 175, 55, 0.3)); font-size: 0.85rem;';

        const ol = document.createElement('ol');
        ol.style.cssText = 'list-style: none; display: flex; gap: 8px; align-items: center; margin: 0; padding: 0; flex-wrap: wrap;';

        breadcrumbs.forEach((crumb, index) => {
            const li = document.createElement('li');
            li.style.cssText = 'display: flex; align-items: center;';

            if (index < breadcrumbs.length - 1) {
                const a = document.createElement('a');
                a.href = crumb.url;
                a.textContent = crumb.name;
                a.style.cssText = 'color: var(--text-secondary, #8b8573); text-decoration: none; transition: color 0.3s ease;';
                a.addEventListener('mouseenter', () => {
                    a.style.color = 'var(--gold-primary, #D4AF37)';
                });
                a.addEventListener('mouseleave', () => {
                    a.style.color = 'var(--text-secondary, #8b8573)';
                });
                li.appendChild(a);
                
                // Add separator
                const separator = document.createElement('span');
                separator.textContent = '›';
                separator.style.cssText = 'margin: 0 8px; color: var(--text-muted, #5a584f);';
                li.appendChild(separator);
            } else {
                // Current page (no link)
                const span = document.createElement('span');
                span.textContent = crumb.name;
                span.style.cssText = 'color: var(--gold-primary, #D4AF37); font-weight: 600;';
                span.setAttribute('aria-current', 'page');
                li.appendChild(span);
            }

            ol.appendChild(li);
        });

        nav.appendChild(ol);

        // Insert after nav or at top of main content
        const mainNav = document.querySelector('nav');
        const main = document.querySelector('main, .container, body');
        
        if (mainNav) {
            mainNav.insertAdjacentElement('afterend', nav);
        } else if (main) {
            main.insertBefore(nav, main.firstChild);
        } else {
            document.body.insertBefore(nav, document.body.firstChild);
        }

        // Add structured data
        addBreadcrumbStructuredData(breadcrumbs);
    }

    // ═══════════════════════════════════════════════════════════════
    // INTERNAL LINKING
    // ═══════════════════════════════════════════════════════════════

    /**
     * Improve internal linking
     */
    function improveInternalLinking() {
        // Add rel="noopener" to external links
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (!link.href.includes(window.location.hostname)) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });

        // Add title attributes to links without them
        document.querySelectorAll('a:not([title])').forEach(link => {
            if (link.textContent.trim()) {
                link.setAttribute('title', link.textContent.trim());
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    function init() {
        // Add structured data
        addArticleStructuredData();
        
        // Create breadcrumbs
        createBreadcrumbNav();
        
        // Improve internal linking
        improveInternalLinking();
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for global use
    window.SEOEnhancements = {
        addArticleStructuredData,
        createBreadcrumbNav,
        improveInternalLinking
    };

})();
