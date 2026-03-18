import { test, expect } from '../fixtures/base.fixture';
import { DataReader } from '../utils/DataReader';

/** Shape of each row in data/register.json */
interface RegisterTestData {
  testCase: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  expectedResult: 'success' | 'error' | 'validation_error';
  expectedError?: string;
  description: string;
}

// Load all test data once
const registerTestData = DataReader.readData<RegisterTestData[]>('register.json');

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

  // Data-driven: iterate over every row in register.json
  for (const data of registerTestData) {
    test(`${data.testCase}`, async ({ registerPage, logger }) => {
      logger.step(`Testing: ${data.description}`);

      // Use unique email for success case to avoid duplicate registration errors
      const email = data.email === 'auto_unique'
        ? `testuser_${Date.now()}@example.com`
        : data.email;

      // Act
      await registerPage.register(data.name, email, data.password, data.confirmPassword);

      // Assert based on expected result
      switch (data.expectedResult) {
        case 'success':
          await registerPage.waitForRegisterSuccess();
          await expect(registerPage.page).not.toHaveURL(/#\/register/);
          logger.stepDone('Registration successful — redirected away from register');
          break;

        case 'error':
          await expect(registerPage.errorMessage).toBeVisible({ timeout: 10000 });
          const errorMsg = await registerPage.getErrorMessage();
          expect(errorMsg).toBeTruthy();
          if (data.expectedError) {
            expect(errorMsg).toContain(data.expectedError);
          }
          logger.stepDone(`Error message displayed: "${errorMsg}"`);
          break;

        case 'validation_error':
          // Form has HTML5 validation — user stays on register page
          await registerPage.page.waitForTimeout(500);
          await expect(registerPage.page).toHaveURL(/#\/register/);
          logger.stepDone('Validation error — user still on register page');
          break;
      }
    });
  }

  test('should have link to login page', async ({ registerPage }) => {
    await expect(registerPage.loginLink).toBeVisible();
    await registerPage.goToLogin();
    await registerPage.page.waitForLoadState('load');
    await expect(registerPage.page).toHaveURL(/#\/login/);
  });
});
