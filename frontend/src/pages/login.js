/**
 * Login Page
 */
import { login } from '../api.js';
import { t } from '../i18n.js';

export async function renderLoginPage() {
  return `
    <div class="auth-page">
      <div class="auth-card" data-testid="login-form">
        <h1>${t('login.title')}</h1>
        <p class="subtitle">${t('login.subtitle')}</p>

        <div class="alert-message error" id="login-error" data-testid="error-message"></div>

        <form id="login-form">
          <div class="form-group">
            <label for="email">${t('login.email')}</label>
            <input type="email" id="email" placeholder="you@example.com" required 
                   data-testid="email-input" />
          </div>
          <div class="form-group">
            <label for="password">${t('login.password')}</label>
            <input type="password" id="password" placeholder="••••••••" required 
                   data-testid="password-input" />
          </div>
          <button type="submit" class="btn btn-primary" data-testid="login-button">${t('login.signIn')}</button>
        </form>

        <div class="auth-footer">
          ${t('login.noAccount')} <a href="#/register" data-testid="register-link">${t('login.createOne')}</a>
        </div>

        <div style="margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--bg-glass-border); text-align:center;">
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: var(--space-sm);">${t('login.demoAccount')}</p>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">demo@fnb.com / password123</p>
        </div>
      </div>
    </div>
  `;
}

export async function initLoginPage() {
  const form = document.getElementById('login-form');
  const errorEl = document.getElementById('login-error');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.classList.remove('show');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      await login(email, password);
      window.location.hash = '#/';
      window.location.reload();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.add('show');
    }
  });
}
