import axios from 'axios';

/**
 * API client for the COOL MES backend (ASP.NET Core + PostgreSQL).
 *
 * All data comes from, and is saved to, the real database through the API.
 * There is intentionally NO mock/in-memory fallback: if the backend is down,
 * calls throw an error so the UI can show it, instead of pretending to save.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

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
    throw new Error(toErrorMessage(err));
  }
}

export const api = {
  // ---------- Categories ----------
  getCategories() {
    return request(client.get('/categories'));
  },

  createCategory(categoryData) {
    return request(client.post('/categories', categoryData));
  },

  updateCategory(id, categoryData) {
    return request(client.put(`/categories/${id}`, categoryData));
  },

  deleteCategory(id) {
    return request(client.delete(`/categories/${id}`));
  },

  // ---------- Products ----------
  /** Returns { items, totalCount, page, pageSize, ... } */
  getProducts(params = {}) {
    return request(client.get('/products', { params }));
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
