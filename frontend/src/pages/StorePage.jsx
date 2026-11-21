import { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../components/Header';
import HeroCarousel from '../components/HeroCarousel';
import ProductGrid from '../components/ProductGrid';
import ProductModal from '../components/ProductModal';
import Footer from '../components/Footer';
import { api } from '../api/api';
import { openGeneralTelegram } from '../utils/telegram';

export default function StorePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const requestSeqRef = useRef(0);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await api.getCategories();
      setCategories(cats || []);
    } catch (err) {
      setLoadError(err.message);
    }
  }, []);

  useEffect(() => {
    let active = true;
    api.getCategories()
      .then((cats) => {
        if (active) setCategories(cats || []);
      })
      .catch((err) => {
        if (active) setLoadError(err.message);
      });
    return () => {
      active = false;
    };
  }, []);

  const fetchProducts = useCallback(async () => {
    const seq = ++requestSeqRef.current;
    setLoading(true);
    try {
      const page = await api.getProducts({
        search: searchTerm.trim() || undefined,
        categoryId: selectedCategory || undefined,
        inStockOnly: inStockOnly || undefined,
        sortBy: sortBy || undefined,
        pageSize: 100,
      });
      if (seq !== requestSeqRef.current) return;
      setProducts(page?.items || []);
      setLoadError(null);
    } catch (err) {
      if (seq !== requestSeqRef.current) return;
      setProducts([]);
      setLoadError(err.message);
    } finally {
      if (seq === requestSeqRef.current) {
        setLoading(false);
      }
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

  const handleHeroAction = (slide) => {
    if (slide?.action === 'telegram') {
      openGeneralTelegram();
      return;
    }
    if (slide?.categoryName && categories.length > 0) {
      const matched = categories.find(
        (c) => c.categoryName.toLowerCase() === slide.categoryName.toLowerCase()
      );
      if (matched) {
        setSelectedCategory(matched.categoryId);
      }
    }
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
      />

      <HeroCarousel onExploreClick={handleHeroAction} />

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
