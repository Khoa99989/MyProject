import { Page } from '@playwright/test';

/**
 * WaitHelper — custom wait and retry utilities beyond Playwright's built-in waits.
 */
export class WaitHelper {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait until a custom condition returns true, polling at a given interval.
   * @param condition - Async function returning a boolean
   * @param options - timeout (ms) and interval (ms)
   */
  async waitForCondition(
    condition: () => Promise<boolean>,
    options: { timeout?: number; interval?: number; message?: string } = {}
  ): Promise<void> {
    const { timeout = 30_000, interval = 500, message = 'Condition not met' } = options;
    const deadline = Date.now() + timeout;

    while (Date.now() < deadline) {
      if (await condition()) return;
      await this.page.waitForTimeout(interval);
    }

    throw new Error(`WaitHelper: ${message} (timed out after ${timeout}ms)`);
  }

  /**
   * Retry an action until it succeeds or the max attempts are reached.
   * @param action - Async function to retry
   * @param options - maxAttempts and delay between attempts (ms)
   * @returns The resolved value of the action
   */
  async retryAction<T>(
    action: () => Promise<T>,
    options: { maxAttempts?: number; delay?: number; description?: string } = {}
  ): Promise<T> {
    const { maxAttempts = 3, delay = 1_000, description = 'Action' } = options;
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await action();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < maxAttempts) {
          await this.page.waitForTimeout(delay);
        }
      }
    }

    throw new Error(
      `WaitHelper: ${description} failed after ${maxAttempts} attempts. Last error: ${lastError?.message}`
    );
  }

  /** Wait for network to become idle */
  async waitForNetworkIdle(timeout: number = 30_000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /** Wait for a specific response URL */
  async waitForApiResponse(urlPattern: string | RegExp, timeout: number = 30_000) {
    return this.page.waitForResponse(urlPattern, { timeout });
  }

  /** Wait for an element to disappear from the DOM */
  async waitForElementToDisappear(selector: string, timeout: number = 10_000): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
  }

  /** Static delay — use sparingly, prefer condition-based waits */
  async sleep(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
}
