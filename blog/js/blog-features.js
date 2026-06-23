/**
 * Blog Enhanced Features
 * - Auto Table of Contents
 * - Back to Top button
 * - Copy Code buttons
 * - Anchor links on headings
 * - Post reactions (claps)
 * - Reading progress
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // TABLE OF CONTENTS (Auto-generated)
    // ═══════════════════════════════════════════════════════════════
    function generateTableOfContents() {
        const article = document.querySelector('.post-body');
        if (!article) return;

        const headings = article.querySelectorAll('h2, h3');
        if (headings.length < 3) return; // Only show ToC for longer posts

        const toc = document.createElement('nav');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h4>📑 Contents</h4><ul></ul>';
        const tocList = toc.querySelector('ul');

        headings.forEach((heading, index) => {
            // Add ID to heading for anchor links
            const id = heading.id || `section-${index}`;
            heading.id = id;

            // Add anchor link icon
            const anchor = document.createElement('a');
            anchor.href = `#${id}`;
            anchor.className = 'heading-anchor';
            anchor.innerHTML = '🔗';
            anchor.title = 'Copy link to section';
            heading.appendChild(anchor);

            // Add to ToC
            const li = document.createElement('li');
            li.className = heading.tagName.toLowerCase();
            li.innerHTML = `<a href="#${id}">${heading.textContent.replace('🔗', '')}</a>`;
            tocList.appendChild(li);
        });

        // Insert ToC after post header
        const header = document.querySelector('.post-header');
        if (header) {
            header.after(toc);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // BACK TO TOP BUTTON
    // ═══════════════════════════════════════════════════════════════
    function createBackToTop() {
        const btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.innerHTML = '↑';
        btn.title = 'Back to top';
        btn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(btn);

        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 500);
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // COPY CODE BUTTONS
    // ═══════════════════════════════════════════════════════════════
    function addCopyCodeButtons() {
        document.querySelectorAll('pre code').forEach(block => {
            const wrapper = block.closest('pre');
            const btn = document.createElement('button');
            btn.className = 'copy-code-btn';
            btn.textContent = 'Copy';

            btn.addEventListener('click', async () => {
                await navigator.clipboard.writeText(block.textContent);
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2000);
            });

            wrapper.style.position = 'relative';
            wrapper.appendChild(btn);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // POST REACTIONS (Claps)
    // ═══════════════════════════════════════════════════════════════
    function createReactionButton() {
        const footer = document.querySelector('.post-footer');
        if (!footer) return;

        const slug = window.location.pathname.split('/').pop().replace('.html', '');
        const storageKey = `claps_${slug}`;
        let claps = parseInt(localStorage.getItem(storageKey) || '0');

        const container = document.createElement('div');
        container.className = 'post-reactions';
        container.innerHTML = `
            <button class="clap-btn" aria-label="Clap for this post">
                <span class="clap-emoji">👏</span>
                <span class="clap-count">${claps}</span>
            </button>
            <span class="clap-label">Enjoyed this? Give it a clap!</span>
        `;

        const btn = container.querySelector('.clap-btn');
        const countEl = container.querySelector('.clap-count');

        btn.addEventListener('click', () => {
            claps++;
            localStorage.setItem(storageKey, claps.toString());
            countEl.textContent = claps;
            btn.classList.add('clapped');
            setTimeout(() => btn.classList.remove('clapped'), 300);
        });

        footer.before(container);
    }

    // ═══════════════════════════════════════════════════════════════
    // READING PROGRESS BAR
    // ═══════════════════════════════════════════════════════════════
    function initReadingProgress() {
        let progressBar = document.getElementById('reading-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'reading-progress';
            progressBar.className = 'reading-progress';
            document.body.prepend(progressBar);
        }

        window.addEventListener('scroll', () => {
            const article = document.querySelector('.post-content, article');
            if (!article) return;

            const scrollTop = window.scrollY;
            const docHeight = article.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = Math.min(Math.max(scrollPercent, 0), 100) + '%';
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // NEWSLETTER SIGNUP CTA
    // ═══════════════════════════════════════════════════════════════
    function insertNewsletterCTA() {
        const article = document.querySelector('.post-body');
        if (!article) return;

        // Insert after ~40% of the content
        const paragraphs = article.querySelectorAll('p');
        const insertPoint = paragraphs[Math.floor(paragraphs.length * 0.4)];
        if (!insertPoint) return;

        const cta = document.createElement('aside');
        cta.className = 'newsletter-inline-cta';
        cta.innerHTML = `
            <div class="cta-content">
                <span class="cta-icon">📬</span>
                <div>
                    <strong>Like what you're reading?</strong>
                    <p>Subscribe to The Signal — GTM insights delivered weekly.</p>
                </div>
                <a href="https://linkedin.com/in/leonbasin" target="_blank" class="cta-btn">Follow on LinkedIn</a>
            </div>
        `;
        insertPoint.after(cta);
    }

    // ═══════════════════════════════════════════════════════════════
    // INIT ALL FEATURES
    // ═══════════════════════════════════════════════════════════════
    document.addEventListener('DOMContentLoaded', () => {
        generateTableOfContents();
        createBackToTop();
        addCopyCodeButtons();
        createReactionButton();
        initReadingProgress();
        insertNewsletterCTA();
    });

})();
