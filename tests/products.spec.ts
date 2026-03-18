import { test, expect } from '../fixtures/base.fixture';
import { DataReader } from '../utils/DataReader';

/** Shape of search test data */
interface SearchTestData {
  testCase: string;
  searchTerm: string;
  expectedMinResults: number;
}

/** Shape of category filter test data */
interface CategoryTestData {
  testCase: string;
  categoryId: number;
  expectedMinResults: number;
}

// Load all test data
const productsTestData = DataReader.readData<(SearchTestData | CategoryTestData)[]>('products.json');

// Separate search tests from category tests
const searchTests = productsTestData.filter((d): d is SearchTestData => 'searchTerm' in d);
const categoryTests = productsTestData.filter((d): d is CategoryTestData => 'categoryId' in d);

test.describe('Products Page Tests', () => {
  test('should display the products page with search and filters', async ({ productListPage }) => {
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

  // Data-driven: search tests
  for (const data of searchTests) {
    test(`Search: ${data.testCase}`, async ({ productListPage, logger }) => {
      await productListPage.goto();
      await productListPage.waitForProductsLoaded();

      logger.step(`Searching for "${data.searchTerm}"`);
      await productListPage.search(data.searchTerm);

      const count = await productListPage.getProductCount();
      expect(count).toBeGreaterThanOrEqual(data.expectedMinResults);
      logger.stepDone(`Search returned ${count} results (expected >= ${data.expectedMinResults})`);
    });
  }

  // Data-driven: category filter tests
  for (const data of categoryTests) {
    test(`Filter: ${data.testCase}`, async ({ productListPage, logger }) => {
      await productListPage.goto();
      await productListPage.waitForProductsLoaded();

      logger.step(`Filtering by category ID ${data.categoryId}`);
      await productListPage.filterByCategory(data.categoryId);

      const count = await productListPage.getProductCount();
      expect(count).toBeGreaterThanOrEqual(data.expectedMinResults);
      logger.stepDone(`Category filter returned ${count} results (expected >= ${data.expectedMinResults})`);
    });
  }

  test('should navigate to product detail when clicking a product', async ({ productListPage }) => {
    await productListPage.goto();
    await productListPage.waitForProductsLoaded();

    await productListPage.clickFirstProductCard();
    await expect(productListPage.page).toHaveURL(/#\/products\/\d+/);
  });

  test('should reset filters when clicking All', async ({ productListPage, logger }) => {
    await productListPage.goto();
    await productListPage.waitForProductsLoaded();

    const initialCount = await productListPage.getProductCount();

    logger.step('Filtering by category 1, then clicking All');
    await productListPage.filterByCategory(1);
    const filteredCount = await productListPage.getProductCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    // Reset to All
    await productListPage.clickElement(productListPage.categoryFilterAll);
    await productListPage.waitForProductsLoaded();

    const resetCount = await productListPage.getProductCount();
    expect(resetCount).toBe(initialCount);
    logger.stepDone('All filter reset products to initial count');
  });
});
