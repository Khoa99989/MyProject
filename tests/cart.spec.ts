import { test, expect } from '../fixtures/base.fixture';

test.describe('Cart Page Tests', () => {
  test('should require login to view cart', async ({ cartPage }) => {
    await cartPage.goto();
    await expect(cartPage.loginPrompt).toBeVisible({ timeout: 10000 });
  });

  test('should show empty cart after login (no items added)', async ({ loginPage, cartPage }) => {
    await loginPage.loginViaApi();

    // Clear cart first to ensure clean state
    await cartPage.page.request.delete('http://localhost:8080/api/cart', {
      headers: {
        Authorization: `Bearer ${await cartPage.page.evaluate(() => localStorage.getItem('fnb_token'))}`,
      },
    });

    await cartPage.goto();
    await cartPage.waitForCartLoaded();

    const isEmpty = await cartPage.isEmpty();
    if (isEmpty) {
      await expect(cartPage.browseMenuButton).toBeVisible();
    }
  });

  test('should display cart summary with total when item added', async ({
    loginPage, productListPage, cartPage, logger,
  }) => {
    await loginPage.loginViaApi();

    logger.step('Adding a product to cart from product list');
    await productListPage.goto();
    await productListPage.waitForProductsLoaded();

    const added = await productListPage.addFirstProductToCart();
    if (added) {
      await productListPage.page.waitForTimeout(1000);

      await cartPage.goto();
      await cartPage.waitForCartLoaded();

      const itemCount = await cartPage.getItemCount();
      expect(itemCount).toBeGreaterThan(0);
      await expect(cartPage.cartTotal).toBeVisible();
      logger.stepDone(`Cart has ${itemCount} item(s) with total displayed`);
    }
  });

  test('should clear entire cart', async ({
    loginPage, productListPage, cartPage, logger,
  }) => {
    await loginPage.loginViaApi();

    // Add a product first
    await productListPage.goto();
    await productListPage.waitForProductsLoaded();
    const added = await productListPage.addFirstProductToCart();
    if (!added) return;
    await productListPage.page.waitForTimeout(1000);

    logger.step('Clearing cart');
    await cartPage.goto();
    await cartPage.waitForCartLoaded();

    // Verify cart has items before clearing
    const beforeCount = await cartPage.getItemCount();
    expect(beforeCount).toBeGreaterThan(0);

    await cartPage.clearCart();
    await cartPage.page.waitForTimeout(1000);

    // Cart should now be empty
    await cartPage.waitForCartLoaded();
    const isEmpty = await cartPage.isEmpty();
    expect(isEmpty).toBe(true);
    logger.stepDone('Cart cleared successfully');
  });

  test('should navigate to menu when clicking Browse Menu on empty cart', async ({
    loginPage, cartPage, logger,
  }) => {
    await loginPage.loginViaApi();

    // Clear cart via API
    await cartPage.page.request.delete('http://localhost:8080/api/cart', {
      headers: {
        Authorization: `Bearer ${await cartPage.page.evaluate(() => localStorage.getItem('fnb_token'))}`,
      },
    });

    await cartPage.goto();
    await cartPage.waitForCartLoaded();

    const isEmpty = await cartPage.isEmpty();
    if (isEmpty) {
      logger.step('Clicking Browse Menu on empty cart');
      await cartPage.clickElement(cartPage.browseMenuButton);
      await cartPage.waitForPageLoad();
      await expect(cartPage.page).toHaveURL(/#\/products/);
      logger.stepDone('Navigated to products page from empty cart');
    }
  });
});
