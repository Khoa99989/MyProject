import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LanguagePage — Page Object for language-switching interactions.
 * The language switcher is present in the navbar on every page.
 */
export class LanguagePage extends BasePage {
  // --------------- Locators ---------------
  readonly langSwitcher: Locator;
  readonly enButton: Locator;
  readonly viButton: Locator;

  // Navbar text locators (for verifying translations)
  readonly navHome: Locator;
  readonly navMenu: Locator;
  readonly signInButton: Locator;

  // Products page locators
  readonly pageHeading: Locator;
  readonly searchHeading: Locator;
  readonly categoriesHeading: Locator;
  readonly filterAllButton: Locator;
  readonly addToCartButtons: Locator;

  // Home page locators
  readonly heroTitle: Locator;
  readonly exploreMenuBtn: Locator;
  readonly joinBrewlyBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.langSwitcher = page.locator('[data-testid="lang-switcher"]');
    this.enButton = page.locator('[data-testid="lang-switcher"] button[data-lang="en"]');
    this.viButton = page.locator('[data-testid="lang-switcher"] button[data-lang="vi"]');

    this.navHome = page.locator('[data-testid="nav-home"]');
    this.navMenu = page.locator('[data-testid="nav-products"]');
    this.signInButton = page.locator('[data-testid="login-button"]');

    this.pageHeading = page.locator('.section-header h2').first();
    this.searchHeading = page.locator('.sidebar-section h3').first();
    this.categoriesHeading = page.locator('.sidebar-section h3').nth(1);
    this.filterAllButton = page.locator('[data-testid="filter-all"]');
    this.addToCartButtons = page.locator('.add-to-cart-btn');

    this.heroTitle = page.locator('.hero h1');
    this.exploreMenuBtn = page.locator('[data-testid="explore-menu-btn"]');
    this.joinBrewlyBtn = page.locator('[data-testid="join-btn"]');
  }

  // --------------- Actions ---------------

  /** Switch to English */
  async switchToEnglish(): Promise<void> {
    await this.clickElement(this.enButton);
    // Language switch triggers hashchange → full re-render
    await this.page.waitForTimeout(500);
  }

  /** Switch to Vietnamese */
  async switchToVietnamese(): Promise<void> {
    await this.clickElement(this.viButton);
    await this.page.waitForTimeout(500);
  }

  /** Get current active language */
  async getActiveLang(): Promise<string> {
    const activeBtn = this.langSwitcher.locator('button.active');
    return (await activeBtn.getAttribute('data-lang')) ?? '';
  }

  /** Set language via localStorage (faster, no UI interaction needed) */
  async setLanguageViaStorage(lang: 'en' | 'vi'): Promise<void> {
    await this.page.evaluate((l) => localStorage.setItem('brewly_lang', l), lang);
  }

  /** Get language from localStorage */
  async getLanguageFromStorage(): Promise<string> {
    return await this.page.evaluate(() => localStorage.getItem('brewly_lang') ?? 'en');
  }

  /** Navigate to products page */
  async gotoProducts(): Promise<void> {
    await this.navigate('/#/products');
    await this.waitForPageLoad();
    // Wait for products to load
    await this.page.locator('#products-grid .loading-state, #products-grid .spinner')
      .waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  }

  /** Navigate to home page */
  async gotoHome(): Promise<void> {
    await this.navigate('/#/');
    await this.waitForPageLoad();
  }

  /** Navigate to login page */
  async gotoLogin(): Promise<void> {
    await this.navigate('/#/login');
    await this.waitForPageLoad();
  }

  /** Navigate to register page */
  async gotoRegister(): Promise<void> {
    await this.navigate('/#/register');
    await this.waitForPageLoad();
  }
}
