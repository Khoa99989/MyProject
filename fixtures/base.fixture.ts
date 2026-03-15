import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ProductListPage } from '../pages/ProductListPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ApiHelper } from '../utils/ApiHelper';
import { WaitHelper } from '../utils/WaitHelper';
import { Logger } from '../utils/Logger';

/**
 * Custom fixture types — extend Playwright's built-in test with
 * auto-provisioned page objects and helpers.
 */
type CustomFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  productListPage: ProductListPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  registerPage: RegisterPage;
  apiHelper: ApiHelper;
  waitHelper: WaitHelper;
  logger: Logger;
};

/**
 * Extended test function with custom fixtures.
 * Usage: import { test, expect } from '../fixtures/base.fixture';
 */
export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  productListPage: async ({ page }, use) => {
    const productListPage = new ProductListPage(page);
    await use(productListPage);
  },

  productDetailPage: async ({ page }, use) => {
    const productDetailPage = new ProductDetailPage(page);
    await use(productDetailPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await use(registerPage);
  },

  apiHelper: async ({ request }, use) => {
    const apiHelper = new ApiHelper(request);
    await use(apiHelper);
  },

  waitHelper: async ({ page }, use) => {
    const waitHelper = new WaitHelper(page);
    await use(waitHelper);
  },

  logger: async ({}, use) => {
    const logger = new Logger('Test');
    await use(logger);
  },
});

export { expect } from '@playwright/test';
