// frontend/src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  SlidersHorizontal,
  User,
  Menu,
  X,
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
  const { totalItemsCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout, switchDemoAccount } = useAuth();
  const { wishlist } = useWishlist();
  const { compareItems } = useCompare();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
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

  const navLinks = [
    { name: 'Shop All', path: '/shop' },
    { name: 'Laptops', path: '/shop?category=Laptops' },
    { name: 'Desktops', path: '/shop?category=Desktop PCs' },
    { name: 'Monitors', path: '/shop?category=Monitors' },
    { name: 'Components', path: '/shop?category=Components' },
    { name: 'Refurbished', path: '/shop?condition=Certified+Refurbished' },
    { name: 'Offers', path: '/deals' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Minimalist Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm tracking-tighter group-hover:bg-neutral-800 transition-colors">
              N
            </div>
            <span className="text-lg font-bold tracking-tight text-black">
              NEXORA
            </span>
          </Link>

          {/* Clean Center Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-600">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-black transition-colors py-1"
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-black font-semibold underline underline-offset-4"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Search & Minimalist Action Icons */}
          <div className="flex items-center gap-3">
            {/* Minimalist Search Input */}
            <div className="relative hidden md:block w-56 xl:w-64" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-neutral-100 border border-transparent focus:bg-white focus:border-black text-xs text-black placeholder-neutral-500 focus:outline-none transition-all"
                />
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </form>

              {showSearchDropdown && (
                <div className="absolute top-full right-0 w-80 mt-2 bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-2.5 border-b border-neutral-100 text-[11px] text-neutral-500 flex justify-between items-center">
                    <span>Results ({searchResults.length})</span>
                    <Link
                      to={`/shop?search=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="text-black font-medium hover:underline"
                    >
                      View all
                    </Link>
                  </div>

                  {isSearching ? (
                    <div className="p-6 text-center text-neutral-400 text-xs">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
                      {searchResults.map((item) => (
                        <Link
                          key={item.id}
                          to={`/product/${item.slug}`}
                          onClick={() => setShowSearchDropdown(false)}
                          className="flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors"
                        >
                          <img
                            src={item.images?.[0]}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-contain bg-neutral-100 p-1 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-black truncate">{item.title}</p>
                            <p className="text-[11px] text-neutral-500">{item.brand}</p>
                          </div>
                          <span className="text-xs font-semibold text-black shrink-0">
                            ${item.price.toLocaleString()}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-neutral-400 text-xs">
                      No matching products found.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Compare */}
            <Link
              to="/compare"
              className="relative p-2 rounded-full text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
              title="Compare"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {compareItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                  {compareItems.length}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              to="/account?tab=wishlist"
              className="relative p-2 rounded-full text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
              title="Saved"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* User Account */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="p-2 rounded-full text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
                title="Account"
              >
                <User className="w-4 h-4" />
                {user && (
                  <span className="hidden xl:inline text-xs font-medium text-black">
                    {user.name.split(' ')[0]}
                  </span>
                )}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-2xl shadow-xl py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-neutral-100">
                        <p className="text-xs font-semibold text-black truncate">{user.name}</p>
                        <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-black hover:bg-neutral-50"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50"
                      >
                        <User className="w-3.5 h-3.5" />
                        Account & Orders
                      </Link>

                      <div className="border-t border-neutral-100 my-1" />

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-neutral-600 hover:text-black hover:bg-neutral-50"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="p-3 space-y-2">
                      <Link
                        to="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block w-full py-2 text-center rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-xs transition-colors"
                      >
                        Sign In
                      </Link>
                      <div className="pt-2 border-t border-neutral-100 space-y-1">
                        <p className="text-[10px] text-neutral-400 uppercase tracking-wider px-1">Quick Demo</p>
                        <button
                          onClick={() => {
                            switchDemoAccount('customer');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-neutral-100 text-neutral-700"
                        >
                          Demo Customer
                        </button>
                        <button
                          onClick={() => {
                            switchDemoAccount('admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-neutral-100 text-black font-medium"
                        >
                          Demo Admin
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCartDrawer || (() => navigate('/cart'))}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-medium transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Bag</span>
              {totalItemsCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-white text-black text-[10px] font-bold">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-700 lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Clean Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-6 py-6 space-y-5">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 rounded-full bg-neutral-100 text-xs text-black"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          <div className="flex flex-col space-y-2.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-neutral-800 py-1 hover:text-black"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-100 flex gap-2">
            <button
              onClick={() => switchDemoAccount('customer')}
              className="flex-1 py-2 rounded-full border border-neutral-300 text-xs font-medium text-black"
            >
              Demo Customer
            </button>
            <button
              onClick={() => switchDemoAccount('admin')}
              className="flex-1 py-2 rounded-full bg-black text-white text-xs font-medium"
            >
              Demo Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
