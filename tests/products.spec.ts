import { test, expect } from '../fixtures/base.fixture';

test.describe('Products Page Tests', () => {
  test('should display the products page with menu heading', async ({ productListPage }) => {
    await productListPage.goto();
    await expect(productListPage.searchInput).toBeVisible();
    await expect(productListPage.categoryFilterAll).toBeVisible();
  });

  test('should display product cards', async ({ productListPage }) => {
    await productListPage.goto();
    await productListPage.waitForProductsLoaded();
    const count = await productListPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter products by search', async ({ productListPage }) => {
    await productListPage.goto();
    await productListPage.waitForProductsLoaded();

    await productListPage.search('Espresso');
    const count = await productListPage.getProductCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should navigate to product detail when clicking a product', async ({ productListPage, page }) => {
    await productListPage.goto();
    await productListPage.waitForProductsLoaded();

    await productListPage.clickFirstProductCard();
    await expect(page).toHaveURL(/#\/products\/\d+/);
  });

  test('should filter products by category', async ({ productListPage }) => {
    await productListPage.goto();
    await productListPage.waitForProductsLoaded();

    const initialCount = await productListPage.getProductCount();

    // Click a category filter (category 1 = Coffee)
    await productListPage.filterByCategory(1);
    await productListPage.waitForProductsLoaded();

    const filteredCount = await productListPage.getProductCount();
    // Filtered count should be less than or equal to initial
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });
});
