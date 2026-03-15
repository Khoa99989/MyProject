import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage — Page Object for the login/authentication page.
 */
export class LoginPage extends BasePage {
  // --------------- Locators ---------------
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    super(page);
    // Scope locators to the login form to avoid navbar conflicts
    const form = page.locator('[data-testid="login-form"]');
    this.emailInput = form.locator('[data-testid="email-input"]');
    this.passwordInput = form.locator('[data-testid="password-input"]');
    this.submitButton = form.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.registerLink = page.locator('[data-testid="register-link"]');
  }

  // --------------- Actions ---------------

  /** Navigate to the login page (hash route for SPA) */
  async goto(): Promise<void> {
    await this.navigate('/#/login');
  }

  /** Fill and submit the login form (UI flow) */
  async login(email: string, password: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.submitButton);
  }

  /** Get the error message text */
  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  /** Check if the error message is displayed */
  async isErrorVisible(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }

  /** Check if user has been redirected after login (i.e. is no longer on login page) */
  isLoggedIn(): boolean {
    return !this.getCurrentUrl().includes('#/login');
  }

  /**
   * Login via API and set localStorage tokens directly.
   * This is the most reliable way to authenticate for tests that need
   * login as a precondition. Bypasses the UI login form entirely.
   */
  async loginViaApi(email: string = 'demo@fnb.com', password: string = 'password123'): Promise<void> {
    // Ensure page is on a real URL (localStorage not accessible on about:blank)
    if (this.page.url() === 'about:blank') {
      await this.page.goto('/');
      await this.page.waitForLoadState('load');
    }

    // Call the login API directly
    const response = await this.page.request.post('http://localhost:8080/api/login', {
      data: { email, password },
    });

    if (!response.ok()) {
      throw new Error(`API login failed: ${response.status()} ${response.statusText()}`);
    }

    const data = await response.json();

    // Set localStorage tokens the same way the frontend does
    await this.page.evaluate((loginData) => {
      localStorage.setItem('fnb_token', loginData.token);
      localStorage.setItem('fnb_user', JSON.stringify(loginData.user));
    }, data);

    // Reload so the SPA reads the new localStorage state
    // and re-renders the navbar with the authenticated UI (logout button, user name)
    await this.page.reload();
    await this.page.waitForLoadState('load');
  }

  /** Wait for successful login via UI (page reload flow) */
  async waitForLoginSuccess(options?: { timeout?: number }): Promise<void> {
    const timeout = options?.timeout ?? 15000;
    // Frontend does: window.location.hash = '#/'; window.location.reload();
    // Wait for navbar to show logout button (means user is authenticated and page reloaded)
    await this.page.locator('[data-testid="logout-button"]').waitFor({
      state: 'visible',
      timeout,
    });
  }
}
