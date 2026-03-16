/**
 * Register Page
 */
import { register } from '../api.js';
import { t, getLang } from '../i18n.js';

export async function renderRegisterPage() {
  return `
    <div class="auth-page">
      <div class="auth-card" data-testid="register-form">
        <h1>${t('register.title')}</h1>
        <p class="subtitle">${t('register.subtitle')}</p>

        <div class="alert-message error" id="register-error" data-testid="error-message"></div>

        <form id="register-form">
          <div class="form-group">
            <label for="name">${t('register.fullName')}</label>
            <input type="text" id="name" placeholder="John Doe" required minlength="2" 
                   data-testid="name-input" />
          </div>
          <div class="form-group">
            <label for="email">${t('register.email')}</label>
            <input type="email" id="email" placeholder="you@example.com" required 
                   data-testid="email-input" />
          </div>
          <div class="form-group">
            <label for="password">${t('register.password')}</label>
            <input type="password" id="password" placeholder="Min 6 characters" required minlength="6" 
                   data-testid="password-input" />
          </div>
          <div class="form-group">
            <label for="confirm-password">${t('register.confirmPassword')}</label>
            <input type="password" id="confirm-password" placeholder="Re-enter password" required 
                   data-testid="confirm-password-input" />
          </div>
          <button type="submit" class="btn btn-primary" data-testid="register-button">${t('register.createAccount')}</button>
        </form>

        <div class="auth-footer">
          ${t('register.hasAccount')} <a href="#/login" data-testid="login-link">${t('register.signIn')}</a>
        </div>
      </div>
    </div>
  `;
}

export async function initRegisterPage() {
  const form = document.getElementById('register-form');
  const errorEl = document.getElementById('register-error');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.classList.remove('show');

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
      errorEl.textContent = t('register.passwordMismatch');
      errorEl.classList.add('show');
      return;
    }

    try {
      await register(name, email, password, getLang());

      // Show email notification toast
      const toast = document.createElement('div');
      toast.className = 'toast show';
      toast.textContent = t('register.successEmail');
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 4000);

      window.location.hash = '#/';
      window.location.reload();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.add('show');
    }
  });
}
