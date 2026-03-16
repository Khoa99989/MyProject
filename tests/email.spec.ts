import { test, expect } from '../fixtures/base.fixture';

/**
 * Email Tests — verify bilingual (EN/VI) welcome email after registration
 * and resend via API. Uses MailHog for local email capture.
 */

const API_URL = process.env.API_URL || 'http://localhost:8080';

/** Generate a unique test email */
function uniqueEmail(prefix = 'emailtest'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}@example.com`;
}

test.describe('Email — Bilingual welcome email', () => {

  // Run tests serially to avoid race conditions with MailHog
  test.describe.configure({ mode: 'serial' });

  // ── English email tests ──

  test('should send ENGLISH welcome email when lang=en', async ({
    emailPage,
    request,
  }) => {
    const email = uniqueEmail('en');
    const name = 'English User';

    const regResponse = await request.post(`${API_URL}/api/register`, {
      data: { name, email, password: 'password123', lang: 'en' },
    });
    expect(regResponse.status()).toBe(201);

    const msg = await emailPage.waitForEmail(email, 15_000);

    // Verify English subject
    expect(emailPage.getSubject(msg)).toContain('Welcome to Brewly');
    expect(emailPage.getSubject(msg)).toContain(name);
    expect(emailPage.getFrom(msg)).toContain('noreply@brewly.com');
    expect(emailPage.getTo(msg)).toBe(email);

    // Verify English content
    const body = emailPage.getBody(msg);
    expect(body).toContain(`Welcome, ${name}`);
    expect(body).toContain('Thank you for joining Brewly');
    expect(body).toContain('Browse');
    expect(body).toContain('Best Sellers');
    expect(body).toContain('Free Delivery');
    expect(body).toContain('Explore Menu');
    expect(body).toContain('All rights reserved');
  });

  // ── Vietnamese email tests ──

  test('should send VIETNAMESE welcome email when lang=vi', async ({
    emailPage,
    request,
  }) => {
    const email = uniqueEmail('vi');
    const name = 'Nguyen Van A';

    const regResponse = await request.post(`${API_URL}/api/register`, {
      data: { name, email, password: 'password123', lang: 'vi' },
    });
    expect(regResponse.status()).toBe(201);

    const msg = await emailPage.waitForEmail(email, 15_000);

    // Verify Vietnamese subject
    const subject = emailPage.getSubject(msg);
    expect(subject).toContain('Chào mừng đến Brewly');
    expect(subject).toContain(name);

    // Verify Vietnamese content
    const body = emailPage.getBody(msg);
    expect(body).toContain(`Chào mừng, ${name}`);
    expect(body).toContain('Cảm ơn bạn đã tham gia Brewly');
    expect(body).toContain('Duyệt');
    expect(body).toContain('Bán chạy nhất');
    expect(body).toContain('Giao hàng miễn phí');
    expect(body).toContain('Khám phá Thực đơn');
    expect(body).toContain('Bảo lưu mọi quyền');
  });

  // ── Default lang = English ──

  test('should default to ENGLISH when no lang provided', async ({
    emailPage,
    request,
  }) => {
    const email = uniqueEmail('default');
    const name = 'Default Lang';

    const regResponse = await request.post(`${API_URL}/api/register`, {
      data: { name, email, password: 'password123' },
    });
    expect(regResponse.status()).toBe(201);

    const msg = await emailPage.waitForEmail(email, 15_000);

    // Should be English
    expect(emailPage.getSubject(msg)).toContain('Welcome to Brewly');
    const body = emailPage.getBody(msg);
    expect(body).toContain('Thank you for joining Brewly');
  });

  // ── Resend endpoint with lang ──

  test('should resend welcome email in Vietnamese via API', async ({
    emailPage,
    request,
  }) => {
    const email = uniqueEmail('resend_vi');
    const name = 'Resend VI User';

    // Register in English
    const regResponse = await request.post(`${API_URL}/api/register`, {
      data: { name, email, password: 'password123', lang: 'en' },
    });
    expect(regResponse.status()).toBe(201);
    const regData = await regResponse.json();
    const token = regData.token;

    // Wait for initial English email
    const enMsg = await emailPage.waitForEmail(email, 15_000);
    expect(emailPage.getSubject(enMsg)).toContain('Welcome to Brewly');

    // Resend in Vietnamese
    const resendResponse = await request.post(`${API_URL}/api/email/resend-welcome`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { lang: 'vi' },
    });
    expect(resendResponse.status()).toBe(200);

    const resendData = await resendResponse.json();
    expect(resendData.lang).toBe('vi');

    // Verify Vietnamese email arrived (there should now be 2 total)
    const result = await emailPage.searchByRecipient(email);
    expect(result.total).toBeGreaterThanOrEqual(2);

    // Check the latest email is in Vietnamese
    const viMsg = result.items[0]; // MailHog returns latest first
    const viSubject = emailPage.getSubject(viMsg);
    expect(viSubject).toContain('Chào mừng đến Brewly');
  });

  // ── Auth guard ──

  test('should reject resend-welcome without auth token', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/email/resend-welcome`);
    expect(response.status()).toBe(401);
  });

  // ── UI registration with language ──

  test('should send email in current UI language after registration', async ({
    registerPage,
    emailPage,
    page,
  }) => {
    const email = uniqueEmail('ui_vi');
    const name = 'UI VN User';

    // Set language to Vietnamese in localStorage before navigating
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('brewly_lang', 'vi'));

    // Navigate to register page (should now be Vietnamese)
    await registerPage.goto();
    await expect(page.locator('[data-testid="register-form"]')).toBeVisible();

    // Fill in and submit
    await registerPage.register(name, email, 'password123');

    // Wait for redirect
    await page.waitForURL(/\/#\/?$/, { timeout: 15_000 });

    // Wait for Vietnamese email
    const msg = await emailPage.waitForEmail(email, 15_000);
    const subject = emailPage.getSubject(msg);
    expect(subject).toContain('Chào mừng đến Brewly');

    const body = emailPage.getBody(msg);
    expect(body).toContain('Cảm ơn bạn đã tham gia Brewly');
  });

  // ── No duplicate check ──

  test('should not send duplicate emails for single registration', async ({
    emailPage,
    request,
  }) => {
    const email = uniqueEmail('nodup');

    await request.post(`${API_URL}/api/register`, {
      data: { name: 'NoDup', email, password: 'password123', lang: 'en' },
    });

    await emailPage.waitForEmail(email, 15_000);
    await new Promise(r => setTimeout(r, 2000));

    const result = await emailPage.searchByRecipient(email);
    expect(result.total).toBe(1);
  });
});
