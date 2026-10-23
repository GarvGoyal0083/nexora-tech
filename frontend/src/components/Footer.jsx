// frontend/src/components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

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
    <footer className="bg-black text-white mt-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-white text-black flex items-center justify-center font-bold text-xs">
                N
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                NEXORA TECH
              </span>
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Minimalist destination for new flagships and 52-point certified refurbished workstations, displays, and components.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2 max-w-sm">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address for restock alerts"
                  className="flex-1 px-4 py-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-colors flex items-center gap-1 shrink-0"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-neutral-300 mt-2 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Subscribed. Use code <strong>NEXORA10</strong> at checkout.
                </p>
              )}
            </form>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-white uppercase tracking-widest">Catalog</h5>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><Link to="/shop?category=Laptops" className="hover:text-white transition-colors">Laptops</Link></li>
              <li><Link to="/shop?category=Desktop PCs" className="hover:text-white transition-colors">Desktops & Workstations</Link></li>
              <li><Link to="/shop?category=Monitors" className="hover:text-white transition-colors">Monitors</Link></li>
              <li><Link to="/shop?category=Components" className="hover:text-white transition-colors">Components</Link></li>
              <li><Link to="/shop?category=Printers" className="hover:text-white transition-colors">Printers</Link></li>
              <li><Link to="/shop?category=Accessories" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Refurbished */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-white uppercase tracking-widest">Refurbished</h5>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><Link to="/shop?condition=Certified+Refurbished" className="hover:text-white transition-colors">Certified Refurbished</Link></li>
              <li><Link to="/deals" className="hover:text-white transition-colors">Special Offers</Link></li>
              <li><Link to="/compare" className="hover:text-white transition-colors">Compare Specs</Link></li>
              <li><span className="text-neutral-500">52-Point Inspection</span></li>
              <li><span className="text-neutral-500">1-Year Warranty</span></li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-white uppercase tracking-widest">Account</h5>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><Link to="/account" className="hover:text-white transition-colors">Profile</Link></li>
              <li><Link to="/account?tab=orders" className="hover:text-white transition-colors">Orders & Tracking</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Bag</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Admin Console</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-900 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Nexora Tech. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>PayPal</span>
            <span>UPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
