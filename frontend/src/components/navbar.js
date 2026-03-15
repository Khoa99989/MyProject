/**
 * Navbar component
 */
import { isLoggedIn, getUser, clearToken } from '../api.js';

export function renderNavbar() {
  const user = getUser();
  const loggedIn = isLoggedIn();

  return `
    <nav class="navbar" id="navbar">
      <div class="navbar-inner">
        <a class="navbar-logo" href="#/" data-testid="navbar-logo">
          ☕ <span>Brew</span>ly
        </a>

        <ul class="navbar-nav">
          <li><a href="#/" data-testid="nav-home">Home</a></li>
          <li><a href="#/products" data-testid="nav-products">Menu</a></li>
        </ul>

        <div class="navbar-actions">
          <button class="cart-btn" onclick="window.location.hash='#/cart'" data-testid="nav-cart">
            🛒
            <span class="cart-badge" id="cart-badge" data-testid="cart-badge">0</span>
          </button>

          ${loggedIn
            ? `<div style="display:flex;align-items:center;gap:0.75rem;">
                <span style="color:var(--text-secondary);font-size:0.85rem;">Hi, ${user?.name || 'User'}</span>
                <button class="btn btn-ghost btn-sm" id="logout-btn" data-testid="logout-button">Logout</button>
              </div>`
            : `<a href="#/login" class="btn btn-primary btn-sm" data-testid="login-button">Sign In</a>`
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
