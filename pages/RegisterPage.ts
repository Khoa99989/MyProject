import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * RegisterPage — Page Object for the registration page.
 */
export class RegisterPage extends BasePage {
  // --------------- Locators ---------------
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.locator('[data-testid="name-input"], #name');
    this.emailInput = page.locator('[data-testid="email-input"], #email');
    this.passwordInput = page.locator('[data-testid="password-input"], #password');
    this.confirmPasswordInput = page.locator('[data-testid="confirm-password-input"], #confirm-password');
    this.submitButton = page.getByRole('button', { name: /create account/i }).or(page.locator('[data-testid="register-button"]'));
    this.errorMessage = page.locator('[data-testid="error-message"], .alert-message.error');
    this.loginLink = page.locator('[data-testid="login-link"], a[href*="#/login"]');
  }

  // --------------- Actions ---------------

  /** Navigate to the register page */
  async goto(): Promise<void> {
    await this.page.goto('/#/register');
    await this.waitForPageLoad();
  }

  /** Fill in and submit the registration form */
  async register(name: string, email: string, password: string, confirmPassword?: string): Promise<void> {
    await this.fillInput(this.nameInput, name);
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.fillInput(this.confirmPasswordInput, confirmPassword || password);
    await this.clickElement(this.submitButton);
  }

  /** Get the error message text */
  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  /** Check if error message is visible */
  async isErrorVisible(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }

  /** Click the login link */
  async goToLogin(): Promise<void> {
    await this.clickElement(this.loginLink);
  }
}
