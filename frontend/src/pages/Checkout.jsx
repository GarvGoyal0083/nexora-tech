// frontend/src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  ShieldCheck,
  CreditCard,
  QrCode,
  DollarSign,
  CheckCircle2,
  Truck,
  ArrowRight,
  Sparkles,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal, shippingFee, discountAmount, tax, total, clearCart, shippingMethod } = useCart();
  const { user, token } = useAuth();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Shipping Form State
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

  // Payment Form State
  const [paymentType, setPaymentType] = useState('card'); // 'card' | 'upi' | 'paypal' | 'cod'
  const [cardData, setCardData] = useState({
    number: '4242 •••• •••• 4242',
    name: user?.name || 'JORDAN LEE',
    expiry: '12/28',
    cvv: '884'
  });

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-400">Please add items before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs"
        >
          Explore Catalog
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
    setCardData({
      number: '4532 •••• •••• 9012',
      name: 'ALEX VANCE',
      expiry: '09/29',
      cvv: '719'
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
            ? 'Priority Overnight Tech Freight'
            : shippingMethod === 'express'
            ? 'Express Insured Courier'
            : 'Standard Tech Freight',
        payment_method:
          paymentType === 'card'
            ? `Credit Card (${cardData.number})`
            : paymentType === 'upi'
            ? 'UPI / Digital Instant Scan'
            : paymentType === 'paypal'
            ? 'PayPal Express'
            : 'Cash / Wire on Delivery',
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

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      // Clear local cart
      clearCart();

      // Navigate to confirmation page
      navigate(`/order-confirmation/${data.order_number}`);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong while processing your order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            256-BIT ENCRYPTED CHECKOUT
          </div>
          <h1 className="text-3xl font-black text-white mt-1">Complete Your Order</h1>
        </div>

        <button
          onClick={handleFillDemoData}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Auto-fill Demo Details</span>
        </button>
      </div>

      {/* Stepper Tabs */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto text-xs font-bold text-center">
        <button
          onClick={() => setStep(1)}
          className={`py-3 px-2 rounded-2xl border transition-all ${
            step === 1
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-neon-cyan/20'
              : 'bg-slate-900/60 text-slate-400 border-slate-800'
          }`}
        >
          1. Shipping Details
        </button>
        <button
          onClick={() => setStep(2)}
          className={`py-3 px-2 rounded-2xl border transition-all ${
            step === 2
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-neon-cyan/20'
              : 'bg-slate-900/60 text-slate-400 border-slate-800'
          }`}
        >
          2. Payment Method
        </button>
        <button
          onClick={() => setStep(3)}
          className={`py-3 px-2 rounded-2xl border transition-all ${
            step === 3
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-neon-cyan/20'
              : 'bg-slate-900/60 text-slate-400 border-slate-800'
          }`}
        >
          3. Final Review
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Main Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Step Forms (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1322] border border-slate-800 space-y-6 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-cyan-400" />
                  Shipping & Delivery Destination
                </h3>
                <span className="text-xs text-slate-500">Step 1 of 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={shippingData.name}
                    onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                    required
                    placeholder="Jordan Lee"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email for Tracking Updates</label>
                  <input
                    type="email"
                    value={shippingData.email}
                    onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                    required
                    placeholder="jordan@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    value={shippingData.phone}
                    onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Country</label>
                  <input
                    type="text"
                    value={shippingData.country}
                    onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Street Address / Suite</label>
                  <input
                    type="text"
                    value={shippingData.street}
                    onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                    required
                    placeholder="742 Evergreen Terrace, Suite 400"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={shippingData.city}
                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                    required
                    placeholder="Austin"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">State / Province</label>
                    <input
                      type="text"
                      value={shippingData.state}
                      onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                      required
                      placeholder="TX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">ZIP / Postal</label>
                    <input
                      type="text"
                      value={shippingData.zip}
                      onChange={(e) => setShippingData({ ...shippingData, zip: e.target.value })}
                      required
                      placeholder="78701"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!shippingData.name || !shippingData.street || !shippingData.city) {
                      setErrorMsg('Please complete required name, street, and city fields.');
                      return;
                    }
                    setErrorMsg('');
                    setStep(2);
                  }}
                  className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-neon-cyan transition-colors"
                >
                  <span>Continue to Payment Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Payment Method */}
          {step === 2 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1322] border border-slate-800 space-y-6 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  Select Payment Method
                </h3>
                <span className="text-xs text-slate-500">Step 2 of 3</span>
              </div>

              {/* Payment Type Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'card', label: 'Credit Card', icon: CreditCard },
                  { id: 'upi', label: 'UPI / QR Scan', icon: QrCode },
                  { id: 'paypal', label: 'PayPal', icon: DollarSign },
                  { id: 'cod', label: 'Wire / COD', icon: ShieldCheck }
                ].map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentType(p.id)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                        paymentType === p.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-neon-cyan/20'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Card Form */}
              {paymentType === 'card' && (
                <div className="space-y-4 pt-2">
                  {/* Cyber Card Visual Preview */}
                  <div className="w-full max-w-sm mx-auto h-48 rounded-2xl bg-gradient-to-tr from-slate-900 via-cyan-950 to-blue-900 border border-cyan-500/40 p-5 flex flex-col justify-between shadow-neon-cyan/30 text-white relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold tracking-widest text-cyan-400">NEXORA SECURE</span>
                      <span className="text-xs font-mono uppercase bg-black/40 px-2 py-0.5 rounded">VISA CHIP</span>
                    </div>
                    <div className="font-mono text-base tracking-widest text-slate-200">
                      {cardData.number}
                    </div>
                    <div className="flex justify-between items-end text-xs font-mono">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Cardholder</span>
                        <span className="font-bold tracking-wider">{cardData.name}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Expires</span>
                        <span className="font-bold">{cardData.expiry}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-semibold mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        placeholder="4242 •••• •••• 4242"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Expiration Date</label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Security Code (CVV)</label>
                      <input
                        type="text"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        placeholder="884"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Instant QR */}
              {paymentType === 'upi' && (
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/30 text-center space-y-3">
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-lg">
                    {/* Simulated High-Res QR Pattern */}
                    <div className="w-full h-full border-4 border-black p-1 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="w-6 h-6 bg-black" />
                        <div className="w-6 h-6 bg-black" />
                      </div>
                      <div className="text-[10px] font-mono font-black text-black">NEXORA-PAY</div>
                      <div className="flex justify-between">
                        <div className="w-6 h-6 bg-black" />
                        <div className="w-6 h-6 bg-cyan-600" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 font-mono font-bold">
                    UPI ID: <span className="text-cyan-400">nexoratech@icici</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Scan with any UPI app (Google Pay, PhonePe, Paytm, BHIM) for zero fee instant checkout.
                  </p>
                </div>
              )}

              {/* PayPal */}
              {paymentType === 'paypal' && (
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                  <p className="text-xs text-slate-300">
                    You will be securely redirected to PayPal to complete your purchase using PayPal Balance or linked bank accounts.
                  </p>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-bold"
                >
                  &larr; Back to Shipping
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-neon-cyan transition-colors"
                >
                  <span>Review Final Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Review */}
          {step === 3 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1322] border border-cyan-500/40 space-y-6 shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  Final Review & Authorization
                </h3>
                <span className="text-xs text-slate-500">Step 3 of 3</span>
              </div>

              {/* Shipping & Payment snapshot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">Deliver To:</span>
                  <p className="font-bold text-white">{shippingData.name}</p>
                  <p className="text-slate-300">{shippingData.street}</p>
                  <p className="text-slate-300">{shippingData.city}, {shippingData.state} {shippingData.zip}</p>
                  <p className="text-slate-400 text-[11px]">{shippingData.email} • {shippingData.phone}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">Payment Details:</span>
                  <p className="font-bold text-cyan-400 uppercase">{paymentType}</p>
                  <p className="text-slate-300">
                    {paymentType === 'card' ? `Card: ${cardData.number}` : 'Digital Authorized Instant Settlement'}
                  </p>
                  <p className="text-emerald-400 text-[11px] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified & Insured
                  </p>
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">Package Contents:</span>
                <div className="max-h-56 overflow-y-auto rounded-xl bg-slate-900/60 border border-slate-800 divide-y divide-slate-800/80">
                  {cart.map((item) => (
                    <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt=""
                          className="w-10 h-10 object-contain bg-slate-950 p-1 rounded-lg shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white line-clamp-1">{item.title}</p>
                          <p className="text-[11px] text-slate-400">
                            Qty: {item.quantity} • {item.condition}
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-cyan-400">
                        ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-bold"
                >
                  &larr; Back to Payment
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handlePlaceOrder}
                  className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-sm flex items-center gap-2 shadow-neon-cyan transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{submitting ? 'Authorizing & Creating Order...' : `Authorize & Pay ₹${Number(total).toLocaleString('en-IN')}`}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0c1322] border border-cyan-500/30 space-y-4 shadow-xl sticky top-28">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Order Pricing Breakdown
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({cart.length} items)</span>
                <span className="text-white font-medium">₹{Number(subtotal).toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Promotional Savings</span>
                  <span>-₹{Number(discountAmount).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Tech Freight Delivery</span>
                <span className="text-white font-medium">
                  {shippingFee === 0 ? 'FREE' : `₹${Number(shippingFee).toLocaleString('en-IN')}`}
                </span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Estimated GST (18%)</span>
                <span className="text-white font-medium">₹{Number(tax).toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Grand Total</span>
                <span className="text-2xl font-black text-cyan-400">
                  ₹{Number(total).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Nexora Tech Buyer Protection
              </div>
              <p>
                All hardware shipments include real-time GPS courier tracking, tamper-evident seals, and full replacement insurance against transit loss or damage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
