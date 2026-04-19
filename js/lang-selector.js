(function () {
    var LANGS = [
        { code: 'en', label: 'English',   fi: 'gb' },
        { code: 'es', label: 'Español',   fi: 'es' },
        { code: 'fr', label: 'Français',  fi: 'fr' },
        { code: 'pt', label: 'Português', fi: 'br' },
        { code: 'ko', label: '한국어',    fi: 'kr' },
        { code: 'ja', label: '日本語',    fi: 'jp' },
        { code: 'zh', label: '简体中文',  fi: 'cn' },
    ];

    var LANG_CODES = LANGS.map(function (l) { return l.code; });

    // Load flag-icons CSS dynamically
    if (!document.querySelector('link[href*="flag-icons"]')) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/css/flag-icons.min.css';
        document.head.appendChild(link);
    }

    function flagHtml(fi) {
        return '<span class="fi fi-' + fi + ' lang-flag-img"></span>';
    }

    function init() {
        var mount = document.querySelector('.language-select');
        if (!mount) return;

        var pathname = window.location.pathname.replace(/\\/g, '/');
        var parts = pathname.split('/').filter(Boolean);
        var currentLang = parts.find(function (p) { return LANG_CODES.indexOf(p) !== -1; }) || 'en';
        var pageName = parts[parts.length - 1] || 'index.html';
        if (!pageName || pageName.indexOf('.') === -1) pageName = 'index.html';

        var current = LANGS.find(function (l) { return l.code === currentLang; });

        function getHref(targetLang) {
            if (targetLang === currentLang) return null;
            var base = currentLang === 'en' ? '' : '../';
            if (targetLang === 'en') return base + pageName;
            return base + targetLang + '/' + pageName;
        }

        var dropdown = document.createElement('div');
        dropdown.className = 'lang-dropdown';

        var trigger = document.createElement('button');
        trigger.className = 'lang-trigger';
        trigger.setAttribute('type', 'button');
        trigger.innerHTML =
            flagHtml(current.fi) +
            '<span class="lang-label">' + current.label + '</span>' +
            '<svg class="lang-chevron" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

        var ul = document.createElement('ul');
        ul.className = 'lang-options';

        LANGS.forEach(function (l) {
            var li = document.createElement('li');
            li.className = 'lang-option' + (l.code === currentLang ? ' active' : '');
            li.innerHTML = flagHtml(l.fi) + '<span class="lang-label">' + l.label + '</span>';
            li.addEventListener('click', function () {
                var href = getHref(l.code);
                if (href) window.location.href = href;
                dropdown.classList.remove('open');
            });
            ul.appendChild(li);
        });

        dropdown.appendChild(trigger);
        dropdown.appendChild(ul);
        mount.innerHTML = '';
        mount.appendChild(dropdown);

        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdown.classList.toggle('open');
        });

        document.addEventListener('click', function () {
            dropdown.classList.remove('open');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
