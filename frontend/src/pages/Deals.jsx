// frontend/src/pages/Deals.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Clock,
  ShieldCheck,
  Tag,
  ArrowRight,
  Zap,
  CheckCircle2,
  Copy
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';

export default function Deals() {
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    { code: 'NEXORA10', discount: '10% OFF Any Order', min: '₹5,000 min order', badge: 'VIP WELCOME' },
    { code: 'CYBER50', discount: '₹2,500 Instant Credit', min: '₹20,000 min order', badge: 'GAMING FLASH' },
    { code: 'GAMER100', discount: '₹5,000 Mega Discount', min: '₹50,000 min order', badge: 'PRO RIGS' },
    { code: 'REFURB15', discount: '15% Off Refurbished', min: '₹15,000 min order', badge: 'ECO SPECIAL' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#0e1628] to-cyan-950/40 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            NEXORA FLASH VAULT
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Special Hardware Offers & Clearance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Save up to 40% on certified refurbished flagships, open-box workstations, and seasonal bundles with full 1-Year Nexora Warranty.
          </p>
        </div>

        {/* Live Countdown Box */}
        <div className="bg-slate-950/90 p-4 rounded-2xl border border-amber-500/30 shrink-0 text-center space-y-1 shadow-lg">
          <span className="text-[11px] font-bold text-amber-400 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            FLASH DEALS CYCLE ENDS IN
          </span>
          <div className="flex items-center justify-center gap-1.5 font-mono text-xl font-black text-white">
            <span className="px-2.5 py-1 bg-slate-900 rounded-xl border border-slate-800">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="px-2.5 py-1 bg-slate-900 rounded-xl border border-slate-800">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span>:</span>
            <span className="px-2.5 py-1 bg-slate-900 rounded-xl border border-slate-800 text-amber-400">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>

      {/* Promo Code Cheat-Sheet Cards */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Tag className="w-4 h-4 text-cyan-400" />
          Active Promotional Coupons (Apply at Checkout)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {promoCodes.map((c) => (
            <div
              key={c.code}
              className="p-4 rounded-2xl bg-[#0c1322] border border-cyan-500/30 flex flex-col justify-between space-y-3 relative overflow-hidden"
            >
              <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">
                {c.badge}
              </span>
              <div>
                <p className="text-base font-black text-white">{c.discount}</p>
                <p className="text-[11px] text-slate-400">{c.min}</p>
              </div>

              <button
                onClick={() => handleCopy(c.code)}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono font-bold flex items-center justify-between transition-colors"
              >
                <span className="text-cyan-400">{c.code}</span>
                {copiedCode === c.code ? (
                  <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Copied!
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Deal Products Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Hardware Drops On Sale Right Now
          </h2>
          <span className="text-xs text-slate-400">{dealProducts.length} Deals Available</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
