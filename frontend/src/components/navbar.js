/**
 * Navbar component
 */
import { isLoggedIn, getUser, clearToken } from '../api.js';
import { t, getLang, setLang } from '../i18n.js';

export function renderNavbar() {
  const user = getUser();
  const loggedIn = isLoggedIn();
  const lang = getLang();

  return `
    <nav class="navbar" id="navbar">
      <div class="navbar-inner">
        <a class="navbar-logo" href="#/" data-testid="navbar-logo">
          ☕ <span>Brew</span>ly
        </a>

        <ul class="navbar-nav">
          <li><a href="#/" data-testid="nav-home">${t('nav.home')}</a></li>
          <li><a href="#/products" data-testid="nav-products">${t('nav.menu')}</a></li>
        </ul>

        <div class="navbar-actions">
          <div class="lang-switcher" id="lang-switcher" data-testid="lang-switcher">
            <button class="${lang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
            <button class="${lang === 'vi' ? 'active' : ''}" data-lang="vi">VI</button>
          </div>

          <button class="cart-btn" onclick="window.location.hash='#/cart'" data-testid="nav-cart">
            🛒
            <span class="cart-badge" id="cart-badge" data-testid="cart-badge">0</span>
          </button>

          ${loggedIn
            ? `<div style="display:flex;align-items:center;gap:0.75rem;">
                <span style="color:var(--text-secondary);font-size:0.85rem;">${t('nav.hi')}, ${user?.name || 'User'}</span>
                <button class="btn btn-ghost btn-sm" id="logout-btn" data-testid="logout-button">${t('nav.logout')}</button>
              </div>`
            : `<a href="#/login" class="btn btn-primary btn-sm" data-testid="login-button">${t('nav.signIn')}</a>`
          }
        </div>
      </div>
    </nav>
  `;
}

export function initNavbar() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearToken();
      window.location.hash = '#/';
      window.location.reload();
    });
  }

  // Language switcher
  const langSwitcher = document.getElementById('lang-switcher');
  if (langSwitcher) {
    langSwitcher.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        setLang(btn.dataset.lang);
      });
    });
  }

  // Highlight current nav link
  const hash = window.location.hash || '#/';
  document.querySelectorAll('.navbar-nav a').forEach(link => {
    if (link.getAttribute('href') === hash) {
      link.classList.add('active');
    }
  });
}

export function updateCartBadge(count) {
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('show', count > 0);
  }
}
