(function() {
    'use strict';

    var PAGES = [
        { id: 'Home', file: 'wiki/Home.md' },
        { id: '开箱即用-—-安装与快速上手', file: 'wiki/开箱即用-—-安装与快速上手.md', order: 1 },
        { id: '第一个-PLC-项目', file: 'wiki/第一个-PLC-项目.md', order: 2 },
        { id: '调试与仿真', file: 'wiki/调试与仿真.md', order: 3 },
        { id: '高级开发', file: 'wiki/高级开发.md', order: 4 },
        { id: '工业化部署架构方案', file: 'wiki/工业化部署架构方案.md', order: 5 },
        { id: '架构设计', file: 'wiki/架构设计.md' },
        { id: '语言参考', file: 'wiki/语言参考.md' },
        { id: '快速入门（CLI）', file: 'wiki/快速入门（CLI）.md' }
    ];

    var currentPage = 'Home';
    var cache = {};

    async function init() {
        await window.I18n.init();

        var hash = decodeURIComponent(window.location.hash.slice(1));
        if (hash && PAGES.some(function(p) { return p.id === hash; })) {
            currentPage = hash;
        }

        setupSidebar();
        await loadPage(currentPage);

        window.addEventListener('hashchange', function() {
            var h = decodeURIComponent(window.location.hash.slice(1));
            if (h && PAGES.some(function(p) { return p.id === h; })) {
                loadPage(h);
            }
        });

        window.addEventListener('popstate', function() {
            var h = decodeURIComponent(window.location.hash.slice(1));
            if (h) loadPage(h);
        });
    }

    function setupSidebar() {
        var links = document.querySelectorAll('.sidebar-link[data-page]');
        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                var page = this.getAttribute('data-page');
                window.location.hash = encodeURIComponent(page);
                loadPage(page);
                closeMobileSidebar();
            });
        });

        var toggle = document.getElementById('sidebarToggle');
        if (toggle) {
            toggle.addEventListener('click', function() {
                document.getElementById('docsSidebar').classList.toggle('open');
            });
        }

        document.addEventListener('click', function(e) {
            var sidebar = document.getElementById('docsSidebar');
            var toggle = document.getElementById('sidebarToggle');
            if (sidebar.classList.contains('open') &&
                !sidebar.contains(e.target) &&
                e.target !== toggle) {
                sidebar.classList.remove('open');
            }
        });
    }

    function closeMobileSidebar() {
        document.getElementById('docsSidebar').classList.remove('open');
    }

    function setActiveLink(pageId) {
        document.querySelectorAll('.sidebar-link').forEach(function(link) {
            link.classList.toggle('active', link.getAttribute('data-page') === pageId);
        });
    }

    async function loadPage(pageId) {
        currentPage = pageId;
        setActiveLink(pageId);
        window.location.hash = encodeURIComponent(pageId);

        var article = document.getElementById('docsArticle');
        var loading = document.getElementById('docsLoading');
        if (loading) loading.style.display = 'flex';

        var page = PAGES.find(function(p) { return p.id === pageId; });
        if (!page) {
            article.innerHTML = '<p>Page not found.</p>';
            return;
        }

        try {
            var md;
            if (cache[pageId]) {
                md = cache[pageId];
            } else {
                var res = await fetch(page.file);
                if (!res.ok) throw new Error('HTTP ' + res.status);
                md = await res.text();
                cache[pageId] = md;
            }

            md = rewriteInternalLinks(md);
            var html = marked.parse(md);
            article.innerHTML = html;

            addHeadingAnchors();
            buildToc();
            buildPager(pageId);
            setupTocScroll();

            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
            article.innerHTML =
                '<div style="text-align:center;padding:60px 0;color:var(--text-secondary)">' +
                '<p style="font-size:1.2rem;margin-bottom:8px">Failed to load document</p>' +
                '<p style="font-size:0.85rem">' + e.message + '</p></div>';
        }
    }

    function rewriteInternalLinks(md) {
        return md.replace(/\[([^\]]+)\]\(([^)]+\.md)\)/g, function(match, text, href) {
            var page = PAGES.find(function(p) {
                return p.file.endsWith(href) || p.id === href.replace('.md', '');
            });
            if (page) {
                return '[' + text + '](#' + encodeURIComponent(page.id) + ')';
            }
            return match;
        });
    }

    function addHeadingAnchors() {
        var article = document.getElementById('docsArticle');
        var headings = article.querySelectorAll('h1, h2, h3, h4');
        headings.forEach(function(h, i) {
            var id = 'heading-' + i + '-' + slugify(h.textContent);
            h.id = id;
        });
    }

    function slugify(text) {
        return text.toLowerCase()
            .replace(/[^\w\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 60);
    }

    function buildToc() {
        var article = document.getElementById('docsArticle');
        var tocList = document.getElementById('tocList');
        var headings = article.querySelectorAll('h2, h3');

        if (headings.length === 0) {
            tocList.innerHTML = '';
            return;
        }

        var html = '';
        headings.forEach(function(h) {
            var level = h.tagName === 'H2' ? '' : ' toc-h3';
            html += '<a href="#' + h.id + '" class="toc-link' + level + '" data-target="' + h.id + '">' +
                    h.textContent + '</a>';
        });
        tocList.innerHTML = html;

        tocList.querySelectorAll('.toc-link').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                var target = document.getElementById(this.getAttribute('data-target'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    function setupTocScroll() {
        var headings = document.querySelectorAll('.docs-article h2, .docs-article h3');
        if (headings.length === 0) return;

        var tocLinks = document.querySelectorAll('.toc-link');
        var ticking = false;

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    var scrollPos = window.scrollY + 100;
                    var active = null;

                    headings.forEach(function(h) {
                        if (h.offsetTop <= scrollPos) active = h.id;
                    });

                    tocLinks.forEach(function(link) {
                        link.classList.toggle('active', link.getAttribute('data-target') === active);
                    });
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    function buildPager(pageId) {
        var pager = document.getElementById('docsPager');
        var ordered = PAGES.filter(function(p) { return p.order; })
            .sort(function(a, b) { return a.order - b.order; });

        var idx = ordered.findIndex(function(p) { return p.id === pageId; });
        if (idx < 0) {
            if (pageId === 'Home' && ordered.length > 0) {
                pager.innerHTML =
                    '<span></span>' +
                    '<a href="#' + encodeURIComponent(ordered[0].id) + '" class="pager-link next" data-page="' + ordered[0].id + '">' +
                    '<span class="pager-label">' + window.I18n.t('docs.pager.next') + '</span>' +
                    '<span class="pager-title">' + getPageTitle(ordered[0]) + '</span></a>';
            } else {
                pager.innerHTML = '';
            }
            bindPagerLinks();
            return;
        }

        var html = '';
        if (idx > 0) {
            html += '<a href="#' + encodeURIComponent(ordered[idx-1].id) + '" class="pager-link prev" data-page="' + ordered[idx-1].id + '">' +
                '<span class="pager-label">' + window.I18n.t('docs.pager.prev') + '</span>' +
                '<span class="pager-title">' + getPageTitle(ordered[idx-1]) + '</span></a>';
        } else {
            html += '<a href="#Home" class="pager-link prev" data-page="Home">' +
                '<span class="pager-label">' + window.I18n.t('docs.pager.prev') + '</span>' +
                '<span class="pager-title">Home</span></a>';
        }

        if (idx < ordered.length - 1) {
            html += '<a href="#' + encodeURIComponent(ordered[idx+1].id) + '" class="pager-link next" data-page="' + ordered[idx+1].id + '">' +
                '<span class="pager-label">' + window.I18n.t('docs.pager.next') + '</span>' +
                '<span class="pager-title">' + getPageTitle(ordered[idx+1]) + '</span></a>';
        }

        pager.innerHTML = html;
        bindPagerLinks();
    }

    function bindPagerLinks() {
        document.querySelectorAll('.pager-link[data-page]').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                loadPage(this.getAttribute('data-page'));
            });
        });
    }

    function getPageTitle(page) {
        var i18nMap = {
            '开箱即用-—-安装与快速上手': 'docs.nav.install',
            '第一个-PLC-项目': 'docs.nav.firstProject',
            '调试与仿真': 'docs.nav.debugging',
            '高级开发': 'docs.nav.advanced',
            '工业化部署架构方案': 'docs.nav.industrial',
            '架构设计': 'docs.nav.architecture',
            '语言参考': 'docs.nav.langRef',
            '快速入门（CLI）': 'docs.nav.cli',
            'Home': 'docs.nav.home'
        };
        var key = i18nMap[page.id];
        return key ? window.I18n.t(key) : page.id;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
