// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
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
  const [refurbishedProducts, setRefurbishedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [featRes, refurbRes] = await Promise.all([
          fetch('/api/products?isFeatured=1&limit=6'),
          fetch('/api/products?condition=Certified+Refurbished&limit=3')
        ]);
        const featData = await featRes.json();
        const refurbData = await refurbRes.json();

        setFeaturedProducts(featData.products || []);
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
    { name: 'Laptops', icon: Laptop, path: '/shop?category=Laptops' },
    { name: 'Desktops', icon: Cpu, path: '/shop?category=Desktop PCs' },
    { name: 'Monitors', icon: Monitor, path: '/shop?category=Monitors' },
    { name: 'Components', icon: HardDrive, path: '/shop?category=Components' },
    { name: 'Printers', icon: Printer, path: '/shop?category=Printers' },
    { name: 'Accessories', icon: Headphones, path: '/shop?category=Accessories' }
  ];

  return (
    <div className="space-y-28">
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Minimalist Hero Section */}
      <section className="border-b border-neutral-200 bg-neutral-50/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-black text-xs font-medium">
                <span>New & Certified Refurbished Hardware</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-black leading-[1.08]">
                High-Performance Computing. <br />
                <span className="text-neutral-400">Simplified.</span>
              </h1>

              <p className="text-neutral-600 text-base sm:text-lg max-w-xl leading-relaxed">
                Curated laptops, custom workstations, OLED displays, and components. Choose factory-sealed new units or save up to 40% on 52-point certified refurbished hardware.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/shop"
                  className="px-7 py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-sm flex items-center gap-2 transition-all"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/shop?condition=Certified+Refurbished"
                  className="px-7 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-black border border-neutral-300 font-medium text-sm transition-all"
                >
                  Explore Refurbished
                </Link>
              </div>
            </div>

            {/* Minimalist Featured Card */}
            <div className="lg:col-span-5">
              <Link
                to="/product/apple-macbook-pro-16-m3-max"
                className="block rounded-3xl bg-white border border-neutral-200 p-8 hover:border-black transition-all shadow-xs"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-black text-white uppercase tracking-wider">
                    Refurbished A+
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">Save $700</span>
                </div>

                <div className="h-56 flex items-center justify-center p-4 bg-neutral-100 rounded-2xl mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
                    alt="MacBook Pro 16 M3 Max"
                    className="max-h-full object-contain mix-blend-multiply"
                  />
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-widest">Apple</p>
                    <h3 className="text-lg font-bold text-black mt-0.5">
                      MacBook Pro 16" M3 Max
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">48GB Unified RAM • 1TB SSD</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-black">$3,299.99</span>
                    <span className="block text-xs text-neutral-400 line-through">$3,999.99</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Categories */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-black tracking-tight">
              Browse by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={cat.path}
                className="group p-6 rounded-2xl bg-neutral-50 hover:bg-black border border-neutral-200 hover:border-black transition-all duration-200 flex flex-col items-center text-center"
              >
                <Icon className="w-6 h-6 text-black group-hover:text-white mb-3 transition-colors" />
                <span className="text-sm font-semibold text-black group-hover:text-white transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Hardware — Spacious 3-Column Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-black tracking-tight">
              Featured Hardware
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Our most popular laptops, workstations, and displays.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* Clean Monochrome Refurbished Statement */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="rounded-3xl bg-black text-white p-10 sm:p-16">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Nexora Refurbished Standard</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Certified Refurbished. <br />
              <span className="text-neutral-400">Tested to perform like new.</span>
            </h2>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl">
              Every pre-owned system passes a 52-point hardware diagnostic, thermal stress test, and battery capacity verification (&gt;90% health), backed by a full 1-year warranty.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-neutral-800 text-xs">
              <div>
                <span className="font-semibold text-white block mb-1">Grade A+ Condition</span>
                <span className="text-neutral-400">Zero screen blemishes and clean chassis</span>
              </div>
              <div>
                <span className="font-semibold text-white block mb-1">90–100% Battery</span>
                <span className="text-neutral-400">Verified cycle count and full load testing</span>
              </div>
              <div>
                <span className="font-semibold text-white block mb-1">1-Year Warranty</span>
                <span className="text-neutral-400">Comprehensive coverage and 30-day returns</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/shop?condition=Certified+Refurbished"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-colors"
              >
                <span>Browse Refurbished Inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Certified Refurbished Picks */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-black tracking-tight">
              Certified Refurbished Picks
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Pristine condition hardware with substantial savings.
            </p>
          </div>
          <Link
            to="/shop?condition=Certified+Refurbished"
            className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1"
          >
            See All Refurbished <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {refurbishedProducts.slice(0, 3).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
