import { test, expect } from '../fixtures/base.fixture';

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('should load the home page successfully', async ({ homePage, logger }) => {
    logger.step('Verifying home page loads');
    await expect(homePage.heroTitle).toBeVisible({ timeout: 10000 });
    const title = await homePage.getTitle();
    expect(title).toBeTruthy();
    logger.stepDone(`Home page loaded with title: "${title}"`);
  });

  test('should display the navigation bar', async ({ homePage }) => {
    await expect(homePage.navBar).toBeVisible();
  });

  test('should display hero section with CTA buttons', async ({ homePage }) => {
    await expect(homePage.heroTitle).toBeVisible();
    await expect(homePage.exploreMenuBtn).toBeVisible();
    await expect(homePage.joinBrewlyBtn).toBeVisible();
  });

  test('should display categories section after loading', async ({ homePage, logger }) => {
    logger.step('Waiting for home page content to load');
    await homePage.waitForHomeLoaded();

    const categoryCount = await homePage.getCategoryCount();
    expect(categoryCount).toBeGreaterThan(0);
    logger.stepDone(`Categories loaded: ${categoryCount} cards`);
  });

  test('should display featured products section after loading', async ({ homePage, logger }) => {
    logger.step('Waiting for featured products to load');
    await homePage.waitForHomeLoaded();

    const productCount = await homePage.getFeaturedProductCount();
    expect(productCount).toBeGreaterThan(0);
    logger.stepDone(`Featured products loaded: ${productCount} cards`);
  });

  test('should display logout button when logged in', async ({ loginPage, homePage, navbarComponent }) => {
    await loginPage.loginViaApi();
    await expect(navbarComponent.logoutButton).toBeVisible({ timeout: 10000 });
  });

  test('should display the user name when logged in', async ({ loginPage, navbarComponent }) => {
    await loginPage.loginViaApi();
    const userName = await navbarComponent.getUserName();
    expect(userName).toContain('Hi,');
  });

  test('should be able to navigate to Menu via navbar', async ({ navbarComponent, logger }) => {
    logger.step('Navigating to Menu via navbar');
    await navbarComponent.clickMenu();
    await expect(navbarComponent.page).toHaveURL(/#\/products/);
    logger.stepDone('Section navigation successful');
  });

  test('should navigate to products when clicking Explore Menu', async ({ homePage }) => {
    await homePage.clickElement(homePage.exploreMenuBtn);
    await homePage.waitForPageLoad();
    await expect(homePage.page).toHaveURL(/#\/products/);
  });

  test('should be able to logout', async ({ loginPage, navbarComponent, logger }) => {
    logger.step('Testing logout flow');
    await loginPage.loginViaApi();
    await expect(navbarComponent.logoutButton).toBeVisible({ timeout: 10000 });
    await navbarComponent.logout();
    // After reload, should see Sign In button instead of Logout
    await expect(navbarComponent.signInButton).toBeVisible({ timeout: 10000 });
    logger.stepDone('Logout successful — Sign In button visible again');
  });
});
