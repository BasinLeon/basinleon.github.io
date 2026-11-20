/**
 * Blog Enhanced Features
 * - Auto Table of Contents
 * - Back to Top button
 * - Copy Code buttons
 * - Anchor links on headings
 */

(function () {
    'use strict';

    if (window.__lbBlogFeaturesLoaded) return;
    window.__lbBlogFeaturesLoaded = true;

    function generateTableOfContents() {
        const article = document.querySelector('.post-body');
        if (!article) return;

        const headings = article.querySelectorAll('h2, h3');
        if (headings.length < 3) return;

        const toc = document.createElement('nav');
        toc.className = 'table-of-contents';
        toc.setAttribute('aria-label', 'Table of contents');
        toc.innerHTML = '<h4>Contents</h4><ul></ul>';
        const tocList = toc.querySelector('ul');

        headings.forEach((heading, index) => {
            const id = heading.id || `section-${index}`;
            heading.id = id;

            const text = heading.textContent.trim();
            const anchor = document.createElement('a');
            anchor.href = `#${id}`;
            anchor.className = 'heading-anchor';
            anchor.textContent = '#';
            anchor.setAttribute('aria-label', `Link to ${text}`);
            heading.appendChild(anchor);

            const li = document.createElement('li');
            li.className = heading.tagName.toLowerCase();
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = text;
            li.appendChild(link);
            tocList.appendChild(li);
        });

        const header = document.querySelector('.post-header');
        if (header) header.after(toc);
    }

    function createBackToTop() {
        if (document.querySelector('.back-to-top')) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'back-to-top';
        btn.textContent = '↑';
        btn.title = 'Back to top';
        btn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(btn);

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                btn.classList.toggle('visible', window.scrollY > 500);
                ticking = false;
            });
        }, { passive: true });

        btn.addEventListener('click', () => {
            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
        });
    }

    function addCopyCodeButtons() {
        document.querySelectorAll('pre code').forEach(block => {
            const wrapper = block.closest('pre');
            if (!wrapper || wrapper.querySelector('.copy-code-btn')) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'copy-code-btn';
            btn.textContent = 'Copy';

            btn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(block.textContent);
                    btn.textContent = 'Copied!';
                    btn.classList.add('copied');
                    setTimeout(() => {
                        btn.textContent = 'Copy';
                        btn.classList.remove('copied');
                    }, 2000);
                } catch (_) {
                    btn.textContent = 'Select to copy';
                }
            });

            wrapper.style.position = 'relative';
            wrapper.appendChild(btn);
        });
    }

    function init() {
        generateTableOfContents();
        createBackToTop();
        addCopyCodeButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
