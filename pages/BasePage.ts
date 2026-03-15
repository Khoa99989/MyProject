import { Page, Locator } from '@playwright/test';

/**
 * BasePage — abstract base class for all Page Objects.
 * Provides shared navigation, wait, and interaction helpers.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // --------------- Navigation ---------------

  /** Navigate to a path relative to baseURL (use hash paths e.g. /#/login for SPA) */
  async navigate(path: string = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /** Wait for the page to finish loading (prefer 'load' for SPA stability) */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('load');
  }

  /** Get the page title */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /** Get the current URL */
  getCurrentUrl(): string {
    return this.page.url();
  }

  // --------------- Interaction Helpers ---------------

  /** Click an element with auto-wait */
  async clickElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /** Fill an input field — clears existing value first */
  async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(value);
  }

  /** Get text content of an element */
  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent()) ?? '';
  }

  /** Check if an element is visible */
  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  // --------------- Utility ---------------

  /** Take a screenshot and return the Buffer */
  async screenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }

  /** Wait for a specific URL pattern */
  async waitForUrl(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(urlPattern);
  }

  /** Select an option from a <select> dropdown */
  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.selectOption(value);
  }

  /** Hover over an element */
  async hoverElement(locator: Locator): Promise<void> {
    await locator.hover();
  }

  /**
   * Fixed wait — use only when no stable selector/network signal exists.
   * Prefer waitForUrl, waitForLoadState, or expect(locator).toBeVisible() instead.
   */
  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /** Clear app auth from localStorage (for logout / require-login scenarios) */
  async clearAuthStorage(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.removeItem('fnb_token');
      localStorage.removeItem('fnb_user');
    });
  }
}
