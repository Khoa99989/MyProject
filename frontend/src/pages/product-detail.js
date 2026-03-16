/**
 * Product Detail Page
 */
import { getProduct, addToCart, isLoggedIn } from '../api.js';
import { showToast } from '../main.js';
import { t } from '../i18n.js';

export async function renderProductDetailPage(id) {
  return `
    <div class="product-detail">
      <div class="container" id="product-detail-container">
        <div class="loading-state"><div class="spinner"></div>${t('detail.loadingProduct')}</div>
      </div>
    </div>
  `;
}

export async function initProductDetailPage(id) {
  const container = document.getElementById('product-detail-container');
  if (!container) return;

  try {
    const product = await getProduct(id);
    const categoryName = product.category?.name || '';

    container.innerHTML = `
      <a href="#/products" class="btn btn-ghost btn-sm" style="margin-bottom: var(--space-xl);" data-testid="back-to-products">${t('detail.backToMenu')}</a>

      <div class="product-detail-grid">
        <div class="product-detail-image">
          <img src="${product.image}" alt="${product.name}" data-testid="product-image" />
        </div>

        <div class="product-detail-info">
          <div class="product-detail-category" data-testid="product-category">${categoryName}</div>
          <h1 data-testid="product-name">${product.name}</h1>

          <div class="product-card-rating" style="margin-bottom: var(--space-lg); font-size: 1rem;">
            <span class="star">★</span> ${product.rating.toFixed(1)} ${t('detail.rating')}
            ${!product.in_stock ? `<span style="color:var(--error); margin-left: 1rem;">${t('detail.outOfStock')}</span>` : `<span style="color:var(--success); margin-left: 1rem;">${t('detail.inStock')}</span>`}
          </div>

          <div class="product-detail-price" data-testid="product-price">$${product.price.toFixed(2)}</div>

          <p class="product-detail-desc" data-testid="product-description">${product.description}</p>

          ${product.in_stock ? `
            <div class="product-detail-actions">
              <div class="quantity-control">
                <button id="qty-minus" data-testid="qty-minus">−</button>
                <span id="qty-value" data-testid="qty-value">1</span>
                <button id="qty-plus" data-testid="qty-plus">+</button>
              </div>
              <button class="btn btn-primary btn-lg" id="add-to-cart-detail" data-testid="add-to-cart-detail">
                ${t('detail.addToCart')} — $${product.price.toFixed(2)}
              </button>
            </div>
          ` : `
            <button class="btn btn-secondary btn-lg" disabled>${t('detail.outOfStock')}</button>
          `}
        </div>
      </div>
    `;

    // Quantity controls
    let qty = 1;
    const qtyValue = document.getElementById('qty-value');
    const addBtn = document.getElementById('add-to-cart-detail');

    document.getElementById('qty-minus')?.addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        qtyValue.textContent = qty;
        addBtn.textContent = `${t('detail.addToCart')} — $${(product.price * qty).toFixed(2)}`;
      }
    });

    document.getElementById('qty-plus')?.addEventListener('click', () => {
      if (qty < 20) {
        qty++;
        qtyValue.textContent = qty;
        addBtn.textContent = `${t('detail.addToCart')} — $${(product.price * qty).toFixed(2)}`;
      }
    });

    addBtn?.addEventListener('click', async () => {
      if (!isLoggedIn()) {
        window.location.hash = '#/login';
        return;
      }
      try {
        await addToCart(product.id, qty);
        showToast(`✅ ${qty}× ${product.name} ${t('detail.addedToCart')}`);
        window.dispatchEvent(new Event('cart-updated'));
      } catch (err) {
        showToast('❌ ' + err.message);
      }
    });

  } catch (e) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">😕</div>
        <h3>${t('detail.notFound')}</h3>
        <p>${t('detail.notFoundDesc')}</p>
        <a href="#/products" class="btn btn-primary">${t('detail.browseMenu')}</a>
      </div>
    `;
  }
}
