import { test, expect } from '../fixtures/base.fixture';
import { DataReader } from '../utils/DataReader';

/** Shape of each row in data/login.json */
interface LoginTestData {
  testCase: string;
  email: string;
  password: string;
  expectedResult: 'success' | 'error' | 'validation_error';
  description: string;
}

// Load all test data once
const loginTestData = DataReader.readData<LoginTestData[]>('login.json');

test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  // Data-driven: iterate over every row in login.json
  for (const data of loginTestData) {
    test(`${data.testCase}`, async ({ loginPage, logger }) => {
      logger.step(`Testing: ${data.description}`);

      // Act
      await loginPage.login(data.email, data.password);

      // Assert based on expected result
      switch (data.expectedResult) {
        case 'success':
          await loginPage.waitForLoginSuccess();
          expect(loginPage.isLoggedIn()).toBe(true);
          logger.stepDone('Login successful — redirected away from login');
          break;

        case 'error':
          await expect(loginPage.errorMessage).toBeVisible({ timeout: 10000 });
          const errorMsg = await loginPage.getErrorMessage();
          expect(errorMsg).toBeTruthy();
          logger.stepDone(`Error message displayed: "${errorMsg}"`);
          break;

        case 'validation_error':
          await expect(loginPage.page).toHaveURL(/#\/login/);
          logger.stepDone('Validation error — user still on login page');
          break;
      }
    });
  }

  test('should display login form elements', async ({ loginPage }) => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('should have link to register page', async ({ loginPage }) => {
    await expect(loginPage.registerLink).toBeVisible();
    await expect(loginPage.registerLink).toHaveAttribute('href', /register/);
  });
});
