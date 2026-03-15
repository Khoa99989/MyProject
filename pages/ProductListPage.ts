import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductListPage — Page Object for the products/menu listing page.
 */
export class ProductListPage extends BasePage {
  // --------------- Locators ---------------
  readonly searchInput: Locator;
  readonly productsGrid: Locator;
  readonly productCards: Locator;
  readonly categoryFilterAll: Locator;
  readonly loadingSpinner: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.productsGrid = page.locator('#products-grid');
    this.productCards = page.locator('.product-card');
    this.categoryFilterAll = page.locator('[data-testid="filter-all"]');
    this.loadingSpinner = page.locator('.spinner');
    this.emptyState = page.locator('.empty-state');
  }

  // --------------- Actions ---------------

  /** Navigate to the products page */
  async goto(): Promise<void> {
    await this.page.goto('/#/products');
    await this.waitForPageLoad();
  }

  /** Navigate to products filtered by a category */
  async gotoCategory(categoryId: number): Promise<void> {
    await this.page.goto(`/#/products?category=${categoryId}`);
    await this.waitForPageLoad();
  }

  /** Search for a product by name (debounced in app — wait for results after) */
  async search(query: string): Promise<void> {
    await this.fillInput(this.searchInput, query);
    await this.waitForProductsLoaded();
  }

  /** Click a category filter button */
  async filterByCategory(categoryId: number): Promise<void> {
    await this.clickElement(this.page.locator(`[data-testid="filter-${categoryId}"]`));
    await this.waitForProductsLoaded();
  }

  /** Click on a specific product card */
  async clickProduct(productId: number): Promise<void> {
    await this.clickElement(this.page.locator(`[data-testid="product-card-${productId}"] .product-card-image`));
  }

  /** Add a product to cart from the listing */
  async addToCart(productId: number): Promise<void> {
    await this.clickElement(this.page.locator(`[data-testid="add-to-cart-${productId}"]`));
  }

  /** Get the count of visible product cards */
  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  /** Wait for products to finish loading (spinner/loading state hidden) */
  async waitForProductsLoaded(): Promise<void> {
    await this.page.locator('#products-grid .loading-state, #products-grid .spinner').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  }

  /** Click the first product card (navigate to product detail) */
  async clickFirstProductCard(): Promise<void> {
    const firstCard = this.productCards.first();
    await this.clickElement(firstCard.locator('.product-card-image'));
  }

  /** Add the first visible product to cart from the list (by add-to-cart button) */
  async addFirstProductToCart(): Promise<boolean> {
    const addBtn = this.page.locator('.add-to-cart-btn[data-product-id], [data-testid^="add-to-cart-"]').first();
    await addBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (!(await addBtn.isVisible())) return false;
    await this.clickElement(addBtn);
    return true;
  }
}
