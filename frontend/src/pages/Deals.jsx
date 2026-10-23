// frontend/src/pages/Deals.jsx
import React, { useState, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';

export default function Deals() {
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await fetch('/api/products?isDeal=1&limit=20');
        const data = await res.json();
        setDealProducts(data.products || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const promoCodes = [
    { code: 'NEXORA10', discount: '10% Off Any Order', min: 'Min. $100' },
    { code: 'CYBER50', discount: '$50 Off', min: 'Min. $300' },
    { code: 'GAMER100', discount: '$100 Off', min: 'Min. $800' },
    { code: 'REFURB15', discount: '15% Off Refurbished', min: 'Min. $250' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 space-y-16">
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Minimal Header */}
      <div className="pb-8 border-b border-neutral-200 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
          Special Offers & Clearance
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-xl">
          Save on certified refurbished flagships, open-box workstations, and promotional bundles.
        </p>
      </div>

      {/* Promo Codes */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          Promotional Codes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {promoCodes.map((c) => (
            <div
              key={c.code}
              className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between space-y-4"
            >
              <div>
                <p className="text-sm font-bold text-black">{c.discount}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{c.min}</p>
              </div>

              <button
                onClick={() => handleCopy(c.code)}
                className="w-full py-2 px-3 rounded-full bg-white border border-neutral-300 hover:border-black text-xs font-mono font-bold text-black flex items-center justify-between transition-colors"
              >
                <span>{c.code}</span>
                {copiedCode === c.code ? (
                  <Check className="w-3.5 h-3.5 text-black" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Deal Products */}
      <section className="space-y-8">
        <h2 className="text-xl font-bold text-black">Featured Deals</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {dealProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
