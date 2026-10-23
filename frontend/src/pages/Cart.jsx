// frontend/src/pages/Cart.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
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
      <div className="max-w-xl mx-auto px-6 py-24 text-center space-y-6">
        <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto" />
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-black">Your Bag is Empty</h2>
          <p className="text-xs text-neutral-500">
            Explore our collection of laptops, desktops, monitors, and components.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-black text-white font-medium text-xs"
        >
          <span>Shop Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 space-y-10">
      <div className="flex items-end justify-between pb-6 border-b border-neutral-200">
        <h1 className="text-3xl font-bold text-black tracking-tight">Shopping Bag</h1>
        <button
          onClick={clearCart}
          className="text-xs text-neutral-500 hover:text-black underline"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Items */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-neutral-200 divide-y divide-neutral-200 overflow-hidden">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between bg-white"
              >
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-xl object-contain bg-neutral-100 p-2 shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest block">
                      {item.brand} • {item.condition?.includes('Refurbished') ? 'Refurbished' : 'New'}
                    </span>
                    <Link
                      to={`/product/${item.slug}`}
                      className="text-sm font-semibold text-black hover:underline block line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-neutral-500">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="flex items-center rounded-full border border-neutral-200 px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-neutral-500 hover:text-black"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-black">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-neutral-500 hover:text-black"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-bold text-black min-w-[85px] text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-neutral-400 hover:text-black"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link to="/shop" className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-black">
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-6 sticky top-28">
            <h3 className="text-base font-bold text-black">Order Summary</h3>

            {/* Promo Code */}
            <div className="space-y-2">
              {appliedCoupon ? (
                <div className="p-3 rounded-xl bg-white border border-neutral-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-black">Code: {appliedCoupon.code}</span>
                  <button onClick={removeCoupon} className="text-neutral-500 hover:text-black underline">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Promo code (e.g. NEXORA10)"
                    className="flex-1 px-3.5 py-2 rounded-full bg-white border border-neutral-200 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black uppercase"
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    disabled={applying || !couponCode}
                    className="px-4 py-2 rounded-full bg-black text-white font-medium text-xs disabled:opacity-40"
                  >
                    Apply
                  </button>
                </div>
              )}

              {couponMsg.text && (
                <p className="text-[11px] text-neutral-600">{couponMsg.text}</p>
              )}
            </div>

            {/* Shipping */}
            <div className="space-y-2 pt-4 border-t border-neutral-200 text-xs">
              <span className="font-semibold text-black block mb-2">Delivery Option</span>
              {[
                { id: 'standard', label: 'Standard Shipping', price: subtotal >= freeShippingThreshold ? 'Free' : '$9.99' },
                { id: 'express', label: 'Express Courier', price: '$14.99' },
                { id: 'overnight', label: 'Priority Overnight', price: '$29.99' }
              ].map((s) => (
                <label
                  key={s.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-neutral-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === s.id}
                      onChange={() => setShippingMethod(s.id)}
                      className="accent-black"
                    />
                    <span className="text-black font-medium">{s.label}</span>
                  </div>
                  <span className="font-semibold text-black">{s.price}</span>
                </label>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-200 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="text-black font-medium">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-black font-medium">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="text-black font-medium">
                  {shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Estimated Tax</span>
                <span className="text-black font-medium">${tax.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-black">Total</span>
                <span className="text-xl font-bold text-black">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
