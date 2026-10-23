// frontend/src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  SlidersHorizontal,
  User,
  ShieldCheck,
  Zap,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Layers,
  Laptop,
  Cpu,
  Monitor,
  Printer,
  HardDrive,
  Headphones,
  CheckCircle2,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

export default function Navbar({ onOpenCartDrawer }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItemsCount, subtotal } = useCart();
  const { user, isAuthenticated, isAdmin, logout, switchDemoAccount } = useAuth();
  const { wishlist } = useWishlist();
  const { compareItems } = useCompare();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Debounced live search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=6`);
        const data = await res.json();
        setSearchResults(data.products || []);
        setShowSearchDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearchDropdown(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: 'Laptops', icon: Laptop, path: '/shop?category=Laptops' },
    { name: 'Desktop PCs', icon: Cpu, path: '/shop?category=Desktop PCs' },
    { name: 'Monitors', icon: Monitor, path: '/shop?category=Monitors' },
    { name: 'Components', icon: HardDrive, path: '/shop?category=Components' },
    { name: 'Printers', icon: Printer, path: '/shop?category=Printers' },
    { name: 'Accessories', icon: Headphones, path: '/shop?category=Accessories' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#07090e]/95 backdrop-blur-md border-b border-cyan-500/15">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 px-4 py-1.5 text-xs border-b border-cyan-500/10 text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-cyan-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Nexora Certified Refurbished:
            </span>
            <span className="hidden sm:inline text-slate-300">
              52-Point Hardware Inspection • 1-Year Full Warranty • Save up to 40%
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:flex items-center gap-1 text-emerald-400">
              <Zap className="w-3 h-3" />
              Free Priority Shipping over ₹10,000
            </span>
            <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
              <span className="text-slate-400">Fast Demo:</span>
              <button
                onClick={() => switchDemoAccount('customer')}
                className="text-cyan-400 hover:text-cyan-300 underline font-medium"
              >
                Customer
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => switchDemoAccount('admin')}
                className="text-amber-400 hover:text-amber-300 underline font-medium"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-neon-cyan group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#07090e] rounded-[10px] flex items-center justify-center">
                <span className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  N
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-extrabold tracking-wider text-white">NEXORA</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
                  TECH
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase">Next-Gen Hardware</p>
            </div>
          </Link>

          {/* Smart Live Search Bar */}
          <div className="flex-1 max-w-xl relative hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
                placeholder="Search RTX 4090, M3 Max MacBook, OLED monitors, Ryzen..."
                className="w-full pl-11 pr-24 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs px-1"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-semibold text-xs transition-colors shadow-sm"
              >
                Search
              </button>
            </form>

            {/* Live Search Autocomplete Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c1322] border border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-2 border-b border-slate-800 text-xs text-slate-400 flex justify-between items-center bg-slate-900/50">
                  <span>Found {searchResults.length} matches for "{searchQuery}"</span>
                  <Link
                    to={`/shop?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="text-cyan-400 hover:underline"
                  >
                    View all results &rarr;
                  </Link>
                </div>

                {isSearching ? (
                  <div className="p-6 text-center text-slate-400 text-sm">Searching inventory...</div>
                ) : searchResults.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/60">
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        to={`/product/${item.slug}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="flex items-center gap-3 p-3 hover:bg-slate-800/50 transition-colors"
                      >
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80'}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-cyan-400 font-medium">{item.brand}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                              item.condition.includes('Refurbished')
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}>
                              {item.condition.includes('Refurbished') ? 'Refurbished' : 'New'}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-200 truncate">{item.title}</p>
                          <p className="text-xs text-slate-400 truncate">{item.short_description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-cyan-400">₹{Number(item.price).toLocaleString('en-IN')}</p>
                          {item.original_price > item.price && (
                            <p className="text-[11px] text-slate-500 line-through">
                              ₹{Number(item.original_price).toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 text-sm">
                    No matching products found. Try "laptop", "RTX", "macbook", or "monitor".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Compare Tool Dock Pill */}
            <Link
              to="/compare"
              className="relative p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
              title="Compare Products"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {compareItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-black text-xs font-bold flex items-center justify-center animate-pulse">
                  {compareItems.length}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              to="/account?tab=wishlist"
              className="relative p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={onOpenCartDrawer || (() => navigate('/cart'))}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-slate-200 transition-all shadow-sm group"
            >
              <ShoppingCart className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="hidden sm:block text-left leading-tight">
                <span className="text-[10px] text-slate-400 block">Cart</span>
                <span className="text-xs font-bold text-white">₹{Number(subtotal).toLocaleString('en-IN')}</span>
              </div>
              {totalItemsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-cyan-400 text-black text-xs font-extrabold flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-200 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-xs font-bold text-white">
                  {user ? user.name.charAt(0) : <User className="w-4 h-4" />}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold leading-none text-slate-200">
                    {user ? user.name.split(' ')[0] : 'Sign In'}
                  </p>
                  <p className="text-[10px] text-cyan-400 leading-none mt-1">
                    {user ? (user.role === 'admin' ? 'Admin' : 'Shopper') : 'Account'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0d1424] border border-cyan-500/25 rounded-2xl shadow-2xl py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/40">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs text-cyan-400 truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-400 hover:bg-amber-500/10 transition-colors font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Console & Inventory
                        </Link>
                      )}

                      <Link
                        to="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 transition-colors"
                      >
                        <User className="w-4 h-4 text-cyan-400" />
                        My Profile & Orders
                      </Link>

                      <Link
                        to="/account?tab=orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 transition-colors"
                      >
                        <Layers className="w-4 h-4 text-blue-400" />
                        Order History
                      </Link>

                      <div className="border-t border-slate-800 my-1"></div>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="p-3 space-y-2">
                      <p className="text-xs text-slate-400 px-1">Welcome to Nexora Tech</p>
                      <Link
                        to="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block w-full py-2 text-center rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs transition-colors shadow-sm"
                      >
                        Sign In / Register
                      </Link>

                      <div className="pt-2 border-t border-slate-800 space-y-1.5">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider px-1">Fast Demo Switch</p>
                        <button
                          onClick={() => {
                            switchDemoAccount('customer');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-800 text-cyan-300 flex items-center justify-between"
                        >
                          <span>Log in as Demo Customer</span>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            switchDemoAccount('admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 flex items-center justify-between"
                        >
                          <span>Log in as Admin (Full Control)</span>
                          <LayoutDashboard className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Secondary Category Navigation Bar */}
        <nav className="hidden md:flex items-center justify-between py-2.5 border-t border-slate-800/70 text-xs">
          <div className="flex items-center gap-6">
            <Link
              to="/shop"
              className="text-slate-200 hover:text-cyan-400 font-semibold transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              All Hardware
            </Link>

            <Link
              to="/shop?condition=Certified+Refurbished"
              className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Certified Refurbished (Grade A+)
            </Link>

            <Link
              to="/shop?category=Laptops"
              className="text-slate-300 hover:text-cyan-400 transition-colors"
            >
              Laptops
            </Link>

            <Link
              to="/shop?category=Desktop PCs"
              className="text-slate-300 hover:text-cyan-400 transition-colors"
            >
              Desktop PCs
            </Link>

            <Link
              to="/shop?category=Monitors"
              className="text-slate-300 hover:text-cyan-400 transition-colors"
            >
              Monitors
            </Link>

            <Link
              to="/shop?category=Components"
              className="text-slate-300 hover:text-cyan-400 transition-colors"
            >
              Components (RTX, CPUs)
            </Link>

            <Link
              to="/shop?category=Printers"
              className="text-slate-300 hover:text-cyan-400 transition-colors"
            >
              Printers
            </Link>

            <Link
              to="/shop?category=Accessories"
              className="text-slate-300 hover:text-cyan-400 transition-colors"
            >
              Peripherals & Audio
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/deals"
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 animate-pulse"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Special Offers & Deals
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30"
              >
                <LayoutDashboard className="w-3 h-3" />
                Admin Dashboard
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile drawer navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0a0f1d] px-4 py-4 space-y-4">
          {/* Mobile search bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hardware, brands, specs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">Shop Categories</p>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={cat.path}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-slate-800 pt-3 space-y-2">
            <Link
              to="/shop?condition=Certified+Refurbished"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              Certified Refurbished (Grade A+)
            </Link>

            <Link
              to="/deals"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Special Deals & Bundles
            </Link>

            <Link
              to="/compare"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
            >
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              Compare Hardware ({compareItems.length})
            </Link>
          </div>

          {/* Quick Demo Login selector in mobile */}
          <div className="border-t border-slate-800 pt-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Switch Account Role</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => switchDemoAccount('customer')}
                className="py-1.5 px-2 rounded-lg text-xs bg-slate-800 text-cyan-400 border border-slate-700"
              >
                Demo Customer
              </button>
              <button
                onClick={() => switchDemoAccount('admin')}
                className="py-1.5 px-2 rounded-lg text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30"
              >
                Demo Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
