(() => {
  'use strict';
  const key = 'a1m_analytics_consent_v1';
  const panel = document.getElementById('cookie-panel');
  const settings = document.getElementById('cookie-settings');
  let active = false;
  let openedFromSettings = false;
  let choice = null;

  function readChoice() {
    try {
      const value = localStorage.getItem(key);
      return value === 'allow' || value === 'deny' ? value : null;
    } catch {
      return choice;
    }
  }

  function startAnalytics() {
    if (active) return;
    active = true;
    window.ym = window.ym || function () {
      (window.ym.a = window.ym.a || []).push(arguments);
    };
    window.ym.l = Date.now();
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://mc.yandex.ru/metrika/tag.js?id=114599279';
    document.head.appendChild(tag);
    window.ym(114599279, 'init', {
      ssr: true, webvisor: false, clickmap: false, trackLinks: false,
      referrer: document.referrer, url: location.href
    });
  }

  function clearAnalyticsCookies() {
    let cookies;
    try { cookies = document.cookie; } catch { return; }
    for (const item of cookies.split(';')) {
      const name = item.trim().split('=')[0];
      if (!name.startsWith('_ym_')) continue;
      const expired = name + '=; Max-Age=0; Path=/';
      document.cookie = expired;
      document.cookie = expired + '; Domain=' + location.hostname;
    }
  }

  function display(show) {
    panel.hidden = !show;
    settings.setAttribute('aria-expanded', String(show));
  }

  function apply(value) {
    choice = value;
    display(!choice);
    if (choice === 'allow') {
      startAnalytics();
    } else {
      if (choice === 'deny') clearAnalyticsCookies();
      if (active) {
        window.disableYaCounter114599279 = true;
        location.reload();
      }
    }
  }

  settings.hidden = false;
  settings.addEventListener('click', () => {
    openedFromSettings = true;
    display(true);
    panel.querySelector('[data-choice="' + (choice || 'deny') + '"]').focus();
  });
  for (const button of panel.querySelectorAll('[data-choice]')) {
    button.addEventListener('click', () => {
      const value = button.dataset.choice;
      try { localStorage.setItem(key, value); } catch { /* Keep the choice on this page. */ }
      apply(value);
      if (openedFromSettings) settings.focus();
      openedFromSettings = false;
    });
  }
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) apply(readChoice());
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) apply(readChoice());
  });
  apply(readChoice());
})();
