import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage — Page Object for the shopping cart page.
 */
export class CartPage extends BasePage {
  // --------------- Locators ---------------
  readonly cartItems: Locator;
  readonly cartSummary: Locator;
  readonly cartTotal: Locator;
  readonly checkoutButton: Locator;
  readonly clearCartButton: Locator;
  readonly emptyState: Locator;
  readonly browseMenuButton: Locator;
  readonly loginPrompt: Locator;
  readonly cartItemRow: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-testid="cart-items"]');
    this.cartItemRow = page.locator('.cart-item');
    this.cartSummary = page.locator('[data-testid="cart-summary"]');
    this.cartTotal = page.locator('[data-testid="cart-total"]');
    this.checkoutButton = page.locator('[data-testid="checkout-btn"]');
    this.clearCartButton = page.locator('[data-testid="clear-cart"]');
    this.emptyState = page.locator('.empty-state');
    this.browseMenuButton = page.locator('[data-testid="browse-menu"]');
    this.loginPrompt = page.locator('[data-testid="login-prompt"]');
  }

  // --------------- Actions ---------------

  /** Navigate to the cart page */
  async goto(): Promise<void> {
    await this.page.goto('/#/cart');
    await this.waitForPageLoad();
  }

  /** Wait until cart content has loaded (loading spinner gone, then empty state or summary visible) */
  async waitForCartLoaded(): Promise<void> {
    await this.page.locator('.cart-page .loading-state, .cart-page .spinner').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    await this.page.waitForSelector('.empty-state, [data-testid="cart-summary"], [data-testid="login-prompt"]', { timeout: 10000 });
  }

  /** Get the number of items in cart */
  async getItemCount(): Promise<number> {
    return this.cartItemRow.count();
  }

  /** Get the total price text */
  async getTotal(): Promise<string> {
    return this.getText(this.cartTotal);
  }

  /** Remove a specific cart item */
  async removeItem(itemId: number): Promise<void> {
    await this.clickElement(this.page.locator(`[data-testid="remove-${itemId}"]`));
  }

  /** Increase quantity of a specific cart item */
  async increaseItemQty(itemId: number): Promise<void> {
    await this.clickElement(this.page.locator(`[data-testid="increase-${itemId}"]`));
  }

  /** Decrease quantity of a specific cart item */
  async decreaseItemQty(itemId: number): Promise<void> {
    await this.clickElement(this.page.locator(`[data-testid="decrease-${itemId}"]`));
  }

  /** Click clear cart button */
  async clearCart(): Promise<void> {
    await this.clickElement(this.clearCartButton);
  }

  /** Click checkout button */
  async checkout(): Promise<void> {
    await this.clickElement(this.checkoutButton);
  }

  /** Check if cart is empty (logged-in user: empty state with Browse Menu) */
  async isEmpty(): Promise<boolean> {
    const hasEmptyState = await this.emptyState.isVisible();
    const hasItems = await this.cartItemRow.count() > 0;
    return hasEmptyState && !hasItems;
  }
}
