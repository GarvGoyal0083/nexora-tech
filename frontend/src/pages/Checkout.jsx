// frontend/src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  CreditCard,
  QrCode,
  DollarSign,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal, shippingFee, discountAmount, tax, total, clearCart, shippingMethod } = useCart();
  const { user, token } = useAuth();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [shippingData, setShippingData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+1 (555) 392-8819',
    street: user?.street || '104 Silicon Parkway, Apt 302',
    city: user?.city || 'Austin',
    state: user?.state || 'TX',
    zip: user?.zip || '78701',
    country: user?.country || 'United States'
  });

  const [paymentType, setPaymentType] = useState('card');
  const [cardData, setCardData] = useState({
    number: '4242 •••• •••• 4242',
    name: user?.name || 'JORDAN LEE',
    expiry: '12/28',
    cvv: '884'
  });

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-black">Your Bag is Empty</h2>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 rounded-full bg-black text-white font-medium text-xs"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  const handleFillDemoData = () => {
    setShippingData({
      name: 'Alex Vance',
      email: 'alex.vance@nexoratech.com',
      phone: '+1 (415) 890-2100',
      street: '742 Cyber Way, Suite 800',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      country: 'United States'
    });
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        customer_name: shippingData.name,
        customer_email: shippingData.email,
        customer_phone: shippingData.phone,
        shipping_address: {
          street: shippingData.street,
          city: shippingData.city,
          state: shippingData.state,
          zip: shippingData.zip,
          country: shippingData.country
        },
        shipping_method:
          shippingMethod === 'overnight'
            ? 'Priority Overnight'
            : shippingMethod === 'express'
            ? 'Express Courier'
            : 'Standard Shipping',
        payment_method:
          paymentType === 'card'
            ? `Card (${cardData.number})`
            : paymentType === 'upi'
            ? 'UPI Instant Scan'
            : paymentType === 'paypal'
            ? 'PayPal'
            : 'Cash on Delivery',
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          condition: item.condition,
          image: item.image
        })),
        subtotal,
        shipping_fee: shippingFee,
        discount: discountAmount,
        tax,
        total
      };

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order');

      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      clearCart();
      navigate(`/order-confirmation/${data.order_number}`);
    } catch (err) {
      setErrorMsg(err.message || 'Error processing order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 space-y-10">
      <div className="flex items-end justify-between pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight">Checkout</h1>
        </div>
        <button
          onClick={handleFillDemoData}
          className="px-4 py-1.5 rounded-full border border-neutral-300 hover:border-black text-xs font-medium text-black"
        >
          Auto-fill Demo Address
        </button>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-3 text-xs font-medium">
        {[
          { num: 1, label: '1. Shipping' },
          { num: 2, label: '2. Payment' },
          { num: 3, label: '3. Review' }
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`px-5 py-2 rounded-full transition-all ${
              step === s.num
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-500'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-neutral-100 border border-black text-black text-xs">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          {step === 1 && (
            <div className="p-8 rounded-3xl border border-neutral-200 space-y-6 bg-white">
              <h3 className="text-base font-bold text-black">Shipping Destination</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={shippingData.name}
                    onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 text-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={shippingData.email}
                    onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 text-black focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-600 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={shippingData.street}
                    onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 text-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 mb-1">City</label>
                  <input
                    type="text"
                    value={shippingData.city}
                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 text-black focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-600 mb-1">State</label>
                    <input
                      type="text"
                      value={shippingData.state}
                      onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 text-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1">ZIP</label>
                    <input
                      type="text"
                      value={shippingData.zip}
                      onChange={(e) => setShippingData({ ...shippingData, zip: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 text-black focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!shippingData.name || !shippingData.street || !shippingData.city) {
                      setErrorMsg('Please complete all shipping fields.');
                      return;
                    }
                    setErrorMsg('');
                    setStep(2);
                  }}
                  className="px-6 py-3 rounded-full bg-black text-white font-medium text-xs flex items-center gap-1.5"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-8 rounded-3xl border border-neutral-200 space-y-6 bg-white">
              <h3 className="text-base font-bold text-black">Payment Method</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'card', label: 'Card', icon: CreditCard },
                  { id: 'upi', label: 'UPI QR', icon: QrCode },
                  { id: 'paypal', label: 'PayPal', icon: DollarSign },
                  { id: 'cod', label: 'COD', icon: ShieldCheck }
                ].map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentType(p.id)}
                      className={`p-3.5 rounded-2xl border text-xs font-medium flex flex-col items-center gap-2 transition-all ${
                        paymentType === p.id
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-neutral-600 border-neutral-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>

              {paymentType === 'card' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 text-black font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 text-black font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1">CVV</label>
                    <input
                      type="text"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 text-black font-mono focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-neutral-500 hover:text-black"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-full bg-black text-white font-medium text-xs flex items-center gap-1.5"
                >
                  <span>Review Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-8 rounded-3xl border border-neutral-200 space-y-6 bg-white">
              <h3 className="text-base font-bold text-black">Review & Authorize</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <span className="text-neutral-400 block">Shipping To</span>
                  <p className="font-bold text-black">{shippingData.name}</p>
                  <p className="text-neutral-600">{shippingData.street}</p>
                  <p className="text-neutral-600">{shippingData.city}, {shippingData.state} {shippingData.zip}</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <span className="text-neutral-400 block">Payment</span>
                  <p className="font-bold text-black uppercase">{paymentType}</p>
                  <p className="text-neutral-600">Encrypted Settlement</p>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-neutral-500 hover:text-black"
                >
                  &larr; Back
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handlePlaceOrder}
                  className="px-8 py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-xs flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Processing...' : `Place Order ($${total.toFixed(2)})`}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-5">
          <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-4 sticky top-28">
            <h3 className="text-base font-bold text-black pb-3 border-b border-neutral-200">
              Summary ({cart.length} items)
            </h3>

            <div className="space-y-2.5 text-xs">
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
                <span className="text-xl font-bold text-black">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
