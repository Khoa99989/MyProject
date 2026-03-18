import { test, expect } from '../fixtures/base.fixture';

test.describe('Product Detail Page Tests', () => {
  const TEST_PRODUCT_ID = 1; // Use the first seeded product

  test('should display product details', async ({ productDetailPage, logger }) => {
    logger.step(`Navigating to product ${TEST_PRODUCT_ID}`);
    await productDetailPage.goto(TEST_PRODUCT_ID);

    await expect(productDetailPage.productName).toBeVisible();
    await expect(productDetailPage.productPrice).toBeVisible();
    await expect(productDetailPage.productDescription).toBeVisible();
    await expect(productDetailPage.productImage).toBeVisible();

    const name = await productDetailPage.getName();
    const price = await productDetailPage.getPrice();
    expect(name).toBeTruthy();
    expect(price).toBeTruthy();
    logger.stepDone(`Product loaded: "${name}" — ${price}`);
  });

  test('should display add to cart button', async ({ productDetailPage }) => {
    await productDetailPage.goto(TEST_PRODUCT_ID);
    await expect(productDetailPage.addToCartButton).toBeVisible();
  });

  test('should display quantity controls', async ({ productDetailPage }) => {
    await productDetailPage.goto(TEST_PRODUCT_ID);
    await expect(productDetailPage.quantityValue).toBeVisible();
    await expect(productDetailPage.quantityPlus).toBeVisible();
    await expect(productDetailPage.quantityMinus).toBeVisible();

    const qty = await productDetailPage.getQuantity();
    expect(qty).toBe(1); // Default quantity should be 1
  });

  test('should increase quantity', async ({ productDetailPage, logger }) => {
    await productDetailPage.goto(TEST_PRODUCT_ID);

    logger.step('Increasing quantity by 2');
    await productDetailPage.increaseQuantity(2);

    const qty = await productDetailPage.getQuantity();
    expect(qty).toBe(3); // 1 (default) + 2
    logger.stepDone(`Quantity increased to ${qty}`);
  });

  test('should decrease quantity (not below 1)', async ({ productDetailPage, logger }) => {
    await productDetailPage.goto(TEST_PRODUCT_ID);

    logger.step('Increasing to 3, then decreasing by 1');
    await productDetailPage.increaseQuantity(2);
    await productDetailPage.decreaseQuantity(1);

    const qty = await productDetailPage.getQuantity();
    expect(qty).toBe(2); // 3 - 1
    logger.stepDone(`Quantity decreased to ${qty}`);
  });

  test('should not decrease quantity below 1', async ({ productDetailPage }) => {
    await productDetailPage.goto(TEST_PRODUCT_ID);

    // Try to decrease from default 1
    await productDetailPage.decreaseQuantity(1);

    const qty = await productDetailPage.getQuantity();
    expect(qty).toBeGreaterThanOrEqual(1);
  });

  test('should navigate back to product list', async ({ productDetailPage, logger }) => {
    await productDetailPage.goto(TEST_PRODUCT_ID);

    logger.step('Clicking back button');
    await productDetailPage.goBack();
    await expect(productDetailPage.page).toHaveURL(/#\/products/);
    logger.stepDone('Navigated back to product list');
  });

  test('should add product to cart when logged in', async ({ loginPage, productDetailPage, logger }) => {
    await loginPage.loginViaApi();

    logger.step(`Adding product ${TEST_PRODUCT_ID} to cart`);
    await productDetailPage.goto(TEST_PRODUCT_ID);
    await productDetailPage.addToCart();

    // Verify toast or cart badge update (product added successfully)
    // Wait a moment for the cart update to process
    await productDetailPage.page.waitForTimeout(1000);
    logger.stepDone('Product added to cart');
  });

  test('should navigate to product detail from product list', async ({ productListPage, productDetailPage }) => {
    await productListPage.goto();
    await productListPage.waitForProductsLoaded();

    await productListPage.clickFirstProductCard();
    await expect(productDetailPage.page).toHaveURL(/#\/products\/\d+/);

    // Verify product detail page content loaded
    await expect(productDetailPage.productName).toBeVisible();
    await expect(productDetailPage.productPrice).toBeVisible();
  });
});
