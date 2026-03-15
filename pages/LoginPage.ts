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
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole('textbox', { name: /email/i }).or(page.locator('[data-testid="email-input"], #email'));
    this.passwordInput = page.locator('[data-testid="password-input"], #password, input[type="password"]');
    this.submitButton = page.getByRole('button', { name: /sign in/i }).or(page.locator('[data-testid="login-button"]'));
    this.errorMessage = page.locator('[data-testid="error-message"], .alert-message.error, .error-message');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot")');
    this.registerLink = page.locator('[data-testid="register-link"], a[href*="register"]');
    this.rememberMeCheckbox = page.locator('[data-testid="remember-me"], #remember-me');
  }

  // --------------- Actions ---------------

  /** Navigate to the login page (hash route for SPA) */
  async goto(): Promise<void> {
    await this.navigate('/#/login');
  }

  /** Perform a full login flow */
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

  /** Wait for successful login (redirect away from login page) */
  async waitForLoginSuccess(options?: { timeout?: number }): Promise<void> {
    await this.page.waitForURL((url) => !url.href.includes('#/login'), { timeout: options?.timeout ?? 15000 });
  }

  /** Click forgot password link */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }

  /** Toggle remember me checkbox */
  async toggleRememberMe(): Promise<void> {
    await this.rememberMeCheckbox.check();
  }
}
