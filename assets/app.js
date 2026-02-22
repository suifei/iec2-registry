(function() {
    'use strict';

    var registry = { packages: [] };
    var categories = { categories: [] };
    var activeCategory = null;

    async function init() {
        try {
            var [regRes, catRes] = await Promise.all([
                fetch('registry.json'),
                fetch('categories.json')
            ]);
            registry = await regRes.json();
            categories = await catRes.json();
        } catch (e) {
            console.error('Failed to load registry:', e);
        }

        await window.I18n.init();

        renderStats();
        renderCategories();
        renderPackages(registry.packages);
        setupSearch();

        window.I18n.onLocaleChange(function() {
            renderStats();
            renderCategories();
            renderPackages(getFilteredPackages());
        });
    }

    function getFilteredPackages() {
        var filtered = activeCategory ?
            registry.packages.filter(function(p) { return p.category === activeCategory; }) :
            registry.packages;

        var searchVal = document.getElementById('searchInput').value.toLowerCase();
        if (searchVal) {
            filtered = filtered.filter(function(p) {
                return p.name.toLowerCase().indexOf(searchVal) >= 0 ||
                       p.description.toLowerCase().indexOf(searchVal) >= 0 ||
                       (p.tags || []).some(function(t) { return t.toLowerCase().indexOf(searchVal) >= 0; }) ||
                       (p.pous || []).some(function(pou) { return pou.toLowerCase().indexOf(searchVal) >= 0; });
            });
        }
        return filtered;
    }

    function renderStats() {
        var el = document.getElementById('stats');
        var pouCount = registry.packages.reduce(function(sum, p) {
            return sum + (p.pous ? p.pous.length : 0);
        }, 0);
        el.textContent = window.I18n.t('hero.stats', {
            packages: registry.packages.length,
            pous: pouCount,
            categories: categories.categories.length,
        });
    }

    function renderCategories() {
        var grid = document.getElementById('categoryGrid');
        grid.innerHTML = '';

        var chip = document.createElement('span');
        chip.className = 'category-chip' + (activeCategory === null ? ' active' : '');
        chip.textContent = window.I18n.t('categories.all');
        chip.dataset.id = '';
        chip.addEventListener('click', function() { filterByCategory(null); });
        grid.appendChild(chip);

        categories.categories.forEach(function(cat) {
            var count = registry.packages.filter(function(p) {
                return p.category === cat.id;
            }).length;

            var c = document.createElement('span');
            c.className = 'category-chip' + (activeCategory === cat.id ? ' active' : '');
            c.dataset.id = cat.id;
            var catName = window.I18n.getLocalizedField(cat, 'name');
            c.innerHTML = catName + ' <span class="count">' + count + '</span>';
            c.addEventListener('click', function() { filterByCategory(cat.id); });
            grid.appendChild(c);
        });
    }

    function filterByCategory(catId) {
        activeCategory = catId;
        renderCategories();
        renderPackages(getFilteredPackages());
    }

    function setupSearch() {
        var input = document.getElementById('searchInput');
        var timer = null;
        input.addEventListener('input', function() {
            clearTimeout(timer);
            timer = setTimeout(function() {
                renderPackages(getFilteredPackages());
            }, 200);
        });
    }

    function renderPackages(pkgs) {
        var grid = document.getElementById('packageGrid');
        grid.innerHTML = '';

        if (pkgs.length === 0) {
            grid.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1/-1; text-align: center; padding: 40px;">' +
                window.I18n.t('packages.noResults') + '</p>';
            return;
        }

        pkgs.forEach(function(pkg) {
            var card = document.createElement('div');
            card.className = 'package-card';
            card.addEventListener('click', function() { showDetail(pkg); });

            var tagsHtml = (pkg.tags || []).slice(0, 5).map(function(t) {
                return '<span class="pkg-tag">' + t + '</span>';
            }).join('');

            var pouCount = pkg.pous ? pkg.pous.length : 0;
            var catLabel = categories.categories.find(function(c) { return c.id === pkg.category; });
            var catName = catLabel ? window.I18n.getLocalizedField(catLabel, 'name') : pkg.category;

            card.innerHTML =
                '<div class="pkg-header">' +
                '  <span class="pkg-name">' + pkg.name + '</span>' +
                '  <span class="pkg-version">v' + pkg.version + '</span>' +
                '</div>' +
                '<div class="pkg-desc">' + pkg.description + '</div>' +
                '<div class="pkg-tags">' + tagsHtml + '</div>' +
                '<div class="pkg-meta">' +
                '  <span>' + catName + '</span>' +
                '  <span class="pkg-pous">' + window.I18n.t('packages.pous', { n: pouCount }) + '</span>' +
                '</div>';

            grid.appendChild(card);
        });
    }

    function showDetail(pkg) {
        var overlay = document.getElementById('detailOverlay');
        var panel = document.getElementById('detailPanel');

        var pousHtml = '';
        if (pkg.pous && pkg.pous.length > 0) {
            var rows = pkg.pous.map(function(pou) {
                return '<tr><td>' + pou + '</td><td>' + window.I18n.t('detail.pouType.fb') + '</td></tr>';
            }).join('');
            pousHtml =
                '<table class="pou-table">' +
                '<thead><tr><th>' + window.I18n.t('detail.pouTableName') + '</th><th>' + window.I18n.t('detail.pouTableType') + '</th></tr></thead>' +
                '<tbody>' + rows + '</tbody></table>';
        }

        var platformsText = (pkg.platforms || []).join(', ');

        panel.innerHTML =
            '<div style="position:relative">' +
            '<button class="btn-close" onclick="document.getElementById(\'detailOverlay\').classList.remove(\'open\')">&times;</button>' +
            '<h2>' + pkg.name + '</h2>' +
            '<span class="version-badge">v' + pkg.version + '</span>' +
            ' <span class="version-badge" style="background:rgba(63,185,80,0.15);color:var(--green)">' + pkg.license + '</span>' +
            '<p class="desc">' + pkg.description + '</p>' +
            '<div class="install-cmd">' + window.I18n.t('detail.installCmd') + ' ' + pkg.name + '</div>' +
            pousHtml +
            '<p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:8px">' +
            window.I18n.t('detail.author') + ' ' + pkg.author + ' &middot; ' + window.I18n.t('detail.platforms') + ' ' + platformsText + '</p>' +
            '<div class="btn-row">' +
            '  <a href="' + (pkg.url || '#') + '" class="btn btn-primary" download>' + window.I18n.t('detail.download') + '</a>' +
            '  <a href="' + (pkg.homepage || '#') + '" class="btn btn-secondary">' + window.I18n.t('detail.docs') + '</a>' +
            '  <a href="packages/' + pkg.name + '/README.md" class="btn btn-secondary" target="_blank">' + window.I18n.t('detail.readme') + '</a>' +
            '</div>' +
            '</div>';

        overlay.classList.add('open');

        overlay.addEventListener('click', function handler(e) {
            if (e.target === overlay) {
                overlay.classList.remove('open');
                overlay.removeEventListener('click', handler);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
