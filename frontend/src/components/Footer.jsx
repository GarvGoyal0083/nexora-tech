// frontend/src/components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  Mail,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#05070a] border-t border-cyan-500/15 text-slate-400 mt-20">
      {/* Value Proposition Banners */}
      <div className="border-b border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">52-Point Diagnostic</h4>
                <p className="text-xs text-slate-400">Every refurbished unit stress-tested & certified</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Insured Tech Freight</h4>
                <p className="text-xs text-slate-400">Foam-cushioned rapid dispatch with live tracking</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">30-Day Money Back</h4>
                <p className="text-xs text-slate-400">Hassle-free return policy if you are not thrilled</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Dedicated Tech Concierge</h4>
                <p className="text-xs text-slate-400">Direct support from certified hardware engineers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5">
                <div className="w-full h-full bg-[#07090e] rounded-[6px] flex items-center justify-center">
                  <span className="text-sm font-black text-cyan-400">N</span>
                </div>
              </div>
              <span className="text-lg font-black tracking-wider text-white">NEXORA TECH</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your destination for top-tier computing power, bleeding-edge gaming rigs, and certified refurbished workstations. Tested rigorously to aerospace tolerances.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-slate-300">
                Subscribe for private flash drops & refurbished restocks:
              </p>
              <div className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs transition-colors flex items-center gap-1 shrink-0"
                >
                  Join VIP
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  You are registered for exclusive VIP drops! Use promo code <strong>NEXORA10</strong>.
                </p>
              )}
            </form>
          </div>

          {/* Shop Hardware */}
          <div>
            <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Shop Hardware</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop?category=Laptops" className="hover:text-cyan-400 transition-colors">Gaming Laptops</Link></li>
              <li><Link to="/shop?category=Desktop PCs" className="hover:text-cyan-400 transition-colors">Desktop Rigs & Workstations</Link></li>
              <li><Link to="/shop?category=Monitors" className="hover:text-cyan-400 transition-colors">OLED & 4K Monitors</Link></li>
              <li><Link to="/shop?category=Components" className="hover:text-cyan-400 transition-colors">GPUs & Processors</Link></li>
              <li><Link to="/shop?category=Printers" className="hover:text-cyan-400 transition-colors">Enterprise Printers</Link></li>
              <li><Link to="/shop?category=Accessories" className="hover:text-cyan-400 transition-colors">Pro Esports Accessories</Link></li>
            </ul>
          </div>

          {/* Certified Refurbished */}
          <div>
            <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Certified Refurbished</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop?condition=Certified+Refurbished" className="hover:text-cyan-400 transition-colors">Refurbished Hub</Link></li>
              <li><span className="text-slate-500">Grade A+ Pristine Standards</span></li>
              <li><span className="text-slate-500">52-Point Inspection Protocol</span></li>
              <li><span className="text-slate-500">Nexora 1-Year Full Coverage</span></li>
              <li><Link to="/deals" className="hover:text-cyan-400 transition-colors">Clearance Outlet</Link></li>
              <li><Link to="/compare" className="hover:text-cyan-400 transition-colors">Spec Comparison Tool</Link></li>
            </ul>
          </div>

          {/* Account & Policies */}
          <div>
            <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Customer Service</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/account?tab=orders" className="hover:text-cyan-400 transition-colors">Order Tracking</Link></li>
              <li><Link to="/account" className="hover:text-cyan-400 transition-colors">My Profile</Link></li>
              <li><Link to="/cart" className="hover:text-cyan-400 transition-colors">Shopping Cart</Link></li>
              <li><span className="text-slate-500">Warranty Registration</span></li>
              <li><span className="text-slate-500">Hardware Trade-in Program</span></li>
              <li><Link to="/admin" className="text-cyan-500 hover:underline">Admin Console</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with payment badges */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Lock className="w-3.5 h-3.5 text-cyan-500" />
            <span>256-Bit SSL Encrypted Checkout • Nexora Tech Systems &copy; {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">VISA</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">MASTERCARD</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">AMEX</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">PAYPAL</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400">UPI / QR</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-amber-400">BITCOIN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
