// frontend/src/pages/OrderConfirmation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  ShieldCheck,
  Printer,
  ArrowRight,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Retrieving your order invoice & tracking manifest...</p>
      </div>
    );
  }

  // Fallback demo order if direct URL accessed
  const displayOrder = order || {
    order_number: id || 'NEX-2026-9041',
    customer_name: 'Jordan Lee',
    customer_email: 'customer@nexoratech.com',
    tracking_number: 'NEX-FDX-88219412',
    status: 'Processing',
    shipping_method: 'Express Insured (2-3 Business Days)',
    payment_method: 'Credit Card (Visa ending in 4242)',
    subtotal: 274999,
    shipping_fee: 0,
    discount: 5000,
    tax: 48600,
    total: 318599,
    shipping_address: {
      street: '742 Evergreen Terrace',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'United States'
    },
    items: [
      {
        id: 2,
        title: 'Apple MacBook Pro 16" M3 Max',
        price: 274999,
        quantity: 1,
        condition: 'Certified Refurbished - Grade A+',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
      }
    ],
    created_at: new Date().toISOString()
  };

  const steps = [
    { title: 'Order Placed', desc: 'Payment verified & logged', done: true },
    { title: 'Diagnostics', desc: '52-point quality check', done: true },
    { title: 'Secured & Packed', desc: 'Tamper foam enclosed', done: displayOrder.status !== 'Pending' },
    { title: 'Shipped', desc: 'FedEx Tech Express in transit', done: displayOrder.status === 'Shipped' || displayOrder.status === 'Delivered' },
    { title: 'Delivered', desc: 'Direct signed handover', done: displayOrder.status === 'Delivered' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Celebration Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-emerald-950/30 border border-cyan-500/30 text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 mx-auto flex items-center justify-center shadow-neon-cyan">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            TRANSACTION CONFIRMED & LOGGED
          </span>
          <h1 className="text-3xl font-black text-white">
            Thank you for your order, {displayOrder.customer_name.split(' ')[0]}!
          </h1>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            Order <strong className="text-cyan-400 font-mono">{displayOrder.order_number}</strong> has been received and queued for priority dispatch. A confirmation receipt has been sent to{' '}
            <span className="text-white underline">{displayOrder.customer_email}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors print:hidden"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print Official Receipt / Tax Invoice</span>
          </button>

          <Link
            to="/shop"
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-neon-cyan transition-colors print:hidden"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Live Order Tracker Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1322] border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-cyan-400" />
              Live Order Fulfillment Timeline
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Carrier Tracking ID: <span className="text-cyan-400 font-mono font-bold">{displayOrder.tracking_number}</span>
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 self-start sm:self-auto">
            Status: {displayOrder.status}
          </span>
        </div>

        {/* Milestone Steps Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {steps.map((st, i) => (
            <div
              key={st.title}
              className={`p-3 rounded-2xl border text-xs space-y-1 ${
                st.done
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold">0{i + 1}</span>
                {st.done ? (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <p className="font-bold text-white">{st.title}</p>
              <p className="text-[10px] text-slate-400">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Itemized Printable Invoice */}
      <div id="printable-invoice" className="p-6 sm:p-8 rounded-3xl bg-[#0c1322] border border-cyan-500/30 space-y-6 shadow-xl">
        <div className="flex justify-between items-start pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-black text-black">
                N
              </div>
              <span className="text-xl font-extrabold text-white">NEXORA TECH SYSTEMS</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Official Hardware Receipt & Tax Manifest</p>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-400 block font-mono">Invoice Date:</span>
            <span className="font-bold text-white">
              {new Date(displayOrder.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Address and Shipping snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block">
              Consignee & Shipping Destination
            </span>
            <p className="font-bold text-white text-sm">{displayOrder.customer_name}</p>
            <p className="text-slate-300">{displayOrder.shipping_address?.street}</p>
            <p className="text-slate-300">
              {displayOrder.shipping_address?.city}, {displayOrder.shipping_address?.state}{' '}
              {displayOrder.shipping_address?.zip}
            </p>
            <p className="text-slate-400 text-[11px]">{displayOrder.customer_email}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block">
              Fulfillment Logistics
            </span>
            <p className="font-bold text-white text-sm">{displayOrder.shipping_method}</p>
            <p className="text-slate-300">Payment: {displayOrder.payment_method}</p>
            <p className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Nexora 1-Year Hardware Warranty Registered
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="p-3">Product Description</th>
                <th className="p-3">Condition Grade</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {displayOrder.items?.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-900/30">
                  <td className="p-3">
                    <p className="font-bold text-white">{item.title}</p>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.condition?.includes('Refurbished')
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {item.condition || 'New'}
                    </span>
                  </td>
                  <td className="p-3 text-center text-slate-300">{item.quantity}</td>
                  <td className="p-3 text-right text-slate-300">₹{Number(item.price).toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-bold text-cyan-400">
                    ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Total Summary */}
        <div className="flex justify-end pt-2 text-xs">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="text-white">₹{Number(displayOrder.subtotal || 0).toLocaleString('en-IN')}</span>
            </div>
            {displayOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Promotional Discount:</span>
                <span>-₹{Number(displayOrder.discount || 0).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Freight Delivery:</span>
              <span className="text-white">
                {displayOrder.shipping_fee === 0 ? 'FREE' : `₹${Number(displayOrder.shipping_fee || 0).toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tax / GST:</span>
              <span className="text-white">₹{Number(displayOrder.tax || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline font-bold">
              <span className="text-sm text-white">Total Amount Paid:</span>
              <span className="text-xl font-black text-cyan-400">
                ₹{Number(displayOrder.total || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
