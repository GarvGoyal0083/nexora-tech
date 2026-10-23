// frontend/src/pages/Shop.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Filter,
  Search,
  X,
  RotateCcw
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';

export default function Shop() {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [condition, setCondition] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    'All',
    'Laptops',
    'Desktop PCs',
    'Monitors',
    'Components',
    'Printers',
    'Accessories'
  ];

  const brands = [
    'All',
    'Apple',
    'ASUS ROG',
    'NVIDIA',
    'Razer',
    'Samsung',
    'Dell',
    'Corsair',
    'HP',
    'Brother',
    'Epson',
    'Logitech',
    'SteelSeries',
    'Sony',
    'Nexora'
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');
    const condParam = params.get('condition');
    const searchParam = params.get('search');
    const brandParam = params.get('brand');

    if (catParam) setCategory(catParam);
    if (condParam) setCondition(condParam);
    if (searchParam) setSearch(searchParam);
    if (brandParam) setSelectedBrand(brandParam);
  }, [location.search]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category && category !== 'All') params.append('category', category);
        if (condition && condition !== 'All') params.append('condition', condition);
        if (selectedBrand && selectedBrand !== 'All') params.append('brand', selectedBrand);
        if (maxPrice < 5000) params.append('maxPrice', maxPrice);
        if (inStockOnly) params.append('inStock', '1');
        if (sortBy) params.append('sort', sortBy);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error loading shop products:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchProducts, 150);
    return () => clearTimeout(timer);
  }, [search, category, condition, selectedBrand, maxPrice, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setCondition('All');
    setSelectedBrand('All');
    setMaxPrice(5000);
    setInStockOnly(false);
    setSortBy('featured');
    navigate('/shop');
  };

  const hasActiveFilters =
    search !== '' ||
    category !== 'All' ||
    condition !== 'All' ||
    selectedBrand !== 'All' ||
    maxPrice < 5000 ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 space-y-10">
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Minimalist Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-neutral-200 gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
            {category === 'All' ? 'All Hardware' : category}
          </h1>
          <p className="text-xs text-neutral-500 mt-1.5">
            Showing {products.length} {products.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Clean Condition Pills */}
        <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-full self-start md:self-auto">
          {[
            { id: 'All', label: 'All' },
            { id: 'New', label: 'New' },
            { id: 'Certified Refurbished', label: 'Refurbished' }
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setCondition(c.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                condition === c.id
                  ? 'bg-black text-white'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Clean Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8">
          <div className="space-y-7 sticky top-28">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-black">
                Filters
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-neutral-500 hover:text-black underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-100 border border-transparent focus:bg-white focus:border-black text-xs text-black placeholder-neutral-400 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Categories */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-black block">Category</label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      category === cat
                        ? 'bg-black text-white font-medium'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-black block">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-100 border border-transparent focus:border-black text-xs text-black focus:outline-none"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Max Price */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-black">Max Price</span>
                <span className="font-medium text-neutral-600">${maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-black h-1 bg-neutral-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* In Stock */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-neutral-300 text-black focus:ring-black"
                />
                <span>In stock only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Sort Row */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 rounded-full border border-neutral-300 text-xs font-medium text-black flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <div className="ml-auto flex items-center gap-2 text-xs">
              <span className="text-neutral-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-full bg-neutral-100 text-xs font-medium text-black focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Spacious Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-neutral-100 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center rounded-3xl bg-neutral-50 border border-neutral-200 space-y-4">
              <h3 className="text-base font-bold text-black">No matching products</h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Try clearing some filters or expanding your price range.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2 rounded-full bg-black text-white font-medium text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-black">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-black block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-100 text-xs text-black"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-black block">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-100 text-xs text-black"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-2.5 rounded-full bg-black text-white font-medium text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
