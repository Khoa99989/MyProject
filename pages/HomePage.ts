import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage — Page Object for the main dashboard / home page.
 */
export class HomePage extends BasePage {
  // --------------- Locators ---------------
  readonly navBar: Locator;
  readonly userMenu: Locator;
  readonly userNameDisplay: Locator;
  readonly logoutButton: Locator;
  readonly searchInput: Locator;
  readonly notificationBell: Locator;

  constructor(page: Page) {
    super(page);
    this.navBar = page.locator('#navbar, nav.navbar, .navbar');
    this.userMenu = page.locator('.navbar-actions').first();
    this.userNameDisplay = page.locator('.navbar-actions span').filter({ hasText: /Hi,/ });
    this.logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout")');
    this.searchInput = page.locator('[data-testid="search-input"], input[type="search"]');
    this.notificationBell = page.locator('[data-testid="notifications"], .notification-bell');
  }

  // --------------- Actions ---------------

  /** Navigate to the home page (hash route for SPA) */
  async goto(): Promise<void> {
    await this.navigate('/#/');
  }

  /** Get the displayed user name */
  async getUserName(): Promise<string> {
    return this.getText(this.userNameDisplay);
  }

  /** Click logout (navbar shows Logout button when logged in) */
  async logout(): Promise<void> {
    await this.clickElement(this.logoutButton);
  }

  /** Navigate to a section via the nav bar (e.g. "Home", "Menu") */
  async navigateToSection(sectionName: string): Promise<void> {
    const link = this.page.getByRole('link', { name: new RegExp(sectionName, 'i') }).first();
    await this.clickElement(link);
    await this.waitForPageLoad();
  }

  /** Check if the navbar is visible (page is loaded) */
  async isNavBarVisible(): Promise<boolean> {
    return this.isVisible(this.navBar);
  }

  /** Search for a term */
  async search(term: string): Promise<void> {
    await this.fillInput(this.searchInput, term);
    await this.searchInput.press('Enter');
  }

  /** Click notification bell */
  async openNotifications(): Promise<void> {
    await this.clickElement(this.notificationBell);
  }
}
