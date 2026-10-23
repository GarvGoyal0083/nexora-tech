// frontend/src/pages/Compare.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  ShoppingCart,
  Check,
  ShieldCheck,
  Sparkles,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';

export default function Compare() {
  const { compareItems, removeFromCompare, clearCompare, addToCompare } = useCompare();
  const { addToCart } = useCart();
  const [allProducts, setAllProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState({});

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch('/api/products?limit=50');
        const data = await res.json();
        setAllProducts(data.products || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadCatalog();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedItemMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  // Compile unique spec keys across all compared items
  const allSpecKeys = Array.from(
    new Set(
      compareItems.flatMap(p => (p.specs ? Object.keys(p.specs) : []))
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest">
            <SlidersHorizontal className="w-4 h-4" />
            HARDWARE SPECIFICATION MATRIX
          </div>
          <h1 className="text-3xl font-black text-white mt-1">
            Compare Hardware Side-by-Side
          </h1>
          <p className="text-xs text-slate-400">
            Compare performance, condition grades, warranties, and exact technical specifications.
          </p>
        </div>

        {compareItems.length > 0 && (
          <div className="flex items-center gap-3">
            {compareItems.length < 4 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Another Product
              </button>
            )}
            <button
              onClick={clearCompare}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 text-xs font-bold"
            >
              Clear Matrix
            </button>
          </div>
        )}
      </div>

      {compareItems.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#0c1322] border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 mx-auto flex items-center justify-center text-cyan-400">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">No hardware in comparison matrix</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You can add up to 4 laptops, PCs, monitors, or components to compare specs side by side.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs shadow-neon-cyan"
          >
            <span>Browse Products to Compare</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl bg-[#0c1322] border border-slate-800 shadow-2xl">
          <table className="w-full text-left border-collapse">
            {/* Header: Product Cards */}
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60">
                <th className="p-4 w-44 text-xs font-mono uppercase tracking-wider text-slate-500 align-top">
                  Hardware
                </th>
                {compareItems.map((item) => (
                  <th key={item.id} className="p-4 min-w-[240px] max-w-[280px] align-top">
                    <div className="relative p-4 rounded-2xl bg-[#0d1629] border border-slate-800 space-y-3">
                      <button
                        onClick={() => removeFromCompare(item.id)}
                        className="absolute top-2 right-2 p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="h-32 flex items-center justify-center p-2 bg-slate-900/60 rounded-xl">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80'}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-cyan-400 font-bold uppercase">{item.brand}</span>
                        <Link
                          to={`/product/${item.slug}`}
                          className="block text-xs font-bold text-white hover:text-cyan-300 line-clamp-2"
                        >
                          {item.title}
                        </Link>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-cyan-400">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.original_price > item.price && (
                          <span className="text-xs text-slate-500 line-through">
                            ${item.original_price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                          addedItemMap[item.id]
                            ? 'bg-emerald-500 text-black'
                            : 'bg-cyan-600 hover:bg-cyan-500 text-black shadow-sm'
                        }`}
                      >
                        {addedItemMap[item.id] ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-xs">
              {/* Condition Row */}
              <tr className="hover:bg-slate-900/30">
                <td className="p-4 font-bold text-slate-400">Condition</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4">
                    {item.condition?.includes('Refurbished') ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {item.condition}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Brand New Sealed
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Warranty Row */}
              <tr className="hover:bg-slate-900/30">
                <td className="p-4 font-bold text-slate-400">Warranty</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4 text-slate-200 font-medium">
                    {item.warranty || '1 Year Nexora Warranty'}
                  </td>
                ))}
              </tr>

              {/* Stock Status */}
              <tr className="hover:bg-slate-900/30">
                <td className="p-4 font-bold text-slate-400">Availability</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4">
                    <span className={`font-semibold ${
                      item.stock > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {item.stock > 0 ? `In Stock (${item.stock} left)` : 'Out of Stock'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Category */}
              <tr className="hover:bg-slate-900/30">
                <td className="p-4 font-bold text-slate-400">Category</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4 text-slate-300 font-medium">
                    {item.category}
                  </td>
                ))}
              </tr>

              {/* Specs Rows */}
              {allSpecKeys.map((key) => (
                <tr key={key} className="hover:bg-slate-900/30">
                  <td className="p-4 font-bold text-cyan-400">{key}</td>
                  {compareItems.map((item) => (
                    <td key={item.id} className="p-4 text-slate-300">
                      {item.specs?.[key] || <span className="text-slate-600">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal to add more products */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#0b101d] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Select Product to Compare</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 my-4 space-y-2">
              {allProducts
                .filter(p => !compareItems.some(ci => ci.id === p.id))
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 hover:bg-slate-900 rounded-xl transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.images?.[0]}
                        alt={product.title}
                        className="w-12 h-12 object-contain bg-slate-950 p-1 rounded-lg shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] text-cyan-400 font-bold">{product.brand}</span>
                        <h4 className="text-xs font-bold text-white truncate">{product.title}</h4>
                        <span className="text-xs font-black text-cyan-400">${product.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addToCompare(product);
                        setShowAddModal(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs shrink-0"
                    >
                      Compare
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
