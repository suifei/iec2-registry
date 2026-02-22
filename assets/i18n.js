(function () {
    'use strict';

    var SUPPORTED_LOCALES = ['en', 'zh-cn', 'de', 'ja'];
    var DEFAULT_LOCALE = 'en';
    var bundles = {};
    var currentLocale = DEFAULT_LOCALE;
    var listeners = [];

    function detectLocale() {
        var stored = localStorage.getItem('iec2-locale');
        if (stored && SUPPORTED_LOCALES.indexOf(stored) >= 0) return stored;

        var nav = (navigator.language || '').toLowerCase();
        if (nav.startsWith('zh')) return 'zh-cn';
        if (nav.startsWith('de')) return 'de';
        if (nav.startsWith('ja')) return 'ja';
        return DEFAULT_LOCALE;
    }

    function loadBundle(locale) {
        if (bundles[locale]) return Promise.resolve(bundles[locale]);
        return fetch('assets/locales/' + locale + '.json')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                bundles[locale] = data;
                return data;
            });
    }

    function t(key, params) {
        var bundle = bundles[currentLocale] || bundles[DEFAULT_LOCALE] || {};
        var text = bundle[key] || key;
        if (params) {
            Object.keys(params).forEach(function (k) {
                text = text.replace(new RegExp('\\{' + k + '\\}', 'g'), String(params[k]));
            });
        }
        return text;
    }

    function applyI18n() {
        var elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            el.textContent = t(key);
        });
        var placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(function (el) {
            var key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = t(key);
        });

        document.documentElement.lang = currentLocale === 'zh-cn' ? 'zh-CN' :
            currentLocale === 'ja' ? 'ja' : currentLocale === 'de' ? 'de' : 'en';
    }

    function setLocale(locale) {
        if (SUPPORTED_LOCALES.indexOf(locale) < 0) locale = DEFAULT_LOCALE;
        currentLocale = locale;
        localStorage.setItem('iec2-locale', locale);
        return loadBundle(locale).then(function () {
            applyI18n();
            listeners.forEach(function (fn) { fn(locale); });
        });
    }

    function getLocale() {
        return currentLocale;
    }

    function onLocaleChange(fn) {
        listeners.push(fn);
    }

    function getLocalizedField(obj, field) {
        var val = obj[field];
        if (val && typeof val === 'object') {
            return val[currentLocale] || val[DEFAULT_LOCALE] || val['en'] || '';
        }
        return val || '';
    }

    function init() {
        var locale = detectLocale();
        currentLocale = locale;
        return Promise.all([loadBundle(DEFAULT_LOCALE), loadBundle(locale)])
            .then(function () {
                applyI18n();
                setupSwitcher();
            });
    }

    function setupSwitcher() {
        var switcher = document.getElementById('langSwitcher');
        if (!switcher) return;
        switcher.value = currentLocale;
        switcher.addEventListener('change', function () {
            setLocale(switcher.value);
        });
    }

    window.I18n = {
        t: t,
        init: init,
        setLocale: setLocale,
        getLocale: getLocale,
        onLocaleChange: onLocaleChange,
        getLocalizedField: getLocalizedField,
        applyI18n: applyI18n,
    };
})();
