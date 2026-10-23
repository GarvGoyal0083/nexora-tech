// frontend/src/pages/Account.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  LayoutDashboard,
  LogOut,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Account() {
  const location = useLocation();
  const { user, token, isAuthenticated, isAdmin, logout, switchDemoAccount, updateProfile } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) setActiveTab(tabParam);
  }, [location.search]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        street: user.street || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
        country: user.country || 'United States'
      });
    }
  }, [user]);

  useEffect(() => {
    async function loadOrders() {
      if (!token) return;
      setLoadingOrders(true);
      try {
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, [token, user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const res = await updateProfile(profileData);
    if (res.success) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-black">Sign In</h2>
          <p className="text-xs text-neutral-500">
            View your orders, warranties, and saved hardware.
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-neutral-200 space-y-4">
          <Link
            to="/login"
            className="block w-full py-3 rounded-full bg-black text-white font-medium text-xs"
          >
            Sign In / Register
          </Link>

          <div className="pt-4 border-t border-neutral-100 space-y-2">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">
              Quick Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => switchDemoAccount('customer')}
                className="py-2 px-3 rounded-full border border-neutral-300 text-black text-xs font-medium"
              >
                Demo Customer
              </button>
              <button
                onClick={() => switchDemoAccount('admin')}
                className="py-2 px-3 rounded-full bg-black text-white text-xs font-medium"
              >
                Demo Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">{user.name}</h1>
          <p className="text-xs text-neutral-500 mt-0.5">{user.email}</p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-full bg-black text-white text-xs font-medium flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </Link>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 rounded-full border border-neutral-300 text-black text-xs font-medium flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'wishlist', label: `Saved (${wishlist.length})` },
          { id: 'profile', label: 'Profile' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
              activeTab === t.id
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-600 hover:text-black'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <p className="text-xs text-neutral-500">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-neutral-50 border border-neutral-200 space-y-3">
              <h3 className="text-sm font-bold text-black">No orders yet</h3>
              <Link
                to="/shop"
                className="inline-block px-5 py-2 rounded-full bg-black text-white font-medium text-xs"
              >
                Shop Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="p-6 rounded-2xl border border-neutral-200 space-y-4 bg-white"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div>
                      <span className="font-mono font-bold text-black text-sm">
                        {o.order_number}
                      </span>
                      <span className="ml-3 text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-100 text-black font-medium">
                        {o.status}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-black">
                        ${o.total.toFixed(2)}
                      </span>
                      <Link
                        to={`/order-confirmation/${o.order_number}`}
                        className="block text-xs text-neutral-500 hover:text-black underline"
                      >
                        Receipt
                      </Link>
                    </div>
                  </div>

                  <div className="divide-y divide-neutral-100 text-xs">
                    {o.items?.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <span className="text-black font-medium">{item.quantity}x {item.title}</span>
                        <span className="text-neutral-600">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div>
          {wishlist.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-neutral-50 border border-neutral-200">
              <p className="text-xs text-neutral-500">Your saved list is empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-neutral-200 flex flex-col justify-between space-y-4 bg-white"
                >
                  <div className="space-y-3">
                    <div className="h-44 flex items-center justify-center p-4 bg-neutral-100 rounded-xl">
                      <img
                        src={item.images?.[0] || item.image}
                        alt={item.title}
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black line-clamp-1">{item.title}</h4>
                      <p className="text-sm font-bold text-black mt-1">${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                    <button
                      onClick={() => addToCart(item, 1)}
                      className="flex-1 py-2 rounded-full bg-black text-white font-medium text-xs"
                    >
                      Move to Bag
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 text-neutral-400 hover:text-black"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="max-w-xl p-8 rounded-3xl border border-neutral-200 space-y-6 bg-white">
          <h3 className="text-base font-bold text-black">Profile & Address</h3>
          {profileSaved && <p className="text-xs text-black font-medium">Saved successfully.</p>}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-600 mb-1">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 text-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-600 mb-1">Street Address</label>
              <input
                type="text"
                value={profileData.street}
                onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 text-black focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-600 mb-1">City</label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 text-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-1">State</label>
                <input
                  type="text"
                  value={profileData.state}
                  onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 text-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-1">ZIP</label>
                <input
                  type="text"
                  value={profileData.zip}
                  onChange={(e) => setProfileData({ ...profileData, zip: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 text-black focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-black text-white font-medium text-xs"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
