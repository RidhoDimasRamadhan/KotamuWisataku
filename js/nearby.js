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
      computing: 'Menghitung rute jalan...',
      nearest: 'Wisata Terdekat',
      distance: 'jarak',
      direction: 'Arahkan',
      km: 'km',
      retry: 'Aktifkan GPS',
      min: 'mnt',
      hr: 'jam',
      straightHint: '(garis lurus)'
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
      computing: 'Computing road routes...',
      nearest: 'Nearest Attractions',
      distance: 'distance',
      direction: 'Direction',
      km: 'km',
      retry: 'Enable GPS',
      min: 'min',
      hr: 'h',
      straightHint: '(straight line)'
    }
  };

  var t = I18N[LANG];

  var DEFAULT_LOCATION = { lat: -6.2088, lng: 106.8456, label: t.fallback };
  var RESULT_LIMIT = 8;

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

  function formatDistance(km) {
    if (km < 1) return Math.round(km * 1000) + ' m';
    if (km < 10) return km.toFixed(1) + ' ' + t.km;
    return Math.round(km) + ' ' + t.km;
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
    return 'https://www.google.com/maps/dir/?api=1' +
           (origin ? ('&origin=' + encodeURIComponent(origin)) : '') +
           '&destination=' + encodeURIComponent(dest.lat + ',' + dest.lng) +
           '&travelmode=driving';
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
    var img = dest.image ? '<img src="' + dest.image + '" alt="' + dest.name + '" loading="lazy">' : '';
    return (
      '<div class="kw-popup">' +
        img +
        '<h4>' + dest.name + '</h4>' +
        '<p class="kw-popup-region">' + dest.region + '</p>' +
        '<p class="kw-popup-desc">' + describe(dest) + '</p>' +
        '<div class="kw-popup-foot">' +
          '<span class="kw-chip"><i class="bi bi-signpost-2"></i> ' + formatDistance(dest.distance) + '</span>' +
          '<a href="' + directionsUrl(user, dest) + '" target="_blank" rel="noopener noreferrer" class="kw-btn kw-btn-primary kw-btn-sm">' +
            '<i class="bi bi-compass"></i> ' + t.direction +
          '</a>' +
        '</div>' +
      '</div>'
    );
  }

  function listItemHtml(dest, user, index) {
    var img = dest.image ? '<img src="' + dest.image + '" alt="' + dest.name + '" loading="lazy">' : '';
    return (
      '<li class="kw-list-item" data-id="' + dest.id + '">' +
        '<span class="kw-rank">' + (index + 1) + '</span>' +
        '<div class="kw-list-thumb">' + img + '</div>' +
        '<div class="kw-list-info">' +
          '<h4>' + dest.name + '</h4>' +
          '<p>' + dest.region + '</p>' +
          '<span class="kw-chip"><i class="bi bi-signpost-2"></i> ' + formatDistance(dest.distance) + '</span>' +
        '</div>' +
        '<a href="' + directionsUrl(user, dest) + '" target="_blank" rel="noopener noreferrer" class="kw-btn kw-btn-primary kw-btn-sm" aria-label="' + t.direction + ' ' + dest.name + '">' +
          '<i class="bi bi-compass"></i>' +
        '</a>' +
      '</li>'
    );
  }

  var mapInstance = null;

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

  function useFallback(message) {
    var loc = DEFAULT_LOCATION;
    var nearest = findNearest(loc.lat, loc.lng);
    setLabel(loc.label, message || t.scanning);
    renderMap(loc, nearest, loc.label, true);
    renderList(loc, nearest, true);
  }

  function useUserLocation(coords) {
    var nearest = findNearest(coords.lat, coords.lng);
    var label = (LANG === 'en' ? 'Your current location' : 'Lokasimu saat ini');
    setLabel(label, t.scanning);
    renderMap(coords, nearest, label, false);
    renderList(coords, nearest, false);
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
