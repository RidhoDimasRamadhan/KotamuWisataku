/**
 * Peta detail Situ Gunung untuk halaman Recomendations.html & ComeToRecommend.html.
 * Idempotent: aman kalau element #map tidak ada (misal di-include di halaman lain).
 */
(function () {
  'use strict';
  if (typeof L === 'undefined') return;
  var el = document.getElementById('map');
  if (!el) return;
  if (el._leaflet_id) return; // sudah di-init

  var latlng = [-6.8319444, 106.9186782];
  var map = L.map(el).setView(latlng, 13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  L.marker(latlng).addTo(map).bindPopup('<b>Situ Gunung</b>').openPopup();

  L.circle(latlng, {
    color: '#f43f5e',
    fillColor: '#f43f5e',
    fillOpacity: 0.25,
    radius: 500
  }).addTo(map);
})();
