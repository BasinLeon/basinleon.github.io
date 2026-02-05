/**
 * Site-Wide Enhancements
 * - Lazy loading
 * - Personalization
 * - Interactive elements
 * - Performance optimizations
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // LAZY LOADING
    // ═══════════════════════════════════════════════════════════════

    /**
     * Lazy load images
     */
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px'
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    /**
     * Lazy load scripts
     */
    function lazyLoadScript(src, defer = true) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.defer = defer;
            script.async = !defer;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // PERSONALIZATION
    // ═══════════════════════════════════════════════════════════════

    /**
     * Detect visitor type
     */
    function detectVisitorType() {
        const path = window.location.pathname;
        const referrer = document.referrer;
        const userAgent = navigator.userAgent;
        
        let type = 'general';
        
        // Check URL patterns
        if (path.includes('/consulting') || path.includes('/services')) {
            type = 'consulting';
        } else if (path.includes('/hiring-managers') || path.includes('/career')) {
            type = 'hiring_manager';
        } else if (path.includes('/blog') || path.includes('/library')) {
            type = 'content_seeker';
        } else if (path.includes('/tools')) {
            type = 'tool_user';
        }
        
        // Check referrer
        if (referrer.includes('linkedin.com')) {
            type = 'linkedin_visitor';
        } else if (referrer.includes('github.com')) {
            type = 'developer';
        }
        
        // Store in session
        sessionStorage.setItem('visitor_type', type);
        
        return type;
    }

    /**
     * Personalize content based on visitor type
     */
    function personalizeContent() {
        const type = detectVisitorType();
        const body = document.body;
        
        // Add data attribute for CSS targeting
        body.setAttribute('data-visitor-type', type);
        
        // Customize CTAs
        const ctas = document.querySelectorAll('.cta-personalized, [data-personalize]');
        ctas.forEach(cta => {
            switch(type) {
                case 'hiring_manager':
                    if (cta.dataset.personalize === 'hiring') {
                        cta.style.display = 'block';
                        cta.textContent = cta.dataset.hiringText || cta.textContent;
                    }
                    break;
                case 'consulting':
                    if (cta.dataset.personalize === 'consulting') {
                        cta.style.display = 'block';
                        cta.textContent = cta.dataset.consultingText || cta.textContent;
                    }
                    break;
            }
        });
        
        // Track visitor type
        if (typeof gtag !== 'undefined') {
            gtag('event', 'visitor_type_detected', {
                visitor_type: type
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // INTERACTIVE ELEMENTS
    // ═══════════════════════════════════════════════════════════════

    /**
     * Add micro-interactions
     */
    function addMicroInteractions() {
        // Button hover effects
        document.querySelectorAll('button, .btn, a.btn').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.transition = 'transform 0.2s ease';
            });
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Card hover effects
        document.querySelectorAll('.card, .post-card, .case-study-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
                this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                this.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.2)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
        });

        // Smooth scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    fadeInObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('section, .card, .post-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            fadeInObserver.observe(el);
        });
    }

    /**
     * Add loading states
     */
    function addLoadingStates() {
        // Form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(e) {
                const submitBtn = this.querySelector('button[type="submit"], input[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = submitBtn.dataset.loadingText || 'Loading...';
                }
            });
        });

        // Link clicks with loading
        document.querySelectorAll('a[data-loading]').forEach(link => {
            link.addEventListener('click', function() {
                this.innerHTML = '<span class="spinner"></span> ' + this.textContent;
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // PERFORMANCE OPTIMIZATIONS
    // ═══════════════════════════════════════════════════════════════

    /**
     * Preload critical resources
     */
    function preloadCriticalResources() {
        // Preload fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.as = 'font';
        fontLink.type = 'font/woff2';
        fontLink.crossOrigin = 'anonymous';
        // Add font URLs as needed
    }

    /**
     * Defer non-critical scripts
     */
    function deferNonCriticalScripts() {
        const scripts = document.querySelectorAll('script[data-defer]');
        scripts.forEach(script => {
            script.defer = true;
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    function init() {
        // Initialize lazy loading
        initLazyLoading();
        
        // Personalize content
        personalizeContent();
        
        // Add interactive elements
        addMicroInteractions();
        addLoadingStates();
        
        // Performance optimizations
        preloadCriticalResources();
        deferNonCriticalScripts();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for global use
    window.SiteEnhancements = {
        detectVisitorType,
        personalizeContent,
        initLazyLoading
    };

})();
