(function () {
  'use strict';

  const LANG = window.KW_LANG === 'en' ? 'en' : 'id';

  const t = {
    id: {
      modalTitle: 'Temukan Wisata Terdekat',
      modalDesc:
        'Izinkan akses lokasi untuk melihat wisata terdekat di sekitarmu — gaya radar. Kami tidak menyimpan lokasimu.',
      allow: 'Izinkan Lokasi',
      skip: 'Nanti Saja',
      locating: 'Mencari posisimu...',
      denied: 'Akses lokasi ditolak. Menampilkan wisata di sekitar Jakarta.',
      unsupported: 'Peramban tidak mendukung GPS. Menampilkan wisata di sekitar Jakarta.',
      fallback: 'Jakarta (default)',
      yourLocation: 'Kamu di sini',
      hereLabel: 'Lokasimu saat ini',
      scanning: 'Memindai wisata di sekitarmu',
      nearest: 'Wisata Terdekat',
      direction: 'Arahkan',
      km: 'km',
      retry: 'Aktifkan GPS',
      min: 'mnt',
      hr: 'jam',
      modeLabel: 'Mode',
      fastest: 'Tercepat',
      modeMotor: 'Motor',
      modeCar: 'Mobil',
      modeWalk: 'Jalan Kaki',
      modeBike: 'Sepeda',
    },
    en: {
      modalTitle: 'Find Nearby Attractions',
      modalDesc:
        'Allow location access to see tourist spots around you — radar style. We do not store your location.',
      allow: 'Allow Location',
      skip: 'Skip',
      locating: 'Locating you...',
      denied: 'Location denied. Showing attractions around Jakarta.',
      unsupported: 'Your browser does not support GPS. Showing attractions around Jakarta.',
      fallback: 'Jakarta (default)',
      yourLocation: 'You are here',
      hereLabel: 'Your current location',
      scanning: 'Scanning nearby attractions',
      nearest: 'Nearest Attractions',
      direction: 'Direction',
      km: 'km',
      retry: 'Enable GPS',
      min: 'min',
      hr: 'h',
      modeLabel: 'Mode',
      fastest: 'Fastest',
      modeMotor: 'Motorcycle',
      modeCar: 'Car',
      modeWalk: 'Walking',
      modeBike: 'Cycling',
    },
  }[LANG];

  const MODES = {
    motor: { iconBi: 'bi-bicycle', factor: 1.4, speed: 30, gmap: 'driving', label: t.modeMotor, badge: t.fastest },
    car: { iconBi: 'bi-car-front-fill', factor: 1.5, speed: 22, gmap: 'driving', label: t.modeCar },
    walk: { iconBi: 'bi-person-walking', factor: 1.2, speed: 5, gmap: 'walking', label: t.modeWalk },
    bike: { iconBi: 'bi-bicycle', factor: 1.3, speed: 14, gmap: 'bicycling', label: t.modeBike },
  };
  const MODE_ORDER = ['motor', 'car', 'walk', 'bike'];

  const DEFAULT_LOCATION = { lat: -6.2088, lng: 106.8456, label: t.fallback };
  const RESULT_LIMIT = 15;
  const EARTH_RADIUS_KM = 6371;

  let currentMode = 'motor';
  let mapInstance = null;
  let lastOrigin = null;
  let lastNearest = null;
  let lastIsFallback = false;

  const esc = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  function haversine(fromLat, fromLng, toLat, toLng) {
    const deltaLat = toRadians(toLat - fromLat);
    const deltaLng = toRadians(toLng - fromLng);
    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) * Math.sin(deltaLng / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
  }

  const PLACEHOLDER_IMAGE = 'img/logo1.png';

  const imgTag = (dest, extraClass) =>
    `<img${extraClass ? ` class="${esc(extraClass)}"` : ''}` +
    ` src="${esc(dest.image || PLACEHOLDER_IMAGE)}"` +
    ` alt="${esc(dest.name)}"` +
    ' width="160" height="110" loading="lazy" decoding="async">';

  function formatDistance(km) {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    if (km < 10) return `${km.toFixed(1)} ${t.km}`;
    return `${Math.round(km)} ${t.km}`;
  }

  function formatDuration(minutes) {
    if (!minutes || !isFinite(minutes)) return '';
    if (minutes < 60) return `${Math.max(1, Math.round(minutes))} ${t.min}`;

    const hours = Math.floor(minutes / 60);
    const rest = Math.round(minutes % 60);
    return `${hours} ${t.hr}${rest ? ` ${rest} ${t.min}` : ''}`;
  }

  function estimateForMode(havKm, modeKey) {
    const mode = MODES[modeKey] || MODES.motor;
    const distance = havKm * mode.factor;
    return { distance, duration: (distance / mode.speed) * 60 };
  }

  function distanceChipHtml(dest) {
    const est = estimateForMode(dest.distance, currentMode);
    const duration = formatDuration(est.duration);
    return (
      '<span class="kw-chip">' +
      `<i class="bi ${MODES[currentMode].iconBi}"></i> ` +
      formatDistance(est.distance) +
      (duration ? ` · ${duration}` : '') +
      '</span>'
    );
  }

  const findNearest = (userLat, userLng, limit) =>
    (window.KW_DESTINATIONS || [])
      .map((dest) => ({ ...dest, distance: haversine(userLat, userLng, dest.lat, dest.lng) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit || RESULT_LIMIT);

  function directionsUrl(user, dest) {
    const origin = user ? `${user.lat},${user.lng}` : '';
    const mode = MODES[currentMode] ? MODES[currentMode].gmap : 'driving';
    return (
      'https://www.google.com/maps/dir/?api=1' +
      (origin ? `&origin=${encodeURIComponent(origin)}` : '') +
      `&destination=${encodeURIComponent(`${dest.lat},${dest.lng}`)}` +
      `&travelmode=${mode}`
    );
  }

  const describe = (dest) => (LANG === 'en' ? dest.descEn || dest.desc || '' : dest.desc || '');

  function showPermissionModal(onAllow, onSkip) {
    if (document.getElementById('kw-permission-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'kw-permission-modal';
    modal.className = 'kw-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'kw-modal-title');
    modal.innerHTML =
      '<div class="kw-modal-card">' +
      '<div class="kw-radar-anim" aria-hidden="true"><span></span><span></span><span></span></div>' +
      `<h2 id="kw-modal-title">${t.modalTitle}</h2>` +
      `<p>${t.modalDesc}</p>` +
      '<div class="kw-modal-actions">' +
      '<button type="button" class="kw-btn kw-btn-primary" id="kw-allow">' +
      `<i class="bi bi-geo-alt-fill" aria-hidden="true"></i> ${t.allow}` +
      '</button>' +
      `<button type="button" class="kw-btn kw-btn-ghost" id="kw-skip">${t.skip}</button>` +
      '</div>' +
      '</div>';

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('open'));

    const closeModal = () => {
      modal.classList.remove('open');
      setTimeout(() => modal.remove(), 300);
    };

    modal.querySelector('#kw-allow').addEventListener('click', () => {
      closeModal();
      onAllow();
    });

    modal.querySelector('#kw-skip').addEventListener('click', () => {
      closeModal();
      onSkip();
    });
  }

  const getUserLocation = () =>
    new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        resolve({ ok: false, reason: 'unsupported' });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ ok: true, coords: { lat: pos.coords.latitude, lng: pos.coords.longitude } }),
        () => resolve({ ok: false, reason: 'denied' }),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      );
    });

  const modeTabsHtml = () =>
    `<div class="kw-mode-tabs" role="tablist" aria-label="${t.modeLabel}">` +
    MODE_ORDER.map((key) => {
      const mode = MODES[key];
      const active = key === currentMode;
      const badge = mode.badge ? `<span class="kw-mode-badge">${mode.badge}</span>` : '';
      return (
        `<button type="button" role="tab" class="kw-mode-btn${active ? ' kw-mode-active' : ''}"` +
        ` data-mode="${key}" aria-selected="${active}">` +
        `<i class="bi ${mode.iconBi}" aria-hidden="true"></i> ${mode.label}${badge}` +
        '</button>'
      );
    }).join('') +
    '</div>';

  function buildSection(hostEl) {
    hostEl.classList.add('kw-nearby');
    hostEl.innerHTML =
      '<div class="kw-nearby-head">' +
      '<div class="kw-locate">' +
      '<span class="kw-locate-dot"><i class="bi bi-geo-alt-fill" aria-hidden="true"></i></span>' +
      '<div>' +
      `<span class="kw-locate-label" id="kw-loc-label">${t.locating}</span>` +
      `<span class="kw-locate-sub" id="kw-loc-sub">${t.scanning}</span>` +
      '</div>' +
      '</div>' +
      '<button type="button" class="kw-btn kw-btn-ghost kw-btn-retry" id="kw-retry">' +
      `<i class="bi bi-crosshair" aria-hidden="true"></i> ${t.retry}` +
      '</button>' +
      '</div>' +
      modeTabsHtml() +
      '<div class="kw-nearby-body">' +
      '<div class="kw-map-wrap">' +
      `<div id="kw-map" class="kw-map" role="application" aria-label="${t.nearest}"></div>` +
      '<div class="kw-map-fade" aria-hidden="true"></div>' +
      '</div>' +
      `<aside class="kw-list-wrap" aria-label="${t.nearest}">` +
      `<h3 class="kw-list-title"><i class="bi bi-compass" aria-hidden="true"></i> ${t.nearest}</h3>` +
      '<ol class="kw-list" id="kw-list"></ol>' +
      '</aside>' +
      '</div>';

    hostEl.querySelector('#kw-retry').addEventListener('click', () => run(true));

    hostEl.querySelectorAll('.kw-mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = btn.getAttribute('data-mode');
        if (!next || next === currentMode) return;

        currentMode = next;
        hostEl.querySelectorAll('.kw-mode-btn').forEach((other) => {
          const selected = other.getAttribute('data-mode') === currentMode;
          other.classList.toggle('kw-mode-active', selected);
          other.setAttribute('aria-selected', String(selected));
        });

        if (lastOrigin && lastNearest) {
          renderList(lastOrigin, lastNearest, lastIsFallback);
          refreshMarkerPopups(lastOrigin, lastNearest, lastIsFallback);
        }
      });
    });
  }

  const userIcon = () =>
    L.divIcon({
      className: 'kw-user-icon',
      html: '<span class="kw-user-ring"></span><span class="kw-user-dot"></span>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

  const destIcon = () =>
    L.divIcon({
      className: 'kw-dest-icon',
      html: '<span class="kw-dest-pin"><i class="bi bi-geo-alt-fill"></i></span>',
      iconSize: [34, 34],
      iconAnchor: [17, 30],
      popupAnchor: [0, -28],
    });

  const popupHtml = (dest, user) =>
    '<div class="kw-popup">' +
    imgTag(dest) +
    `<h4>${esc(dest.name)}</h4>` +
    `<p class="kw-popup-region">${esc(dest.region)}</p>` +
    `<p class="kw-popup-desc">${esc(describe(dest))}</p>` +
    '<div class="kw-popup-foot">' +
    distanceChipHtml(dest) +
    `<a href="${directionsUrl(user, dest)}" target="_blank" rel="noopener noreferrer" class="kw-btn kw-btn-primary kw-btn-sm">` +
    `<i class="bi bi-compass"></i> ${t.direction}` +
    '</a>' +
    '</div>' +
    '</div>';

  const listItemHtml = (dest, user, index) =>
    `<li class="kw-list-item" data-id="${esc(dest.id)}">` +
    `<span class="kw-rank">${index + 1}</span>` +
    `<div class="kw-list-thumb">${imgTag(dest)}</div>` +
    '<div class="kw-list-info">' +
    `<h4>${esc(dest.name)}</h4>` +
    `<p>${esc(dest.region)}</p>` +
    distanceChipHtml(dest) +
    '</div>' +
    `<a href="${directionsUrl(user, dest)}" target="_blank" rel="noopener noreferrer" class="kw-btn kw-btn-primary kw-btn-sm" aria-label="${esc(`${t.direction} ${dest.name}`)}">` +
    '<i class="bi bi-compass"></i>' +
    '</a>' +
    '</li>';

  function refreshMarkerPopups(user, nearest, isFallback) {
    if (!mapInstance || !mapInstance._kwMarkers) return;

    const byId = new Map(nearest.map((dest) => [dest.id, dest]));
    mapInstance._kwMarkers.forEach((marker) => {
      const dest = byId.get(marker._kwId);
      if (dest) marker.setPopupContent(popupHtml(dest, isFallback ? null : user));
    });
  }

  function renderMap(user, nearest, label, isFallback) {
    const mapEl = document.getElementById('kw-map');
    if (!mapEl) return;

    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }

    const center = [user.lat, user.lng];
    mapInstance = L.map(mapEl, {
      center,
      zoom: nearest.length && nearest[0].distance < 50 ? 11 : 5,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapInstance);

    L.circle(center, {
      radius: Math.max(5000, Math.min(150000, (nearest[0] ? nearest[0].distance : 10) * 1500)),
      color: '#22d3ee',
      fillColor: '#22d3ee',
      fillOpacity: 0.08,
      weight: 1,
      className: 'kw-scan-circle',
    }).addTo(mapInstance);

    const userMarker = L.marker(center, { icon: userIcon(), zIndexOffset: 1000 })
      .addTo(mapInstance)
      .bindPopup(`<strong>${esc(t.yourLocation)}</strong><br><small>${esc(label)}</small>`);

    const group = L.featureGroup([userMarker]);
    nearest.forEach((dest) => {
      const marker = L.marker([dest.lat, dest.lng], { icon: destIcon() })
        .addTo(mapInstance)
        .bindPopup(popupHtml(dest, isFallback ? null : user), { maxWidth: 260 });
      group.addLayer(marker);
      marker._kwId = dest.id;
    });

    try {
      mapInstance.fitBounds(group.getBounds().pad(0.2), { maxZoom: 12 });
    } catch {}

    mapInstance._kwMarkers = group.getLayers();
  }

  function renderList(user, nearest, isFallback) {
    const list = document.getElementById('kw-list');
    if (!list) return;

    list.innerHTML = nearest
      .map((dest, index) => listItemHtml(dest, isFallback ? null : user, index))
      .join('');

    list.querySelectorAll('.kw-list-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;

        const id = item.getAttribute('data-id');
        const markers = (mapInstance && mapInstance._kwMarkers) || [];
        const marker = markers.find((m) => m._kwId === id);
        if (!marker) return;

        mapInstance.setView(marker.getLatLng(), 12, { animate: true });
        marker.openPopup();
      });
    });
  }

  function setLabel(main, sub) {
    const label = document.getElementById('kw-loc-label');
    const subLabel = document.getElementById('kw-loc-sub');
    if (label) label.textContent = main;
    if (subLabel) subLabel.textContent = sub;
  }

  function renderAll(origin, originLabel, isFallback) {
    const nearest = findNearest(origin.lat, origin.lng, RESULT_LIMIT);

    lastOrigin = origin;
    lastNearest = nearest;
    lastIsFallback = isFallback;

    renderMap(origin, nearest, originLabel, isFallback);
    renderList(origin, nearest, isFallback);
  }

  function useFallback(message) {
    setLabel(DEFAULT_LOCATION.label, message || t.scanning);
    renderAll(DEFAULT_LOCATION, DEFAULT_LOCATION.label, true);
  }

  function useUserLocation(coords) {
    setLabel(t.hereLabel, t.scanning);
    renderAll(coords, t.hereLabel, false);
  }

  function run(skipModal) {
    const host = document.getElementById('kw-nearby-host');
    if (!host) return;

    buildSection(host);

    const start = () => {
      setLabel(t.locating, t.scanning);
      getUserLocation().then((res) => {
        if (res.ok) useUserLocation(res.coords);
        else useFallback(res.reason === 'denied' ? t.denied : t.unsupported);
      });
    };

    if (skipModal) {
      start();
      return;
    }

    useFallback(t.scanning);
    showPermissionModal(start, () => useFallback(t.denied));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => run(false));
  } else {
    run(false);
  }
})();
