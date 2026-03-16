/**
 * Brewly F&B — Main Application Entry
 * Hash-based SPA router
 */
import './style.css';
import { renderNavbar, initNavbar, updateCartBadge } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { renderHomePage, initHomePage } from './pages/home.js';
import { renderProductsPage, initProductsPage } from './pages/products.js';
import { renderProductDetailPage, initProductDetailPage } from './pages/product-detail.js';
import { renderCartPage, initCartPage } from './pages/cart.js';
import { renderLoginPage, initLoginPage } from './pages/login.js';
import { renderRegisterPage, initRegisterPage } from './pages/register.js';
import { getCart, isLoggedIn } from './api.js';
import { t } from './i18n.js';

const app = document.getElementById('app');

// Toast container
const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

/** Show a toast notification */
export function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/** Update the cart badge in the navbar */
async function refreshCartBadge() {
  if (!isLoggedIn()) {
    updateCartBadge(0);
    return;
  }
  try {
    const data = await getCart();
    const count = (data.items || []).reduce((sum, item) => sum + item.quantity, 0);
    updateCartBadge(count);
  } catch {
    updateCartBadge(0);
  }
}

/** Route definitions */
async function router() {
  const hash = window.location.hash || '#/';
  const path = hash.split('?')[0]; // ignore query params for routing

  let pageHtml = '';
  let initFn = null;
  let initArg = null;

  // Match routes
  if (path === '#/' || path === '#') {
    pageHtml = await renderHomePage();
    initFn = initHomePage;
  } else if (path === '#/products') {
    pageHtml = await renderProductsPage();
    initFn = initProductsPage;
  } else if (path.startsWith('#/products/')) {
    const id = path.split('/')[2];
    pageHtml = await renderProductDetailPage(id);
    initFn = initProductDetailPage;
    initArg = id;
  } else if (path === '#/cart') {
    pageHtml = await renderCartPage();
    initFn = initCartPage;
  } else if (path === '#/login') {
    pageHtml = await renderLoginPage();
    initFn = initLoginPage;
  } else if (path === '#/register') {
    pageHtml = await renderRegisterPage();
    initFn = initRegisterPage;
  } else {
    // 404
    pageHtml = `
      <div class="auth-page">
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3>${t('notFound.title')}</h3>
          <p>${t('notFound.desc')}</p>
          <a href="#/" class="btn btn-primary">${t('notFound.goHome')}</a>
        </div>
      </div>
    `;
  }

  // Render
  app.innerHTML = `
    ${renderNavbar()}
    <main id="page-content">${pageHtml}</main>
    ${renderFooter()}
  `;

  // Initialize page
  initNavbar();
  if (initFn) {
    await initFn(initArg);
  }

  // Refresh cart badge
  refreshCartBadge();

  // Scroll to top
  window.scrollTo(0, 0);
}

// Listen for hash changes
window.addEventListener('hashchange', router);

// Listen for cart updates
window.addEventListener('cart-updated', refreshCartBadge);

// Initial render
router();
