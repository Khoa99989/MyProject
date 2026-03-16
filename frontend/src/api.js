/**
 * API Client — wraps fetch for backend calls
 * Production: set VITE_API_URL (e.g. https://your-backend.onrender.com/api) khi build
 */
const API_BASE = import.meta.env.VITE_API_URL || '/api';

/** Get stored JWT token */
function getToken() {
  return localStorage.getItem('fnb_token');
}

/** Store JWT token */
export function setToken(token) {
  localStorage.setItem('fnb_token', token);
}

/** Remove JWT token */
export function clearToken() {
  localStorage.removeItem('fnb_token');
  localStorage.removeItem('fnb_user');
}

/** Get stored user */
export function getUser() {
  const u = localStorage.getItem('fnb_user');
  return u ? JSON.parse(u) : null;
}

/** Store user */
export function setUser(user) {
  localStorage.setItem('fnb_user', JSON.stringify(user));
}

/** Check if user is logged in */
export function isLoggedIn() {
  return !!getToken();
}

/** Generic fetch wrapper */
async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(res.ok ? 'Empty response from server' : `Request failed (${res.status})`);
  }

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// ---- Auth ----
export async function login(email, password) {
  const data = await request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  setUser(data.user);
  return data;
}

export async function register(name, email, password, lang = 'en') {
  const data = await request('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, lang }),
  });
  setToken(data.token);
  setUser(data.user);
  return data;
}

// ---- Products ----
export async function getProducts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/products${qs ? '?' + qs : ''}`);
}

export async function getProduct(id) {
  return request(`/products/${id}`);
}

export async function getFeaturedProducts() {
  return request('/products/featured');
}

export async function getCategories() {
  return request('/categories');
}

// ---- Cart ----
export async function getCart() {
  return request('/cart');
}

export async function addToCart(productId, quantity = 1) {
  return request('/cart', {
    method: 'POST',
    body: JSON.stringify({ product_id: productId, quantity }),
  });
}

export async function updateCartItem(itemId, quantity) {
  return request(`/cart/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
}

export async function removeFromCart(itemId) {
  return request(`/cart/${itemId}`, { method: 'DELETE' });
}

export async function clearCart() {
  return request('/cart', { method: 'DELETE' });
}
