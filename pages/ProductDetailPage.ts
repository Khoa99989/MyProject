import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductDetailPage — Page Object for the product detail view.
 */
export class ProductDetailPage extends BasePage {
  // --------------- Locators ---------------
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly productCategory: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;
  readonly quantityValue: Locator;
  readonly quantityPlus: Locator;
  readonly quantityMinus: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('[data-testid="product-name"]');
    this.productPrice = page.locator('[data-testid="product-price"]');
    this.productDescription = page.locator('[data-testid="product-description"]');
    this.productCategory = page.locator('[data-testid="product-category"]');
    this.productImage = page.locator('[data-testid="product-image"]');
    this.addToCartButton = page.locator('[data-testid="add-to-cart-detail"]');
    this.quantityValue = page.locator('[data-testid="qty-value"]');
    this.quantityPlus = page.locator('[data-testid="qty-plus"]');
    this.quantityMinus = page.locator('[data-testid="qty-minus"]');
    this.backButton = page.locator('[data-testid="back-to-products"]');
  }

  // --------------- Actions ---------------

  /** Navigate to a specific product detail page */
  async goto(productId: number): Promise<void> {
    await this.page.goto(`/#/products/${productId}`);
    await this.waitForPageLoad();
  }

  /** Add the product to cart with the current quantity */
  async addToCart(): Promise<void> {
    await this.clickElement(this.addToCartButton);
  }

  /** Increase the quantity */
  async increaseQuantity(times: number = 1): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.clickElement(this.quantityPlus);
    }
  }

  /** Decrease the quantity */
  async decreaseQuantity(times: number = 1): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.clickElement(this.quantityMinus);
    }
  }

  /** Get the current quantity value */
  async getQuantity(): Promise<number> {
    const text = await this.getText(this.quantityValue);
    return parseInt(text, 10);
  }

  /** Go back to product list */
  async goBack(): Promise<void> {
    await this.clickElement(this.backButton);
  }

  /** Get the product name text */
  async getName(): Promise<string> {
    return this.getText(this.productName);
  }

  /** Get the product price text */
  async getPrice(): Promise<string> {
    return this.getText(this.productPrice);
  }
}
