import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * MailHog API response types
 */
interface MailHogMessage {
  ID: string;
  From: { Mailbox: string; Domain: string };
  To: Array<{ Mailbox: string; Domain: string }>;
  Content: {
    Headers: Record<string, string[]>;
    Body: string;
  };
}

interface MailHogResponse {
  total: number;
  count: number;
  items: MailHogMessage[];
}

/**
 * EmailPage — Page Object for email-related testing.
 * Wraps MailHog REST API for verifying emails in tests.
 */
export class EmailPage extends BasePage {
  private readonly mailhogBaseUrl: string;

  constructor(page: Page) {
    super(page);
    this.mailhogBaseUrl = process.env.MAILHOG_URL || 'http://localhost:8025';
  }

  // --------------- MailHog API helpers ---------------

  /** Fetch all messages from MailHog */
  async getMessages(): Promise<MailHogResponse> {
    const response = await this.page.request.get(`${this.mailhogBaseUrl}/api/v2/messages`);
    return response.json() as Promise<MailHogResponse>;
  }

  /** Delete all messages in MailHog */
  async clearMailbox(): Promise<void> {
    await this.page.request.delete(`${this.mailhogBaseUrl}/api/v1/messages`);
  }

  /** Search MailHog for emails matching a query */
  async searchByRecipient(email: string): Promise<MailHogResponse> {
    const response = await this.page.request.get(
      `${this.mailhogBaseUrl}/api/v2/search?kind=to&query=${encodeURIComponent(email)}`
    );
    return response.json() as Promise<MailHogResponse>;
  }

  /** Get the latest email for a specific recipient */
  async getLatestEmailFor(email: string): Promise<MailHogMessage | null> {
    const result = await this.searchByRecipient(email);
    return result.items.length > 0 ? result.items[0] : null;
  }

  /** Wait for an email to arrive for a specific recipient (with polling) */
  async waitForEmail(email: string, timeoutMs = 10_000): Promise<MailHogMessage> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const msg = await this.getLatestEmailFor(email);
      if (msg) return msg;
      await this.page.waitForTimeout(500);
    }
    throw new Error(`No email received for ${email} within ${timeoutMs}ms`);
  }

  /** Extract the subject from a MailHog message */
  getSubject(msg: MailHogMessage): string {
    return msg.Content.Headers['Subject']?.[0] || '';
  }

  /** Extract the "From" header */
  getFrom(msg: MailHogMessage): string {
    return msg.Content.Headers['From']?.[0] || '';
  }

  /** Extract the "To" email address */
  getTo(msg: MailHogMessage): string {
    if (msg.To.length === 0) return '';
    return `${msg.To[0].Mailbox}@${msg.To[0].Domain}`;
  }

  /** Extract the HTML body */
  getBody(msg: MailHogMessage): string {
    return msg.Content.Body || '';
  }

  /** Get the total number of emails in MailHog */
  async getEmailCount(): Promise<number> {
    const result = await this.getMessages();
    return result.total;
  }
}
