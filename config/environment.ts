import * as path from 'path';

// Load .env from project root (dotenv is optional)
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dotenv = require('dotenv');
  dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
} catch {
  // dotenv not installed — use process.env directly
}

export const ENV = {
  /** Base URL of the application under test (default localhost for local runs) */
  BASE_URL: process.env.BASE_URL || (process.env.CI ? 'https://staging.example.com' : 'http://localhost:5173'),

  /** API base URL */
  API_URL: process.env.API_URL || 'https://api.staging.example.com',

  /** Default timeout in milliseconds */
  DEFAULT_TIMEOUT: Number(process.env.DEFAULT_TIMEOUT) || 30_000,

  /** Run browsers in headless mode */
  HEADLESS: process.env.HEADLESS !== 'false',

  /** Number of parallel workers */
  WORKERS: Number(process.env.WORKERS) || (process.env.CI ? 2 : 4),

  /** Number of retries on failure */
  RETRIES: Number(process.env.RETRIES) || (process.env.CI ? 2 : 0),

  /** Browser to run tests against: 'chromium' | 'firefox' | 'webkit' | 'all' */
  BROWSER: process.env.BROWSER || 'all',
} as const;
