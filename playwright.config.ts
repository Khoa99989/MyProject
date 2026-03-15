import { defineConfig, devices } from '@playwright/test';
import { ENV } from './config/environment';

/**
 * Playwright Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /* Directory containing test files */
  testDir: './tests',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: ENV.RETRIES,

  /* Parallel workers */
  workers: ENV.WORKERS,

  /* Reporter configuration */
  reporter: process.env.CI
    ? [['blob'], ['html', { open: 'never' }], ['list'], ['json', { outputFile: 'test-results/results.json' }]]
    : [['html', { open: 'on-failure' }], ['list']],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL for page.goto() */
    baseURL: ENV.BASE_URL,

    /* Collect trace on first retry */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on first retry */
    video: 'on-first-retry',

    /* Headless mode */
    headless: ENV.HEADLESS,

    /* Action timeout */
    actionTimeout: ENV.DEFAULT_TIMEOUT,

    /* Navigation timeout */
    navigationTimeout: ENV.DEFAULT_TIMEOUT,
  },

  /* Global timeout per test */
  timeout: 60_000,

  /* Expect timeout */
  expect: {
    timeout: 10_000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Output directory for test artifacts */
  outputDir: 'test-results/',
});
