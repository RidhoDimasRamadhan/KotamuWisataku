/**
 * Halaman detail destinasi (wisata.html).
 *
 * Seluruh isi dirender dari data/destinations.js berdasarkan query string:
 *
 *   wisata.html?id=borobudur          → Bahasa Indonesia
 *   wisata.html?id=borobudur&lang=en  → English
 *
 * Satu halaman ini melayani ke-97 destinasi, jadi tidak perlu membuat file
 * HTML per tempat. Kalau id tidak dikenal, tampilkan pesan yang jelas, bukan
 * halaman kosong.
 */
(function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  var id = params.get('id');
  var LANG = params.get('lang') === 'en' ? 'en' : 'id';

  var T = {
    id: {
      notFound: 'Destinasi tidak ditemukan',
      notFoundBody: 'Tautan yang kamu buka tidak mengarah ke destinasi yang kami kenal.',
      home: 'Kembali ke beranda',
      breadcrumbHome: 'Beranda',
      breadcrumbList: 'Rekomendasi',
      about: 'Tentang Destinasi',
      location: 'Lokasi',
      directions: 'Petunjuk Arah',
      openMaps: 'Buka di Google Maps',
      nearby: 'Destinasi Lain di Sekitar',
      km: 'km'
    },
    en: {
      notFound: 'Destination not found',
      notFoundBody: 'The link you opened does not point to a destination we know.',
      home: 'Back to home',
      breadcrumbHome: 'Home',
      breadcrumbList: 'Recommendations',
      about: 'About This Destination',
      location: 'Location',
      directions: 'Directions',
      openMaps: 'Open in Google Maps',
      nearby: 'Other Destinations Nearby',
      km: 'km'
    }
  }[LANG];

  var HOME = LANG === 'en' ? 'English.html' : 'index.html';

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function detailUrl(dest) {
    return 'wisata.html?id=' + encodeURIComponent(dest.id) +
           (LANG === 'en' ? '&lang=en' : '');
  }

  function mapsUrl(dest) {
    return 'https://www.google.com/maps/dir/?api=1&destination=' +
           encodeURIComponent(dest.lat + ',' + dest.lng);
  }

  function describe(dest) {
    return LANG === 'en' ? (dest.descEn || dest.desc || '') : (dest.desc || '');
  }

  /** Jarak garis lurus, dipakai hanya untuk mengurutkan destinasi terdekat. */
  function haversine(lat1, lng1, lat2, lng2) {
    var R = 6371;
    var toRad = function (x) { return (x * Math.PI) / 180; };
    var dLat = toRad(lat2 - lat1);
    var dLng = toRad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  function nearestOthers(dest, limit) {
    return (window.KW_DESTINATIONS || [])
      .filter(function (d) { return d.id !== dest.id; })
      .map(function (d) {
        return { dest: d, km: haversine(dest.lat, dest.lng, d.lat, d.lng) };
      })
      .sort(function (a, b) { return a.km - b.km; })
      .slice(0, limit);
  }

  function renderNotFound(host) {
    document.title = T.notFound + ' — KotamuWisataku';
    host.innerHTML =
      '<div class="kw-detail-empty">' +
        '<h1>' + esc(T.notFound) + '</h1>' +
        '<p>' + esc(T.notFoundBody) + '</p>' +
        '<a class="kw-detail-btn" href="' + HOME + '">' +
          '<i class="bi bi-house-door" aria-hidden="true"></i> ' + esc(T.home) +
        '</a>' +
      '</div>';
  }

  function render(host, dest) {
    document.documentElement.lang = LANG;
    document.title = dest.name + ' — KotamuWisataku';

    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', describe(dest).slice(0, 155));

    host.innerHTML =
      '<nav class="kw-detail-crumbs" aria-label="breadcrumb">' +
        '<a href="' + HOME + '">' + esc(T.breadcrumbHome) + '</a>' +
        '<span aria-hidden="true">›</span>' +
        '<a href="' + HOME + '#Rekomendasi">' + esc(T.breadcrumbList) + '</a>' +
        '<span aria-hidden="true">›</span>' +
        '<span aria-current="page">' + esc(dest.name) + '</span>' +
      '</nav>' +

      '<header class="kw-detail-head">' +
        '<h1>' + esc(dest.name) + '</h1>' +
        '<p class="kw-detail-region">' +
          '<i class="bi bi-geo-alt-fill" aria-hidden="true"></i> ' + esc(dest.region) +
        '</p>' +
      '</header>' +

      '<img class="kw-detail-hero" src="' + esc(dest.image) + '" alt="' + esc(dest.name) + '" ' +
           'width="1200" height="675" decoding="async">' +

      '<section class="kw-detail-section">' +
        '<h2>' + esc(T.about) + '</h2>' +
        '<p>' + esc(describe(dest)) + '</p>' +
      '</section>' +

      '<section class="kw-detail-section">' +
        '<h2>' + esc(T.location) + '</h2>' +
        '<div id="kw-detail-map" class="kw-detail-map" role="application" ' +
             'aria-label="' + esc(T.location + ' ' + dest.name) + '"></div>' +
        '<a class="kw-detail-btn" href="' + esc(mapsUrl(dest)) + '" ' +
           'target="_blank" rel="noopener noreferrer">' +
          '<i class="bi bi-compass" aria-hidden="true"></i> ' + esc(T.openMaps) +
        '</a>' +
      '</section>' +

      '<section class="kw-detail-section">' +
        '<h2>' + esc(T.nearby) + '</h2>' +
        '<ul class="kw-detail-nearby">' +
          nearestOthers(dest, 6).map(function (n) {
            return '<li><a href="' + esc(detailUrl(n.dest)) + '">' +
                     '<img src="' + esc(n.dest.image) + '" alt="" width="160" height="110" loading="lazy" decoding="async">' +
                     '<span class="kw-detail-nearby-name">' + esc(n.dest.name) + '</span>' +
                     '<span class="kw-detail-nearby-meta">' + esc(n.dest.region) + ' · ' +
                       n.km.toFixed(n.km < 10 ? 1 : 0) + ' ' + esc(T.km) +
                     '</span>' +
                   '</a></li>';
          }).join('') +
        '</ul>' +
      '</section>';

    initMap(dest);
  }

  function initMap(dest) {
    if (typeof L === 'undefined') return;
    var el = document.getElementById('kw-detail-map');
    if (!el || el._leaflet_id) return;

    var latlng = [dest.lat, dest.lng];
    var map = L.map(el).setView(latlng, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.marker(latlng).addTo(map).bindPopup('<b>' + esc(dest.name) + '</b>').openPopup();
    L.circle(latlng, {
      color: '#62bae7', fillColor: '#62bae7', fillOpacity: 0.2, radius: 600
    }).addTo(map);
  }

  /**
   * Pemilih bahasa di halaman ini dinamis: bendera pada tombol mengikuti
   * bahasa yang sedang dibuka, dan pilihan di dalam menu menunjuk destinasi
   * yang sama dalam bahasa satunya — jadi berpindah bahasa tidak membuang
   * halaman yang sedang dibaca.
   */
  function wireLanguageLinks(dest) {
    var btn = document.getElementById('kw-lang-btn');
    var alt = document.getElementById('kw-lang-alt');
    var other = LANG === 'en' ? 'id' : 'en';

    var FLAG = {
      id: { img: 'img/indonesia', alt: 'Bendera Indonesia', name: 'Bahasa Indonesia', code: 'ID' },
      en: { img: 'img/eng', alt: 'Bendera Inggris', name: 'English', code: 'EN' }
    };

    function paint(host, cfg) {
      var img = host.querySelector('img');
      var src = host.querySelector('source');
      if (img) { img.src = cfg.img + '.png'; img.alt = cfg.alt; }
      if (src) src.srcset = cfg.img + '.webp';
    }

    if (btn) {
      paint(btn, FLAG[LANG]);
      var code = btn.querySelector('.kw-lang-code');
      if (code) code.textContent = FLAG[LANG].code;
      btn.setAttribute('aria-label', LANG === 'en' ? 'Choose language' : 'Pilih bahasa');
    }

    if (alt) {
      paint(alt, FLAG[other]);
      var name = alt.querySelector('.kw-lang-name');
      if (name) name.textContent = FLAG[other].name;
      alt.setAttribute('hreflang', other);
      alt.setAttribute('lang', other);
      alt.href = dest
        ? 'wisata.html?id=' + encodeURIComponent(dest.id) + (other === 'en' ? '&lang=en' : '')
        : (other === 'en' ? 'English.html' : 'index.html');
    }
  }

  function boot() {
    var host = document.getElementById('kw-detail');
    if (!host) return;

    var dest = (window.KW_DESTINATIONS || []).filter(function (d) {
      return d.id === id;
    })[0];

    wireLanguageLinks(dest);
    if (dest) render(host, dest);
    else renderNotFound(host);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
