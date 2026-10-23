// frontend/src/pages/Compare.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Check,
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

  const allSpecKeys = Array.from(
    new Set(
      compareItems.flatMap(p => (p.specs ? Object.keys(p.specs) : []))
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight">
            Compare Hardware
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Side-by-side specification comparison.
          </p>
        </div>

        {compareItems.length > 0 && (
          <div className="flex items-center gap-3">
            {compareItems.length < 4 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-full bg-black text-white text-xs font-medium flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Product
              </button>
            )}
            <button
              onClick={clearCompare}
              className="px-4 py-2 rounded-full border border-neutral-300 text-black text-xs font-medium"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {compareItems.length === 0 ? (
        <div className="py-24 text-center rounded-3xl bg-neutral-50 border border-neutral-200 space-y-4">
          <h2 className="text-lg font-bold text-black">No products selected to compare</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Select up to 4 products from the catalog to compare their specifications side by side.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-white font-medium text-xs"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-neutral-200 bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="p-6 w-44 text-xs font-semibold uppercase tracking-wider text-neutral-400 align-top">
                  Product
                </th>
                {compareItems.map((item) => (
                  <th key={item.id} className="p-6 min-w-[240px] max-w-[280px] align-top">
                    <div className="relative space-y-4">
                      <button
                        onClick={() => removeFromCompare(item.id)}
                        className="absolute top-0 right-0 p-1 text-neutral-400 hover:text-black"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="h-32 flex items-center justify-center p-4 bg-neutral-100 rounded-2xl">
                        <img
                          src={item.images?.[0]}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain mix-blend-multiply"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-neutral-400 font-semibold uppercase">{item.brand}</span>
                        <Link
                          to={`/product/${item.slug}`}
                          className="block text-sm font-bold text-black hover:underline line-clamp-1 mt-0.5"
                        >
                          {item.title}
                        </Link>
                        <span className="text-base font-bold text-black block mt-1">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full py-2 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-xs"
                      >
                        {addedItemMap[item.id] ? 'Added' : 'Add to Bag'}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200 text-xs">
              <tr>
                <td className="p-5 font-semibold text-neutral-500">Condition</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-5 text-black font-medium">
                    {item.condition}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-5 font-semibold text-neutral-500">Warranty</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-5 text-neutral-700">
                    {item.warranty || '1 Year Warranty'}
                  </td>
                ))}
              </tr>

              {allSpecKeys.map((key) => (
                <tr key={key}>
                  <td className="p-5 font-semibold text-neutral-500">{key}</td>
                  {compareItems.map((item) => (
                    <td key={item.id} className="p-5 text-black">
                      {item.specs?.[key] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-black">Select Product</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 my-4">
              {allProducts
                .filter(p => !compareItems.some(ci => ci.id === p.id))
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between py-3 gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.images?.[0]}
                        alt={product.title}
                        className="w-10 h-10 object-contain bg-neutral-100 p-1 rounded-lg shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-black truncate">{product.title}</h4>
                        <span className="text-xs text-neutral-500">${product.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addToCompare(product);
                        setShowAddModal(false);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-black text-white font-medium text-xs shrink-0"
                    >
                      Select
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
