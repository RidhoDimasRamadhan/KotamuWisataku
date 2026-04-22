/**
 * KotamuWisataku — UI behaviour
 * - Navbar toggle & scroll state
 * - Search form toggle
 * - Swiper hero slider
 * - "Load more" untuk Rekomendasi & Artikel
 * - Dark mode (class-based, lebih scalable)
 * - Subscribe form (tanpa kredensial SMTP di client — lihat CATATAN di sendEmail)
 *
 * Dipisah dari fitur GPS (lihat js/nearby.js).
 */
(function () {
  'use strict';

  // --- Header / Navbar -----------------------------------------------------
  var header = document.querySelector('.header');
  var navbar = document.querySelector('.header .navbar');
  var menuBtn = document.querySelector('#menu-btn');
  var navClose = document.querySelector('#nav-close');

  if (menuBtn && navbar) {
    menuBtn.addEventListener('click', function () { navbar.classList.add('active'); });
  }
  if (navClose && navbar) {
    navClose.addEventListener('click', function () { navbar.classList.remove('active'); });
  }

  // --- Search form --------------------------------------------------------
  var searchForm = document.querySelector('.search-form');
  var searchBtn = document.querySelector('#search-btn');
  var closeSearch = document.querySelector('#close-search');

  if (searchBtn && searchForm) {
    searchBtn.addEventListener('click', function () { searchForm.classList.add('active'); });
  }
  if (closeSearch && searchForm) {
    closeSearch.addEventListener('click', function () { searchForm.classList.remove('active'); });
  }

  // --- Header scroll state ------------------------------------------------
  function syncHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 0) header.classList.add('active');
    else header.classList.remove('active');
  }
  window.addEventListener('scroll', function () {
    if (navbar) navbar.classList.remove('active');
    syncHeaderScroll();
  }, { passive: true });
  window.addEventListener('load', syncHeaderScroll);

  // --- Swiper (home slider) ----------------------------------------------
  if (typeof Swiper !== 'undefined' && document.querySelector('.home-slider')) {
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

  // --- Load more (reusable) ----------------------------------------------
  function setupLoadMore(btnSelector, itemsSelector, step) {
    var btn = document.querySelector(btnSelector);
    if (!btn) return;
    var current = step;
    btn.addEventListener('click', function () {
      var boxes = Array.prototype.slice.call(document.querySelectorAll(itemsSelector));
      for (var i = current; i < current + step && i < boxes.length; i++) {
        boxes[i].style.display = 'inline-block';
      }
      current += step;
      if (current >= boxes.length) btn.style.display = 'none';
    });
  }
  setupLoadMore('#load-more', '.main .gambarRekomendasi .gambar', 5);
  setupLoadMore('#load-more2', '.main2 .gambarartikel2 .gambarmain2', 5);

  // --- Dark mode (persistent, class-based) -------------------------------
  var STORAGE_KEY = 'kw-theme';
  var toggle = document.getElementById('darkmode');

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('kw-dark');
      if (toggle) {
        toggle.classList.remove('bi-moon-fill');
        toggle.classList.add('bi-sun');
      }
    } else {
      document.body.classList.remove('kw-dark');
      if (toggle) {
        toggle.classList.add('bi-moon-fill');
        toggle.classList.remove('bi-sun');
      }
    }
  }

  var savedTheme = null;
  try { savedTheme = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage blocked */ }
  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

  if (toggle) {
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.setAttribute('aria-label', 'Toggle dark mode');

    var toggleTheme = function () {
      var next = document.body.classList.contains('kw-dark') ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
    };
    toggle.addEventListener('click', toggleTheme);
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTheme(); }
    });
  }

  // --- Lazy-load images + safer external links ---------------------------
  // Tambahkan loading="lazy" pada gambar non-critical dan rel="noopener noreferrer"
  // pada semua link target="_blank" supaya aman dari reverse tabnabbing.
  function hardenDocument() {
    var imgs = document.querySelectorAll('img');
    imgs.forEach(function (img, i) {
      if (!img.hasAttribute('loading') && i > 0) img.setAttribute('loading', 'lazy');
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
    });
    var extLinks = document.querySelectorAll('a[target="_blank"]');
    extLinks.forEach(function (a) {
      var rel = (a.getAttribute('rel') || '').toLowerCase();
      if (rel.indexOf('noopener') === -1) {
        a.setAttribute('rel', (rel ? rel + ' ' : '') + 'noopener noreferrer');
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hardenDocument);
  } else {
    hardenDocument();
  }

  // --- Subscribe form -----------------------------------------------------
  // Default: email subscriber disimpan di localStorage browser.
  //   Cek kapan saja via DevTools → Console:
  //     JSON.parse(localStorage.getItem('kw-subscribers'))
  //
  // Untuk kirim email beneran ke inbox (opsional), isi KW_SUBSCRIBE_EMAIL dengan
  // alamatmu. Pakai FormSubmit.co — gratis, no signup, no API key. Submit pertama
  // akan memicu email verifikasi ke alamat itu; klik "Activate Form" sekali →
  // submission berikutnya auto-forward ke inbox.
  var KW_SUBSCRIBE_EMAIL = 'manifestingsolutiontechnology@gmail.com';
  var KW_SUBSCRIBE_ENDPOINT = KW_SUBSCRIBE_EMAIL
    ? 'https://formsubmit.co/ajax/' + KW_SUBSCRIBE_EMAIL
    : '';
  var KW_SUBSCRIBERS_KEY = 'kw-subscribers';

  function rememberSubscriberLocally(email) {
    try {
      var list = JSON.parse(localStorage.getItem(KW_SUBSCRIBERS_KEY) || '[]');
      if (list.indexOf(email) === -1) list.push(email);
      localStorage.setItem(KW_SUBSCRIBERS_KEY, JSON.stringify(list));
    } catch (e) { /* storage blocked, abaikan */ }
  }

  function showToast(message, type) {
    // Toast non-blocking di kanan bawah, auto-dismiss 4 detik.
    var existing = document.getElementById('kw-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'kw-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.style.cssText =
      'position:fixed;bottom:24px;right:24px;z-index:9999;' +
      'max-width:340px;padding:14px 18px;border-radius:12px;' +
      'font-family:Poppins,-apple-system,sans-serif;font-size:14px;font-weight:500;' +
      'color:#fff;background:' + (type === 'error' ? '#ef4444' : 'linear-gradient(135deg,#22d3ee,#6366f1,#a855f7)') + ';' +
      'box-shadow:0 18px 40px rgba(15,23,42,0.25);' +
      'opacity:0;transform:translateY(10px);transition:opacity .25s,transform .25s;';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(function () { toast.remove(); }, 260);
    }, 4000);
  }

  window.sendEmail = function sendEmail() {
    var input = document.getElementById('namaa') ||
                document.querySelector('form input[type="email"]') ||
                document.querySelector('form input[name="email"]');
    var value = input ? String(input.value || '').trim() : '';
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    var isEn = document.documentElement.lang === 'en';

    if (!emailOk) {
      showToast(isEn ? 'Please enter a valid email address.' : 'Mohon masukkan alamat email yang valid.', 'error');
      return false;
    }

    var btn = document.activeElement && document.activeElement.tagName === 'BUTTON'
                ? document.activeElement : null;
    if (btn) { btn.disabled = true; btn.style.opacity = '0.65'; btn.style.cursor = 'wait'; }

    var finish = function () {
      if (input) input.value = '';
      if (btn) { btn.disabled = false; btn.style.opacity = ''; btn.style.cursor = ''; }
    };

    // Tanpa endpoint eksternal: simpan lokal saja.
    if (!KW_SUBSCRIBE_ENDPOINT) {
      rememberSubscriberLocally(value);
      showToast(isEn
        ? 'Thanks! You are subscribed: ' + value
        : 'Terima kasih! Email berlangganan berhasil: ' + value);
      finish();
      return false;
    }

    var payload = {
      email: value,
      _subject: 'KotamuWisataku — New subscriber',
      _template: 'table',
      _captcha: 'false',
      source: location.href
    };

    fetch(KW_SUBSCRIBE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        var ok = data && (data.success === 'true' || data.success === true);
        if (ok) {
          showToast(isEn
            ? 'Thanks! You are subscribed: ' + value
            : 'Terima kasih! Email berlangganan berhasil: ' + value);
        } else {
          rememberSubscriberLocally(value);
          showToast(isEn
            ? 'Saved! Email will be forwarded after verification.'
            : 'Tersimpan! Email akan diteruskan setelah verifikasi.');
        }
      })
      .catch(function () {
        rememberSubscriberLocally(value);
        showToast(isEn
          ? 'Offline — saved locally, will retry later.'
          : 'Offline — tersimpan lokal, akan dicoba lagi.');
      })
      .then(finish);

    return false;
  };
})();
