// frontend/src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Search,
  Filter,
  RefreshCw,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { token, isAdmin, switchDemoAccount } = useAuth();

  const [activeTab, setActiveTab] = useState('inventory'); // 'overview' | 'inventory' | 'orders'
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & filter in inventory
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Add / Edit Modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Laptops',
    condition: 'New',
    brand: '',
    price: '',
    original_price: '',
    stock: 10,
    sku: '',
    description: '',
    short_description: '',
    warranty: '1 Year Nexora Warranty',
    imageUrl: '',
    specsRaw: ''
  });

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, ordRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/products?limit=100'),
        fetch('/api/orders')
      ]);

      const statsData = await statsRes.json();
      const prodData = await prodRes.json();
      const ordData = await ordRes.json();

      setStats(statsData);
      setProducts(prodData.products || []);
      setOrders(ordData || []);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, [token]);

  // Quick Inline Stock Update
  const handleUpdateStock = async (id, newStock) => {
    try {
      const res = await fetch(`/api/products/${id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });
      if (res.ok) {
        setProducts(prev =>
          prev.map(p => (p.id === id ? { ...p, stock: newStock } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hardware unit from catalog?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Open modal to add product
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      category: 'Laptops',
      condition: 'New',
      brand: '',
      price: '',
      original_price: '',
      stock: 10,
      sku: `NEX-${Date.now().toString().slice(-6)}`,
      description: '',
      short_description: '',
      warranty: '1 Year Nexora Warranty',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      specsRaw: '{\n  "Processor": "Intel Core i9 / AMD Ryzen 9",\n  "Graphics": "RTX 4080",\n  "Memory": "32GB DDR5"\n}'
    });
    setShowProductModal(true);
  };

  // Open modal to edit product
  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setProductForm({
      title: p.title,
      category: p.category,
      condition: p.condition,
      brand: p.brand,
      price: p.price,
      original_price: p.original_price || p.price,
      stock: p.stock,
      sku: p.sku || '',
      description: p.description || '',
      short_description: p.short_description || '',
      warranty: p.warranty || '1 Year Nexora Warranty',
      imageUrl: p.images?.[0] || '',
      specsRaw: p.specs ? JSON.stringify(p.specs, null, 2) : '{}'
    });
    setShowProductModal(true);
  };

  // Submit Product Form (Create or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      let parsedSpecs = {};
      try {
        parsedSpecs = JSON.parse(productForm.specsRaw || '{}');
      } catch (err) {
        parsedSpecs = {};
      }

      const payload = {
        title: productForm.title,
        category: productForm.category,
        condition: productForm.condition,
        brand: productForm.brand,
        price: Number(productForm.price),
        original_price: Number(productForm.original_price || productForm.price),
        stock: Number(productForm.stock),
        sku: productForm.sku,
        description: productForm.description,
        short_description: productForm.short_description,
        warranty: productForm.warranty,
        images: [productForm.imageUrl],
        specs: parsedSpecs
      };

      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const updated = await res.json();
        setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const created = await res.json();
        setProducts(prev => [created, ...prev]);
      }

      setShowProductModal(false);
    } catch (e) {
      console.error('Error saving product:', e);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filter products for inventory table
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#101b33] to-[#0a1224] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest">
            <LayoutDashboard className="w-4 h-4" />
            NEXORA CENTRAL COMMAND
          </div>
          <h1 className="text-3xl font-black text-white">Admin & Inventory Portal</h1>
          <p className="text-xs text-slate-400">
            Real-time control over catalog stock levels, certified refurbished grading, and customer orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllAdminData}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Refresh database records"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-neon-cyan transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Hardware</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-[#0c1322] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">
            ${stats?.total_revenue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
          </div>
          <p className="text-[11px] text-slate-500">From {stats?.total_orders || 0} customer orders</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0c1322] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Catalog Products</span>
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {stats?.total_products || products.length}
          </div>
          <p className="text-[11px] text-slate-500">Across 6 tech departments</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0c1322] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {stats?.low_stock_count || 0}
          </div>
          <p className="text-[11px] text-slate-500">Units with ≤ 5 available</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0c1322] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Certified Refurbished</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {products.filter(p => p.condition?.includes('Refurbished')).length}
          </div>
          <p className="text-[11px] text-slate-500">Grade A+ tested units in stock</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'inventory'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product & Inventory Management ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'orders'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Order Fulfillment ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'overview'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Analytics & Low Stock Warnings</span>
        </button>
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT TABLE */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-[#0c1322] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search by title, brand, or SKU..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All Categories</option>
                <option value="Laptops">Laptops</option>
                <option value="Desktop PCs">Desktop PCs</option>
                <option value="Monitors">Monitors</option>
                <option value="Components">Components</option>
                <option value="Printers">Printers</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl bg-[#0c1322] border border-slate-800 shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="p-3.5">Product & SKU</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Condition</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5 text-center">Stock Level</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/30">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=100&q=80'}
                          alt=""
                          className="w-10 h-10 object-contain bg-slate-950 p-1 rounded-lg shrink-0 border border-slate-800"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-white line-clamp-1">{p.title}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className="font-mono text-cyan-400">{p.sku}</span>
                            <span>•</span>
                            <span>{p.brand}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-300 font-medium">{p.category}</td>

                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.condition?.includes('Refurbished')
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {p.condition}
                      </span>
                    </td>

                    <td className="p-3.5 font-bold text-cyan-400 text-sm">
                      ${p.price.toFixed(2)}
                    </td>

                    {/* Stock with inline quick buttons */}
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleUpdateStock(p.id, Math.max(0, p.stock - 1))}
                          className="w-6 h-6 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className={`w-10 text-center font-mono font-bold ${
                          p.stock <= 5 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {p.stock}
                        </span>
                        <button
                          onClick={() => handleUpdateStock(p.id, p.stock + 1)}
                          className="w-6 h-6 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300"
                        title="Edit hardware"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-rose-400"
                        title="Delete hardware"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl bg-[#0c1322] border border-slate-800 shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="p-3.5">Order ID & Date</th>
                  <th className="p-3.5">Customer Details</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5">Total Paid</th>
                  <th className="p-3.5">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-900/30">
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-cyan-400 text-sm block">
                        {o.order_number}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(o.created_at).toLocaleString()}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <p className="font-bold text-white">{o.customer_name}</p>
                      <p className="text-[11px] text-slate-400">{o.customer_email}</p>
                      <p className="text-[10px] text-slate-500">
                        {o.shipping_address?.city}, {o.shipping_address?.state}
                      </p>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <div className="space-y-1">
                        {o.items?.map((it, idx) => (
                          <p key={idx} className="truncate text-slate-300">
                            {it.quantity}x {it.title}
                          </p>
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5 font-bold text-cyan-400 text-sm">
                      ${o.total.toFixed(2)}
                    </td>

                    <td className="p-3.5">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none ${
                          o.status === 'Delivered'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : o.status === 'Shipped'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : o.status === 'Cancelled'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: OVERVIEW & ALERTS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Low stock critical warnings */}
          <div className="p-6 rounded-2xl bg-[#0c1322] border border-amber-500/30 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              Low Stock Replenishment Warnings
            </div>

            <div className="space-y-3">
              {products
                .filter(p => p.stock <= 5)
                .map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{p.title}</p>
                      <span className="text-[10px] text-cyan-400 font-mono">{p.sku}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-400">Only {p.stock} units!</span>
                      <button
                        onClick={() => handleUpdateStock(p.id, p.stock + 10)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-[10px]"
                      >
                        +10 Restock
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Condition & Category distribution */}
          <div className="p-6 rounded-2xl bg-[#0c1322] border border-slate-800 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Inventory Category Balance
            </div>

            <div className="space-y-2">
              {['Laptops', 'Desktop PCs', 'Monitors', 'Components', 'Printers', 'Accessories'].map(
                (cat) => {
                  const count = products.filter(p => p.category === cat).length;
                  const pct = Math.round((count / (products.length || 1)) * 100);
                  return (
                    <div key={cat} className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>{cat}</span>
                        <span className="font-mono text-cyan-400">{count} units ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-cyan-500 h-2 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0b101d] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-cyan-400" />
                {editingProduct ? 'Edit Hardware Unit' : 'Add New Hardware to Catalog'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Product Title</label>
                  <input
                    type="text"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    required
                    placeholder="e.g. ASUS ROG Strix SCAR 18 (2024)"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  >
                    <option value="Laptops">Laptops</option>
                    <option value="Desktop PCs">Desktop PCs</option>
                    <option value="Monitors">Monitors</option>
                    <option value="Components">Components</option>
                    <option value="Printers">Printers</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Condition</label>
                  <select
                    value={productForm.condition}
                    onChange={(e) => setProductForm({ ...productForm, condition: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  >
                    <option value="New">Brand New</option>
                    <option value="Certified Refurbished - Grade A+">Certified Refurbished - Grade A+</option>
                    <option value="Certified Refurbished - Grade A">Certified Refurbished - Grade A</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Brand</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    required
                    placeholder="Apple, ASUS ROG, NVIDIA..."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">SKU</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="NEX-LPT-01"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    placeholder="1999.99"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Original / Strikethrough Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.original_price}
                    onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                    placeholder="2399.99"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Warranty Term</label>
                  <input
                    type="text"
                    value={productForm.warranty}
                    onChange={(e) => setProductForm({ ...productForm, warranty: e.target.value })}
                    placeholder="1 Year Nexora Warranty"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">High-Res Image URL</label>
                  <input
                    type="url"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Short Feature Summary</label>
                  <input
                    type="text"
                    value={productForm.short_description}
                    onChange={(e) => setProductForm({ ...productForm, short_description: e.target.value })}
                    placeholder="18-inch Mini LED | i9-14900HX | RTX 4090 | 32GB RAM"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Specs (JSON Format)</label>
                  <textarea
                    rows="4"
                    value={productForm.specsRaw}
                    onChange={(e) => setProductForm({ ...productForm, specsRaw: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold text-xs shadow-neon-cyan"
                >
                  {editingProduct ? 'Update Product' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
