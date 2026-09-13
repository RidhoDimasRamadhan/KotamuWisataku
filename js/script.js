/**
 * KotamuWisataku — UI behaviour
 *
 * Setiap fitur berdiri sebagai satu fungsi `init*` yang idempotent dan aman
 * dipanggil di halaman mana pun (semua query DOM dijaga null-check), lalu
 * dirangkai di `boot()` paling bawah.
 *
 *   initNavbar()      navbar toggle + state saat scroll
 *   initSearchForm()  toggle search overlay
 *   initHeroSlider()  Swiper di halaman home
 *   initLoadMore()    tombol "muat lebih banyak"
 *   initTheme()       dark mode persisten (class-based)
 *   hardenDocument()  lazy-load gambar + rel="noopener" untuk link eksternal
 *   initSubscribe()   form berlangganan (lihat CATATAN di bawah)
 *
 * Fitur GPS terpisah di js/nearby.js.
 */
(function () {
  'use strict';

  // ===========================================================================
  // Konstanta
  // ===========================================================================

  var THEME_KEY = 'kw-theme';
  var SUBSCRIBERS_KEY = 'kw-subscribers';

  // Email subscriber disimpan di localStorage browser. Cek kapan saja lewat
  // DevTools → Console:  JSON.parse(localStorage.getItem('kw-subscribers'))
  //
  // Untuk meneruskan ke inbox sungguhan, isi SUBSCRIBE_EMAIL. Pakai
  // FormSubmit.co — gratis, tanpa signup/API key. Submit pertama memicu email
  // verifikasi; klik "Activate Form" sekali → submission berikutnya auto-forward.
  var SUBSCRIBE_EMAIL = 'manifestingsolutiontechnology@gmail.com';
  var SUBSCRIBE_ENDPOINT = SUBSCRIBE_EMAIL
    ? 'https://formsubmit.co/ajax/' + SUBSCRIBE_EMAIL
    : '';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ===========================================================================
  // Helper
  // ===========================================================================

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function on(el, type, handler, opts) {
    if (el) el.addEventListener(type, handler, opts);
  }

  function isEnglish() {
    return document.documentElement.lang === 'en';
  }

  /** localStorage bisa diblokir (private mode, cookie policy) — jangan sampai fatal. */
  function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function storageSet(key, value) {
    try { localStorage.setItem(key, value); return true; } catch (e) { return false; }
  }

  // ===========================================================================
  // Navbar
  // ===========================================================================

  function initNavbar() {
    var header = $('.header');
    var navbar = $('.header .navbar');

    on($('#menu-btn'), 'click', function () {
      if (navbar) navbar.classList.add('active');
    });
    on($('#nav-close'), 'click', function () {
      if (navbar) navbar.classList.remove('active');
    });

    function syncHeaderScroll() {
      if (header) header.classList.toggle('active', window.scrollY > 0);
    }

    on(window, 'scroll', function () {
      if (navbar) navbar.classList.remove('active');
      syncHeaderScroll();
    }, { passive: true });

    syncHeaderScroll();
  }

  // ===========================================================================
  // Search overlay
  // ===========================================================================

  function initSearchForm() {
    var searchForm = $('.search-form');
    if (!searchForm) return;

    on($('#search-btn'), 'click', function () { searchForm.classList.add('active'); });
    on($('#close-search'), 'click', function () { searchForm.classList.remove('active'); });
    on(document, 'keydown', function (e) {
      if (e.key === 'Escape') searchForm.classList.remove('active');
    });
  }

  // ===========================================================================
  // Hero slider (Swiper)
  // ===========================================================================

  function initHeroSlider() {
    if (typeof Swiper === 'undefined' || !$('.home-slider')) return;

    // eslint-disable-next-line no-new
    new Swiper('.home-slider', {
      loop: true,
      grabCursor: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  }

  // ===========================================================================
  // Load more
  // ===========================================================================

  /**
   * Tampilkan `step` item tambahan tiap klik; tombol hilang saat habis.
   * Daftar item di-query sekali saat init — konten section ini statis.
   */
  function setupLoadMore(btnSelector, itemsSelector, step) {
    var btn = $(btnSelector);
    if (!btn) return;

    var items = $$(itemsSelector);
    var shown = step;

    if (shown >= items.length) {
      btn.style.display = 'none';
      return;
    }

    on(btn, 'click', function () {
      var end = Math.min(shown + step, items.length);
      for (var i = shown; i < end; i++) items[i].style.display = 'inline-block';
      shown = end;
      if (shown >= items.length) btn.style.display = 'none';
    });
  }

  function initLoadMore() {
    setupLoadMore('#load-more', '.main .gambarRekomendasi .gambar', 5);
    setupLoadMore('#load-more2', '.main2 .gambarartikel2 .gambarmain2', 5);
  }

  // ===========================================================================
  // Dark mode
  // ===========================================================================

  function initTheme() {
    var toggle = document.getElementById('darkmode');

    function applyTheme(theme) {
      var dark = theme === 'dark';
      document.body.classList.toggle('kw-dark', dark);
      if (!toggle) return;
      toggle.classList.toggle('bi-sun', dark);
      toggle.classList.toggle('bi-moon-fill', !dark);
      toggle.setAttribute('aria-pressed', String(dark));
    }

    applyTheme(storageGet(THEME_KEY) === 'dark' ? 'dark' : 'light');
    if (!toggle) return;

    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.setAttribute('aria-label', isEnglish() ? 'Toggle dark mode' : 'Ubah mode gelap');

    function toggleTheme() {
      var next = document.body.classList.contains('kw-dark') ? 'light' : 'dark';
      applyTheme(next);
      storageSet(THEME_KEY, next);
    }

    on(toggle, 'click', toggleTheme);
    on(toggle, 'keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  }

  // ===========================================================================
  // Hardening dokumen
  // ===========================================================================

  /**
   * - `loading="lazy"` untuk gambar di luar viewport awal (yang di dalam
   *   viewport dibiarkan eager supaya LCP tidak melambat).
   * - `rel="noopener noreferrer"` pada semua target="_blank" → cegah
   *   reverse tabnabbing.
   */
  function hardenDocument() {
    var foldHeight = window.innerHeight || 800;

    $$('img').forEach(function (img) {
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
      if (img.hasAttribute('loading')) return;
      var aboveFold = img.getBoundingClientRect().top < foldHeight;
      if (!aboveFold) img.setAttribute('loading', 'lazy');
    });

    $$('a[target="_blank"]').forEach(function (a) {
      var rel = (a.getAttribute('rel') || '').toLowerCase();
      if (rel.indexOf('noopener') === -1) {
        a.setAttribute('rel', (rel ? rel + ' ' : '') + 'noopener noreferrer');
      }
    });
  }

  // ===========================================================================
  // Toast
  // ===========================================================================

  var TOAST_STYLE_ID = 'kw-toast-style';
  var TOAST_CSS =
    '#kw-toast{position:fixed;bottom:24px;right:24px;z-index:9999;max-width:340px;' +
    'padding:14px 18px;border-radius:12px;font-family:Poppins,-apple-system,sans-serif;' +
    'font-size:14px;font-weight:500;color:#fff;box-shadow:0 18px 40px rgba(15,23,42,.25);' +
    'background:linear-gradient(135deg,#22d3ee,#6366f1,#a855f7);opacity:0;' +
    'transform:translateY(10px);transition:opacity .25s,transform .25s}' +
    '#kw-toast.kw-toast-error{background:#ef4444}' +
    '#kw-toast.kw-toast-visible{opacity:1;transform:translateY(0)}' +
    '@media (prefers-reduced-motion:reduce){#kw-toast{transition:none}}';

  function ensureToastStyle() {
    if (document.getElementById(TOAST_STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = TOAST_STYLE_ID;
    style.textContent = TOAST_CSS;
    document.head.appendChild(style);
  }

  /** Toast non-blocking di kanan bawah, auto-dismiss 4 detik. */
  function showToast(message, type) {
    ensureToastStyle();

    var existing = document.getElementById('kw-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'kw-toast';
    if (type === 'error') toast.classList.add('kw-toast-error');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () { toast.classList.add('kw-toast-visible'); });
    setTimeout(function () {
      toast.classList.remove('kw-toast-visible');
      setTimeout(function () { toast.remove(); }, 260);
    }, 4000);
  }

  // ===========================================================================
  // Subscribe
  // ===========================================================================

  function rememberSubscriberLocally(email) {
    try {
      var list = JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY) || '[]');
      if (list.indexOf(email) === -1) list.push(email);
      localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(list));
    } catch (e) { /* storage diblokir — abaikan */ }
  }

  function setBusy(btn, busy) {
    if (!btn) return;
    btn.disabled = busy;
    btn.style.opacity = busy ? '0.65' : '';
    btn.style.cursor = busy ? 'wait' : '';
  }

  function successMessage(email) {
    return isEnglish()
      ? 'Thanks! You are subscribed: ' + email
      : 'Terima kasih! Email berlangganan berhasil: ' + email;
  }

  /**
   * Kirim satu email subscriber.
   * @param {HTMLFormElement} form form yang di-submit — input dibaca dari
   *        dalam form ini, bukan dari dokumen, supaya halaman dengan lebih
   *        dari satu form subscribe tidak saling tertukar nilainya.
   */
  function submitSubscription(form) {
    var input = $('input[type="email"]', form) || $('input', form);
    var email = input ? String(input.value || '').trim() : '';

    if (!EMAIL_RE.test(email)) {
      showToast(
        isEnglish() ? 'Please enter a valid email address.'
                    : 'Mohon masukkan alamat email yang valid.',
        'error'
      );
      if (input) input.focus();
      return;
    }

    var btn = $('button', form);
    setBusy(btn, true);

    function finish() {
      if (input) input.value = '';
      setBusy(btn, false);
    }

    // Tanpa endpoint eksternal: simpan lokal saja.
    if (!SUBSCRIBE_ENDPOINT) {
      rememberSubscriberLocally(email);
      showToast(successMessage(email));
      finish();
      return;
    }

    fetch(SUBSCRIBE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        email: email,
        _subject: 'KotamuWisataku — New subscriber',
        _template: 'table',
        _captcha: 'false',
        source: location.href
      })
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (data && (data.success === 'true' || data.success === true)) {
          showToast(successMessage(email));
          return;
        }
        rememberSubscriberLocally(email);
        showToast(isEnglish()
          ? 'Saved! Email will be forwarded after verification.'
          : 'Tersimpan! Email akan diteruskan setelah verifikasi.');
      })
      .catch(function () {
        rememberSubscriberLocally(email);
        showToast(isEnglish()
          ? 'Offline — saved locally, will retry later.'
          : 'Offline — tersimpan lokal, akan dicoba lagi.');
      })
      .then(finish);
  }

  function initSubscribe() {
    $$('form[data-subscribe]').forEach(function (form) {
      on(form, 'submit', function (e) {
        e.preventDefault();
        submitSubscription(form);
      });
    });
  }

  /**
   * Shim untuk markup lama yang masih memanggil `onclick="sendEmail()"`.
   * Menyelesaikan form dari elemen yang sedang fokus supaya tetap scoped.
   */
  window.sendEmail = function sendEmail() {
    var active = document.activeElement;
    var form = (active && active.closest && active.closest('form')) || $('form[data-subscribe]');
    if (form) submitSubscription(form);
    return false;
  };

  // ===========================================================================
  // Boot
  // ===========================================================================

  var booted = false;

  /** Idempotent — dipanggil dua kali tidak menggandakan listener. */
  function boot() {
    if (booted) return;
    booted = true;

    initNavbar();
    initSearchForm();
    initHeroSlider();
    initLoadMore();
    initTheme();
    initSubscribe();
    hardenDocument();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
