(function () {
  'use strict';

  const DEFAULT_SPOT = {
    lat: -6.8319444,
    lng: 106.9186782,
    label: 'Situ Gunung',
    zoom: 13,
    radius: 500,
  };

  const ACCENT = '#f43f5e';

  const numberAttribute = (el, name, fallback) => {
    const value = parseFloat(el.getAttribute(name));
    return Number.isFinite(value) ? value : fallback;
  };

  const escapeHtml = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const readSpot = (el) => ({
    lat: numberAttribute(el, 'data-lat', DEFAULT_SPOT.lat),
    lng: numberAttribute(el, 'data-lng', DEFAULT_SPOT.lng),
    label: el.getAttribute('data-label') || DEFAULT_SPOT.label,
    zoom: numberAttribute(el, 'data-zoom', DEFAULT_SPOT.zoom),
    radius: numberAttribute(el, 'data-radius', DEFAULT_SPOT.radius),
  });

  function initSpotMap() {
    if (typeof L === 'undefined') return;

    const el = document.getElementById('map');
    const alreadyInitialised = el && el._leaflet_id;
    if (!el || alreadyInitialised) return;

    const spot = readSpot(el);
    const latlng = [spot.lat, spot.lng];
    const map = L.map(el).setView(latlng, spot.zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker(latlng)
      .addTo(map)
      .bindPopup(`<b>${escapeHtml(spot.label)}</b>`)
      .openPopup();

    L.circle(latlng, {
      color: ACCENT,
      fillColor: ACCENT,
      fillOpacity: 0.25,
      radius: spot.radius,
    }).addTo(map);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpotMap);
  } else {
    initSpotMap();
  }
})();
