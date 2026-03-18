import { test, expect } from '../fixtures/base.fixture';

test.describe('Language Switcher Tests', () => {
  // ─── Products Page ───────────────────────────────────────

  test.describe('Products Page i18n', () => {
    test('should display language switcher (EN/VI) in navbar', async ({ languagePage }) => {
      await languagePage.gotoProducts();
      await expect(languagePage.langSwitcher).toBeVisible();
      await expect(languagePage.enButton).toBeVisible();
      await expect(languagePage.viButton).toBeVisible();
    });

    test('should default to English', async ({ languagePage }) => {
      await languagePage.gotoProducts();
      const lang = await languagePage.getActiveLang();
      expect(lang).toBe('en');

      // Verify English text
      await expect(languagePage.pageHeading).toHaveText('Our Menu');
      await expect(languagePage.navHome).toHaveText('Home');
      await expect(languagePage.navMenu).toHaveText('Menu');
    });

    test('should switch to Vietnamese on products page', async ({ languagePage, logger }) => {
      await languagePage.gotoProducts();

      logger.step('Switching to Vietnamese');
      await languagePage.switchToVietnamese();
      await languagePage.waitForProductsRerender();

      // Verify Vietnamese text
      await expect(languagePage.pageHeading).toHaveText('Thực đơn');
      await expect(languagePage.navHome).toHaveText('Trang chủ');
      await expect(languagePage.navMenu).toHaveText('Thực đơn');
      await expect(languagePage.filterAllButton).toHaveText('Tất cả');
      logger.stepDone('Vietnamese text verified on products page');
    });

    test('should switch back to English from Vietnamese', async ({ languagePage, logger }) => {
      await languagePage.gotoProducts();

      logger.step('Switching to Vietnamese then back to English');
      await languagePage.switchToVietnamese();
      await languagePage.page.waitForTimeout(500);

      await languagePage.switchToEnglish();
      await languagePage.waitForProductsRerender();

      await expect(languagePage.pageHeading).toHaveText('Our Menu');
      await expect(languagePage.navHome).toHaveText('Home');
      await expect(languagePage.filterAllButton).toHaveText('All');
      logger.stepDone('English text restored after switching back');
    });

    test('should translate Add to Cart buttons to Vietnamese', async ({ languagePage }) => {
      await languagePage.gotoProducts();
      await languagePage.waitForProductsRerender();

      await languagePage.switchToVietnamese();
      await languagePage.waitForProductsRerender();

      const firstAddBtn = languagePage.addToCartButtons.first();
      await expect(firstAddBtn).toBeVisible({ timeout: 10000 });
      const btnText = await firstAddBtn.textContent();
      expect(btnText?.trim()).toMatch(/Thêm vào giỏ|Hết hàng/);
    });
  });

  // ─── Home Page ───────────────────────────────────────────

  test.describe('Home Page i18n', () => {
    test('should display Vietnamese hero text after switching', async ({ languagePage, logger }) => {
      await languagePage.gotoHome();

      logger.step('Switching to Vietnamese on home page');
      await languagePage.switchToVietnamese();

      await expect(languagePage.heroTitle).toContainText('Khám phá những');
      await expect(languagePage.exploreMenuBtn).toHaveText('Khám phá thực đơn');
      await expect(languagePage.joinBrewlyBtn).toHaveText('Tham gia Brewly');
      logger.stepDone('Home page hero section translated to Vietnamese');
    });

    test('should display English hero text by default', async ({ languagePage }) => {
      await languagePage.gotoHome();
      await expect(languagePage.heroTitle).toBeVisible({ timeout: 10000 });
      await expect(languagePage.heroTitle).toContainText('Discover the Finest');
      await expect(languagePage.exploreMenuBtn).toBeVisible({ timeout: 10000 });
      await expect(languagePage.exploreMenuBtn).toHaveText('Explore Menu');
    });
  });

  // ─── Login / Register Pages ──────────────────────────────

  test.describe('Auth Pages i18n', () => {
    test('should translate login page to Vietnamese', async ({ languagePage, logger }) => {
      await languagePage.gotoLogin();

      logger.step('Switching to Vietnamese on login page');
      await languagePage.switchToVietnamese();

      await expect(languagePage.loginFormTitle).toHaveText('Chào mừng trở lại');
      await expect(languagePage.loginFormButton).toHaveText('Đăng nhập');
      logger.stepDone('Login page translated to Vietnamese');
    });

    test('should translate register page to Vietnamese', async ({ languagePage, logger }) => {
      await languagePage.gotoRegister();

      logger.step('Switching to Vietnamese on register page');
      await languagePage.switchToVietnamese();

      await expect(languagePage.registerFormTitle).toHaveText('Tham gia Brewly');
      await expect(languagePage.registerFormButton).toHaveText('Tạo tài khoản');
      logger.stepDone('Register page translated to Vietnamese');
    });
  });

  // ─── Language Persistence ────────────────────────────────

  test.describe('Language Persistence', () => {
    test('should persist language choice in localStorage', async ({ languagePage, logger }) => {
      await languagePage.gotoProducts();

      logger.step('Switching to Vietnamese and checking localStorage');
      await languagePage.switchToVietnamese();

      const storedLang = await languagePage.getLanguageFromStorage();
      expect(storedLang).toBe('vi');
      logger.stepDone('Language stored as "vi" in localStorage');
    });

    test('should remember Vietnamese after page navigation', async ({ languagePage, logger }) => {
      await languagePage.gotoProducts();

      logger.step('Switching to Vietnamese, then navigating to home');
      await languagePage.switchToVietnamese();

      // Navigate to home
      await languagePage.gotoHome();

      // Language should still be Vietnamese
      const lang = await languagePage.getActiveLang();
      expect(lang).toBe('vi');
      await expect(languagePage.heroTitle).toContainText('Khám phá những');
      logger.stepDone('Vietnamese persisted across page navigation');
    });

    test('should remember language after hard reload', async ({ languagePage, logger }) => {
      await languagePage.gotoProducts();

      logger.step('Switching to Vietnamese and reloading page');
      await languagePage.switchToVietnamese();

      // Hard reload
      await languagePage.page.reload();
      await languagePage.waitForProductsRerender();

      const lang = await languagePage.getActiveLang();
      expect(lang).toBe('vi');
      await expect(languagePage.pageHeading).toHaveText('Thực đơn');
      logger.stepDone('Vietnamese persisted after hard reload');
    });
  });

  // ─── Active State ────────────────────────────────────────

  test.describe('Language Button Active State', () => {
    test('EN button should have active class by default', async ({ languagePage }) => {
      await languagePage.gotoProducts();
      await expect(languagePage.enButton).toHaveClass(/active/);
      await expect(languagePage.viButton).not.toHaveClass(/active/);
    });

    test('VI button should have active class after switching', async ({ languagePage }) => {
      await languagePage.gotoProducts();
      await languagePage.switchToVietnamese();
      await expect(languagePage.viButton).toHaveClass(/active/);
      await expect(languagePage.enButton).not.toHaveClass(/active/);
    });
  });
});
