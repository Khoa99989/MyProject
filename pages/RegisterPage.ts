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
  readonly formTitle: Locator;

  constructor(page: Page) {
    super(page);
    // Scope to the register form to avoid navbar conflicts
    const form = page.locator('[data-testid="register-form"]');
    this.nameInput = form.locator('[data-testid="name-input"]');
    this.emailInput = form.locator('[data-testid="email-input"]');
    this.passwordInput = form.locator('[data-testid="password-input"]');
    this.confirmPasswordInput = form.locator('[data-testid="confirm-password-input"]');
    this.submitButton = form.locator('[data-testid="register-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    // Use data-testid only to avoid matching the navbar "Sign In" link
    this.loginLink = page.locator('[data-testid="login-link"]');
    this.formTitle = page.locator('.auth-card h1');
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

  /**
   * Wait for successful registration — logout button should appear after redirect + reload.
   * Similar to LoginPage.waitForLoginSuccess().
   */
  async waitForRegisterSuccess(options?: { timeout?: number }): Promise<void> {
    const timeout = options?.timeout ?? 15000;
    await this.page.locator('[data-testid="logout-button"]').waitFor({
      state: 'visible',
      timeout,
    });
  }
}
