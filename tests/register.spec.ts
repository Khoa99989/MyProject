import { test, expect } from '../fixtures/base.fixture';

test.describe('Registration Page Tests', () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.goto();
  });

  test('should display registration form elements', async ({ registerPage }) => {
    await expect(registerPage.nameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.confirmPasswordInput).toBeVisible();
    await expect(registerPage.submitButton).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ registerPage }) => {
    await registerPage.register('Test User', 'test@example.com', 'password123', 'differentpass');

    await expect(registerPage.errorMessage).toBeVisible({ timeout: 10000 });
    const errorMsg = await registerPage.getErrorMessage();
    expect(errorMsg).toContain('Passwords do not match');
  });

  test('should have link to login page', async ({ registerPage }) => {
    await expect(registerPage.loginLink).toBeVisible();
    await registerPage.goToLogin();
    await registerPage.page.waitForURL(/#\/login/);
    await expect(registerPage.page).toHaveURL(/#\/login/);
  });

  test('should register successfully with valid data', async ({ registerPage }) => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    await registerPage.register('Test User', uniqueEmail, 'password123');

    await registerPage.page.waitForURL((url) => !url.href.includes('#/register'), { timeout: 15000 });
    await expect(registerPage.page).not.toHaveURL(/#\/register/);
  });
});
