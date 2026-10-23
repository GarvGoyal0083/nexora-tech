// frontend/src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { token } = useAuth();

  const [activeTab, setActiveTab] = useState('inventory');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

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

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product from catalog?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

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
      specsRaw: '{\n  "Processor": "Intel Core i9",\n  "Memory": "32GB DDR5"\n}'
    });
    setShowProductModal(true);
  };

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

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight">Admin Console</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage catalog inventory, pricing, and customer orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllAdminData}
            className="p-2.5 rounded-full border border-neutral-300 hover:border-black text-black transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
          <span className="text-xs text-neutral-500">Total Revenue</span>
          <div className="text-2xl font-bold text-black">
            ${stats?.total_revenue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
          <span className="text-xs text-neutral-500">Total Orders</span>
          <div className="text-2xl font-bold text-black">
            {stats?.total_orders || orders.length}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
          <span className="text-xs text-neutral-500">Products</span>
          <div className="text-2xl font-bold text-black">
            {stats?.total_products || products.length}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
          <span className="text-xs text-neutral-500">Low Stock Alerts</span>
          <div className="text-2xl font-bold text-black">
            {stats?.low_stock_count || 0}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'inventory', label: `Inventory (${products.length})` },
          { id: 'orders', label: `Orders (${orders.length})` }
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

      {/* Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-2 rounded-full bg-neutral-100 text-xs text-black focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-full bg-neutral-100 text-xs text-black focus:outline-none"
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

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 uppercase text-[10px]">
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Condition</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]}
                          alt=""
                          className="w-10 h-10 object-contain bg-neutral-100 p-1 rounded-lg shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-black line-clamp-1">{p.title}</p>
                          <span className="text-[11px] text-neutral-400">{p.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-600">{p.category}</td>
                    <td className="p-4 text-neutral-600">{p.condition}</td>
                    <td className="p-4 font-bold text-black">${p.price.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleUpdateStock(p.id, Math.max(0, p.stock - 1))}
                          className="w-6 h-6 rounded-full border border-neutral-300 text-black flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold text-black">{p.stock}</span>
                        <button
                          onClick={() => handleUpdateStock(p.id, p.stock + 1)}
                          className="w-6 h-6 rounded-full border border-neutral-300 text-black flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 text-neutral-500 hover:text-black"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-neutral-400 hover:text-black"
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

      {/* Orders Table */}
      {activeTab === 'orders' && (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400 uppercase text-[10px]">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-neutral-50">
                  <td className="p-4 font-mono font-bold text-black">{o.order_number}</td>
                  <td className="p-4">
                    <p className="font-semibold text-black">{o.customer_name}</p>
                    <p className="text-neutral-500">{o.customer_email}</p>
                  </td>
                  <td className="p-4">
                    {o.items?.map((it, idx) => (
                      <p key={idx} className="text-neutral-600">{it.quantity}x {it.title}</p>
                    ))}
                  </td>
                  <td className="p-4 font-bold text-black">${o.total.toFixed(2)}</td>
                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                      className="px-3 py-1.5 rounded-full bg-neutral-100 text-xs font-medium text-black focus:outline-none"
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
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold text-black">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={() => setShowProductModal(false)}>
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-neutral-600 mb-1">Title</label>
                  <input
                    type="text"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 text-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 text-black"
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
                  <label className="block text-neutral-600 mb-1">Condition</label>
                  <select
                    value={productForm.condition}
                    onChange={(e) => setProductForm({ ...productForm, condition: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 text-black"
                  >
                    <option value="New">Brand New</option>
                    <option value="Certified Refurbished - Grade A+">Certified Refurbished - Grade A+</option>
                    <option value="Certified Refurbished - Grade A">Certified Refurbished - Grade A</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 mb-1">Brand</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 text-black"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 text-black"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-600 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 text-black"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-full border border-neutral-300 text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-black text-white font-medium"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
