import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import HeroCarousel from '../components/HeroCarousel';
import ProductGrid from '../components/ProductGrid';
import ProductModal from '../components/ProductModal';
import Footer from '../components/Footer';
import { api } from '../api/api';

export default function StorePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState(null);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await api.getCategories();
      setCategories(cats || []);
      setIsLiveApi(true);
    } catch (err) {
      setLoadError(err.message);
      setIsLiveApi(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const page = await api.getProducts({
        search: searchTerm.trim() || undefined,
        categoryId: selectedCategory || undefined,
        inStockOnly: inStockOnly || undefined,
        sortBy: sortBy || undefined,
        pageSize: 100, // API default is 12; load the whole catalog
      });
      setProducts(page?.items || []);
      setIsLiveApi(true);
      setLoadError(null);
    } catch (err) {
      setProducts([]);
      setLoadError(err.message);
      setIsLiveApi(false);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm, inStockOnly, sortBy]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 200);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
    setInStockOnly(false);
    setSortBy('newest');
  };

  const hasActiveFilters = Boolean(
    selectedCategory !== null ||
    searchTerm.trim() !== '' ||
    inStockOnly ||
    sortBy !== 'newest'
  );

  const activeCategoryObj = categories.find((c) => c.categoryId === selectedCategory);
  const activeCategoryName = activeCategoryObj ? activeCategoryObj.categoryName : null;

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1D1D1F]">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isLiveApi={isLiveApi}
      />

      <HeroCarousel onExploreClick={scrollToProducts} />

      <main className="flex-1">
        {loadError && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="p-4 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-between gap-3">
              <span className="text-sm text-[#6E6E73]">Sorry, we couldn't load the products right now. Please try again shortly.</span>
              <button
                onClick={() => { fetchCategories(); fetchProducts(); }}
                className="px-4 py-2 rounded-full bg-[#1D1D1F] hover:bg-[#000000] text-white text-xs font-medium shrink-0"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        <ProductGrid
          products={products}
          loading={loading}
          onViewDetails={(product) => setActiveProduct(product)}
          inStockOnly={inStockOnly}
          onToggleInStock={setInStockOnly}
          sortBy={sortBy}
          onSortChange={setSortBy}
          activeCategoryName={activeCategoryName}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </main>

      {activeProduct && (
        <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
      )}

      <Footer />
    </div>
  );
}
