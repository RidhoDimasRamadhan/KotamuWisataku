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
      province: 'Provinsi',
      category: 'Kategori',
      timezone: 'Zona waktu',
      coordinates: 'Koordinat',
      about: 'Tentang Destinasi',
      why: 'Kenapa Layak Dikunjungi',
      doing: 'Yang Bisa Kamu Lakukan',
      timing: 'Waktu Terbaik Berkunjung',
      season:
        'Secara umum musim kemarau di Indonesia berlangsung sekitar April hingga Oktober, sedangkan musim hujan November hingga Maret. Rentang kemarau biasanya paling aman untuk menyusun rencana perjalanan.',
      tips: 'Tips Berkunjung',
      location: 'Lokasi & Cara ke Sana',
      openMaps: 'Buka di Google Maps',
      reference: 'Titik Acuan Terdekat',
      nearby: 'Destinasi Lain di Sekitar',
      more: 'Jelajahi',
      km: 'km',
      chooseLanguage: 'Pilih bahasa',
      directions: ['utara', 'timur laut', 'timur', 'tenggara', 'selatan', 'barat daya', 'barat', 'barat laut'],
      compass: { north: 'LU', south: 'LS', east: 'BT', west: 'BB' },
      locationLead: (name, region, coords, zone) =>
        `${name} berada di ${region}, tepatnya pada koordinat ${coords}, dan mengikuti zona waktu ${zone}.`,
      referenceLead:
        'Beberapa destinasi lain dalam daftar kami bisa dipakai sebagai patokan jarak saat menyusun rute:',
      referenceItem: (name, km, direction) => `${name} — sekitar ${km} ke arah ${direction}`,
      moreLead: (province) => `Destinasi lain yang berada di ${province}:`,
    },
    en: {
      notFound: 'Destination not found',
      notFoundBody: 'The link you opened does not point to a destination we know.',
      home: 'Back to home',
      breadcrumbHome: 'Home',
      breadcrumbList: 'Recommendations',
      province: 'Province',
      category: 'Category',
      timezone: 'Time zone',
      coordinates: 'Coordinates',
      about: 'About This Destination',
      why: 'Why It Is Worth Visiting',
      doing: 'Things You Can Do',
      timing: 'Best Time to Visit',
      season:
        'Broadly speaking, the dry season in Indonesia runs from around April to October, while the rainy season falls between November and March. The dry months are usually the safest window to plan a trip around.',
      tips: 'Visiting Tips',
      location: 'Location & Getting There',
      openMaps: 'Open in Google Maps',
      reference: 'Nearest Reference Points',
      nearby: 'Other Destinations Nearby',
      more: 'Explore',
      km: 'km',
      chooseLanguage: 'Choose language',
      directions: ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'],
      compass: { north: 'N', south: 'S', east: 'E', west: 'W' },
      locationLead: (name, region, coords, zone) =>
        `${name} sits in ${region}, at coordinates ${coords}, and follows the ${zone} time zone.`,
      referenceLead:
        'A few other destinations in our list make useful distance markers while you plan a route:',
      referenceItem: (name, km, direction) => `${name} — roughly ${km} to the ${direction}`,
      moreLead: (province) => `Other destinations in ${province}:`,
    },
  }[LANG];

  const FLAG_ALT = {
    id: { id: 'Bendera Indonesia', en: 'Bendera Inggris' },
    en: { id: 'Indonesian flag', en: 'English flag' },
  }[LANG];

  const FLAGS = {
    id: { image: 'img/indonesia', alt: FLAG_ALT.id, name: 'Bahasa Indonesia', code: 'ID' },
    en: { image: 'img/eng', alt: FLAG_ALT.en, name: 'English', code: 'EN' },
  };

  const HOME = LANG === 'en' ? 'English.html' : 'index.html';
  const OTHER_LANG = LANG === 'en' ? 'id' : 'en';
  const NEARBY_LIMIT = 6;
  const REFERENCE_LIMIT = 3;
  const PROVINCE_LIMIT = 6;
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

  const provinceOf = (dest) => String(dest.region || '').split(',').pop().trim();

  const timeZoneOf = (dest) => {
    if (dest.lng < 114.7) return 'WIB (UTC+7)';
    if (dest.lng < 127) return 'WITA (UTC+8)';
    return 'WIT (UTC+9)';
  };

  const formatCoordinates = (dest) => {
    const lat = `${Math.abs(dest.lat).toFixed(4)}° ${dest.lat < 0 ? TEXT.compass.south : TEXT.compass.north}`;
    const lng = `${Math.abs(dest.lng).toFixed(4)}° ${dest.lng < 0 ? TEXT.compass.west : TEXT.compass.east}`;
    return `${lat}, ${lng}`;
  };

  const guideOf = (dest) => {
    const haystack = `${dest.name} ${dest.region}`.toLowerCase();
    const rule = (window.KW_GUIDE_RULES || []).find(([, keywords]) =>
      keywords.some((keyword) => haystack.includes(keyword))
    );
    const guides = window.KW_GUIDES || {};
    const entry = guides[rule ? rule[0] : 'umum'] || guides.umum;
    return entry ? entry[LANG] : null;
  };

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  function distanceInKm(fromLat, fromLng, toLat, toLng) {
    const deltaLat = toRadians(toLat - fromLat);
    const deltaLng = toRadians(toLng - fromLng);
    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) * Math.sin(deltaLng / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
  }

  function bearingLabel(from, to) {
    const y = Math.sin(toRadians(to.lng - from.lng)) * Math.cos(toRadians(to.lat));
    const x =
      Math.cos(toRadians(from.lat)) * Math.sin(toRadians(to.lat)) -
      Math.sin(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.cos(toRadians(to.lng - from.lng));
    const degrees = (Math.atan2(y, x) * 180) / Math.PI;
    const index = Math.round(((degrees + 360) % 360) / 45) % 8;
    return TEXT.directions[index];
  }

  const allDestinations = () => window.KW_DESTINATIONS || [];

  const nearestOthers = (dest, limit) =>
    allDestinations()
      .filter((other) => other.id !== dest.id)
      .map((other) => ({ dest: other, km: distanceInKm(dest.lat, dest.lng, other.lat, other.lng) }))
      .sort((a, b) => a.km - b.km)
      .slice(0, limit);

  const sameProvince = (dest, limit) =>
    allDestinations()
      .filter((other) => other.id !== dest.id && provinceOf(other) === provinceOf(dest))
      .slice(0, limit);

  const formatKm = (km) => `${km.toFixed(km < 10 ? 1 : 0)} ${TEXT.km}`;

  const factItem = (label, value) =>
    `<li><span class="kw-fact-label">${escape(label)}</span><strong class="kw-fact-value">${escape(value)}</strong></li>`;

  const listItems = (items, className) =>
    `<ul class="${className}">${items.map((item) => `<li>${escape(item)}</li>`).join('')}</ul>`;

  const cardItem = (dest, meta) => `
    <li>
      <a href="${escape(detailUrl(dest))}">
        <img src="${escape(dest.image)}" alt="" width="320" height="220" loading="lazy" decoding="async">
        <span class="kw-detail-nearby-name">${escape(dest.name)}</span>
        <span class="kw-detail-nearby-meta">${escape(meta)}</span>
      </a>
    </li>`;

  function referenceSection(dest) {
    const points = nearestOthers(dest, REFERENCE_LIMIT);
    if (!points.length) return '';

    const items = points.map(({ dest: other, km }) =>
      TEXT.referenceItem(other.name, formatKm(km), bearingLabel(dest, other))
    );

    return `
      <h3>${escape(TEXT.reference)}</h3>
      <p>${escape(TEXT.referenceLead)}</p>
      ${listItems(items, 'kw-article-list')}`;
  }

  function provinceSection(dest) {
    const others = sameProvince(dest, PROVINCE_LIMIT);
    if (!others.length) return '';

    const province = provinceOf(dest);
    return `
      <section class="kw-detail-section">
        <h2>${escape(`${TEXT.more} ${province}`)}</h2>
        <p>${escape(TEXT.moreLead(province))}</p>
        <ul class="kw-detail-nearby">
          ${others.map((other) => cardItem(other, other.region)).join('')}
        </ul>
      </section>`;
  }

  function articleSection(dest, guide) {
    if (!guide) return '';

    return `
      <h2>${escape(TEXT.why)}</h2>
      <p>${escape(guide.why)}</p>

      <h2>${escape(TEXT.doing)}</h2>
      ${listItems(guide.activities, 'kw-article-list kw-article-ticks')}

      <h2>${escape(TEXT.timing)}</h2>
      <p>${escape(TEXT.season)}</p>
      <p>${escape(guide.timing)}</p>

      <h2>${escape(TEXT.tips)}</h2>
      <ol class="kw-article-steps">${guide.tips.map((tip) => `<li>${escape(tip)}</li>`).join('')}</ol>`;
  }

  function renderNotFound(host) {
    document.title = `${TEXT.notFound} — KotamuWisataku`;
    setMeta('meta[property="og:title"]', document.title);
    setMeta('meta[property="og:description"]', TEXT.notFoundBody);
    host.innerHTML = `
      <div class="kw-detail-body">
        <div class="kw-detail-empty">
          <h1>${escape(TEXT.notFound)}</h1>
          <p>${escape(TEXT.notFoundBody)}</p>
          <a class="kw-detail-btn" href="${HOME}">
            <i class="bi bi-house-door" aria-hidden="true"></i> ${escape(TEXT.home)}
          </a>
        </div>
      </div>`;
  }

  function setMeta(selector, value) {
    const tag = document.querySelector(selector);
    if (tag) tag.setAttribute('content', value);
  }

  function paintMetadata(dest) {
    const title = `${dest.name} — KotamuWisataku`;
    const summary = describe(dest).slice(0, 155);
    const image = new URL(dest.image, location.href).href;

    document.title = title;

    setMeta('meta[name="description"]', summary);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', summary);
    setMeta('meta[property="og:image"]', image);
    setMeta('meta[property="og:image:alt"]', dest.name);
    setMeta('meta[property="og:url"]', location.href);
    setMeta('meta[property="og:locale"]', LANG === 'en' ? 'en_US' : 'id_ID');
    setMeta('meta[property="og:locale:alternate"]', LANG === 'en' ? 'id_ID' : 'en_US');
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', summary);
    setMeta('meta[name="twitter:image"]', image);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = location.href;

    const alternate = document.querySelector('link[rel="alternate"]');
    if (alternate) {
      alternate.href = new URL(detailUrl(dest, OTHER_LANG), location.href).href;
      alternate.hreflang = OTHER_LANG;
    }
  }

  function paintStructuredData(dest) {
    const previous = document.getElementById('kw-jsonld');
    if (previous) previous.remove();

    const absolute = (value) => new URL(value, location.href).href;
    const home = absolute(HOME);

    const data = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'TouristAttraction',
          name: dest.name,
          description: describe(dest),
          image: absolute(dest.image),
          url: location.href,
          inLanguage: LANG === 'en' ? 'en-US' : 'id-ID',
          geo: { '@type': 'GeoCoordinates', latitude: dest.lat, longitude: dest.lng },
          address: {
            '@type': 'PostalAddress',
            addressLocality: String(dest.region || '').split(',')[0].trim(),
            addressRegion: provinceOf(dest),
            addressCountry: 'ID',
          },
          hasMap: mapsUrl(dest),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: TEXT.breadcrumbHome, item: home },
            { '@type': 'ListItem', position: 2, name: TEXT.breadcrumbList, item: `${home}#Rekomendasi` },
            { '@type': 'ListItem', position: 3, name: dest.name, item: location.href },
          ],
        },
      ],
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'kw-jsonld';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function render(host, dest) {
    document.documentElement.lang = LANG;
    paintMetadata(dest);
    paintStructuredData(dest);

    const guide = guideOf(dest);
    const coordinates = formatCoordinates(dest);
    const zone = timeZoneOf(dest);

    host.innerHTML = `
      <figure class="kw-hero">
        <img src="${escape(dest.image)}" alt="${escape(dest.name)}" width="1600" height="900"
             fetchpriority="high" decoding="async">
      </figure>

      <div class="kw-detail-body">
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
          <ul class="kw-facts">
            ${factItem(TEXT.province, provinceOf(dest))}
            ${guide ? factItem(TEXT.category, guide.label) : ''}
            ${factItem(TEXT.timezone, zone)}
            ${factItem(TEXT.coordinates, coordinates)}
          </ul>
        </header>

        <article class="kw-article">
          <h2>${escape(TEXT.about)}</h2>
          <p class="kw-article-lead">${escape(describe(dest))}</p>
          ${articleSection(dest, guide)}

          <h2>${escape(TEXT.location)}</h2>
          <p>${escape(TEXT.locationLead(dest.name, dest.region, coordinates, zone))}</p>
          <div id="kw-detail-map" class="kw-detail-map" role="application"
               aria-label="${escape(`${TEXT.location} ${dest.name}`)}"></div>
          <a class="kw-detail-btn" href="${escape(mapsUrl(dest))}" target="_blank" rel="noopener noreferrer">
            <i class="bi bi-compass" aria-hidden="true"></i> ${escape(TEXT.openMaps)}
          </a>
          ${referenceSection(dest)}
        </article>

        <section class="kw-detail-section">
          <h2>${escape(TEXT.nearby)}</h2>
          <ul class="kw-detail-nearby">
            ${nearestOthers(dest, NEARBY_LIMIT)
              .map(({ dest: other, km }) => cardItem(other, `${other.region} · ${formatKm(km)}`))
              .join('')}
          </ul>
        </section>

        ${provinceSection(dest)}
      </div>`;

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

    const dest = allDestinations().find((d) => d.id === destinationId);

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
