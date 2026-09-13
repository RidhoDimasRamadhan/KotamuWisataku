/**
 * Peta detail satu destinasi untuk halaman rekomendasi.
 *
 * Lokasi dibaca dari atribut data pada elemen #map, jadi halaman baru cukup
 * menulis markup — tanpa menyentuh file ini:
 *
 *   <div id="map"
 *        data-lat="-6.8319444"
 *        data-lng="106.9186782"
 *        data-label="Situ Gunung"
 *        data-zoom="13"
 *        data-radius="500"></div>
 *
 * Idempotent: aman kalau Leaflet belum ada atau #map tidak ada di halaman.
 */
(function () {
  'use strict';

  // Dipakai kalau halaman belum mencantumkan atribut data pada #map.
  var DEFAULT_SPOT = {
    lat: -6.8319444,
    lng: 106.9186782,
    label: 'Situ Gunung',
    zoom: 13,
    radius: 500
  };

  var ACCENT = '#f43f5e';

  /** Baca atribut numerik, jatuh ke fallback kalau kosong / bukan angka. */
  function numAttr(el, name, fallback) {
    var value = parseFloat(el.getAttribute(name));
    return isFinite(value) ? value : fallback;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function readSpot(el) {
    return {
      lat: numAttr(el, 'data-lat', DEFAULT_SPOT.lat),
      lng: numAttr(el, 'data-lng', DEFAULT_SPOT.lng),
      label: el.getAttribute('data-label') || DEFAULT_SPOT.label,
      zoom: numAttr(el, 'data-zoom', DEFAULT_SPOT.zoom),
      radius: numAttr(el, 'data-radius', DEFAULT_SPOT.radius)
    };
  }

  function initSpotMap() {
    if (typeof L === 'undefined') return;

    var el = document.getElementById('map');
    if (!el || el._leaflet_id) return; // belum ada, atau sudah di-init

    var spot = readSpot(el);
    var latlng = [spot.lat, spot.lng];
    var map = L.map(el).setView(latlng, spot.zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.marker(latlng)
      .addTo(map)
      .bindPopup('<b>' + escapeHtml(spot.label) + '</b>')
      .openPopup();

    L.circle(latlng, {
      color: ACCENT,
      fillColor: ACCENT,
      fillOpacity: 0.25,
      radius: spot.radius
    }).addTo(map);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpotMap);
  } else {
    initSpotMap();
  }
})();
