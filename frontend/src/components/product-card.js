/**
 * Product Card component
 */
export function renderProductCard(product) {
  const categoryName = product.category?.name || '';
  const outOfStock = !product.in_stock;

  return `
    <div class="product-card ${outOfStock ? 'out-of-stock' : ''}" 
         data-product-id="${product.id}" 
         data-testid="product-card-${product.id}">
      <div class="product-card-image" onclick="window.location.hash='#/products/${product.id}'">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        ${outOfStock
          ? '<span class="product-card-badge out-of-stock-badge">Sold Out</span>'
          : product.rating >= 4.8
            ? '<span class="product-card-badge">⭐ Best Seller</span>'
            : ''
        }
      </div>
      <div class="product-card-body">
        <div class="product-card-category">${categoryName}</div>
        <h3 class="product-card-name">${product.name}</h3>
        <p class="product-card-desc">${product.description}</p>
        <div class="product-card-footer">
          <span class="product-card-price">$${product.price.toFixed(2)}</span>
          <span class="product-card-rating">
            <span class="star">★</span> ${product.rating.toFixed(1)}
          </span>
        </div>
        ${!outOfStock
          ? `<button class="btn btn-primary btn-sm add-to-cart-btn" 
                     data-product-id="${product.id}"
                     data-testid="add-to-cart-${product.id}">
              Add to Cart
            </button>`
          : `<button class="btn btn-secondary btn-sm add-to-cart-btn" disabled>
              Out of Stock
            </button>`
        }
      </div>
    </div>
  `;
}
