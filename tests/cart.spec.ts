import { test, expect } from '../fixtures/base.fixture';

test.describe('Cart Page Tests', () => {
  test('should require login to view cart', async ({ cartPage }) => {
    await cartPage.clearAuthStorage();
    await cartPage.goto();
    await expect(cartPage.loginPrompt).toBeVisible();
  });

  test('should show empty cart or cart content after login', async ({ cartPage, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('demo@fnb.com', 'password123');
    await loginPage.waitForLoginSuccess();

    await cartPage.goto();
    await cartPage.waitForCartLoaded();

    const isEmpty = await cartPage.isEmpty();
    if (isEmpty) {
      await expect(cartPage.browseMenuButton).toBeVisible();
    } else {
      await expect(cartPage.cartSummary).toBeVisible();
    }
  });

  test('should display cart summary with total when item added', async ({ cartPage, loginPage, productListPage }) => {
    await loginPage.goto();
    await loginPage.login('demo@fnb.com', 'password123');
    await loginPage.waitForLoginSuccess();

    await productListPage.goto();
    await productListPage.waitForProductsLoaded();

    const added = await productListPage.addFirstProductToCart();
    if (added) {
      await cartPage.goto();
      await cartPage.waitForCartLoaded();

      const itemCount = await cartPage.getItemCount();
      expect(itemCount).toBeGreaterThan(0);
      await expect(cartPage.cartTotal).toBeVisible();
    }
  });
});
