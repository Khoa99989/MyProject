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

  // Hero section
  readonly heroTitle: Locator;
  readonly heroDescription: Locator;
  readonly exploreMenuBtn: Locator;
  readonly joinBrewlyBtn: Locator;

  // Categories section
  readonly categoriesSection: Locator;
  readonly categoriesGrid: Locator;
  readonly categoryCards: Locator;

  // Featured products section
  readonly featuredGrid: Locator;
  readonly featuredProductCards: Locator;

  constructor(page: Page) {
    super(page);
    this.navBar = page.locator('#navbar');
    this.userNameDisplay = page.locator('.navbar-actions span').filter({ hasText: /Hi,/ });
    this.logoutButton = page.locator('[data-testid="logout-button"]');

    // Hero
    this.heroTitle = page.locator('.hero h1');
    this.heroDescription = page.locator('.hero p');
    this.exploreMenuBtn = page.locator('[data-testid="explore-menu-btn"]');
    this.joinBrewlyBtn = page.locator('[data-testid="join-btn"]');

    // Categories
    this.categoriesSection = page.locator('#categories-section');
    this.categoriesGrid = page.locator('#categories-grid');
    this.categoryCards = page.locator('.category-card');

    // Featured products
    this.featuredGrid = page.locator('#featured-grid');
    this.featuredProductCards = this.featuredGrid.locator('.product-card');
  }

  // --------------- Actions ---------------

  /** Navigate to the home page (hash route for SPA) */
  async goto(): Promise<void> {
    await this.navigate('/#/');
  }

  /** Wait for home page content to fully load (hero + categories + featured products) */
  async waitForHomeLoaded(): Promise<void> {
    await this.heroTitle.waitFor({ state: 'visible', timeout: 10000 });
    // Wait for categories loading spinner to disappear
    await this.categoriesGrid.locator('.loading-state, .spinner')
      .waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    // Wait for featured products loading spinner to disappear
    await this.featuredGrid.locator('.loading-state, .spinner')
      .waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
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

  /** Get the count of visible category cards */
  async getCategoryCount(): Promise<number> {
    return this.categoryCards.count();
  }

  /** Get the count of visible featured product cards */
  async getFeaturedProductCount(): Promise<number> {
    return this.featuredProductCards.count();
  }

  /** Click on a specific category card */
  async clickCategory(categoryId: number): Promise<void> {
    await this.clickElement(this.page.locator(`[data-testid="category-${categoryId}"]`));
  }
}
