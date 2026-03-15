/**
 * Home Page
 */
import { getFeaturedProducts, getCategories, addToCart, isLoggedIn } from '../api.js';
import { renderProductCard } from '../components/product-card.js';
import { showToast } from '../main.js';

export async function renderHomePage() {
  return `
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">✨ Crafted with Passion</div>
          <h1>Discover the Finest <span class="highlight">Food & Beverages</span></h1>
          <p>From artisan coffee and premium teas to freshly baked pastries — every sip and bite is an experience worth savoring.</p>
          <div class="hero-actions">
            <a href="#/products" class="btn btn-primary btn-lg" data-testid="explore-menu-btn">Explore Menu</a>
            <a href="#/register" class="btn btn-secondary btn-lg" data-testid="join-btn">Join Brewly</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="categories-section">
      <div class="container">
        <div class="section-header">
          <h2>Our Categories</h2>
          <p>Explore our carefully curated selection of premium food and beverages</p>
        </div>
        <div class="categories-grid" id="categories-grid">
          <div class="loading-state"><div class="spinner"></div>Loading categories...</div>
        </div>
      </div>
    </section>

    <section class="section" style="background: var(--bg-secondary);">
      <div class="container">
        <div class="section-header">
          <h2>Popular Right Now</h2>
          <p>Trending items loved by our customers</p>
        </div>
        <div class="products-grid" id="featured-grid">
          <div class="loading-state"><div class="spinner"></div>Loading products...</div>
        </div>
      </div>
    </section>
  `;
}

export async function initHomePage() {
  // Load categories
  try {
    const categories = await getCategories();
    const grid = document.getElementById('categories-grid');
    if (grid && categories.length) {
      grid.innerHTML = categories.map(cat => `
        <a class="category-card" href="#/products?category=${cat.id}" data-testid="category-${cat.id}">
          <img src="${cat.image}" alt="${cat.name}" loading="lazy" />
          <div class="category-card-overlay">
            <h3>${cat.name}</h3>
            <p>${cat.description}</p>
          </div>
        </a>
      `).join('');
    }
  } catch (e) {
    document.getElementById('categories-grid').innerHTML = '<p style="color:var(--text-muted)">Unable to load categories</p>';
  }

  // Load featured products
  try {
    const products = await getFeaturedProducts();
    const grid = document.getElementById('featured-grid');
    if (grid && products.length) {
      grid.innerHTML = products.map(p => renderProductCard(p)).join('');
      attachAddToCartHandlers(grid);
    }
  } catch (e) {
    document.getElementById('featured-grid').innerHTML = '<p style="color:var(--text-muted)">Unable to load products</p>';
  }
}

function attachAddToCartHandlers(container) {
  container.querySelectorAll('.add-to-cart-btn[data-product-id]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!isLoggedIn()) {
        window.location.hash = '#/login';
        return;
      }
      const productId = parseInt(btn.dataset.productId);
      try {
        await addToCart(productId, 1);
        showToast('✅ Added to cart!');
        window.dispatchEvent(new Event('cart-updated'));
      } catch (err) {
        showToast('❌ ' + err.message);
      }
    });
  });
}
