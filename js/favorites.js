(function () {
  'use strict';

  const KEY = 'kw-favorites';

  const LANG = document.documentElement.lang === 'en' ? 'en' : 'id';

  const TEXT = {
    id: {
      add: 'Simpan destinasi ini',
      remove: 'Hapus dari simpanan',
      added: 'Destinasi disimpan.',
      removed: 'Destinasi dihapus dari simpanan.',
      failed: 'Tidak bisa menyimpan. Penyimpanan peramban sedang diblokir.',
      filter: 'Tersimpan',
      empty: 'Belum ada destinasi tersimpan. Tekan ikon hati pada kartu mana pun.',
    },
    en: {
      add: 'Save this destination',
      remove: 'Remove from saved',
      added: 'Destination saved.',
      removed: 'Destination removed from saved.',
      failed: 'Could not save. Browser storage is blocked.',
      filter: 'Saved',
      empty: 'No saved destinations yet. Tap the heart on any card.',
    },
  }[LANG];

  function read() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(raw) ? raw.filter((id) => typeof id === 'string') : [];
    } catch {
      return [];
    }
  }

  function write(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
      return true;
    } catch {
      return false;
    }
  }

  const notify = (message, type) => {
    if (typeof window.kwToast === 'function') window.kwToast(message, type);
  };

  const api = {
    text: TEXT,
    list: read,
    has: (id) => read().includes(id),
    count: () => read().length,

    toggle(id) {
      const list = read();
      const index = list.indexOf(id);
      const saved = index === -1;

      if (saved) list.push(id);
      else list.splice(index, 1);

      if (!write(list)) {
        notify(TEXT.failed, 'error');
        return null;
      }

      notify(saved ? TEXT.added : TEXT.removed);
      document.dispatchEvent(new CustomEvent('kw-favorites-change', { detail: { id, saved } }));
      return saved;
    },

    button(id, extraClass) {
      const saved = api.has(id);
      const label = saved ? TEXT.remove : TEXT.add;
      return (
        `<button type="button" class="kw-fav${saved ? ' kw-fav-on' : ''}${extraClass ? ` ${extraClass}` : ''}"` +
        ` data-fav="${id}" aria-pressed="${saved}" aria-label="${label}" title="${label}">` +
        `<i class="bi ${saved ? 'bi-heart-fill' : 'bi-heart'}" aria-hidden="true"></i>` +
        '</button>'
      );
    },

    paint(button) {
      const saved = api.has(button.dataset.fav);
      const label = saved ? TEXT.remove : TEXT.add;

      button.classList.toggle('kw-fav-on', saved);
      button.setAttribute('aria-pressed', String(saved));
      button.setAttribute('aria-label', label);
      button.title = label;

      const icon = button.querySelector('i');
      if (icon) icon.className = `bi ${saved ? 'bi-heart-fill' : 'bi-heart'}`;
    },

    paintAll(scope) {
      (scope || document).querySelectorAll('[data-fav]').forEach(api.paint);
    },
  };

  document.addEventListener('click', (e) => {
    const button = e.target.closest('[data-fav]');
    if (!button) return;

    e.preventDefault();
    e.stopPropagation();
    api.toggle(button.dataset.fav);
  });

  document.addEventListener('kw-favorites-change', () => api.paintAll());

  window.addEventListener('storage', (e) => {
    if (e.key === KEY) api.paintAll();
  });

  window.kwFavorites = api;
})();
