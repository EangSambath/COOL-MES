import React, { useState, useEffect } from 'react';
import { 
  FolderPlus, PackagePlus, Edit2, Trash2, ArrowLeft, LogOut, 
  Search, Shield, CheckCircle2, AlertCircle, Plus, Minus, 
  ExternalLink, Layers, Package, AlertTriangle, X
} from 'lucide-react';
import { api } from '../api/api';
import logoImg from '../assets/picture/logo.png';

export default function AdminDashboard({ onExitAdmin, onRefreshStoreData }) {
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'products'
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Search & Filter state
  const [catSearch, setCatSearch] = useState('');
  const [prodSearch, setProdSearch] = useState('');
  const [prodCatFilter, setProdCatFilter] = useState('');

  // Modals state
  const [categoryModal, setCategoryModal] = useState({ isOpen: false, mode: 'create', data: null });
  const [productModal, setProductModal] = useState({ isOpen: false, mode: 'create', data: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: '', id: null, name: '' });

  const [loadError, setLoadError] = useState(null);

  // Load data (always fresh from the database via the API)
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [cats, prodPage] = await Promise.all([
        api.getCategories(),
        api.getProducts({ pageSize: 100 })
      ]);
      setCategories(cats || []);
      setProducts(prodPage?.items || []);
      setLoadError(null);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // --- Category Actions ---
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const categoryName = formData.get('categoryName')?.trim();
    const description = formData.get('description')?.trim();

    if (!categoryName) return;

    try {
      if (categoryModal.mode === 'create') {
        await api.createCategory({ categoryName, description });
        showToast(`Category "${categoryName}" saved to database.`);
      } else {
        await api.updateCategory(categoryModal.data.categoryId, { categoryName, description });
        showToast(`Category "${categoryName}" updated in database.`);
      }
      setCategoryModal({ isOpen: false, mode: 'create', data: null });
      await loadDashboardData();
      onRefreshStoreData();
    } catch (err) {
      // Keep the modal open so the admin can fix the input
      showToast(err.message, 'error');
    }
  };

  const handleDeleteCategory = async () => {
    const { id, name } = deleteConfirm;
    setDeleteConfirm({ isOpen: false, type: '', id: null, name: '' });
    try {
      await api.deleteCategory(id);
      showToast(`Category "${name}" deleted from database.`);
      await loadDashboardData();
      onRefreshStoreData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // --- Product Actions ---
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      productName: formData.get('productName')?.trim(),
      description: formData.get('description')?.trim(),
      price: parseFloat(formData.get('price')),
      imageUrl: formData.get('imageUrl')?.trim(),
      stockQuantity: parseInt(formData.get('stockQuantity'), 10) || 0,
      categoryId: parseInt(formData.get('categoryId'), 10)
    };

    if (!productData.productName || !productData.imageUrl || !productData.categoryId) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    try {
      if (productModal.mode === 'create') {
        await api.createProduct(productData);
        showToast(`Product "${productData.productName}" saved to database.`);
      } else {
        await api.updateProduct(productModal.data.productId, productData);
        showToast(`Product "${productData.productName}" updated in database.`);
      }
      setProductModal({ isOpen: false, mode: 'create', data: null });
      await loadDashboardData();
      onRefreshStoreData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleQuickStockUpdate = async (product, change) => {
    const newStock = Math.max(0, (product.stockQuantity || 0) + change);
    try {
      await api.updateStock(product.productId, newStock);
      setProducts(prev => prev.map(p =>
        p.productId === product.productId ? { ...p, stockQuantity: newStock, inStock: newStock > 0 } : p
      ));
      onRefreshStoreData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async () => {
    const { id, name } = deleteConfirm;
    setDeleteConfirm({ isOpen: false, type: '', id: null, name: '' });
    try {
      await api.deleteProduct(id);
      showToast(`Product "${name}" deleted from database.`);
      await loadDashboardData();
      onRefreshStoreData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Stats
  const totalStock = products.reduce((acc, p) => acc + (p.stockQuantity || 0), 0);
  const lowStockCount = products.filter(p => (p.stockQuantity || 0) <= 5).length;

  // Filtered views
  const filteredCategories = categories.filter(c => 
    c.categoryName.toLowerCase().includes(catSearch.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(catSearch.toLowerCase()))
  );

  const filteredProducts = products.filter(p => {
    const matchQuery = p.productName.toLowerCase().includes(prodSearch.toLowerCase()) ||
                       (p.description && p.description.toLowerCase().includes(prodSearch.toLowerCase()));
    const matchCat = prodCatFilter ? p.categoryId === parseInt(prodCatFilter, 10) : true;
    return matchQuery && matchCat;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 glass-chrome">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-750 p-1 flex items-center justify-center overflow-hidden">
              <img src={logoImg} alt="COOL MES Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-lg text-white">COOL MES</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ADMIN PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Inventory & Category Control</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onExitAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('coolmes_admin_auth');
                onExitAdmin();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
        
        {/* Backend / database connection error */}
        {loadError && (
          <div className="p-4 rounded-xl border bg-rose-950/80 border-rose-800 text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">Not connected to the database — changes cannot be saved.</p>
                <p className="text-xs text-rose-300 mt-0.5">{loadError}</p>
              </div>
            </div>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Toast Notification */}
        {notification && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 shadow-xl transition animate-fadeIn ${
            notification.type === 'error' 
              ? 'bg-rose-950/90 border-rose-800 text-rose-200' 
              : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
          }`}>
            {notification.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">Total Products</span>
              <div className="text-2xl font-black text-white font-mono mt-0.5">{products.length}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">Categories</span>
              <div className="text-2xl font-black text-white font-mono mt-0.5">{categories.length}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">Total Units Stock</span>
              <div className="text-2xl font-black text-white font-mono mt-0.5">{totalStock}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">Low/Out of Stock</span>
              <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">{lowStockCount}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
              activeTab === 'categories'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Manage Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
              activeTab === 'products'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Manage Products ({products.length})</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: CATEGORIES MANAGEMENT                              */}
        {/* ========================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <button
                onClick={() => setCategoryModal({ isOpen: true, mode: 'create', data: null })}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            {/* Categories Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 uppercase text-[11px] text-slate-400 tracking-wider">
                    <tr>
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Category Name</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 text-center">Products</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredCategories.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-slate-500">
                          No categories found. Click "Add Category" to create one.
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((cat) => (
                        <tr key={cat.categoryId} className="hover:bg-slate-850/50 transition">
                          <td className="py-3.5 px-4 font-mono text-slate-400">#{cat.categoryId}</td>
                          <td className="py-3.5 px-4 font-bold text-white text-sm">{cat.categoryName}</td>
                          <td className="py-3.5 px-4 text-slate-300 max-w-md truncate">{cat.description || '—'}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 font-mono text-emerald-400 font-bold">
                              {cat.productCount ?? products.filter(p => p.categoryId === cat.categoryId).length}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setCategoryModal({ isOpen: true, mode: 'edit', data: cat })}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                                title="Edit Category"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ 
                                  isOpen: true, 
                                  type: 'category', 
                                  id: cat.categoryId, 
                                  name: cat.categoryName 
                                })}
                                className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition"
                                title="Delete Category"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PRODUCTS MANAGEMENT                                */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search product name or keyword..."
                    value={prodSearch}
                    onChange={(e) => setProdSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={prodCatFilter}
                  onChange={(e) => setProdCatFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setProductModal({ isOpen: true, mode: 'create', data: null })}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20"
              >
                <PackagePlus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 uppercase text-[11px] text-slate-400 tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4 text-center">Stock Quantity</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-8 text-slate-500">
                          No products found matching criteria. Click "Add Product" to create one.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => {
                        const isOut = (prod.stockQuantity || 0) <= 0;
                        const isLow = (prod.stockQuantity || 0) > 0 && (prod.stockQuantity || 0) <= 5;
                        return (
                          <tr key={prod.productId} className="hover:bg-slate-850/50 transition">
                            {/* Product Image & Title */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.imageUrl}
                                  alt={prod.productName}
                                  className="w-11 h-11 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=200&auto=format&fit=crop&q=80';
                                  }}
                                />
                                <div>
                                  <div className="font-bold text-white text-sm line-clamp-1">{prod.productName}</div>
                                  <div className="text-[11px] text-slate-400 line-clamp-1">{prod.description || 'No description'}</div>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                                {prod.categoryName || 'General'}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                              ${Number(prod.price).toFixed(2)}
                            </td>

                            {/* Stock Quantity with Quick Adjust Buttons */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleQuickStockUpdate(prod, -1)}
                                  disabled={prod.stockQuantity <= 0}
                                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white flex items-center justify-center transition"
                                  title="Decrease stock by 1"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center font-mono font-bold text-white">
                                  {prod.stockQuantity}
                                </span>
                                <button
                                  onClick={() => handleQuickStockUpdate(prod, 1)}
                                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition"
                                  title="Increase stock by 1"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              {isOut ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                                  Out of Stock
                                </span>
                              ) : isLow ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                                  Low Stock
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                                  In Stock
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setProductModal({ isOpen: true, mode: 'edit', data: prod })}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm({ 
                                    isOpen: true, 
                                    type: 'product', 
                                    id: prod.productId, 
                                    name: prod.productName 
                                  })}
                                  className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT CATEGORY                              */}
      {/* ========================================================= */}
      {categoryModal.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn"
          onClick={() => setCategoryModal({ isOpen: false, mode: 'create', data: null })}
        >
          <div 
            className="relative w-full max-w-md glass-sheet animate-sheetIn rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setCategoryModal({ isOpen: false, mode: 'create', data: null })}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white font-mono mb-4">
              {categoryModal.mode === 'create' ? 'Create New Category' : 'Edit Category'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="categoryName"
                  required
                  defaultValue={categoryModal.data?.categoryName || ''}
                  placeholder="e.g. Tactical Knives & Blades"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  defaultValue={categoryModal.data?.description || ''}
                  placeholder="Short description of products in this category..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCategoryModal({ isOpen: false, mode: 'create', data: null })}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-md shadow-emerald-500/20"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ADD / EDIT PRODUCT                               */}
      {/* ========================================================= */}
      {productModal.isOpen && (
        <ProductFormModal
          mode={productModal.mode}
          data={productModal.data}
          categories={categories}
          onClose={() => setProductModal({ isOpen: false, mode: 'create', data: null })}
          onSubmit={handleSaveProduct}
        />
      )}

      {/* ========================================================= */}
      {/* MODAL 3: DELETE CONFIRMATION                              */}
      {/* ========================================================= */}
      {deleteConfirm.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn"
          onClick={() => setDeleteConfirm({ isOpen: false, type: '', id: null, name: '' })}
        >
          <div 
            className="w-full max-w-sm glass-sheet animate-sheetIn rounded-2xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Confirm Deletion</h3>
            <p className="text-xs text-slate-400 mb-5">
              Are you sure you want to delete <strong className="text-white">"{deleteConfirm.name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setDeleteConfirm({ isOpen: false, type: '', id: null, name: '' })}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={deleteConfirm.type === 'category' ? handleDeleteCategory : handleDeleteProduct}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-600/30"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component for product form with live image preview
function ProductFormModal({ mode, data, categories, onClose, onSubmit }) {
  const [previewUrl, setPreviewUrl] = useState(data?.imageUrl || '');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl glass-sheet animate-sheetIn rounded-2xl p-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-black text-white font-mono mb-4">
          {mode === 'create' ? 'Add New Product' : 'Edit Product'}
        </h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="productName"
              required
              defaultValue={data?.productName || ''}
              placeholder="e.g. Grade 5 Titanium Tactical Pen"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Category *
              </label>
              <select
                name="categoryId"
                required
                defaultValue={data?.categoryId || (categories[0]?.categoryId || '')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Price (USD $) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                name="price"
                required
                defaultValue={data?.price || ''}
                placeholder="29.99"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                name="stockQuantity"
                required
                defaultValue={data?.stockQuantity ?? 10}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Image Preview
              </label>
              <div className="h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center px-3 gap-2 overflow-hidden">
                {previewUrl ? (
                  <>
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-7 h-7 rounded object-cover border border-slate-700" 
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=100'; }}
                    />
                    <span className="text-[11px] text-emerald-400 truncate">Image loaded</span>
                  </>
                ) : (
                  <span className="text-[11px] text-slate-500">Enter image URL below</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Image URL *
            </label>
            <input
              type="url"
              name="imageUrl"
              required
              value={previewUrl}
              onChange={(e) => setPreviewUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Product Description
            </label>
            <textarea
              name="description"
              rows="3"
              defaultValue={data?.description || ''}
              placeholder="Specifications, materials, dimensions, and tactical features..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-md shadow-emerald-500/20"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

