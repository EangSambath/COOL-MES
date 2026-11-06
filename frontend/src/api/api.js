import axios from 'axios';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../data/mockData';

// Mutable in-memory copies for local fallback
let localCategories = [...MOCK_CATEGORIES];
let localProducts = [...MOCK_PRODUCTS];

// Prefer Vite proxy or explicit environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  /**
   * Fetch all categories
   */
  async getCategories() {
    try {
      const response = await client.get('/categories');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return { data: response.data, isLive: true };
      }
      return { data: localCategories, isLive: false };
    } catch (err) {
      console.warn('API /categories failed or offline, using fallback data:', err.message);
      return { data: localCategories, isLive: false, error: err.message };
    }
  },

  /**
   * Create a new category
   */
  async createCategory(categoryData) {
    try {
      const response = await client.post('/categories', categoryData);
      return { success: true, data: response.data, isLive: true };
    } catch (err) {
      console.warn('API createCategory fallback:', err.message);
      const newCategory = {
        categoryId: localCategories.length ? Math.max(...localCategories.map(c => c.categoryId)) + 1 : 1,
        categoryName: categoryData.categoryName,
        description: categoryData.description || '',
        productCount: 0
      };
      localCategories.push(newCategory);
      return { success: true, data: newCategory, isLive: false };
    }
  },

  /**
   * Update category
   */
  async updateCategory(id, categoryData) {
    try {
      const response = await client.put(`/categories/${id}`, categoryData);
      return { success: true, data: response.data, isLive: true };
    } catch (err) {
      console.warn('API updateCategory fallback:', err.message);
      const idx = localCategories.findIndex(c => c.categoryId === Number(id));
      if (idx !== -1) {
        localCategories[idx] = { ...localCategories[idx], ...categoryData };
        // Update category name in products if changed
        localProducts.forEach(p => {
          if (p.categoryId === Number(id)) {
            p.categoryName = categoryData.categoryName;
          }
        });
        return { success: true, data: localCategories[idx], isLive: false };
      }
      return { success: false, error: 'Category not found' };
    }
  },

  /**
   * Delete category
   */
  async deleteCategory(id) {
    try {
      const response = await client.delete(`/categories/${id}`);
      return { success: true, data: response.data, isLive: true };
    } catch (err) {
      console.warn('API deleteCategory fallback:', err.message);
      const hasProducts = localProducts.some(p => p.categoryId === Number(id));
      if (hasProducts) {
        throw new Error('Cannot delete category with associated products.');
      }
      localCategories = localCategories.filter(c => c.categoryId !== Number(id));
      return { success: true, isLive: false };
    }
  },

  /**
   * Fetch products with search, category, and sorting filters
   */
  async getProducts(params = {}) {
    try {
      const response = await client.get('/products', { params });
      if (response.data && response.data.items) {
        return {
          items: response.data.items,
          totalCount: response.data.totalCount,
          page: response.data.page,
          pageSize: response.data.pageSize,
          isLive: true,
        };
      }
      if (Array.isArray(response.data)) {
        return {
          items: response.data,
          totalCount: response.data.length,
          page: 1,
          pageSize: response.data.length,
          isLive: true,
        };
      }
      throw new Error('Unexpected response shape');
    } catch (err) {
      console.warn('API /products failed or offline, using fallback mock data:', err.message);
      
      let filtered = [...localProducts];

      if (params.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(p =>
          p.productName.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query))
        );
      }

      if (params.categoryId && Number(params.categoryId) > 0) {
        filtered = filtered.filter(p => p.categoryId === Number(params.categoryId));
      }

      if (params.inStockOnly) {
        filtered = filtered.filter(p => p.stockQuantity > 0);
      }

      if (params.minPrice) {
        filtered = filtered.filter(p => p.price >= Number(params.minPrice));
      }

      if (params.maxPrice) {
        filtered = filtered.filter(p => p.price <= Number(params.maxPrice));
      }

      if (params.sortBy === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (params.sortBy === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (params.sortBy === 'name_asc') {
        filtered.sort((a, b) => a.productName.localeCompare(b.productName));
      } else if (params.sortBy === 'name_desc') {
        filtered.sort((a, b) => b.productName.localeCompare(a.productName));
      }

      return {
        items: filtered,
        totalCount: filtered.length,
        page: 1,
        pageSize: filtered.length,
        isLive: false,
        error: err.message,
      };
    }
  },

  /**
   * Fetch single product by ID
   */
  async getProductById(id) {
    try {
      const response = await client.get(`/products/${id}`);
      return { data: response.data, isLive: true };
    } catch (err) {
      const found = localProducts.find(p => p.productId === Number(id));
      return { data: found || null, isLive: false };
    }
  },

  /**
   * Create a new product
   */
  async createProduct(productData) {
    try {
      const response = await client.post('/products', productData);
      return { success: true, data: response.data, isLive: true };
    } catch (err) {
      console.warn('API createProduct fallback:', err.message);
      const cat = localCategories.find(c => c.categoryId === Number(productData.categoryId));
      const newProduct = {
        productId: localProducts.length ? Math.max(...localProducts.map(p => p.productId)) + 1 : 1,
        productName: productData.productName,
        description: productData.description || '',
        price: Number(productData.price),
        imageUrl: productData.imageUrl,
        stockQuantity: Number(productData.stockQuantity || 0),
        inStock: Number(productData.stockQuantity || 0) > 0,
        categoryId: Number(productData.categoryId),
        categoryName: cat ? cat.categoryName : '',
        createdAt: new Date().toISOString()
      };
      localProducts.unshift(newProduct);
      if (cat) cat.productCount = (cat.productCount || 0) + 1;
      return { success: true, data: newProduct, isLive: false };
    }
  },

  /**
   * Update an existing product
   */
  async updateProduct(id, productData) {
    try {
      const response = await client.put(`/products/${id}`, productData);
      return { success: true, data: response.data, isLive: true };
    } catch (err) {
      console.warn('API updateProduct fallback:', err.message);
      const idx = localProducts.findIndex(p => p.productId === Number(id));
      if (idx !== -1) {
        const cat = localCategories.find(c => c.categoryId === Number(productData.categoryId));
        localProducts[idx] = {
          ...localProducts[idx],
          productName: productData.productName,
          description: productData.description,
          price: Number(productData.price),
          imageUrl: productData.imageUrl,
          stockQuantity: Number(productData.stockQuantity),
          inStock: Number(productData.stockQuantity) > 0,
          categoryId: Number(productData.categoryId),
          categoryName: cat ? cat.categoryName : localProducts[idx].categoryName,
          updatedAt: new Date().toISOString()
        };
        return { success: true, data: localProducts[idx], isLive: false };
      }
      return { success: false, error: 'Product not found' };
    }
  },

  /**
   * Quick update stock
   */
  async updateStock(id, stockQuantity) {
    try {
      const response = await client.patch(`/products/${id}/stock`, { stockQuantity: Number(stockQuantity) });
      return { success: true, data: response.data, isLive: true };
    } catch (err) {
      console.warn('API updateStock fallback:', err.message);
      const found = localProducts.find(p => p.productId === Number(id));
      if (found) {
        found.stockQuantity = Number(stockQuantity);
        found.inStock = Number(stockQuantity) > 0;
        return { success: true, data: found, isLive: false };
      }
      return { success: false, error: 'Product not found' };
    }
  },

  /**
   * Delete a product
   */
  async deleteProduct(id) {
    try {
      const response = await client.delete(`/products/${id}`);
      return { success: true, data: response.data, isLive: true };
    } catch (err) {
      console.warn('API deleteProduct fallback:', err.message);
      const product = localProducts.find(p => p.productId === Number(id));
      if (product) {
        const cat = localCategories.find(c => c.categoryId === product.categoryId);
        if (cat && cat.productCount > 0) cat.productCount -= 1;
      }
      localProducts = localProducts.filter(p => p.productId !== Number(id));
      return { success: true, isLive: false };
    }
  },

  /**
   * Check API Health
   */
  async checkHealth() {
    try {
      await client.get('/categories');
      return true;
    } catch {
      return false;
    }
  }
};
