/**
 * Products Page
 */
import { getProducts, getCategories, addToCart, isLoggedIn } from '../api.js';
import { renderProductCard } from '../components/product-card.js';
import { showToast } from '../main.js';

let debounceTimer;

export async function renderProductsPage() {
  return `
    <div class="products-page">
      <div class="container">
        <div class="section-header" style="text-align:left; margin-bottom: var(--space-xl);">
          <h2>Our Menu</h2>
          <p>Browse our full collection of premium food & beverages</p>
        </div>

        <div class="products-layout">
          <aside class="products-sidebar">
            <div class="sidebar-section">
              <h3>Search</h3>
              <input type="text" class="search-input" id="search-input" 
                     placeholder="Search products..." data-testid="search-input" />
            </div>
            <div class="sidebar-section">
              <h3>Categories</h3>
              <div class="category-filter" id="category-filter">
                <button class="active" data-category="" data-testid="filter-all">All</button>
              </div>
            </div>
          </aside>

          <div>
            <div class="products-grid" id="products-grid">
              <div class="loading-state"><div class="spinner"></div>Loading products...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function initProductsPage() {
  // Parse URL params
  const hashParts = window.location.hash.split('?');
  const params = new URLSearchParams(hashParts[1] || '');
  const initialCategory = params.get('category') || '';

  // Load categories for filter
  try {
    const categories = await getCategories();
    const filterContainer = document.getElementById('category-filter');
    if (filterContainer) {
      filterContainer.innerHTML = `
        <button class="${!initialCategory ? 'active' : ''}" data-category="" data-testid="filter-all">All</button>
        ${categories.map(cat => `
          <button class="${initialCategory == cat.id ? 'active' : ''}" 
                  data-category="${cat.id}" 
                  data-testid="filter-${cat.id}">${cat.name}</button>
        `).join('')}
      `;

      // Category click handler
      filterContainer.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          filterContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          loadProducts({ category: btn.dataset.category });
        });
      });
    }
  } catch (e) { /* silently fail */ }

  // Search handler
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const activeCategory = document.querySelector('.category-filter button.active')?.dataset?.category || '';
        loadProducts({ category: activeCategory, search: searchInput.value });
      }, 300);
    });
  }

  // Initial load
  loadProducts({ category: initialCategory });
}

async function loadProducts(params = {}) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading-state"><div class="spinner"></div>Loading...</div>';

  try {
    const data = await getProducts(params);
    const products = data.products || [];

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-state-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(p => renderProductCard(p)).join('');

    // Attach add-to-cart handlers
    grid.querySelectorAll('.add-to-cart-btn[data-product-id]').forEach(btn => {
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
  } catch (e) {
    grid.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;">Failed to load products</p>';
  }
}
