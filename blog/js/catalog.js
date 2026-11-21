(function () {
            const body = document.body;
            const menuToggle = document.querySelector('.menu-toggle');
            const primaryLinks = document.getElementById('primary-links');
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const catalogList = document.getElementById('catalog-list');
            const catalogCount = document.getElementById('catalog-count');
            const catalogEmpty = document.getElementById('catalog-empty');
            const catalogReset = document.getElementById('catalog-reset');
            const loadMoreButton = document.getElementById('load-more');
            const searchInput = document.getElementById('archive-search');
            const searchClear = document.getElementById('search-clear');
            const sortSelect = document.getElementById('archive-sort');
            const surpriseBtn = document.getElementById('catalog-surprise');
            const filterButtons = [...document.querySelectorAll('.filter-button')];
            const filterCounts = [...document.querySelectorAll('[data-filter-count]')];
            const topicChips = [...document.querySelectorAll('[data-topic]')];
            let allPosts = [];
            let readingMinutes = new Map();
            let currentFilter = 'essential';
            let currentSort = 'newest';
            let activeTopic = '';
            let query = '';
            let visibleCount = 12;

            const essentialUrls = new Set([
                'posts/the-machine-described-me-back-to-myself.html',
                'posts/the-builders-advantage.html',
                'posts/sam-ink-note-in-the-other-room.html',
                'posts/the-souls-algorithm-fallow-year.html',
                'posts/rebuilt-manual-sdr-workflow.html',
                'posts/the-archive-was-empty.html',
                'posts/architecture-of-the-inward-machine.html',
                'posts/the-silence-architect.html',
                'posts/stop-selling-start-architecting-rise-of-gtm-engineer.html',
                'posts/gtm-systemization-framework.html',
                'posts/architecture-of-revenue.html',
                'posts/system-finds-the-role.html',
            ]);

            const lanes = {
                operator: ['gtm', 'revenue', 'sales', 'pipeline', 'business', 'leadership', 'market', 'career', 'account'],
                builder: ['ai', 'artificial intelligence', 'python', 'technology', 'agent', 'automation', 'code', 'github', 'build'],
                human: ['writing', 'memory', 'creative', 'philosophy', 'silence', 'labyrinth', 'story', 'fiction', 'parenthood', 'inner'],
                fiction: ['fiction', 'sam & ink', 'the archivist', 'novella', 'short story', 'folklore']
            };

            function postText(post) {
                if (!post._text) {
                    post._text = [post.title, post.excerpt, post.category, ...(post.tags || [])].join(' ').toLowerCase();
                }
                return post._text;
            }

            function postPath(post) {
                const raw = String(post.url || '');
                return raw.startsWith('/') ? raw : `/blog/${raw.replace(/^\/+/, '')}`;
            }

            function matchesLane(post, lane) {
                if (lane === 'all') return true;
                if (lane === 'essential') return essentialUrls.has(String(post.url).replace(/^\/blog\//, ''));
                if (lane === 'fiction' && String(post.category).toLowerCase() === 'fiction') return true;
                const text = postText(post);
                return (lanes[lane] || []).some(term => text.includes(term));
            }

            function getLane(post) {
                const text = postText(post);
                if (matchesLane(post, 'fiction')) return 'Fiction';
                if (lanes.human.some(term => text.includes(term))) return 'Human';
                if (lanes.builder.some(term => text.includes(term))) return 'Builder';
                return 'Operator';
            }

            function formatDate(dateString) {
                if (!dateString) return 'Archive';
                const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(dateString) ? `${dateString}T12:00:00` : dateString);
                if (Number.isNaN(date.getTime())) return dateString;
                return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
            }

            function matchesQuery(post, needle) {
                if (!needle) return true;
                const text = postText(post);
                const tokens = needle.split(/\s+/).filter(Boolean);
                return tokens.every(token => text.includes(token));
            }

            const essentialPins = ['posts/the-machine-described-me-back-to-myself.html', 'posts/the-builders-advantage.html', 'posts/gtm-systemization-framework.html', 'posts/rebuilt-manual-sdr-workflow.html'];

            function filteredPosts() {
                const needle = query.trim().toLowerCase();
                const laneToUse = (needle || activeTopic) && currentFilter === 'essential' ? 'all' : currentFilter;
                const result = allPosts.filter(post => {
                    if (!matchesLane(post, laneToUse)) return false;
                    if (activeTopic && !postText(post).includes(activeTopic)) return false;
                    return matchesQuery(post, needle);
                });
                if (currentSort === 'oldest') {
                    result.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
                } else if (currentSort === 'quick') {
                    result.sort((a, b) => {
                        const ma = readingMinutes.get(postPath(a))?.minutes ?? 99;
                        const mb = readingMinutes.get(postPath(b))?.minutes ?? 99;
                        return ma !== mb ? ma - mb : new Date(b.date || 0) - new Date(a.date || 0);
                    });
                } else if (laneToUse === 'essential') {
                    const rank = post => { const i = essentialPins.indexOf(String(post.url).replace(/^\/blog\//, '')); return i < 0 ? essentialPins.length : i; };
                    result.sort((a, b) => rank(a) - rank(b));
                }
                return result;
            }

            function createPostRow(post) {
                const link = document.createElement('a');
                link.className = 'catalog-row';
                link.href = post.url;

                const meta = document.createElement('span');
                meta.className = 'catalog-meta';
                meta.append(document.createTextNode(formatDate(post.date)));
                meta.append(document.createTextNode(' · '));
                const selectedLane = ['operator', 'builder', 'human', 'fiction'].includes(currentFilter)
                    ? currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)
                    : getLane(post);
                const timing = readingMinutes.get(postPath(post));
                const minsLabel = timing ? (Number.isFinite(timing.words) && timing.words < 225 ? ' · <1 min' : ` · ${timing.minutes} min`) : '';
                meta.append(document.createTextNode(selectedLane + minsLabel));

                const title = document.createElement('h3');
                title.textContent = post.title;

                const excerpt = document.createElement('p');
                excerpt.textContent = post.excerpt || 'Open the entry.';

                link.append(meta, title, excerpt);
                return link;
            }

            function syncUrl() {
                const url = new URL(location.href);
                if (currentFilter !== 'essential') url.searchParams.set('lane', currentFilter);
                else url.searchParams.delete('lane');
                if (query.trim()) url.searchParams.set('q', query.trim());
                else url.searchParams.delete('q');
                if (activeTopic) url.searchParams.set('topic', activeTopic);
                else url.searchParams.delete('topic');
                if (currentSort !== 'newest') url.searchParams.set('sort', currentSort);
                else url.searchParams.delete('sort');
                history.replaceState(null, '', url.pathname + url.search + url.hash);
            }

            function renderCatalog() {
                if (!allPosts.length) return;
                const filtered = filteredPosts();
                const visible = filtered.slice(0, visibleCount);
                catalogList.replaceChildren(...visible.map(createPostRow));
                const isEmpty = filtered.length === 0;
                catalogList.hidden = isEmpty;
                if (catalogEmpty) catalogEmpty.hidden = !isEmpty;
                const scopeNote = (query.trim() || activeTopic) && currentFilter === 'essential' ? ' across all rooms' : '';
                catalogCount.textContent = isEmpty
                    ? '0 matching entries'
                    : `Showing ${visible.length} of ${filtered.length} ${filtered.length === 1 ? 'entry' : 'entries'}${scopeNote}`;
                loadMoreButton.hidden = visible.length >= filtered.length;
                if (searchClear) searchClear.hidden = !query.length;
            }

            function updateLaneCounts() {
                const countFor = lane => lane === 'all'
                    ? allPosts.length
                    : allPosts.filter(post => matchesLane(post, lane)).length;
                filterCounts.forEach(node => { node.textContent = countFor(node.dataset.filterCount); });
            }

            function syncButtonStates() {
                filterButtons.forEach(button => {
                    const active = button.dataset.filter === currentFilter;
                    button.classList.toggle('active', active);
                    button.setAttribute('aria-pressed', String(active));
                });
                topicChips.forEach(chip => {
                    chip.setAttribute('aria-pressed', String(chip.dataset.topic === activeTopic));
                });
                if (sortSelect) sortSelect.value = currentSort;
            }

            function updateCatalogView(animate) {
                syncButtonStates();
                syncUrl();
                if (animate && !reducedMotion && document.startViewTransition) {
                    try {
                        const t = document.startViewTransition(() => renderCatalog());
                        if (t && t.ready) t.ready.catch(() => {});
                        if (t && t.finished) t.finished.catch(() => {});
                        return;
                    } catch (_) {}
                }
                renderCatalog();
            }

            function setFilter(filter, animate = true) {
                currentFilter = filter;
                visibleCount = 12;
                updateCatalogView(animate);
            }

            if (menuToggle && primaryLinks) {
                const closeMenu = () => {
                    body.classList.remove('menu-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.setAttribute('aria-label', 'Open menu');
                };
                menuToggle.addEventListener('click', () => {
                    const open = body.classList.toggle('menu-open');
                    menuToggle.setAttribute('aria-expanded', String(open));
                    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
                });
                primaryLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
                document.addEventListener('keydown', event => {
                    if (!body.classList.contains('menu-open')) return;
                    if (event.key === 'Escape') { closeMenu(); menuToggle.focus(); }
                    if (event.key === 'Tab') {
                        const items = [menuToggle, ...primaryLinks.querySelectorAll('a')];
                        const first = items[0], last = items[items.length - 1];
                        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
                        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
                    }
                });
                window.matchMedia('(min-width: 941px)').addEventListener('change', event => {
                    if (event.matches) closeMenu();
                });
            }

            const revealItems = document.querySelectorAll('.reveal');
            if (reducedMotion || !('IntersectionObserver' in window)) {
                revealItems.forEach(item => item.classList.add('is-visible'));
            } else {
                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) return;
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    });
                }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });
                revealItems.forEach(item => observer.observe(item));
            }

            if (!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                const heroArt = document.querySelector('.hero-art');
                if (heroArt) {
                    let ticking = false;
                    const updateParallax = () => {
                        heroArt.style.translate = `0 ${Math.min(window.scrollY * 0.05, 38)}px`;
                        ticking = false;
                    };
                    window.addEventListener('scroll', () => {
                        if (ticking) return;
                        ticking = true;
                        requestAnimationFrame(updateParallax);
                    }, { passive: true });
                }
            }

            filterButtons.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter, true)));
            topicChips.forEach(chip => chip.addEventListener('click', () => {
                activeTopic = activeTopic === chip.dataset.topic ? '' : chip.dataset.topic;
                visibleCount = 12;
                updateCatalogView(true);
            }));
            if (sortSelect) {
                sortSelect.addEventListener('change', () => {
                    currentSort = sortSelect.value;
                    visibleCount = 12;
                    updateCatalogView(true);
                });
            }
            if (searchClear) {
                searchClear.addEventListener('click', () => {
                    searchInput.value = '';
                    query = '';
                    visibleCount = 12;
                    updateCatalogView(false);
                    searchInput.focus();
                });
            }
            if (catalogReset) {
                catalogReset.addEventListener('click', () => {
                    searchInput.value = '';
                    query = '';
                    activeTopic = '';
                    currentFilter = 'all';
                    currentSort = 'newest';
                    visibleCount = 12;
                    updateCatalogView(true);
                });
            }
            if (surpriseBtn) {
                surpriseBtn.addEventListener('click', () => {
                    const pool = filteredPosts().length ? filteredPosts() : allPosts;
                    if (!pool.length) return;
                    const pick = pool[Math.floor(Math.random() * pool.length)];
                    location.href = pick.url;
                });
            }
            searchInput.addEventListener('input', event => {
                query = event.target.value;
                visibleCount = 12;
                syncUrl();
                renderCatalog();
            });
            document.addEventListener('keydown', event => {
                const activeTag = document.activeElement?.tagName;
                const isTyping = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT' || document.activeElement?.isContentEditable;
                if (event.key === '/' && !isTyping) {
                    event.preventDefault();
                    searchInput.focus();
                    searchInput.select();
                }
                if (event.key === 'Escape' && document.activeElement === searchInput && searchInput.value) {
                    searchInput.value = '';
                    query = '';
                    visibleCount = 12;
                    updateCatalogView(false);
                }
            });
            loadMoreButton.addEventListener('click', () => {
                visibleCount += 12;
                renderCatalog();
            });

            // Auto-open the Sam & Ink fragment shelf when jumping to #fragments
            const gardenShelf = document.querySelector('#fragments details.garden-shelf');
            if (gardenShelf) {
                const openFragmentsShelf = () => {
                    if (location.hash === '#fragments') gardenShelf.open = true;
                };
                openFragmentsShelf();
                window.addEventListener('hashchange', openFragmentsShelf);
                document.querySelectorAll('a[href="#fragments"]').forEach(link => {
                    link.addEventListener('click', () => { gardenShelf.open = true; });
                });
            }

            // Restore initial state from URL query params (?lane=, ?q=, ?topic=, ?sort=)
            const initParams = new URLSearchParams(location.search);
            const initLane = initParams.get('lane');
            if (initLane && ['essential', 'all', 'operator', 'builder', 'human', 'fiction'].includes(initLane)) {
                currentFilter = initLane;
            }
            const initQuery = initParams.get('q');
            if (initQuery) {
                query = initQuery;
                searchInput.value = initQuery;
            }
            const initTopic = initParams.get('topic');
            if (initTopic) activeTopic = initTopic.toLowerCase();
            const initSort = initParams.get('sort');
            if (initSort && ['newest', 'oldest', 'quick'].includes(initSort)) currentSort = initSort;

            if (!window.__lbReadingIndexPromise) {
                window.__lbReadingIndexPromise = fetch('/blog/reading-index.json').then(r => r.ok ? r.json() : []).catch(() => []);
            }

            Promise.all([
                fetch('/data/posts.json?v=20261119').then(response => {
                    if (!response.ok) throw new Error(`Archive request failed: ${response.status}`);
                    return response.json();
                }),
                window.__lbReadingIndexPromise
            ]).then(([posts, readingRows]) => {
                if (Array.isArray(readingRows)) {
                    readingRows.forEach(row => { if (row && row.url) readingMinutes.set(row.url, row); });
                }
                allPosts = posts
                    .filter(post => post.url && post.url !== '#')
                    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
                updateLaneCounts();
                syncButtonStates();
                renderCatalog();
                if ((initQuery || initLane || initTopic) && !location.hash) {
                    document.getElementById('catalog')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
                }
            }).catch(error => {
                console.error(error);
                catalogCount.textContent = 'Showing featured entries · full catalog temporarily unavailable';
                loadMoreButton.hidden = true;
            });
        })();
