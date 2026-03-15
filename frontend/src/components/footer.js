/**
 * Footer component
 */
export function renderFooter() {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <h3>☕ <span>Brew</span>ly</h3>
            <p>Premium food & beverages crafted with passion. From artisan coffee to freshly baked goods — we deliver quality to your door.</p>
          </div>
          <div class="footer-col">
            <h4>Menu</h4>
            <ul>
              <li><a href="#/products?category=1">Coffee</a></li>
              <li><a href="#/products?category=2">Tea</a></li>
              <li><a href="#/products?category=3">Juice & Smoothie</a></li>
              <li><a href="#/products?category=4">Bakery</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#/">About Us</a></li>
              <li><a href="#/">Careers</a></li>
              <li><a href="#/">Contact</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#/">FAQ</a></li>
              <li><a href="#/">Shipping</a></li>
              <li><a href="#/">Returns</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          &copy; ${new Date().getFullYear()} Brewly. All rights reserved.
        </div>
      </div>
    </footer>
  `;
}
