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
      count: (shown, total) =>
        shown === total
          ? `Menampilkan seluruh ${total} destinasi.`
          : `Menampilkan ${shown} dari ${total} destinasi.`,
      empty: 'Tidak ada destinasi yang cocok. Coba ubah kata kunci atau saringannya.',
    },
    en: {
      allCategories: 'All categories',
      allProvinces: 'All provinces',
      sortName: 'Name A–Z',
      sortNameDesc: 'Name Z–A',
      sortProvince: 'Province',
      count: (shown, total) =>
        shown === total
          ? `Showing all ${total} destinations.`
          : `Showing ${shown} of ${total} destinations.`,
      empty: 'No destination matches. Try a different keyword or filter.',
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

  const state = { q: '', province: '', category: '', sort: 'name' };

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
    ]);

    chipHost.innerHTML = [{ value: '', label: TEXT.allCategories }, ...categories.map((c) => ({ value: c, label: categoryLabel(c) }))]
      .map(
        ({ value, label }) =>
          `<button class="kw-chip" type="button" data-category="${escape(value)}" aria-pressed="false">${escape(label)}</button>`
      )
      .join('');
  }

  const detailUrl = (dest) =>
    `wisata.html?id=${encodeURIComponent(dest.id)}${LANG === 'en' ? '&lang=en' : ''}`;

  const card = ({ dest, province, category }) => `
    <li class="kw-explore-item">
      <a href="${escape(detailUrl(dest))}">
        <img src="${escape(dest.image)}" alt="" width="320" height="200" loading="lazy" decoding="async">
        <span class="kw-explore-cat">${escape(categoryLabel(category))}</span>
        <span class="kw-explore-name">${escape(dest.name)}</span>
        <span class="kw-explore-region">
          <i class="bi bi-geo-alt-fill" aria-hidden="true"></i> ${escape(dest.region)}
        </span>
        <span class="kw-explore-prov">${escape(province)}</span>
      </a>
    </li>`;

  const sorters = {
    name: (a, b) => a.dest.name.localeCompare(b.dest.name),
    'name-desc': (a, b) => b.dest.name.localeCompare(a.dest.name),
    province: (a, b) =>
      a.province.localeCompare(b.province) || a.dest.name.localeCompare(b.dest.name),
  };

  function matches(entry) {
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

    grid.innerHTML = shown.map(card).join('');
    counter.textContent = TEXT.count(shown.length, destinations.length);
    emptyNote.textContent = TEXT.empty;
    emptyNote.hidden = shown.length > 0;

    [...chipHost.querySelectorAll('.kw-chip')].forEach((chip) => {
      const active = chip.dataset.category === state.category;
      chip.classList.toggle('kw-chip-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });

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
    state.sort = sorters[sort] ? sort : 'name';

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
      state.sort = selectSort.value;
      render();
    });

    chipHost.addEventListener('click', (e) => {
      const chip = e.target.closest('.kw-chip');
      if (!chip) return;
      state.category = chip.dataset.category === state.category ? '' : chip.dataset.category;
      render();
    });

    resetButton.addEventListener('click', () => {
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

  buildControls();
  readUrl();
  wire();
  render();
})();
