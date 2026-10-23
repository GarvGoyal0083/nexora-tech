// frontend/src/pages/OrderConfirmation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Printer,
  ArrowRight
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

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-xs text-neutral-500">Loading order details...</p>
      </div>
    );
  }

  const displayOrder = order || {
    order_number: id || 'NEX-2026-9041',
    customer_name: 'Jordan Lee',
    customer_email: 'customer@nexoratech.com',
    tracking_number: 'NEX-FDX-88219412',
    status: 'Processing',
    shipping_method: 'Express Courier',
    payment_method: 'Credit Card',
    subtotal: 3299.99,
    shipping_fee: 0,
    discount: 100,
    tax: 263.99,
    total: 3463.98,
    shipping_address: {
      street: '742 Evergreen Terrace',
      city: 'Austin',
      state: 'TX',
      zip: '78701'
    },
    items: [
      {
        id: 2,
        title: 'Apple MacBook Pro 16" M3 Max',
        price: 3299.99,
        quantity: 1,
        condition: 'Certified Refurbished - Grade A+'
      }
    ],
    created_at: new Date().toISOString()
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
      <div className="p-10 rounded-3xl bg-neutral-50 border border-neutral-200 text-center space-y-4">
        <CheckCircle2 className="w-10 h-10 text-black mx-auto" />
        <h1 className="text-3xl font-bold text-black">
          Order Confirmed
        </h1>
        <p className="text-xs text-neutral-600 max-w-md mx-auto">
          Order <strong className="text-black font-mono">{displayOrder.order_number}</strong> has been placed. Tracking ID: <span className="font-mono text-black">{displayOrder.tracking_number}</span>
        </p>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-full border border-neutral-300 text-black font-medium text-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>

          <Link
            to="/shop"
            className="px-5 py-2.5 rounded-full bg-black text-white font-medium text-xs flex items-center gap-1.5"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Invoice */}
      <div className="p-8 rounded-3xl border border-neutral-200 space-y-6 bg-white">
        <div className="flex justify-between items-start pb-6 border-b border-neutral-200">
          <div>
            <span className="text-base font-bold text-black">NEXORA TECH</span>
            <p className="text-xs text-neutral-500 mt-0.5">Receipt & Order Summary</p>
          </div>
          <div className="text-right text-xs text-neutral-500">
            {new Date(displayOrder.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="divide-y divide-neutral-200 text-xs">
          {displayOrder.items?.map((item, idx) => (
            <div key={idx} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-black">{item.title}</p>
                <p className="text-neutral-500">Qty: {item.quantity} • {item.condition}</p>
              </div>
              <span className="font-bold text-black">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-neutral-200 flex justify-between items-baseline text-sm font-bold text-black">
          <span>Total Paid</span>
          <span className="text-lg">${displayOrder.total?.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
