import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * NavbarComponent — reusable Page Object for the navbar present on every page.
 * Encapsulates navigation links, auth buttons, language switcher, and cart badge.
 */
export class NavbarComponent extends BasePage {
  // --------------- Navigation Links ---------------
  readonly navHome: Locator;
  readonly navMenu: Locator;
  readonly navCart: Locator;

  // --------------- Auth ---------------
  readonly signInButton: Locator;
  readonly logoutButton: Locator;
  readonly userNameDisplay: Locator;

  // --------------- Language Switcher ---------------
  readonly langSwitcher: Locator;
  readonly enButton: Locator;
  readonly viButton: Locator;

  // --------------- Cart Badge ---------------
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    const navbar = page.locator('#navbar');

    // Nav links
    this.navHome = page.locator('[data-testid="nav-home"]');
    this.navMenu = page.locator('[data-testid="nav-products"]');
    this.navCart = page.locator('[data-testid="nav-cart"]');

    // Auth
    this.signInButton = page.locator('[data-testid="login-button"]');
    this.logoutButton = page.locator('[data-testid="logout-button"]');
    this.userNameDisplay = navbar.locator('.navbar-actions span').filter({ hasText: /Hi,/ });

    // Language
    this.langSwitcher = page.locator('[data-testid="lang-switcher"]');
    this.enButton = page.locator('[data-testid="lang-switcher"] button[data-lang="en"]');
    this.viButton = page.locator('[data-testid="lang-switcher"] button[data-lang="vi"]');

    // Cart badge
    this.cartBadge = page.locator('[data-testid="cart-badge"]');
  }

  // --------------- Navigation Actions ---------------

  /** Click the Home link in navbar */
  async clickHome(): Promise<void> {
    await this.clickElement(this.navHome);
    await this.waitForPageLoad();
  }

  /** Click the Menu link in navbar */
  async clickMenu(): Promise<void> {
    await this.clickElement(this.navMenu);
    await this.waitForPageLoad();
  }

  /** Click the Cart link in navbar */
  async clickCart(): Promise<void> {
    await this.clickElement(this.navCart);
    await this.waitForPageLoad();
  }

  /** Click Sign In button */
  async clickSignIn(): Promise<void> {
    await this.clickElement(this.signInButton);
    await this.waitForPageLoad();
  }

  // --------------- Auth Actions ---------------

  /** Click logout and wait for page reload */
  async logout(): Promise<void> {
    await this.clickElement(this.logoutButton);
    await this.page.waitForLoadState('load');
  }

  /** Get the displayed user name (e.g. "Hi, Demo") */
  async getUserName(): Promise<string> {
    return this.getText(this.userNameDisplay);
  }

  /** Check if user is logged in (logout button visible) */
  async isLoggedIn(): Promise<boolean> {
    return this.isVisible(this.logoutButton);
  }

  // --------------- Language Actions ---------------

  /** Switch to English */
  async switchToEnglish(): Promise<void> {
    await this.clickElement(this.enButton);
    await this.page.waitForTimeout(500);
  }

  /** Switch to Vietnamese */
  async switchToVietnamese(): Promise<void> {
    await this.clickElement(this.viButton);
    await this.page.waitForTimeout(500);
  }

  /** Get the current active language code ('en' | 'vi') */
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

  // --------------- Cart Badge ---------------

  /** Get the cart badge count (returns 0 if badge is hidden) */
  async getCartBadgeCount(): Promise<number> {
    const visible = await this.isVisible(this.cartBadge);
    if (!visible) return 0;
    const text = await this.getText(this.cartBadge);
    return parseInt(text, 10) || 0;
  }
}
