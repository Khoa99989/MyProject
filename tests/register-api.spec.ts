import { test, expect } from '../fixtures/base.fixture';

/**
 * Registration API + Database Verification Tests
 *
 * These tests verify that the registration flow correctly:
 * 1. Accepts valid input and returns proper response (token + user)
 * 2. Inserts user data into the Supabase `users` table
 * 3. Allows login with newly registered credentials
 * 4. Rejects duplicate emails
 * 5. Validates input (name, email, password)
 * 6. Sanitizes input (trim whitespace, lowercase email)
 */

const API_BASE = 'http://localhost:8080/api';

/** Generate a unique email for each test run */
function uniqueEmail(prefix: string = 'test'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}@example.com`;
}

test.describe('Registration API Tests', () => {

  test.describe('Successful Registration', () => {

    test('should register a new user via API and return token + user data', async ({ apiHelper, logger }) => {
      logger.step('Register a new user via POST /api/register');

      const email = uniqueEmail('api');
      const response = await apiHelper.post(`${API_BASE}/register`, {
        data: { name: 'API Test User', email, password: 'securePass123' },
      });

      expect(response.status()).toBe(201);
      const body = await response.json();

      // Verify response structure
      expect(body).toHaveProperty('token');
      expect(body).toHaveProperty('user');
      expect(body.token).toBeTruthy();
      expect(typeof body.token).toBe('string');

      // Verify user data in response
      expect(body.user).toHaveProperty('id');
      expect(body.user.name).toBe('API Test User');
      expect(body.user.email).toBe(email.toLowerCase());
      expect(body.user.id).toBeGreaterThan(0);

      // Ensure password hash is NOT returned
      expect(body.user).not.toHaveProperty('password');
      expect(body.user).not.toHaveProperty('password_hash');
      expect(body.user).not.toHaveProperty('passwordHash');

      logger.stepDone(`User registered: id=${body.user.id}, email=${body.user.email}`);
    });

    test('should allow login with newly registered credentials', async ({ apiHelper, logger }) => {
      const email = uniqueEmail('login_verify');
      const password = 'testPassword456';

      logger.step('Step 1: Register a new user');
      const regResponse = await apiHelper.post(`${API_BASE}/register`, {
        data: { name: 'Login Verify User', email, password },
      });
      expect(regResponse.status()).toBe(201);

      logger.step('Step 2: Login with the same credentials');
      const loginResponse = await apiHelper.post(`${API_BASE}/login`, {
        data: { email, password },
      });
      expect(loginResponse.status()).toBe(200);

      const loginBody = await loginResponse.json();
      expect(loginBody).toHaveProperty('token');
      expect(loginBody.user.email).toBe(email.toLowerCase());

      logger.stepDone('Login with newly registered credentials succeeded');
    });

    test('should return valid JWT that works for profile endpoint', async ({ apiHelper, logger }) => {
      const email = uniqueEmail('jwt_verify');

      logger.step('Step 1: Register and get token');
      const regResponse = await apiHelper.post(`${API_BASE}/register`, {
        data: { name: 'JWT Verify User', email, password: 'jwtTest789' },
      });
      expect(regResponse.status()).toBe(201);
      const { token, user } = await regResponse.json();

      logger.step('Step 2: Use token to access profile');
      apiHelper.setAuthToken(token);
      const profileResponse = await apiHelper.get(`${API_BASE}/profile`);
      expect(profileResponse.status()).toBe(200);

      const profile = await profileResponse.json();
      expect(profile.id).toBe(user.id);
      expect(profile.name).toBe('JWT Verify User');
      expect(profile.email).toBe(email.toLowerCase());

      apiHelper.clearAuthToken();
      logger.stepDone('JWT token is valid and works for /api/profile');
    });
  });

  test.describe('Input Sanitization', () => {

    test('should trim whitespace from name and email', async ({ apiHelper, logger }) => {
      const rawEmail = `  ${uniqueEmail('trim')}  `;
      const expectedEmail = rawEmail.trim().toLowerCase();

      logger.step('Register with whitespace-padded name and email');
      const response = await apiHelper.post(`${API_BASE}/register`, {
        data: { name: '  Spacey Name  ', email: rawEmail, password: 'trimTest123' },
      });
      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body.user.name).toBe('Spacey Name');
      expect(body.user.email).toBe(expectedEmail);

      logger.stepDone('Name and email were trimmed correctly');
    });

    test('should lowercase email on registration', async ({ apiHelper, logger }) => {
      const email = `UPPER_${Date.now()}@EXAMPLE.COM`;

      logger.step('Register with uppercase email');
      const response = await apiHelper.post(`${API_BASE}/register`, {
        data: { name: 'Uppercase Email User', email, password: 'upperTest123' },
      });
      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body.user.email).toBe(email.toLowerCase());

      logger.step('Login with lowercase email should work');
      const loginResponse = await apiHelper.post(`${API_BASE}/login`, {
        data: { email: email.toLowerCase(), password: 'upperTest123' },
      });
      expect(loginResponse.status()).toBe(200);

      logger.stepDone('Email was lowercased and login works with lowercase');
    });
  });

  test.describe('Duplicate Email Prevention', () => {

    test('should reject duplicate email registration', async ({ apiHelper, logger }) => {
      const email = uniqueEmail('dup');

      logger.step('Step 1: Register first user');
      const firstResponse = await apiHelper.post(`${API_BASE}/register`, {
        data: { name: 'First User', email, password: 'firstPass123' },
      });
      expect(firstResponse.status()).toBe(201);

      logger.step('Step 2: Attempt duplicate registration');
      const dupResponse = await apiHelper.post(`${API_BASE}/register`, {
        data: { name: 'Duplicate User', email, password: 'dupPass456' },
      });
      expect(dupResponse.status()).toBe(409);

      const dupBody = await dupResponse.json();
      expect(dupBody.error).toContain('Email already registered');

      logger.stepDone('Duplicate email correctly rejected with 409 Conflict');
    });

    test('should reject duplicate email even with different case', async ({ apiHelper, logger }) => {
      const baseEmail = uniqueEmail('case_dup');

      logger.step('Step 1: Register with lowercase email');
      const firstResponse = await apiHelper.post(`${API_BASE}/register`, {
        data: { name: 'Case User 1', email: baseEmail.toLowerCase(), password: 'casePass123' },
      });
      expect(firstResponse.status()).toBe(201);

      logger.step('Step 2: Attempt registration with uppercase email');
      const dupResponse = await apiHelper.post(`${API_BASE}/register`, {
        data: { name: 'Case User 2', email: baseEmail.toUpperCase(), password: 'casePass456' },
      });
      expect(dupResponse.status()).toBe(409);

      logger.stepDone('Duplicate email detection is case-insensitive');
    });
  });

  test.describe('Input Validation', () => {

    test('should reject registration without name', async ({ apiHelper, logger }) => {
      logger.step('Register without name field');
      const response = await apiHelper.post(`${API_BASE}/register`, {
        data: { email: uniqueEmail('no_name'), password: 'validPass123' },
      });
      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toContain('Invalid input');

      logger.stepDone('Missing name rejected with 400');
    });

    test('should reject registration with short name (< 2 chars)', async ({ apiHelper, logger }) => {
      logger.step('Register with single character name');
      const response = await apiHelper.post(`${API_BASE}/register`, {
        data: { name: 'A', email: uniqueEmail('short_name'), password: 'validPass123' },
      });
      expect(response.status()).toBe(400);

      logger.stepDone('Short name rejected with 400');
    });

    test('should reject registration without email', async ({ apiHelper, logger }) => {
      logger.step('Register without email field');
      const response = await apiHelper.post(`${API_BASE}/register`, {
        data: { name: 'No Email User', password: 'validPass123' },
      });
      expect(response.status()).toBe(400);

      logger.stepDone('Missing email rejected with 400');
    });

    test('should reject registration with invalid email format', async ({ apiHelper, logger }) => {
      logger.step('Register with invalid email format');
      const response = await apiHelper.post(`${API_BASE}/register`, {
        data: { name: 'Bad Email User', email: 'not-an-email', password: 'validPass123' },
      });
      expect(response.status()).toBe(400);

      logger.stepDone('Invalid email format rejected with 400');
    });

    test('should reject registration without password', async ({ apiHelper, logger }) => {
      logger.step('Register without password field');
      const response = await apiHelper.post(`${API_BASE}/register`, {
        data: { name: 'No Pass User', email: uniqueEmail('no_pass') },
      });
      expect(response.status()).toBe(400);

      logger.stepDone('Missing password rejected with 400');
    });

    test('should reject registration with short password (< 6 chars)', async ({ apiHelper, logger }) => {
      logger.step('Register with short password');
      const response = await apiHelper.post(`${API_BASE}/register`, {
        data: { name: 'Short Pass User', email: uniqueEmail('short_pass'), password: '12345' },
      });
      expect(response.status()).toBe(400);

      logger.stepDone('Short password rejected with 400');
    });

    test('should reject registration with empty JSON body', async ({ apiHelper, logger }) => {
      logger.step('Register with empty body');
      const response = await apiHelper.post(`${API_BASE}/register`, {
        data: {},
      });
      expect(response.status()).toBe(400);

      logger.stepDone('Empty body rejected with 400');
    });
  });

  test.describe('UI → Database End-to-End', () => {

    test('should register via UI and verify user data via API', async ({ registerPage, apiHelper, logger }) => {
      const email = uniqueEmail('e2e');
      const password = 'e2ePassword123';

      logger.step('Step 1: Register via UI');
      await registerPage.goto();
      await registerPage.register('E2E Test User', email, password, password);
      await registerPage.waitForRegisterSuccess();

      logger.step('Step 2: Login via API with the same credentials');
      const loginResponse = await apiHelper.post(`${API_BASE}/login`, {
        data: { email, password },
      });
      expect(loginResponse.status()).toBe(200);

      const loginBody = await loginResponse.json();
      expect(loginBody.user.name).toBe('E2E Test User');
      expect(loginBody.user.email).toBe(email.toLowerCase());
      expect(loginBody.user.id).toBeGreaterThan(0);

      logger.step('Step 3: Verify profile via API');
      apiHelper.setAuthToken(loginBody.token);
      const profileResponse = await apiHelper.get(`${API_BASE}/profile`);
      expect(profileResponse.status()).toBe(200);

      const profile = await profileResponse.json();
      expect(profile.name).toBe('E2E Test User');
      expect(profile.email).toBe(email.toLowerCase());

      apiHelper.clearAuthToken();
      logger.stepDone('UI registration → API login → Profile verified successfully');
    });

    test('should show error on UI when registering duplicate email', async ({ registerPage, apiHelper, logger }) => {
      const email = uniqueEmail('ui_dup');
      const password = 'uiDupPass123';

      logger.step('Step 1: Register user via API first');
      const regResponse = await apiHelper.post(`${API_BASE}/register`, {
        data: { name: 'First UI User', email, password },
      });
      expect(regResponse.status()).toBe(201);

      logger.step('Step 2: Try to register same email via UI');
      await registerPage.goto();
      await registerPage.register('Duplicate UI User', email, password, password);

      // Should show error message
      await expect(registerPage.errorMessage).toBeVisible({ timeout: 10_000 });
      const errorMsg = await registerPage.getErrorMessage();
      expect(errorMsg).toContain('Email already registered');

      logger.stepDone('UI correctly shows duplicate email error');
    });
  });
});
