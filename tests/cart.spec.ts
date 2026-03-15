import { test, expect } from '../fixtures/base.fixture';

test.describe('Cart Page Tests', () => {
  test('should require login to view cart', async ({ cartPage }) => {
    await cartPage.goto();
    await expect(cartPage.loginPrompt).toBeVisible({ timeout: 10000 });
  });

  test('should show empty cart or cart content after login', async ({ loginPage, cartPage }) => {
    // loginViaApi sets localStorage + navigates to home + reloads
    await loginPage.loginViaApi();
    await cartPage.goto();
    await cartPage.waitForCartLoaded();

    const isEmpty = await cartPage.isEmpty();
    if (isEmpty) {
      await expect(cartPage.browseMenuButton).toBeVisible();
    } else {
      await expect(cartPage.cartSummary).toBeVisible();
    }
  });

  test('should display cart summary with total when item added', async ({ loginPage, productListPage, cartPage }) => {
    await loginPage.loginViaApi();

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
    }
  });
});
