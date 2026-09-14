(function () {
  'use strict';

  const params = new URLSearchParams(location.search);
  const destinationId = params.get('id');
  const LANG = params.get('lang') === 'en' ? 'en' : 'id';

  const TEXT = {
    id: {
      notFound: 'Destinasi tidak ditemukan',
      notFoundBody: 'Tautan yang kamu buka tidak mengarah ke destinasi yang kami kenal.',
      home: 'Kembali ke beranda',
      breadcrumbHome: 'Beranda',
      breadcrumbList: 'Rekomendasi',
      about: 'Tentang Destinasi',
      location: 'Lokasi',
      openMaps: 'Buka di Google Maps',
      nearby: 'Destinasi Lain di Sekitar',
      km: 'km',
      chooseLanguage: 'Pilih bahasa',
    },
    en: {
      notFound: 'Destination not found',
      notFoundBody: 'The link you opened does not point to a destination we know.',
      home: 'Back to home',
      breadcrumbHome: 'Home',
      breadcrumbList: 'Recommendations',
      about: 'About This Destination',
      location: 'Location',
      openMaps: 'Open in Google Maps',
      nearby: 'Other Destinations Nearby',
      km: 'km',
      chooseLanguage: 'Choose language',
    },
  }[LANG];

  const FLAGS = {
    id: { image: 'img/indonesia', alt: 'Bendera Indonesia', name: 'Bahasa Indonesia', code: 'ID' },
    en: { image: 'img/eng', alt: 'Bendera Inggris', name: 'English', code: 'EN' },
  };

  const HOME = LANG === 'en' ? 'English.html' : 'index.html';
  const OTHER_LANG = LANG === 'en' ? 'id' : 'en';
  const NEARBY_LIMIT = 6;
  const EARTH_RADIUS_KM = 6371;

  const escape = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const detailUrl = (dest, lang = LANG) =>
    `wisata.html?id=${encodeURIComponent(dest.id)}${lang === 'en' ? '&lang=en' : ''}`;

  const mapsUrl = (dest) =>
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${dest.lat},${dest.lng}`)}`;

  const describe = (dest) =>
    LANG === 'en' ? dest.descEn || dest.desc || '' : dest.desc || '';

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  function distanceInKm(fromLat, fromLng, toLat, toLng) {
    const deltaLat = toRadians(toLat - fromLat);
    const deltaLng = toRadians(toLng - fromLng);
    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) * Math.sin(deltaLng / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
  }

  const nearestOthers = (dest, limit) =>
    (window.KW_DESTINATIONS || [])
      .filter((other) => other.id !== dest.id)
      .map((other) => ({ dest: other, km: distanceInKm(dest.lat, dest.lng, other.lat, other.lng) }))
      .sort((a, b) => a.km - b.km)
      .slice(0, limit);

  const formatKm = (km) => `${km.toFixed(km < 10 ? 1 : 0)} ${escape(TEXT.km)}`;

  const nearbyCard = ({ dest, km }) => `
    <li>
      <a href="${escape(detailUrl(dest))}">
        <img src="${escape(dest.image)}" alt="" width="160" height="110" loading="lazy" decoding="async">
        <span class="kw-detail-nearby-name">${escape(dest.name)}</span>
        <span class="kw-detail-nearby-meta">${escape(dest.region)} · ${formatKm(km)}</span>
      </a>
    </li>`;

  function renderNotFound(host) {
    document.title = `${TEXT.notFound} — KotamuWisataku`;
    host.innerHTML = `
      <div class="kw-detail-empty">
        <h1>${escape(TEXT.notFound)}</h1>
        <p>${escape(TEXT.notFoundBody)}</p>
        <a class="kw-detail-btn" href="${HOME}">
          <i class="bi bi-house-door" aria-hidden="true"></i> ${escape(TEXT.home)}
        </a>
      </div>`;
  }

  function render(host, dest) {
    document.documentElement.lang = LANG;
    document.title = `${dest.name} — KotamuWisataku`;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', describe(dest).slice(0, 155));

    host.innerHTML = `
      <nav class="kw-detail-crumbs" aria-label="breadcrumb">
        <a href="${HOME}">${escape(TEXT.breadcrumbHome)}</a>
        <span aria-hidden="true">›</span>
        <a href="${HOME}#Rekomendasi">${escape(TEXT.breadcrumbList)}</a>
        <span aria-hidden="true">›</span>
        <span aria-current="page">${escape(dest.name)}</span>
      </nav>

      <header class="kw-detail-head">
        <h1>${escape(dest.name)}</h1>
        <p class="kw-detail-region">
          <i class="bi bi-geo-alt-fill" aria-hidden="true"></i> ${escape(dest.region)}
        </p>
      </header>

      <img class="kw-detail-hero" src="${escape(dest.image)}" alt="${escape(dest.name)}"
           width="1200" height="675" decoding="async">

      <section class="kw-detail-section">
        <h2>${escape(TEXT.about)}</h2>
        <p>${escape(describe(dest))}</p>
      </section>

      <section class="kw-detail-section">
        <h2>${escape(TEXT.location)}</h2>
        <div id="kw-detail-map" class="kw-detail-map" role="application"
             aria-label="${escape(`${TEXT.location} ${dest.name}`)}"></div>
        <a class="kw-detail-btn" href="${escape(mapsUrl(dest))}" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-compass" aria-hidden="true"></i> ${escape(TEXT.openMaps)}
        </a>
      </section>

      <section class="kw-detail-section">
        <h2>${escape(TEXT.nearby)}</h2>
        <ul class="kw-detail-nearby">
          ${nearestOthers(dest, NEARBY_LIMIT).map(nearbyCard).join('')}
        </ul>
      </section>`;

    initMap(dest);
  }

  function initMap(dest) {
    if (typeof L === 'undefined') return;

    const el = document.getElementById('kw-detail-map');
    const alreadyInitialised = el && el._leaflet_id;
    if (!el || alreadyInitialised) return;

    const latlng = [dest.lat, dest.lng];
    const map = L.map(el).setView(latlng, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker(latlng).addTo(map).bindPopup(`<b>${escape(dest.name)}</b>`).openPopup();

    L.circle(latlng, {
      color: '#62bae7',
      fillColor: '#62bae7',
      fillOpacity: 0.2,
      radius: 600,
    }).addTo(map);
  }

  function paintFlag(host, flag) {
    const img = host.querySelector('img');
    const source = host.querySelector('source');
    if (img) {
      img.src = `${flag.image}.png`;
      img.alt = flag.alt;
    }
    if (source) source.srcset = `${flag.image}.webp`;
  }

  function wireLanguageMenu(dest) {
    const button = document.getElementById('kw-lang-btn');
    const otherLink = document.getElementById('kw-lang-alt');

    if (button) {
      paintFlag(button, FLAGS[LANG]);
      const code = button.querySelector('.kw-lang-code');
      if (code) code.textContent = FLAGS[LANG].code;
      button.setAttribute('aria-label', TEXT.chooseLanguage);
    }

    if (otherLink) {
      paintFlag(otherLink, FLAGS[OTHER_LANG]);
      const name = otherLink.querySelector('.kw-lang-name');
      if (name) name.textContent = FLAGS[OTHER_LANG].name;
      otherLink.setAttribute('hreflang', OTHER_LANG);
      otherLink.setAttribute('lang', OTHER_LANG);
      otherLink.href = dest
        ? detailUrl(dest, OTHER_LANG)
        : (OTHER_LANG === 'en' ? 'English.html' : 'index.html');
    }
  }

  function boot() {
    const host = document.getElementById('kw-detail');
    if (!host) return;

    const dest = (window.KW_DESTINATIONS || []).find((d) => d.id === destinationId);

    wireLanguageMenu(dest);
    if (dest) render(host, dest);
    else renderNotFound(host);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
