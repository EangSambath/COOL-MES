import axios from 'axios';
import { DEFAULT_CATEGORIES } from '../data/mockData';

/**
 * API client for the COOL MES backend (ASP.NET Core + PostgreSQL).
 *
 * All data comes from, and is saved to, the real database through the API.
 * Admin write endpoints require a signed Bearer token from POST /api/auth/login.
 */
const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

export const ADMIN_TOKEN_KEY = 'coolmes_admin_token';
export const CATEGORIES_CACHE_KEY = 'coolmes_categories_cache';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s to allow Render free-tier cold start wakeup
  headers: { 'Content-Type': 'application/json' },
});

// Attach the admin Bearer token automatically whenever it is present
client.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If an admin session expires (HTTP 401), clear the stored token and notify AdminPage
client.interceptors.response.use(
  (response) => response,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || '';
    if (status === 401 && !url.includes('/auth/login')) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem('coolmes_admin_auth');
      window.dispatchEvent(new Event('coolmes:unauthorized'));
    }
    return Promise.reject(err);
  }
);

/**
 * Turns an axios error into a readable message, including
 * ASP.NET Core validation errors ({ errors: { Field: [msg] } }).
 */
function toErrorMessage(err) {
  if (!err.response) {
    return `Cannot connect to the server at ${API_BASE_URL}. Make sure the backend is running (cd backend; dotnet run).`;
  }
  const data = err.response.data;
  if (data?.errors && typeof data.errors === 'object') {
    return Object.values(data.errors).flat().join(' ');
  }
  if (data?.message) return data.message;
  if (data?.title) return data.title;
  return `Request failed (HTTP ${err.response.status}).`;
}

async function request(promise) {
  try {
    const response = await promise;
    return response.data;
  } catch (err) {
    throw new Error(toErrorMessage(err), { cause: err });
  }
}

export const api = {
  // ---------- Auth ----------
  hasAdminToken() {
    return Boolean(localStorage.getItem(ADMIN_TOKEN_KEY));
  },

  async login(password) {
    const data = await request(client.post('/auth/login', { password }));
    if (data?.token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      localStorage.setItem('coolmes_admin_auth', 'true');
    }
    return data;
  },

  verifyAdmin() {
    return request(client.get('/auth/verify'));
  },

  logout() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem('coolmes_admin_auth');
  },

  // ---------- Categories ----------
  getInitialCategories() {
    try {
      const cached = localStorage.getItem(CATEGORIES_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore localStorage errors and fallback to default categories
    }
    return DEFAULT_CATEGORIES;
  },

  async getCategories() {
    const data = await request(client.get('/categories'));
    if (Array.isArray(data) && data.length > 0) {
      localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(data));
    }
    return data;
  },

  async createCategory(categoryData) {
    const created = await request(client.post('/categories', categoryData));
    // Immediately update local cache so UI stays instant
    const current = this.getInitialCategories();
    localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify([...current, created]));
    return created;
  },

  async updateCategory(id, categoryData) {
    const updated = await request(client.put(`/categories/${id}`, categoryData));
    // Update local cache so UI updates instantly
    const current = this.getInitialCategories().map((c) =>
      c.categoryId === id ? updated : c
    );
    localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(current));
    return updated;
  },

  async deleteCategory(id) {
    const res = await request(client.delete(`/categories/${id}`));
    const current = this.getInitialCategories().filter((c) => c.categoryId !== id);
    localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(current));
    return res;
  },

  // ---------- Products ----------
  /** Returns { items, totalCount, page, pageSize, ... } */
  getProducts(params = {}, config = {}) {
    return request(client.get('/products', { params, ...config }));
  },

  /** Returns all products without pagination */
  getAllProducts() {
    return request(client.get('/products/all'));
  },

  getProductById(id) {
    return request(client.get(`/products/${id}`));
  },

  createProduct(productData) {
    return request(client.post('/products', productData));
  },

  updateProduct(id, productData) {
    return request(client.put(`/products/${id}`, productData));
  },

  updateStock(id, stockQuantity) {
    return request(client.patch(`/products/${id}/stock`, { stockQuantity: Number(stockQuantity) }));
  },

  deleteProduct(id) {
    return request(client.delete(`/products/${id}`));
  },
};
