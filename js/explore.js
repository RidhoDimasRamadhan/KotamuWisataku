(function () {
  'use strict';

  const grid = document.getElementById('kw-explore-grid');
  if (!grid) return;

  const LANG = document.documentElement.lang === 'en' ? 'en' : 'id';

  const TEXT = {
    id: {
      allCategories: 'Semua kategori',
      allProvinces: 'Semua provinsi',
      sortName: 'Nama A–Z',
      sortNameDesc: 'Nama Z–A',
      sortProvince: 'Provinsi',
      sortNearest: 'Terdekat dari saya',
      locating: 'Mencari posisimu...',
      denied: 'Akses lokasi ditolak, urutan dikembalikan ke nama.',
      unsupported: 'Peramban tidak mendukung GPS, urutan dikembalikan ke nama.',
      km: 'km dari lokasimu',
      count: (shown, total) =>
        shown === total
          ? `Menampilkan seluruh ${total} destinasi.`
          : `Menampilkan ${shown} dari ${total} destinasi.`,
      empty: 'Tidak ada destinasi yang cocok. Coba ubah kata kunci atau saringannya.',
      mapLabel: 'Peta destinasi yang sedang disaring',
      openDetail: 'Lihat detail',
    },
    en: {
      allCategories: 'All categories',
      allProvinces: 'All provinces',
      sortName: 'Name A–Z',
      sortNameDesc: 'Name Z–A',
      sortProvince: 'Province',
      sortNearest: 'Nearest to me',
      locating: 'Locating you...',
      denied: 'Location denied, sorting returned to name.',
      unsupported: 'Your browser does not support GPS, sorting returned to name.',
      km: 'km from you',
      count: (shown, total) =>
        shown === total
          ? `Showing all ${total} destinations.`
          : `Showing ${shown} of ${total} destinations.`,
      empty: 'No destination matches. Try a different keyword or filter.',
      mapLabel: 'Map of the destinations currently filtered',
      openDetail: 'View details',
    },
  }[LANG];

  const escape = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const normalize = (value) =>
    String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const provinceOf = (dest) => String(dest.region || '').split(',').pop().trim();

  const categoryOf = (dest) => {
    const haystack = `${dest.name} ${dest.region}`.toLowerCase();
    const rule = (window.KW_GUIDE_RULES || []).find(([, keywords]) =>
      keywords.some((keyword) => haystack.includes(keyword))
    );
    return rule ? rule[0] : 'umum';
  };

  const categoryLabel = (key) => {
    const guide = (window.KW_GUIDES || {})[key];
    return guide && guide[LANG] ? guide[LANG].label : key;
  };

  const destinations = (window.KW_DESTINATIONS || []).map((dest) => ({
    dest,
    province: provinceOf(dest),
    category: categoryOf(dest),
    haystack: normalize(`${dest.name} ${dest.region}`),
  }));

  const provinces = [...new Set(destinations.map((d) => d.province))].sort((a, b) =>
    a.localeCompare(b)
  );

  const categories = [...new Set(destinations.map((d) => d.category))].sort((a, b) =>
    categoryLabel(a).localeCompare(categoryLabel(b))
  );

  const inputQuery = document.getElementById('kw-explore-q');
  const selectProvince = document.getElementById('kw-explore-prov');
  const selectSort = document.getElementById('kw-explore-sort');
  const chipHost = document.getElementById('kw-explore-cats');
  const counter = document.getElementById('kw-explore-count');
  const emptyNote = document.getElementById('kw-explore-empty');
  const resetButton = document.getElementById('kw-explore-reset');
  const form = document.getElementById('kw-explore-filters');
  const favChip = document.getElementById('kw-explore-favwrap');

  const state = { q: '', province: '', category: '', sort: 'name', favorites: false };
  let here = null;

  const EARTH_RADIUS_KM = 6371;
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  function distanceInKm(from, dest) {
    const deltaLat = toRadians(dest.lat - from.lat);
    const deltaLng = toRadians(dest.lng - from.lng);
    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(toRadians(from.lat)) * Math.cos(toRadians(dest.lat)) * Math.sin(deltaLng / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
  }

  const notify = (message, type) => {
    if (typeof window.kwToast === 'function') window.kwToast(message, type);
  };

  function fillSelect(select, options) {
    select.innerHTML = options
      .map(({ value, label }) => `<option value="${escape(value)}">${escape(label)}</option>`)
      .join('');
  }

  function buildControls() {
    fillSelect(selectProvince, [
      { value: '', label: TEXT.allProvinces },
      ...provinces.map((p) => ({ value: p, label: p })),
    ]);

    fillSelect(selectSort, [
      { value: 'name', label: TEXT.sortName },
      { value: 'name-desc', label: TEXT.sortNameDesc },
      { value: 'province', label: TEXT.sortProvince },
      { value: 'nearest', label: TEXT.sortNearest },
    ]);

    const favLabel = window.kwFavorites ? window.kwFavorites.text.filter : '';
    if (favLabel) {
      favChip.innerHTML =
        `<button class="kw-chip kw-chip-fav" type="button" id="kw-explore-fav" aria-pressed="false">` +
        `<i class="bi bi-heart" aria-hidden="true"></i> ${escape(favLabel)} <span id="kw-explore-fav-count"></span>` +
        '</button>';
    }

    chipHost.innerHTML = [{ value: '', label: TEXT.allCategories }, ...categories.map((c) => ({ value: c, label: categoryLabel(c) }))]
      .map(
        ({ value, label }) =>
          `<button class="kw-chip" type="button" data-category="${escape(value)}" aria-pressed="false">${escape(label)}</button>`
      )
      .join('');
  }

  const detailUrl = (dest) =>
    `wisata.html?id=${encodeURIComponent(dest.id)}${LANG === 'en' ? '&lang=en' : ''}`;

  const distanceBadge = (entry) =>
    state.sort === 'nearest' && here
      ? `<span class="kw-explore-dist"><i class="bi bi-cursor-fill" aria-hidden="true"></i> ${entry.km.toFixed(entry.km < 10 ? 1 : 0)} ${escape(TEXT.km)}</span>`
      : '';

  const favButton = (dest) =>
    window.kwFavorites ? window.kwFavorites.button(dest.id, 'kw-fav-card') : '';

  const card = ({ dest, province, category, km }) => `
    <li class="kw-explore-item">
      <a href="${escape(detailUrl(dest))}">
        <img src="${escape(dest.image)}" alt="" width="320" height="200" loading="lazy" decoding="async">
        <span class="kw-explore-cat">${escape(categoryLabel(category))}</span>
        <span class="kw-explore-name">${escape(dest.name)}</span>
        <span class="kw-explore-region">
          <i class="bi bi-geo-alt-fill" aria-hidden="true"></i> ${escape(dest.region)}
        </span>
        <span class="kw-explore-prov">${escape(province)}</span>
        ${distanceBadge({ dest, km })}
      </a>
      ${favButton(dest)}
    </li>`;

  const sorters = {
    name: (a, b) => a.dest.name.localeCompare(b.dest.name),
    'name-desc': (a, b) => b.dest.name.localeCompare(a.dest.name),
    province: (a, b) =>
      a.province.localeCompare(b.province) || a.dest.name.localeCompare(b.dest.name),
    nearest: (a, b) =>
      here ? a.km - b.km : a.dest.name.localeCompare(b.dest.name),
  };

  function matches(entry) {
    if (state.favorites && !(window.kwFavorites && window.kwFavorites.has(entry.dest.id))) return false;
    if (state.province && entry.province !== state.province) return false;
    if (state.category && entry.category !== state.category) return false;
    if (state.q && !entry.haystack.includes(state.q)) return false;
    return true;
  }

  function syncUrl() {
    const params = new URLSearchParams();
    if (state.q) params.set('q', state.q);
    if (state.province) params.set('provinsi', state.province);
    if (state.category) params.set('kategori', state.category);
    if (state.sort !== 'name') params.set('urut', state.sort);

    const query = params.toString();
    try {
      history.replaceState(null, '', query ? `?${query}` : location.pathname);
    } catch {}
  }

  function render() {
    const shown = destinations.filter(matches).sort(sorters[state.sort] || sorters.name);

    if (view === 'map') paintMarkers(shown);
    else grid.innerHTML = shown.map(card).join('');
    counter.textContent = TEXT.count(shown.length, destinations.length);
    emptyNote.textContent =
      state.favorites && window.kwFavorites && !window.kwFavorites.count()
        ? window.kwFavorites.text.empty
        : TEXT.empty;
    emptyNote.hidden = shown.length > 0;
    if (view === 'map') mapHost.hidden = shown.length === 0;

    [...chipHost.querySelectorAll('.kw-chip')].forEach((chip) => {
      const active = chip.dataset.category === state.category;
      chip.classList.toggle('kw-chip-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });

    const favButtonEl = document.getElementById('kw-explore-fav');
    if (favButtonEl && window.kwFavorites) {
      const n = window.kwFavorites.count();
      favButtonEl.classList.toggle('kw-chip-active', state.favorites);
      favButtonEl.setAttribute('aria-pressed', String(state.favorites));
      favButtonEl.querySelector('i').className = `bi ${state.favorites ? 'bi-heart-fill' : 'bi-heart'}`;
      document.getElementById('kw-explore-fav-count').textContent = n ? `(${n})` : '';
    }

    syncUrl();
  }

  function readUrl() {
    const params = new URLSearchParams(location.search);
    const province = params.get('provinsi') || '';
    const category = params.get('kategori') || '';
    const sort = params.get('urut') || 'name';

    state.q = normalize(params.get('q') || '');
    state.province = provinces.includes(province) ? province : '';
    state.category = categories.includes(category) ? category : '';
    state.sort = sorters[sort] && sort !== 'nearest' ? sort : 'name';

    inputQuery.value = params.get('q') || '';
    selectProvince.value = state.province;
    selectSort.value = state.sort;
  }

  function wire() {
    form.addEventListener('submit', (e) => e.preventDefault());

    inputQuery.addEventListener('input', () => {
      state.q = normalize(inputQuery.value);
      render();
    });

    selectProvince.addEventListener('change', () => {
      state.province = selectProvince.value;
      render();
    });

    selectSort.addEventListener('change', () => {
      if (selectSort.value === 'nearest') {
        locate();
        return;
      }
      state.sort = selectSort.value;
      render();
    });

    chipHost.addEventListener('click', (e) => {
      const chip = e.target.closest('.kw-chip');
      if (!chip) return;
      state.category = chip.dataset.category === state.category ? '' : chip.dataset.category;
      render();
    });

    if (favChip) {
      favChip.addEventListener('click', (e) => {
        if (!e.target.closest('#kw-explore-fav')) return;
        state.favorites = !state.favorites;
        render();
      });
    }

    document.addEventListener('kw-favorites-change', () => render());

    resetButton.addEventListener('click', () => {
      state.favorites = false;
      state.q = '';
      state.province = '';
      state.category = '';
      state.sort = 'name';
      inputQuery.value = '';
      selectProvince.value = '';
      selectSort.value = 'name';
      render();
      inputQuery.focus();
    });
  }

  function applyDistances(coords) {
    here = coords;
    destinations.forEach((entry) => {
      entry.km = distanceInKm(coords, entry.dest);
    });
  }

  function fallbackSort() {
    state.sort = 'name';
    selectSort.value = 'name';
    render();
  }

  function locate() {
    if (here) {
      state.sort = 'nearest';
      render();
      return;
    }

    if (!('geolocation' in navigator)) {
      notify(TEXT.unsupported, 'error');
      fallbackSort();
      return;
    }

    notify(TEXT.locating);
    selectSort.disabled = true;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        selectSort.disabled = false;
        applyDistances({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        state.sort = 'nearest';
        selectSort.value = 'nearest';
        render();
      },
      () => {
        selectSort.disabled = false;
        notify(TEXT.denied, 'error');
        fallbackSort();
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }

  const mapHost = document.getElementById('kw-explore-map');
  const viewToggle = document.querySelector('.kw-view-toggle');

  let map = null;
  let markerLayer = null;
  let view = 'grid';

  function ensureMap() {
    if (map || typeof L === 'undefined' || !mapHost) return map;

    mapHost.setAttribute('aria-label', TEXT.mapLabel);
    map = L.map(mapHost, { center: [-2.5, 118], zoom: 4, scrollWheelZoom: false });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    markerLayer = L.layerGroup().addTo(map);
    return map;
  }

  function paintMarkers(entries) {
    if (!ensureMap()) return;

    markerLayer.clearLayers();
    const points = [];

    entries.forEach(({ dest }) => {
      const marker = L.marker([dest.lat, dest.lng]).bindPopup(
        `<strong>${escape(dest.name)}</strong><br><small>${escape(dest.region)}</small><br>` +
          `<a href="${escape(detailUrl(dest))}">${escape(TEXT.openDetail)}</a>`
      );
      markerLayer.addLayer(marker);
      points.push([dest.lat, dest.lng]);
    });

    map.invalidateSize();
    if (points.length) map.fitBounds(L.latLngBounds(points).pad(0.15), { maxZoom: 12 });
  }

  function setView(next) {
    view = next;
    const isMap = view === 'map';

    grid.hidden = isMap;
    mapHost.hidden = !isMap;

    viewToggle.querySelectorAll('.kw-view-btn').forEach((btn) => {
      const active = btn.dataset.view === view;
      btn.classList.toggle('kw-view-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    render();
  }

  const recentHost = document.getElementById('kw-recent');

  function renderRecent() {
    if (!recentHost || !window.kwRecent) return;

    const items = window.kwRecent.destinations();
    recentHost.hidden = items.length === 0;
    if (!items.length) {
      recentHost.innerHTML = '';
      return;
    }

    recentHost.innerHTML =
      '<div class="kw-recent-head">' +
      `<h2>${escape(window.kwRecent.text.title)}</h2>` +
      `<button class="kw-recent-clear" type="button" id="kw-recent-clear">` +
      `<i class="bi bi-x-lg" aria-hidden="true"></i> ${escape(window.kwRecent.text.clear)}` +
      '</button>' +
      '</div>' +
      '<ul class="kw-recent-list">' +
      items
        .map(
          (dest) => `
        <li>
          <a href="${escape(detailUrl(dest))}">
            <img src="${escape(dest.image)}" alt="" width="120" height="80" loading="lazy" decoding="async">
            <span>${escape(dest.name)}</span>
          </a>
        </li>`
        )
        .join('') +
      '</ul>';
  }

  if (viewToggle && mapHost) {
    viewToggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.kw-view-btn');
      if (btn && btn.dataset.view !== view) setView(btn.dataset.view);
    });
  }

  if (recentHost) {
    recentHost.addEventListener('click', (e) => {
      if (e.target.closest('#kw-recent-clear')) window.kwRecent.clear();
    });
    document.addEventListener('kw-recent-change', renderRecent);
  }

  buildControls();
  readUrl();
  wire();
  render();
  renderRecent();
})();
