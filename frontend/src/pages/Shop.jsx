// frontend/src/pages/Shop.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  Search,
  X,
  Grid3X3,
  List,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';

export default function Shop() {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [condition, setCondition] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [maxPrice, setMaxPrice] = useState(400000);
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

  // Sync URL query params with state
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

  // Fetch filtered products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category && category !== 'All') params.append('category', category);
        if (condition && condition !== 'All') params.append('condition', condition);
        if (selectedBrand && selectedBrand !== 'All') params.append('brand', selectedBrand);
        if (maxPrice < 400000) params.append('maxPrice', maxPrice);
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
    setMaxPrice(400000);
    setInStockOnly(false);
    setSortBy('featured');
    navigate('/shop');
  };

  const hasActiveFilters =
    search !== '' ||
    category !== 'All' ||
    condition !== 'All' ||
    selectedBrand !== 'All' ||
    maxPrice < 400000 ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0c162c] to-[#071324] border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            NEXORA TECH CATALOG
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            High-Performance Hardware & Certified Gear
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Explore factory-sealed flagships and 52-point certified refurbished computers with 1-Year Full Coverage.
          </p>
        </div>

        {/* Quick condition selector pills */}
        <div className="flex items-center gap-2 shrink-0 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setCondition('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              condition === 'All'
                ? 'bg-cyan-500 text-black shadow-neon-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Hardware
          </button>
          <button
            onClick={() => setCondition('Certified Refurbished')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              condition.includes('Refurbished')
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Certified Refurbished
          </button>
          <button
            onClick={() => setCondition('New')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              condition === 'New'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Brand New
          </button>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="p-6 rounded-2xl bg-[#0c1322] border border-slate-800 space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Filter className="w-4 h-4 text-cyan-400" />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset All
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Keyword Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="RTX 4090, M3, 4K..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Category</label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      category === cat
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <span>{cat}</span>
                    {category === cat && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Hardware Condition */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 block">Hardware Condition</label>
              <div className="space-y-1">
                {[
                  { id: 'All', label: 'All Conditions' },
                  { id: 'New', label: 'Brand New (Factory Sealed)' },
                  { id: 'Certified Refurbished', label: 'Certified Refurbished (Grade A+)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCondition(item.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      condition === item.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    {condition === item.id && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 block">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Max Budget</span>
                <span className="font-black text-cyan-400">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="400000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹5,000</span>
                <span>₹2,00,000</span>
                <span>₹4,00,000</span>
              </div>
            </div>

            {/* In Stock Only Checkbox */}
            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar: Sort, View, Active filters */}
          <div className="p-4 rounded-2xl bg-[#0c1322] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-cyan-400 flex items-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters {hasActiveFilters && '•'}</span>
              </button>

              <p className="text-xs text-slate-400">
                Showing <strong className="text-white">{products.length}</strong> products
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

              {/* View mode toggle */}
              <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg ${
                    viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title="Grid View"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg ${
                    viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-500">Active filters:</span>
              {category !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                  Category: {category}
                  <button onClick={() => setCategory('All')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {condition !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-950 border border-emerald-500/30 text-emerald-300">
                  {condition}
                  <button onClick={() => setCondition('All')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedBrand !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-blue-950 border border-blue-500/30 text-blue-300">
                  Brand: {selectedBrand}
                  <button onClick={() => setSelectedBrand('All')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-700 text-slate-300">
                  "{search}"
                  <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {maxPrice < 400000 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-700 text-slate-300">
                  Under ₹{maxPrice.toLocaleString('en-IN')}
                  <button onClick={() => setMaxPrice(400000)}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-rose-400 hover:underline ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Grid / List */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#0c1322] border border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 mx-auto flex items-center justify-center text-slate-500">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No matching hardware found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try widening your price range, clearing keyword filters, or switching condition tabs.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}>
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

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-[#0b101d] h-full p-6 overflow-y-auto space-y-6 shadow-2xl border-l border-cyan-500/30">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Filter Products</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Mobile Condition */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
              >
                <option value="All">All Conditions</option>
                <option value="New">Brand New Sealed</option>
                <option value="Certified Refurbished">Certified Refurbished</option>
              </select>
            </div>

            {/* Mobile Brand */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Mobile Max Price */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-300">Max Budget:</span>
                <span className="font-bold text-cyan-400">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="400000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
