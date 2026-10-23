// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  ChevronRight,
  RotateCcw,
  Cpu,
  Laptop,
  Monitor,
  HardDrive,
  Printer,
  Headphones
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [refurbishedProducts, setRefurbishedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Countdown timer for daily drops
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

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
    async function loadData() {
      try {
        const [featRes, dealRes, refurbRes] = await Promise.all([
          fetch('/api/products?isFeatured=1&limit=8'),
          fetch('/api/products?isDeal=1&limit=6'),
          fetch('/api/products?condition=Certified+Refurbished&limit=6')
        ]);
        const featData = await featRes.json();
        const dealData = await dealRes.json();
        const refurbData = await refurbRes.json();

        setFeaturedProducts(featData.products || []);
        setDealProducts(dealData.products || []);
        setRefurbishedProducts(refurbData.products || []);
      } catch (err) {
        console.error('Failed to load home page products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    { name: 'Laptops', count: 'Gaming & Ultrabooks', icon: Laptop, path: '/shop?category=Laptops', bg: 'from-blue-600/20 to-cyan-600/20' },
    { name: 'Desktop PCs', count: 'Custom Liquid & Mac', icon: Cpu, path: '/shop?category=Desktop PCs', bg: 'from-purple-600/20 to-indigo-600/20' },
    { name: 'Monitors', count: 'OLED & 4K UltraWide', icon: Monitor, path: '/shop?category=Monitors', bg: 'from-cyan-600/20 to-emerald-600/20' },
    { name: 'Components', count: 'RTX 4090 & CPUs', icon: HardDrive, path: '/shop?category=Components', bg: 'from-rose-600/20 to-orange-600/20' },
    { name: 'Printers', count: 'EcoTank & Laser MFP', icon: Printer, path: '/shop?category=Printers', bg: 'from-amber-600/20 to-yellow-600/20' },
    { name: 'Accessories', count: 'Esports Mice & Audio', icon: Headphones, path: '/shop?category=Accessories', bg: 'from-emerald-600/20 to-teal-600/20' }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-cyan-500/15 bg-gradient-to-b from-[#090e1a] via-[#07090e] to-[#07090e]">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold shadow-neon-cyan">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Computing & Certified Refurbished Hardware</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                DOMINATE PERFORMANCE. <br />
                <span className="cyber-gradient-text">ZERO COMPROMISE.</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Premium destination for brand-new flagships and aerospace-tested{' '}
                <strong className="text-emerald-400 font-semibold">Certified Refurbished</strong> laptops,
                custom liquid-cooled gaming PCs, 240Hz QD-OLED monitors, and elite components with up to{' '}
                <span className="text-cyan-400 font-bold">40% savings</span> and a full 1-Year Guarantee.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-neon-cyan transition-all transform hover:-translate-y-0.5"
                >
                  <span>Explore Hardware</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/shop?condition=Certified+Refurbished"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-emerald-500/40 hover:border-emerald-400 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Shop Certified Refurbished</span>
                </Link>
              </div>

              {/* Live Trust Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
                <div className="text-left">
                  <div className="text-2xl font-black text-cyan-400">52-Pt</div>
                  <div className="text-[11px] text-slate-400">Rigorous Diagnostics</div>
                </div>
                <div className="text-left border-l border-slate-800 pl-4">
                  <div className="text-2xl font-black text-emerald-400">100%</div>
                  <div className="text-[11px] text-slate-400">Warranty Coverage</div>
                </div>
                <div className="text-left border-l border-slate-800 pl-4">
                  <div className="text-2xl font-black text-blue-400">50k+</div>
                  <div className="text-[11px] text-slate-400">Enthusiasts Served</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl bg-gradient-to-b from-slate-800/60 to-slate-900/90 p-1 border border-cyan-500/30 shadow-2xl backdrop-blur-xl">
                <div className="relative rounded-[22px] bg-[#0c1322] p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      CERTIFIED REFURBISHED GRADE A+
                    </span>
                    <span className="text-xs font-mono text-cyan-400">INSPECTED</span>
                  </div>

                  <div className="relative h-56 flex items-center justify-center my-2">
                    <img
                      src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
                      alt="MacBook Pro M3 Max"
                      className="max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,240,255,0.2)]"
                    />
                  </div>

                  <div className="space-y-2 mt-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">Apple</span>
                      <div className="flex items-center text-amber-400 text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="ml-1 font-bold text-white">4.95</span>
                      </div>
                    </div>

                    <h3 className="text-base font-extrabold text-white">
                      MacBook Pro 16" M3 Max (48GB / 1TB SSD)
                    </h3>

                    <p className="text-xs text-slate-400">
                      100% Battery Health • Zero Scratches • 1-Year Nexora Warranty
                    </p>

                    <div className="flex items-baseline justify-between pt-2">
                      <div>
                        <span className="text-2xl font-black text-cyan-400">$3,299.99</span>
                        <span className="text-xs text-slate-500 line-through ml-2">$3,999.99</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        SAVE $700
                      </span>
                    </div>

                    <Link
                      to="/product/apple-macbook-pro-16-m3-max"
                      className="mt-3 block w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold text-xs text-center shadow-neon-cyan transition-colors"
                    >
                      View Certified Unit &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              HARDWARE ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Explore by Tech Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Browse entire catalog &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={cat.path}
                className="group relative p-5 rounded-2xl bg-[#0d1424] border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 flex flex-col items-center text-center overflow-hidden hover:shadow-neon-cyan/20"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.bg} border border-cyan-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">{cat.count}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Certified Refurbished Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-[#0b1326] to-[#071324] border border-emerald-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                THE NEXORA REFURBISHED PROMISE
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Aerospace-Grade Certified Refurbished. <br />
                <span className="text-emerald-400">Save up to 40% with 1-Year Full Warranty.</span>
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                Every pre-owned workstation, ultrabook, and monitor goes through our intense 52-point hardware stress test: thermal throttling analysis, certified battery health verification (&gt;90%), zero dead-pixel screen calibration, and hygienic UV sterilization.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-emerald-400 font-bold block mb-1">Grade A+ Pristine</span>
                  <span className="text-slate-400">Zero cosmetic flaws on screens & body</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-emerald-400 font-bold block mb-1">Battery Health</span>
                  <span className="text-slate-400">Verified at least 90-100% capacity</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-emerald-400 font-bold block mb-1">OEM Accessories</span>
                  <span className="text-slate-400">Genuine power bricks & braided cables</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-emerald-400 font-bold block mb-1">1-Year Coverage</span>
                  <span className="text-slate-400">Instant hardware repair or replacement</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/shop?condition=Certified+Refurbished"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors shadow-lg"
                >
                  <span>Shop All Certified Refurbished Hardware</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <Award className="w-16 h-16 text-emerald-400 mb-3" />
              <h4 className="text-lg font-bold text-white">52-Point Checklist Passed</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Each unit includes a printed physical inspection certificate signed by our certified tech engineers.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>30-Day Hassle-Free Return Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Deals with Countdown Timer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#091122] border border-cyan-500/25">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                LIMITED-TIME HARDWARE DEALS
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Nexora Flash Drops
              </h2>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-2 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-400 font-medium">Drops Reset in:</span>
              <div className="flex items-center gap-1 font-mono text-sm font-black text-cyan-400">
                <span className="px-2 py-1 bg-slate-900 rounded-lg">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span>:</span>
                <span className="px-2 py-1 bg-slate-900 rounded-lg">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span>:</span>
                <span className="px-2 py-1 bg-slate-900 rounded-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          {/* Deal Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {dealProducts.slice(0, 3).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/deals"
              className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300"
            >
              <span>See all {dealProducts.length} flash deals and bundles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Flagships & Hot Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              CURATED FLAGSHIPS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Top Rated Hardware & Rigs
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Explore all hardware &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* Certified Refurbished Grid Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              CERTIFIED SAVINGS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Certified Refurbished Top Picks
            </h2>
          </div>
          <Link
            to="/shop?condition=Certified+Refurbished"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            View all refurbished inventory &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {refurbishedProducts.slice(0, 3).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      </section>

      {/* Brand Marquee */}
      <section className="border-y border-slate-800/80 bg-slate-950/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Official Hardware & Certified Component Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-70">
            {['NVIDIA', 'ASUS ROG', 'APPLE', 'RAZER', 'SAMSUNG', 'INTEL', 'AMD', 'CORSAIR', 'DELL', 'LOGITECH'].map((b) => (
              <span key={b} className="text-sm sm:text-base font-black tracking-widest text-slate-300 hover:text-cyan-400 transition-colors">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            COMMUNITY REVIEWS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Trusted by Builders & Creators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0c1322] border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "Bought a Certified Refurbished M3 Max MacBook Pro 16. It arrived packed like Fort Knox with sealed Apple charger and zero marks. Battery health was 100%. Saved $700 vs new."
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-white">David Kim</p>
                <p className="text-[11px] text-cyan-400">VFX Supervisor</p>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">Verified Buyer</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c1322] border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "Nexora CyberApex Titan desktop PC is a masterpiece. Custom hardline loop, 7950X3D + 4090, stress-tested benchmarks included. Shipped across the country with zero issues."
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-white">Marcus Vance</p>
                <p className="text-[11px] text-cyan-400">Esports Director</p>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">Verified Buyer</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c1322] border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "The Samsung Odyssey G9 OLED is phenomenal. The 1-Year Nexora Tech warranty and quick support gave me total peace of mind. Will buy all my rigs here."
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-white">Elena Rostova</p>
                <p className="text-[11px] text-cyan-400">Game Developer</p>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">Verified Buyer</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
