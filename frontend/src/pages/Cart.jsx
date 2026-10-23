// frontend/src/pages/Cart.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Zap,
  Tag,
  Check,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shippingMethod,
    setShippingMethod,
    shippingFee,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
    tax,
    total,
    freeShippingThreshold
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState({ text: '', isError: false });
  const [applying, setApplying] = useState(false);

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (codeToApply) => {
    const code = codeToApply || couponCode;
    if (!code.trim()) return;
    setApplying(true);
    setCouponMsg({ text: '', isError: false });
    const res = await applyCoupon(code.trim().toUpperCase());
    if (res.success) {
      setCouponMsg({ text: res.message, isError: false });
      setCouponCode('');
    } else {
      setCouponMsg({ text: res.error, isError: true });
    }
    setApplying(false);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-900 mx-auto flex items-center justify-center text-cyan-400 border border-slate-800">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white">Your Shopping Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Discover our collection of gaming laptops, liquid-cooled desktops, 4K OLED displays, and certified refurbished flagships.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold text-sm shadow-neon-cyan transition-all"
        >
          <span>Explore Hardware Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest">
            <ShoppingCart className="w-4 h-4" />
            CHECKOUT READY
          </div>
          <h1 className="text-3xl font-black text-white mt-1">Shopping Cart</h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      {/* Free Shipping Milestone Indicator */}
      <div className="p-4 rounded-2xl bg-[#0c1426] border border-cyan-500/30 text-xs">
        <div className="flex items-center justify-between text-slate-200 mb-2 font-bold">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Zap className="w-4 h-4" />
            Nexora Tech Priority Freight
          </span>
          <span className="text-cyan-300">
            {remainingForFreeShipping === 0
              ? 'Free Shipping Unlocked!'
              : `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} more for Free Priority Shipping`}
          </span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Grid Layout: Cart Items (8 cols) + Order Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl bg-[#0c1322] border border-slate-800 divide-y divide-slate-800/80 overflow-hidden shadow-xl">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col sm:flex-row items-center gap-4 justify-between"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-xl object-contain bg-slate-950 p-2 border border-slate-800 shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase">
                        {item.brand}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        item.condition?.includes('Refurbished')
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {item.condition?.includes('Refurbished') ? 'Certified Refurbished' : 'Brand New'}
                      </span>
                    </div>

                    <Link
                      to={`/product/${item.slug}`}
                      className="text-sm font-bold text-white hover:text-cyan-300 transition-colors block line-clamp-1"
                    >
                      {item.title}
                    </Link>

                    <p className="text-xs font-black text-cyan-400">
                      ₹{Number(item.price).toLocaleString('en-IN')} each
                    </p>
                  </div>
                </div>

                {/* Right controls: quantity & price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                  <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-slate-400 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-slate-400 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <span className="text-base font-black text-white">
                      ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
            <Link to="/shop" className="hover:text-cyan-400 flex items-center gap-1.5 font-bold">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <span>All items covered by 1-Year Nexora Warranty</span>
          </div>
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0c1322] border border-cyan-500/30 space-y-6 shadow-xl sticky top-28">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Order Summary
            </h3>

            {/* Promo Code Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                Promo Code / Discount
              </label>

              {appliedCoupon ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-300 block">{appliedCoupon.code}</span>
                    <span className="text-slate-400 text-[11px]">
                      {appliedCoupon.discount_type === 'pct' ? `${appliedCoupon.value}% discount applied` : `₹${Number(appliedCoupon.value).toLocaleString('en-IN')} discount applied`}
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. NEXORA10"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono uppercase"
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    disabled={applying || !couponCode}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs border border-cyan-500/30 disabled:opacity-50"
                  >
                    {applying ? '...' : 'Apply'}
                  </button>
                </div>
              )}

              {couponMsg.text && (
                <p className={`text-[11px] ${couponMsg.isError ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {couponMsg.text}
                </p>
              )}

              {/* Quick Coupon Suggestions */}
              {!appliedCoupon && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500">Try:</span>
                  {['NEXORA10', 'CYBER50', 'GAMER100'].map((c) => (
                    <button
                      key={c}
                      onClick={() => handleApplyCoupon(c)}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Shipping Method Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 block">Shipping Speed</label>
              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="text-cyan-500"
                    />
                    <div>
                      <span className="font-semibold text-white block">Standard Tech Freight</span>
                      <span className="text-[11px] text-slate-500">4-6 Business Days</span>
                    </div>
                  </div>
                  <span className="font-bold text-cyan-400">
                    {subtotal >= freeShippingThreshold ? 'FREE' : '₹499'}
                  </span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="text-cyan-500"
                    />
                    <div>
                      <span className="font-semibold text-white block">Express Insured Courier</span>
                      <span className="text-[11px] text-slate-500">2-3 Business Days</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-200">₹799</span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'overnight'}
                      onChange={() => setShippingMethod('overnight')}
                      className="text-cyan-500"
                    />
                    <div>
                      <span className="font-semibold text-white block">Priority Overnight</span>
                      <span className="text-[11px] text-slate-500">Next Business Day AM</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-200">₹1,499</span>
                </label>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-medium">₹{Number(subtotal).toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{Number(discountAmount).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Estimated Shipping</span>
                <span className="text-white font-medium">
                  {shippingFee === 0 ? 'FREE' : `₹${Number(shippingFee).toLocaleString('en-IN')}`}
                </span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Estimated GST (18%)</span>
                <span className="text-white font-medium">₹{Number(tax).toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Estimated Total</span>
                <span className="text-2xl font-black text-cyan-400">
                  ₹{Number(total).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-neon-cyan transition-all transform hover:-translate-y-0.5"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
