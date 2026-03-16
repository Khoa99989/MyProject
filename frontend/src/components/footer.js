/**
 * Footer component
 */
import { t } from '../i18n.js';

export function renderFooter() {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <h3>☕ <span>Brew</span>ly</h3>
            <p>${t('footer.brand')}</p>
          </div>
          <div class="footer-col">
            <h4>${t('footer.menu')}</h4>
            <ul>
              <li><a href="#/products?category=1">Coffee</a></li>
              <li><a href="#/products?category=2">Tea</a></li>
              <li><a href="#/products?category=3">Juice & Smoothie</a></li>
              <li><a href="#/products?category=4">Bakery</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>${t('footer.company')}</h4>
            <ul>
              <li><a href="#/">${t('footer.aboutUs')}</a></li>
              <li><a href="#/">${t('footer.careers')}</a></li>
              <li><a href="#/">${t('footer.contact')}</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>${t('footer.support')}</h4>
            <ul>
              <li><a href="#/">${t('footer.faq')}</a></li>
              <li><a href="#/">${t('footer.shipping')}</a></li>
              <li><a href="#/">${t('footer.returns')}</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          &copy; ${new Date().getFullYear()} ${t('footer.copyright')}
        </div>
      </div>
    </footer>
  `;
}
