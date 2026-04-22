/**
 * Nearby Wisata — fitur utama KotamuWisataku.
 * Minta izin GPS, deteksi wisata terdekat, tampilkan di peta gaya "radar",
 * dan sediakan tombol arah (Google Maps directions).
 *
 * Dependencies: Leaflet (di-load via CDN di HTML), window.KW_DESTINATIONS (data/destinations.js).
 * Opsi bahasa: set window.KW_LANG = 'en' | 'id' sebelum script ini dieksekusi.
 */
(function () {
  'use strict';

  var LANG = (window.KW_LANG === 'en') ? 'en' : 'id';

  var I18N = {
    id: {
      modalTitle: 'Temukan Wisata Terdekat',
      modalDesc: 'Izinkan akses lokasi untuk melihat wisata terdekat di sekitarmu — gaya radar. Kami tidak menyimpan lokasimu.',
      allow: 'Izinkan Lokasi',
      skip: 'Nanti Saja',
      locating: 'Mencari posisimu...',
      denied: 'Akses lokasi ditolak. Menampilkan wisata di sekitar Jakarta.',
      unsupported: 'Peramban tidak mendukung GPS. Menampilkan wisata di sekitar Jakarta.',
      fallback: 'Jakarta (default)',
      yourLocation: 'Kamu di sini',
      scanning: 'Memindai wisata di sekitarmu',
      nearest: 'Wisata Terdekat',
      direction: 'Arahkan',
      km: 'km',
      retry: 'Aktifkan GPS',
      min: 'mnt',
      hr: 'jam',
      modeLabel: 'Mode',
      modeMotor: 'Motor',
      modeCar: 'Mobil',
      modeWalk: 'Jalan Kaki',
      modeBike: 'Sepeda'
    },
    en: {
      modalTitle: 'Find Nearby Attractions',
      modalDesc: 'Allow location access to see tourist spots around you — radar style. We do not store your location.',
      allow: 'Allow Location',
      skip: 'Skip',
      locating: 'Locating you...',
      denied: 'Location denied. Showing attractions around Jakarta.',
      unsupported: 'Your browser does not support GPS. Showing attractions around Jakarta.',
      fallback: 'Jakarta (default)',
      yourLocation: 'You are here',
      scanning: 'Scanning nearby attractions',
      nearest: 'Nearest Attractions',
      direction: 'Direction',
      km: 'km',
      retry: 'Enable GPS',
      min: 'min',
      hr: 'h',
      modeLabel: 'Mode',
      modeMotor: 'Motorcycle',
      modeCar: 'Car',
      modeWalk: 'Walking',
      modeBike: 'Cycling'
    }
  };

  /**
   * Travel modes untuk estimasi jarak/waktu + deep-link Google Maps.
   * factor = pengali Haversine ke estimasi jarak jalan (urban Indonesia).
   * speed  = km/jam rata-rata kondisi perkotaan.
   * gmap   = nilai `travelmode` untuk Google Maps URL.
   */
  var MODES = {
    motor: { key: 'motor', iconBi: 'bi-bicycle', factor: 1.40, speed: 30, gmap: 'driving' },
    car:   { key: 'car',   iconBi: 'bi-car-front-fill', factor: 1.50, speed: 22, gmap: 'driving' },
    walk:  { key: 'walk',  iconBi: 'bi-person-walking', factor: 1.20, speed: 5,  gmap: 'walking' },
    bike:  { key: 'bike',  iconBi: 'bi-bicycle', factor: 1.30, speed: 14, gmap: 'bicycling' }
  };
  var MODE_ORDER = ['motor', 'car', 'walk', 'bike'];
  var currentMode = 'motor';

  var t = I18N[LANG];

  var DEFAULT_LOCATION = { lat: -6.2088, lng: 106.8456, label: t.fallback };
  var RESULT_LIMIT = 15;

  // --- Helpers ---------------------------------------------------------------

  function haversine(lat1, lng1, lat2, lng2) {
    var R = 6371; // km
    var toRad = function (x) { return (x * Math.PI) / 180; };
    var dLat = toRad(lat2 - lat1);
    var dLng = toRad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  /**
   * Peta id → filename Wikimedia Commons yang SUDAH diverifikasi (HTTP 200).
   * Untuk id lain, pakai loremflickr.com dengan tag otomatis dari nama.
   */
  var WIKIMEDIA_IMAGES = {
    'monas':       'Monas.jpg',
    'borobudur':   'Borobudur-Nothwest-view.jpg',
    'prambanan':   'Prambanan_Trimurti.jpg',
    'bromo':       'Bromo_Sunrise.jpg',
    'merapi':      'Mount_Merapi.jpg',
    'ulun-danu':   'Pura_Ulun_Danu_Bratan.jpg',
    'tanah-lot':   'Tanah_Lot_Bali.jpg',
    'komodo':      'Komodo_Dragon.jpg',
    'labuan-bajo': 'Labuan_Bajo.jpg',
    'raja-ampat':  'Raja_Ampat.jpg',
    'toba':        'Lake_Toba.jpg'
  };

  /**
   * Bangun URL gambar per destinasi.
   *   1. Wikimedia Commons kalau destinasi ada di WIKIMEDIA_IMAGES (real photo)
   *   2. loremflickr.com dengan tag dari nama (real Flickr photo by tags)
   * Fallback ke dest.image (lokal) ditangani via onerror di <img> tag.
   */
  function resolveImageUrl(dest) {
    if (WIKIMEDIA_IMAGES[dest.id]) {
      return 'https://commons.wikimedia.org/wiki/Special:FilePath/' +
             encodeURIComponent(WIKIMEDIA_IMAGES[dest.id]) + '?width=500';
    }
    var tags = (dest.name || '')
      .toLowerCase()
      .replace(/[()'"]/g, '')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(function (w) { return w.length > 2; })
      .slice(0, 3)
      .join(',');
    if (!tags) tags = 'indonesia,tourism';
    else tags = tags + ',indonesia';
    return 'https://loremflickr.com/500/350/' + encodeURIComponent(tags);
  }

  /** Render <img> dengan source eksternal + fallback ke lokal kalau error. */
  function imgTag(dest, extraClass) {
    var ext = resolveImageUrl(dest);
    var fb = (dest.image || '').replace(/'/g, '&#39;');
    var cls = extraClass ? ' class="' + extraClass + '"' : '';
    return '<img' + cls + ' src="' + ext + '" alt="' + dest.name + '"' +
           (fb ? ' onerror="this.onerror=null;this.src=\'' + fb + '\'"' : '') +
           ' loading="lazy" decoding="async">';
  }

  function formatDistance(km) {
    if (km < 1) return Math.round(km * 1000) + ' m';
    if (km < 10) return km.toFixed(1) + ' ' + t.km;
    return Math.round(km) + ' ' + t.km;
  }

  function formatDuration(min) {
    if (!min || !isFinite(min)) return '';
    if (min < 60) return Math.max(1, Math.round(min)) + ' ' + t.min;
    var h = Math.floor(min / 60);
    var m = Math.round(min % 60);
    return h + ' ' + t.hr + (m ? ' ' + m + ' ' + t.min : '');
  }

  /** Hitung jarak & durasi estimasi untuk mode terpilih, berdasarkan Haversine. */
  function estimateForMode(havKm, modeKey) {
    var m = MODES[modeKey] || MODES.motor;
    var distKm = havKm * m.factor;
    var durMin = (distKm / m.speed) * 60;
    return { distance: distKm, duration: durMin };
  }

  function distanceChipHtml(d) {
    var est = estimateForMode(d.distance, currentMode);
    var dur = formatDuration(est.duration);
    var icon = MODES[currentMode].iconBi;
    return '<span class="kw-chip">' +
             '<i class="bi ' + icon + '"></i> ' +
             formatDistance(est.distance) +
             (dur ? ' · ' + dur : '') +
           '</span>';
  }

  function findNearest(userLat, userLng, limit) {
    var list = (window.KW_DESTINATIONS || []).map(function (d) {
      return Object.assign({}, d, { distance: haversine(userLat, userLng, d.lat, d.lng) });
    });
    list.sort(function (a, b) { return a.distance - b.distance; });
    return list.slice(0, limit || RESULT_LIMIT);
  }

  function directionsUrl(user, dest) {
    var origin = user ? (user.lat + ',' + user.lng) : '';
    var mode = MODES[currentMode] ? MODES[currentMode].gmap : 'driving';
    return 'https://www.google.com/maps/dir/?api=1' +
           (origin ? ('&origin=' + encodeURIComponent(origin)) : '') +
           '&destination=' + encodeURIComponent(dest.lat + ',' + dest.lng) +
           '&travelmode=' + mode;
  }

  function describe(dest) {
    return LANG === 'en' ? (dest.descEn || dest.desc || '') : (dest.desc || '');
  }

  // --- Permission Modal ------------------------------------------------------

  function showPermissionModal(onAllow, onSkip) {
    if (document.getElementById('kw-permission-modal')) return;

    var modal = document.createElement('div');
    modal.id = 'kw-permission-modal';
    modal.className = 'kw-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'kw-modal-title');
    modal.innerHTML =
      '<div class="kw-modal-card">' +
        '<div class="kw-radar-anim" aria-hidden="true"><span></span><span></span><span></span></div>' +
        '<h2 id="kw-modal-title">' + t.modalTitle + '</h2>' +
        '<p>' + t.modalDesc + '</p>' +
        '<div class="kw-modal-actions">' +
          '<button type="button" class="kw-btn kw-btn-primary" id="kw-allow">' +
            '<i class="bi bi-geo-alt-fill" aria-hidden="true"></i> ' + t.allow +
          '</button>' +
          '<button type="button" class="kw-btn kw-btn-ghost" id="kw-skip">' + t.skip + '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    requestAnimationFrame(function () { modal.classList.add('open'); });

    modal.querySelector('#kw-allow').addEventListener('click', function () {
      closeModal();
      onAllow();
    });
    modal.querySelector('#kw-skip').addEventListener('click', function () {
      closeModal();
      onSkip();
    });

    function closeModal() {
      modal.classList.remove('open');
      setTimeout(function () { modal.remove(); }, 300);
    }
  }

  // --- Geolocation -----------------------------------------------------------

  function getUserLocation() {
    return new Promise(function (resolve) {
      if (!('geolocation' in navigator)) {
        resolve({ ok: false, reason: 'unsupported' });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          resolve({
            ok: true,
            coords: { lat: pos.coords.latitude, lng: pos.coords.longitude }
          });
        },
        function () { resolve({ ok: false, reason: 'denied' }); },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      );
    });
  }

  // --- Rendering -------------------------------------------------------------

  function modeTabsHtml() {
    var labels = { motor: t.modeMotor, car: t.modeCar, walk: t.modeWalk, bike: t.modeBike };
    var badges = { motor: (LANG === 'en' ? 'Fastest' : 'Tercepat') };
    return (
      '<div class="kw-mode-tabs" role="tablist" aria-label="' + t.modeLabel + '">' +
        MODE_ORDER.map(function (k) {
          var m = MODES[k];
          var active = (k === currentMode) ? ' kw-mode-active' : '';
          var badge = badges[k] ? '<span class="kw-mode-badge">' + badges[k] + '</span>' : '';
          return (
            '<button type="button" role="tab" class="kw-mode-btn' + active + '" data-mode="' + k + '" aria-selected="' + (k === currentMode) + '">' +
              '<i class="bi ' + m.iconBi + '" aria-hidden="true"></i> ' + labels[k] + badge +
            '</button>'
          );
        }).join('') +
      '</div>'
    );
  }

  function buildSection(hostEl) {
    hostEl.classList.add('kw-nearby');
    hostEl.innerHTML =
      '<div class="kw-nearby-head">' +
        '<div class="kw-locate">' +
          '<span class="kw-locate-dot"><i class="bi bi-geo-alt-fill" aria-hidden="true"></i></span>' +
          '<div>' +
            '<span class="kw-locate-label" id="kw-loc-label">' + t.locating + '</span>' +
            '<span class="kw-locate-sub" id="kw-loc-sub">' + t.scanning + '</span>' +
          '</div>' +
        '</div>' +
        '<button type="button" class="kw-btn kw-btn-ghost kw-btn-retry" id="kw-retry">' +
          '<i class="bi bi-crosshair" aria-hidden="true"></i> ' + t.retry +
        '</button>' +
      '</div>' +
      modeTabsHtml() +
      '<div class="kw-nearby-body">' +
        '<div class="kw-map-wrap">' +
          '<div id="kw-map" class="kw-map" role="application" aria-label="' + t.nearest + '"></div>' +
          '<div class="kw-map-fade" aria-hidden="true"></div>' +
        '</div>' +
        '<aside class="kw-list-wrap" aria-label="' + t.nearest + '">' +
          '<h3 class="kw-list-title"><i class="bi bi-compass" aria-hidden="true"></i> ' + t.nearest + '</h3>' +
          '<ol class="kw-list" id="kw-list"></ol>' +
        '</aside>' +
      '</div>';

    hostEl.querySelector('#kw-retry').addEventListener('click', function () {
      run(true);
    });

    hostEl.querySelectorAll('.kw-mode-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = btn.getAttribute('data-mode');
        if (!next || next === currentMode) return;
        currentMode = next;
        hostEl.querySelectorAll('.kw-mode-btn').forEach(function (b) {
          var on = b.getAttribute('data-mode') === currentMode;
          b.classList.toggle('kw-mode-active', on);
          b.setAttribute('aria-selected', String(on));
        });
        // Re-render list + popup isi pakai mode baru, tanpa recreate map
        if (lastOrigin && lastNearest) {
          renderList(lastOrigin, lastNearest, lastIsFallback);
          refreshMarkerPopups(lastOrigin, lastNearest, lastIsFallback);
        }
      });
    });
  }

  function userIcon() {
    return L.divIcon({
      className: 'kw-user-icon',
      html: '<span class="kw-user-ring"></span><span class="kw-user-dot"></span>',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  }

  function destIcon() {
    return L.divIcon({
      className: 'kw-dest-icon',
      html: '<span class="kw-dest-pin"><i class="bi bi-geo-alt-fill"></i></span>',
      iconSize: [34, 34],
      iconAnchor: [17, 30],
      popupAnchor: [0, -28]
    });
  }

  function popupHtml(dest, user) {
    var img = imgTag(dest);
    return (
      '<div class="kw-popup">' +
        img +
        '<h4>' + dest.name + '</h4>' +
        '<p class="kw-popup-region">' + dest.region + '</p>' +
        '<p class="kw-popup-desc">' + describe(dest) + '</p>' +
        '<div class="kw-popup-foot">' +
          distanceChipHtml(dest) +
          '<a href="' + directionsUrl(user, dest) + '" target="_blank" rel="noopener noreferrer" class="kw-btn kw-btn-primary kw-btn-sm">' +
            '<i class="bi bi-compass"></i> ' + t.direction +
          '</a>' +
        '</div>' +
      '</div>'
    );
  }

  function listItemHtml(dest, user, index) {
    var img = imgTag(dest);
    return (
      '<li class="kw-list-item" data-id="' + dest.id + '">' +
        '<span class="kw-rank">' + (index + 1) + '</span>' +
        '<div class="kw-list-thumb">' + img + '</div>' +
        '<div class="kw-list-info">' +
          '<h4>' + dest.name + '</h4>' +
          '<p>' + dest.region + '</p>' +
          distanceChipHtml(dest) +
        '</div>' +
        '<a href="' + directionsUrl(user, dest) + '" target="_blank" rel="noopener noreferrer" class="kw-btn kw-btn-primary kw-btn-sm" aria-label="' + t.direction + ' ' + dest.name + '">' +
          '<i class="bi bi-compass"></i>' +
        '</a>' +
      '</li>'
    );
  }

  var mapInstance = null;
  var lastOrigin = null;
  var lastNearest = null;
  var lastIsFallback = false;

  function refreshMarkerPopups(user, nearest, isFallback) {
    if (!mapInstance || !mapInstance._kwMarkers) return;
    var byId = {};
    nearest.forEach(function (d) { byId[d.id] = d; });
    mapInstance._kwMarkers.forEach(function (m) {
      var dest = byId[m._kwId];
      if (dest) m.setPopupContent(popupHtml(dest, isFallback ? null : user));
    });
  }

  function renderMap(user, nearest, label, isFallback) {
    var mapEl = document.getElementById('kw-map');
    if (!mapEl) return;

    if (mapInstance) { mapInstance.remove(); mapInstance = null; }

    var center = [user.lat, user.lng];
    mapInstance = L.map(mapEl, {
      center: center,
      zoom: nearest.length && nearest[0].distance < 50 ? 11 : 5,
      scrollWheelZoom: false,
      zoomControl: true
    });

    // Dark-style tiles untuk efek radar/Pokemon
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(mapInstance);

    // Scan radius
    L.circle(center, {
      radius: Math.max(5000, Math.min(150000, (nearest[0] ? nearest[0].distance : 10) * 1500)),
      color: '#22d3ee',
      fillColor: '#22d3ee',
      fillOpacity: 0.08,
      weight: 1,
      className: 'kw-scan-circle'
    }).addTo(mapInstance);

    // User marker
    var userMarker = L.marker(center, { icon: userIcon(), zIndexOffset: 1000 })
      .addTo(mapInstance)
      .bindPopup('<strong>' + t.yourLocation + '</strong><br><small>' + label + '</small>');

    // Destination markers
    var group = L.featureGroup([userMarker]);
    nearest.forEach(function (d) {
      var m = L.marker([d.lat, d.lng], { icon: destIcon() })
        .addTo(mapInstance)
        .bindPopup(popupHtml(d, isFallback ? null : user), { maxWidth: 260 });
      group.addLayer(m);
      m._kwId = d.id;
    });

    // Fit bounds
    try {
      mapInstance.fitBounds(group.getBounds().pad(0.2), { maxZoom: 12 });
    } catch (e) { /* single point fallback */ }

    // Expose so list click can open popup
    mapInstance._kwMarkers = group.getLayers();
  }

  function renderList(user, nearest, isFallback) {
    var ol = document.getElementById('kw-list');
    if (!ol) return;
    ol.innerHTML = nearest.map(function (d, i) {
      return listItemHtml(d, isFallback ? null : user, i);
    }).join('');

    // Clicking list item opens popup on map
    ol.querySelectorAll('.kw-list-item').forEach(function (li) {
      li.addEventListener('click', function (e) {
        if (e.target.closest('a')) return; // let direction link work
        var id = li.getAttribute('data-id');
        var marker = (mapInstance && mapInstance._kwMarkers || []).find(function (m) { return m._kwId === id; });
        if (marker) {
          mapInstance.setView(marker.getLatLng(), 12, { animate: true });
          marker.openPopup();
        }
      });
    });
  }

  function setLabel(main, sub) {
    var l = document.getElementById('kw-loc-label');
    var s = document.getElementById('kw-loc-sub');
    if (l) l.textContent = main;
    if (s) s.textContent = sub;
  }

  // --- Orchestration ---------------------------------------------------------

  function renderAll(origin, originLabel, isFallback) {
    var nearest = findNearest(origin.lat, origin.lng, RESULT_LIMIT);
    lastOrigin = origin;
    lastNearest = nearest;
    lastIsFallback = isFallback;
    renderMap(origin, nearest, originLabel, isFallback);
    renderList(origin, nearest, isFallback);
  }

  function useFallback(message) {
    var loc = DEFAULT_LOCATION;
    setLabel(loc.label, message || t.scanning);
    renderAll(loc, loc.label, true);
  }

  function useUserLocation(coords) {
    var label = (LANG === 'en' ? 'Your current location' : 'Lokasimu saat ini');
    setLabel(label, t.scanning);
    renderAll(coords, label, false);
  }

  function run(skipModal) {
    var host = document.getElementById('kw-nearby-host');
    if (!host) return;
    buildSection(host);

    var start = function () {
      setLabel(t.locating, t.scanning);
      getUserLocation().then(function (res) {
        if (res.ok) {
          useUserLocation(res.coords);
        } else {
          useFallback(res.reason === 'denied' ? t.denied : t.unsupported);
        }
      });
    };

    if (skipModal) { start(); return; }

    // First render with fallback so the section is visible, then prompt
    useFallback(t.scanning);

    showPermissionModal(
      function onAllow() { start(); },
      function onSkip()  { useFallback(t.denied); }
    );
  }

  // --- Boot ------------------------------------------------------------------

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { run(false); });
  } else {
    run(false);
  }
})();
