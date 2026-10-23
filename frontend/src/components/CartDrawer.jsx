// frontend/src/components/CartDrawer.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItemsCount
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-black" />
              <h3 className="text-sm font-bold text-black">
                Shopping Bag ({totalItemsCount})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-500 hover:text-black hover:bg-neutral-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 divide-y divide-neutral-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <ShoppingBag className="w-8 h-8 text-neutral-300" />
                <h4 className="text-sm font-semibold text-black">Your bag is empty</h4>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Explore laptops, workstations, monitors, and components.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/shop');
                  }}
                  className="mt-2 px-5 py-2.5 rounded-full bg-black text-white font-medium text-xs"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-5 first:pt-0 flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-contain bg-neutral-100 p-2 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      {item.brand}
                    </span>
                    <h4 className="text-xs font-semibold text-black truncate">{item.title}</h4>
                    <p className="text-xs font-bold text-black mt-0.5">
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center rounded-full border border-neutral-200 px-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-neutral-500 hover:text-black"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium text-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-neutral-500 hover:text-black"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-black p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-100 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span className="text-lg font-bold text-black">
                  ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/cart');
                  }}
                  className="py-2.5 px-4 rounded-full border border-neutral-300 hover:border-black text-black font-medium text-xs text-center transition-colors"
                >
                  View Bag
                </button>

                <button
                  onClick={() => {
                    onClose();
                    navigate('/checkout');
                  }}
                  className="py-2.5 px-4 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-xs text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
