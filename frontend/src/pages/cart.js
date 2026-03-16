/**
 * Cart Page
 */
import { getCart, updateCartItem, removeFromCart, clearCart, isLoggedIn } from '../api.js';
import { showToast } from '../main.js';
import { t } from '../i18n.js';

export async function renderCartPage() {
  if (!isLoggedIn()) {
    return `
      <div class="auth-page">
        <div class="empty-state">
          <div class="empty-state-icon">🔐</div>
          <h3>${t('cart.signInRequired')}</h3>
          <p>${t('cart.signInRequiredDesc')}</p>
          <a href="#/login" class="btn btn-primary" data-testid="login-prompt">${t('cart.signIn')}</a>
        </div>
      </div>
    `;
  }

  return `
    <div class="cart-page">
      <div class="container">
        <div class="section-header" style="text-align:left; margin-bottom: var(--space-xl);">
          <h2>${t('cart.title')}</h2>
        </div>
        <div id="cart-content">
          <div class="loading-state"><div class="spinner"></div>${t('cart.loading')}</div>
        </div>
      </div>
    </div>
  `;
}

export async function initCartPage() {
  if (!isLoggedIn()) return;
  await loadCart();
}

async function loadCart() {
  const container = document.getElementById('cart-content');
  if (!container) return;

  try {
    const data = await getCart();
    const items = data.items || [];

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🛒</div>
          <h3>${t('cart.empty')}</h3>
          <p>${t('cart.emptyDesc')}</p>
          <a href="#/products" class="btn btn-primary" data-testid="browse-menu">${t('cart.browseMenu')}</a>
        </div>
      `;
      window.dispatchEvent(new Event('cart-updated'));
      return;
    }

    container.innerHTML = `
      <div class="cart-grid">
        <div class="cart-items" data-testid="cart-items">
          ${items.map(item => `
            <div class="cart-item" data-item-id="${item.id}" data-testid="cart-item-${item.id}">
              <div class="cart-item-image">
                <img src="${item.product.image}" alt="${item.product.name}" loading="lazy" />
              </div>
              <div class="cart-item-info">
                <div>
                  <div class="cart-item-name">${item.product.name}</div>
                  <div class="cart-item-price">$${item.product.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                  <div class="quantity-control">
                    <button class="qty-btn" data-action="decrease" data-item-id="${item.id}" data-testid="decrease-${item.id}">−</button>
                    <span data-testid="qty-${item.id}">${item.quantity}</span>
                    <button class="qty-btn" data-action="increase" data-item-id="${item.id}" data-testid="increase-${item.id}">+</button>
                  </div>
                  <button class="btn btn-ghost btn-sm remove-btn" data-item-id="${item.id}" data-testid="remove-${item.id}">🗑️ ${t('cart.remove')}</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="cart-summary" data-testid="cart-summary">
          <h3>${t('cart.orderSummary')}</h3>
          <div class="cart-summary-row">
            <span>${t('cart.subtotal')} (${items.reduce((s, i) => s + i.quantity, 0)} ${t('cart.items')})</span>
            <span>$${data.total.toFixed(2)}</span>
          </div>
          <div class="cart-summary-row">
            <span>${t('cart.delivery')}</span>
            <span style="color:var(--success);">${t('cart.free')}</span>
          </div>
          <div class="cart-summary-total">
            <span>${t('cart.total')}</span>
            <span data-testid="cart-total">$${data.total.toFixed(2)}</span>
          </div>
          <button class="btn btn-primary" data-testid="checkout-btn">${t('cart.checkout')}</button>
          <button class="btn btn-ghost btn-sm" style="width:100%;margin-top:var(--space-sm);" id="clear-cart-btn" data-testid="clear-cart">${t('cart.clearCart')}</button>
        </div>
      </div>
    `;

    // Quantity buttons
    container.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const itemId = parseInt(btn.dataset.itemId);
        const item = items.find(i => i.id === itemId);
        if (!item) return;

        const newQty = btn.dataset.action === 'increase' ? item.quantity + 1 : item.quantity - 1;

        if (newQty < 1) {
          await removeFromCart(itemId);
          showToast(t('cart.itemRemoved'));
        } else {
          await updateCartItem(itemId, newQty);
        }
        await loadCart();
        window.dispatchEvent(new Event('cart-updated'));
      });
    });

    // Remove buttons
    container.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const itemId = parseInt(btn.dataset.itemId);
        await removeFromCart(itemId);
        showToast(t('cart.itemRemoved'));
        await loadCart();
        window.dispatchEvent(new Event('cart-updated'));
      });
    });

    // Clear cart
    document.getElementById('clear-cart-btn')?.addEventListener('click', async () => {
      await clearCart();
      showToast(t('cart.cartCleared'));
      await loadCart();
      window.dispatchEvent(new Event('cart-updated'));
    });

    window.dispatchEvent(new Event('cart-updated'));

  } catch (e) {
    container.innerHTML = `<p style="color:var(--text-muted);">${t('cart.error')}</p>`;
  }
}
