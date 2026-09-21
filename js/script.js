(function () {
  'use strict';

  const THEME_KEY = 'kw-theme';
  const SUBSCRIBERS_KEY = 'kw-subscribers';

  const SUBSCRIBE_EMAIL = 'manifestingsolutiontechnology@gmail.com';
  const SUBSCRIBE_ENDPOINT = SUBSCRIBE_EMAIL
    ? `https://formsubmit.co/ajax/${SUBSCRIBE_EMAIL}`
    : '';

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const SEARCH_LIMIT = 8;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const on = (el, type, handler, opts) => {
    if (el) el.addEventListener(type, handler, opts);
  };

  const isEnglish = () => document.documentElement.lang === 'en';

  const text = (idText, enText) => (isEnglish() ? enText : idText);

  const storageGet = (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const storageSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  };

  const escapeHtml = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  function initNavbar() {
    const header = $('.header');
    const navbar = $('.header .navbar');

    on($('#menu-btn'), 'click', () => navbar && navbar.classList.add('active'));
    on($('#nav-close'), 'click', () => navbar && navbar.classList.remove('active'));

    const syncHeaderScroll = () => {
      if (header) header.classList.toggle('active', window.scrollY > 0);
    };

    on(
      window,
      'scroll',
      () => {
        if (navbar) navbar.classList.remove('active');
        syncHeaderScroll();
      },
      { passive: true }
    );

    syncHeaderScroll();
  }

  function initLangMenu() {
    const dropdown = $('.header .dropdown');
    if (!dropdown) return;

    const btn = $('.kw-lang-btn', dropdown);
    if (!btn) return;

    const isOpen = () => dropdown.classList.contains('kw-open');

    const setOpen = (open) => {
      dropdown.classList.toggle('kw-open', open);
      btn.setAttribute('aria-expanded', String(open));
    };

    let openedByHover = false;

    on(dropdown, 'mouseenter', () => {
      openedByHover = true;
      setOpen(true);
    });

    on(dropdown, 'mouseleave', () => {
      openedByHover = false;
      setOpen(false);
    });

    on(btn, 'click', (e) => {
      e.stopPropagation();
      if (openedByHover && isOpen()) return;
      setOpen(!isOpen());
    });

    on(document, 'click', (e) => {
      if (!dropdown.contains(e.target)) setOpen(false);
    });

    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        openedByHover = false;
        setOpen(false);
        btn.focus();
      }
    });

    $$('a', dropdown).forEach((a) => on(a, 'click', () => setOpen(false)));
  }

  const normalize = (value) =>
    String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const destinationUrl = (dest) =>
    `wisata.html?id=${encodeURIComponent(dest.id)}${isEnglish() ? '&lang=en' : ''}`;

  function scoreDestination(dest, query) {
    const name = normalize(dest.name);
    const region = normalize(dest.region);
    if (name.indexOf(query) === 0) return 0;
    if (name.indexOf(query) > 0) return 1;
    if (region.includes(query)) return 2;
    return -1;
  }

  function searchDestinations(query) {
    const q = normalize(query);
    if (q.length < 2) return [];

    return (window.KW_DESTINATIONS || [])
      .map((dest) => ({ dest, score: scoreDestination(dest, q) }))
      .filter((hit) => hit.score >= 0)
      .sort((a, b) => a.score - b.score || a.dest.name.localeCompare(b.dest.name))
      .slice(0, SEARCH_LIMIT)
      .map((hit) => hit.dest);
  }

  const searchItem = (dest, index) =>
    `<a class="kw-search-item" role="option" aria-selected="false" id="kw-search-opt-${index}"` +
    ` href="${escapeHtml(destinationUrl(dest))}">` +
    '<i class="bi bi-geo-alt-fill" aria-hidden="true"></i>' +
    `<span class="kw-search-name">${escapeHtml(dest.name)}</span>` +
    `<span class="kw-search-region">${escapeHtml(dest.region)}</span>` +
    '</a>';

  function initSearchForm() {
    const searchForm = $('.search-form');
    if (!searchForm) return;

    const input = $('#search-box', searchForm);
    const form = $('form', searchForm);

    const panel = document.createElement('div');
    panel.className = 'kw-search-results';
    panel.id = 'kw-search-results';
    panel.setAttribute('role', 'listbox');
    if (form) form.insertAdjacentElement('afterend', panel);

    if (input) {
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-expanded', 'false');
      input.setAttribute('aria-controls', 'kw-search-results');
      input.setAttribute('aria-autocomplete', 'list');
      input.setAttribute('autocomplete', 'off');
      input.placeholder = text('Cari destinasi atau daerah...', 'Search a destination or region...');
    }

    let results = [];
    let active = -1;

    function setActive(index) {
      const items = $$('.kw-search-item', panel);
      if (!items.length) return;

      active = (index + items.length) % items.length;
      items.forEach((el, n) => {
        el.classList.toggle('kw-search-active', n === active);
        el.setAttribute('aria-selected', String(n === active));
      });
      items[active].scrollIntoView({ block: 'nearest' });
    }

    function render(query) {
      results = searchDestinations(query);
      active = -1;

      if (normalize(query).length < 2) {
        panel.innerHTML = '';
        panel.classList.remove('kw-search-open');
        if (input) input.setAttribute('aria-expanded', 'false');
        return;
      }

      panel.classList.add('kw-search-open');
      if (input) input.setAttribute('aria-expanded', 'true');

      panel.innerHTML = results.length
        ? results.map(searchItem).join('')
        : `<p class="kw-search-empty">${text('Destinasi tidak ditemukan.', 'No destination found.')}</p>`;
    }

    const open = () => {
      searchForm.classList.add('active');
      if (input) setTimeout(() => input.focus(), 60);
    };

    const close = () => {
      searchForm.classList.remove('active');
      if (input) input.blur();
    };

    on($('#search-btn'), 'click', open);
    on($('#close-search'), 'click', close);
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    on(input, 'input', () => render(input.value));

    on(input, 'keydown', (e) => {
      if (!results.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(active + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(active - 1);
      }
    });

    on(form, 'submit', (e) => {
      e.preventDefault();
      const items = $$('.kw-search-item', panel);
      const pick = items[active >= 0 ? active : 0];
      if (pick) pick.click();
    });

    on(searchForm, 'click', (e) => {
      if (e.target === searchForm) close();
    });
  }

  function initHeroSlider() {
    if (typeof Swiper === 'undefined' || !$('.home-slider')) return;

    new Swiper('.home-slider', {
      loop: true,
      grabCursor: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  function setupLoadMore(btnSelector, itemsSelector, step) {
    const btn = $(btnSelector);
    if (!btn) return;

    const items = $$(itemsSelector);
    let shown = step;

    if (shown >= items.length) {
      btn.style.display = 'none';
      return;
    }

    on(btn, 'click', () => {
      const end = Math.min(shown + step, items.length);
      items.slice(shown, end).forEach((item) => {
        item.style.display = 'inline-block';
      });
      shown = end;
      if (shown >= items.length) btn.style.display = 'none';
    });
  }

  function initLoadMore() {
    setupLoadMore('#load-more', '.main .gambarRekomendasi .gambar', 5);
    setupLoadMore('#load-more2', '.main2 .gambarartikel2 .gambarmain2', 5);
  }

  function initTheme() {
    const toggle = document.getElementById('darkmode');

    const applyTheme = (theme) => {
      const dark = theme === 'dark';
      document.body.classList.toggle('kw-dark', dark);
      if (!toggle) return;
      toggle.classList.toggle('bi-sun', dark);
      toggle.classList.toggle('bi-moon-fill', !dark);
      toggle.setAttribute('aria-pressed', String(dark));
    };

    applyTheme(storageGet(THEME_KEY) === 'dark' ? 'dark' : 'light');
    if (!toggle) return;

    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.setAttribute('aria-label', text('Ubah mode gelap', 'Toggle dark mode'));

    const toggleTheme = () => {
      const next = document.body.classList.contains('kw-dark') ? 'light' : 'dark';
      applyTheme(next);
      storageSet(THEME_KEY, next);
    };

    on(toggle, 'click', toggleTheme);
    on(toggle, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  }

  function initBackToTop() {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'kw-to-top';
    button.className = 'kw-to-top';
    button.innerHTML = '<i class="bi bi-arrow-up" aria-hidden="true"></i>';
    button.setAttribute('aria-label', text('Kembali ke atas halaman', 'Back to top of page'));
    button.title = text('Kembali ke atas', 'Back to top');
    document.body.appendChild(button);

    const threshold = () => Math.max(600, window.innerHeight * 0.8);

    const sync = () => button.classList.toggle('kw-to-top-show', window.scrollY > threshold());

    on(window, 'scroll', sync, { passive: true });
    on(button, 'click', () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      const skip = $('.kw-skip-link');
      if (skip) skip.focus({ preventScroll: true });
    });

    sync();
  }

  function hardenDocument() {
    const foldHeight = window.innerHeight || 800;

    $$('img').forEach((img) => {
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
      if (img.hasAttribute('loading')) return;
      const aboveFold = img.getBoundingClientRect().top < foldHeight;
      if (!aboveFold) img.setAttribute('loading', 'lazy');
    });

    $$('a[target="_blank"]').forEach((a) => {
      const rel = (a.getAttribute('rel') || '').toLowerCase();
      if (!rel.includes('noopener')) {
        a.setAttribute('rel', `${rel ? `${rel} ` : ''}noopener noreferrer`);
      }
    });
  }

  const TOAST_STYLE_ID = 'kw-toast-style';
  const TOAST_CSS = `
    #kw-toast{position:fixed;bottom:88px;right:24px;z-index:9999;max-width:340px;
    padding:14px 18px;border-radius:12px;font-family:Poppins,-apple-system,sans-serif;
    font-size:14px;font-weight:500;color:#fff;box-shadow:0 18px 40px rgba(15,23,42,.25);
    background:linear-gradient(135deg,#22d3ee,#6366f1,#a855f7);opacity:0;
    transform:translateY(10px);transition:opacity .25s,transform .25s}
    #kw-toast.kw-toast-error{background:#ef4444}
    #kw-toast.kw-toast-visible{opacity:1;transform:translateY(0)}
    @media (prefers-reduced-motion:reduce){#kw-toast{transition:none}}`;

  function ensureToastStyle() {
    if (document.getElementById(TOAST_STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = TOAST_STYLE_ID;
    style.textContent = TOAST_CSS;
    document.head.appendChild(style);
  }

  function showToast(message, type) {
    ensureToastStyle();

    const existing = document.getElementById('kw-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'kw-toast';
    if (type === 'error') toast.classList.add('kw-toast-error');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('kw-toast-visible'));
    setTimeout(() => {
      toast.classList.remove('kw-toast-visible');
      setTimeout(() => toast.remove(), 260);
    }, 4000);
  }

  function rememberSubscriberLocally(email) {
    try {
      const list = JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY) || '[]');
      if (!list.includes(email)) list.push(email);
      localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(list));
    } catch {}
  }

  function setBusy(btn, busy) {
    if (!btn) return;
    btn.disabled = busy;
    btn.style.opacity = busy ? '0.65' : '';
    btn.style.cursor = busy ? 'wait' : '';
  }

  const successMessage = (email) =>
    text(`Terima kasih! Email berlangganan berhasil: ${email}`, `Thanks! You are subscribed: ${email}`);

  function submitSubscription(form) {
    const input = $('input[type="email"]', form) || $('input', form);
    const email = input ? String(input.value || '').trim() : '';

    if (!EMAIL_RE.test(email)) {
      showToast(
        text('Mohon masukkan alamat email yang valid.', 'Please enter a valid email address.'),
        'error'
      );
      if (input) input.focus();
      return;
    }

    const btn = $('button', form);
    setBusy(btn, true);

    const finish = () => {
      if (input) input.value = '';
      setBusy(btn, false);
    };

    if (!SUBSCRIBE_ENDPOINT) {
      rememberSubscriberLocally(email);
      showToast(successMessage(email));
      finish();
      return;
    }

    fetch(SUBSCRIBE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        email,
        _subject: 'KotamuWisataku — New subscriber',
        _template: 'table',
        _captcha: 'false',
        source: location.href,
      }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data && (data.success === 'true' || data.success === true)) {
          showToast(successMessage(email));
          return;
        }
        rememberSubscriberLocally(email);
        showToast(
          text(
            'Tersimpan! Email akan diteruskan setelah verifikasi.',
            'Saved! Email will be forwarded after verification.'
          )
        );
      })
      .catch(() => {
        rememberSubscriberLocally(email);
        showToast(
          text('Offline — tersimpan lokal, akan dicoba lagi.', 'Offline — saved locally, will retry later.')
        );
      })
      .then(finish);
  }

  function initSubscribe() {
    $$('form[data-subscribe]').forEach((form) => {
      on(form, 'submit', (e) => {
        e.preventDefault();
        submitSubscription(form);
      });
    });
  }

  window.kwToast = showToast;

  window.sendEmail = function sendEmail() {
    const active = document.activeElement;
    const form = (active && active.closest && active.closest('form')) || $('form[data-subscribe]');
    if (form) submitSubscription(form);
    return false;
  };

  let booted = false;

  function boot() {
    if (booted) return;
    booted = true;

    initNavbar();
    initLangMenu();
    initSearchForm();
    initHeroSlider();
    initLoadMore();
    initTheme();
    initSubscribe();
    initBackToTop();
    hardenDocument();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
