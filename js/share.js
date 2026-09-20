(function () {
  'use strict';

  const buttons = [...document.querySelectorAll('[data-share]')];
  if (!buttons.length) return;

  const LANG = document.documentElement.lang === 'en' ? 'en' : 'id';

  const TEXT = {
    id: {
      copied: 'Tautan halaman ini sudah disalin.',
      copyFailed: 'Gagal menyalin tautan. Salin manual dari bilah alamat.',
      shareText: 'Temukan destinasi wisata Indonesia di KotamuWisataku',
    },
    en: {
      copied: 'Link to this page copied.',
      copyFailed: 'Could not copy the link. Please copy it from the address bar.',
      shareText: 'Discover Indonesian travel destinations on KotamuWisataku',
    },
  }[LANG];

  const pageUrl = () => location.href.split('#')[0];
  const pageTitle = () => document.title || TEXT.shareText;

  const INTENTS = {
    whatsapp: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    facebook: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    telegram: (url, title) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  };

  const notify = (message, type) => {
    if (typeof window.kwToast === 'function') window.kwToast(message, type);
    else alert(message);
  };

  async function copyLink() {
    const url = pageUrl();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const field = document.createElement('textarea');
        field.value = url;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        const ok = document.execCommand('copy');
        field.remove();
        if (!ok) throw new Error('execCommand gagal');
      }
      notify(TEXT.copied);
    } catch {
      notify(TEXT.copyFailed, 'error');
    }
  }

  function share(kind) {
    if (kind === 'copy') {
      copyLink();
      return;
    }

    const build = INTENTS[kind];
    if (build) window.open(build(pageUrl(), pageTitle()), '_blank', 'noopener,noreferrer');
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => share(button.dataset.share));
  });
})();
