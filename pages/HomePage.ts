import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage — Page Object for the main dashboard / home page.
 */
export class HomePage extends BasePage {
  // --------------- Locators ---------------
  readonly navBar: Locator;
  readonly userNameDisplay: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.navBar = page.locator('#navbar');
    this.userNameDisplay = page.locator('.navbar-actions span').filter({ hasText: /Hi,/ });
    this.logoutButton = page.locator('[data-testid="logout-button"]');
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

  /** Click logout and wait for page to reload */
  async logout(): Promise<void> {
    await this.clickElement(this.logoutButton);
    // Logout triggers location.reload(), wait for it
    await this.page.waitForLoadState('load');
  }

  /** Navigate to a section via the nav bar (e.g. "Home", "Menu") */
  async navigateToSection(sectionName: string): Promise<void> {
    const link = this.page.locator('.navbar-nav').getByRole('link', { name: new RegExp(sectionName, 'i') });
    await this.clickElement(link);
    await this.waitForPageLoad();
  }

  /** Check if the navbar is visible (page is loaded) */
  async isNavBarVisible(): Promise<boolean> {
    return this.isVisible(this.navBar);
  }
}
