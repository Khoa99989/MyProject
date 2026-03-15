import { test, expect } from '../fixtures/base.fixture';

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('should load the home page successfully', async ({ homePage, logger }) => {
    logger.step('Verifying home page loads');
    await expect(homePage.page.locator('.hero h1')).toBeVisible({ timeout: 10000 });
    const title = await homePage.getTitle();
    expect(title).toBeTruthy();
    logger.stepDone(`Home page loaded with title: "${title}"`);
  });

  test('should display the navigation bar', async ({ homePage }) => {
    await expect(homePage.navBar).toBeVisible();
  });

  test('should display logout button when logged in', async ({ loginPage, homePage }) => {
    // loginViaApi sets localStorage + navigates to home + reloads
    await loginPage.loginViaApi();
    await expect(homePage.logoutButton).toBeVisible({ timeout: 10000 });
  });

  test('should display the user name when logged in', async ({ loginPage, homePage }) => {
    await loginPage.loginViaApi();
    const userName = await homePage.getUserName();
    expect(userName).toContain('Hi,');
  });

  test('should be able to navigate to Menu via navbar', async ({ homePage, logger }) => {
    logger.step('Navigating to Menu via navbar');
    await homePage.navigateToSection('Menu');
    await homePage.waitForPageLoad();
    await expect(homePage.page).toHaveURL(/#\/products/);
    logger.stepDone('Section navigation successful');
  });

  test('should display Explore Menu button', async ({ homePage }) => {
    await expect(homePage.page.locator('[data-testid="explore-menu-btn"]')).toBeVisible();
  });

  test('should be able to logout', async ({ loginPage, homePage, logger }) => {
    logger.step('Testing logout flow');
    await loginPage.loginViaApi();
    await expect(homePage.logoutButton).toBeVisible({ timeout: 10000 });
    await homePage.logout();
    // After reload, should see Sign In button instead of Logout
    await expect(homePage.page.locator('[data-testid="login-button"]')).toBeVisible({ timeout: 10000 });
    logger.stepDone('Logout successful — Sign In button visible again');
  });
});
