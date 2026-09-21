(function () {
  'use strict';

  const KEY = 'kw-recent';
  const LIMIT = 8;

  const LANG = document.documentElement.lang === 'en' ? 'en' : 'id';

  const TEXT = {
    id: { title: 'Terakhir dilihat', clear: 'Bersihkan riwayat', cleared: 'Riwayat dibersihkan.' },
    en: { title: 'Recently viewed', clear: 'Clear history', cleared: 'History cleared.' },
  }[LANG];

  function read() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(raw) ? raw.filter((id) => typeof id === 'string').slice(0, LIMIT) : [];
    } catch {
      return [];
    }
  }

  function write(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list.slice(0, LIMIT)));
      return true;
    } catch {
      return false;
    }
  }

  const api = {
    text: TEXT,
    list: read,

    push(id) {
      if (!id) return;
      const list = read().filter((item) => item !== id);
      list.unshift(id);
      write(list);
    },

    clear() {
      write([]);
      if (typeof window.kwToast === 'function') window.kwToast(TEXT.cleared);
      document.dispatchEvent(new CustomEvent('kw-recent-change'));
    },

    destinations() {
      const all = window.KW_DESTINATIONS || [];
      return read()
        .map((id) => all.find((dest) => dest.id === id))
        .filter(Boolean);
    },
  };

  window.kwRecent = api;
})();
