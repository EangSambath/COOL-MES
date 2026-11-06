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

  const fetchCategories = useCallback(async () => {
    const result = await api.getCategories();
    setCategories(result.data || []);
    if (result.isLive) setIsLiveApi(true);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getProducts({
        search: searchTerm.trim() || undefined,
        categoryId: selectedCategory || undefined,
        inStockOnly: inStockOnly || undefined,
        sortBy: sortBy || undefined,
      });
      setProducts(result.items || []);
      if (result.isLive) setIsLiveApi(true);
    } catch (err) {
      console.error('Error fetching products:', err);
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
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
