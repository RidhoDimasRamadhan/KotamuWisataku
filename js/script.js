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
  // CATATAN: sebelumnya fungsi ini mengirim email dari client pakai SMTP.js
  // dengan Host/Username/Password *hard-coded* di source → ini bocor kredensial.
  // Password lama SUDAH DIHAPUS. Implementasi real harus pakai backend endpoint.
  // Untuk saat ini: validasi email & tampilkan konfirmasi UI.
  window.sendEmail = function sendEmail() {
    var input = document.getElementById('namaa') ||
                document.querySelector('form input[type="email"]') ||
                document.querySelector('form input[name="email"]');
    var value = input ? String(input.value || '').trim() : '';
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!emailOk) {
      alert(document.documentElement.lang === 'en'
        ? 'Please enter a valid email address.'
        : 'Mohon masukkan alamat email yang valid.');
      return false;
    }

    // TODO: ganti dengan fetch ke backend endpoint (mis. /api/subscribe).
    alert(document.documentElement.lang === 'en'
      ? 'Thanks! You are subscribed: ' + value
      : 'Terima kasih! Email berlangganan: ' + value);

    if (input) input.value = '';
    return false;
  };
})();
