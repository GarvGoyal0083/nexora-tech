// frontend/src/components/QuickViewModal.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Star,
  ShieldCheck,
  Check,
  ShoppingCart,
  Plus,
  Minus,
  ArrowRight,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'];

  const isRefurbished = product.condition?.toLowerCase().includes('refurbished');

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-4xl bg-[#0b101d] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Images */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800">
          <div className="h-64 sm:h-80 w-full flex items-center justify-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800/80">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 p-1 bg-slate-900 transition-all ${
                    selectedImage === idx ? 'border-cyan-400 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Condition & Brand */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-slate-600">•</span>
              {isRefurbished ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {product.condition}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Brand New Factory Sealed
                </span>
              )}
            </div>

            <h3 className="text-xl font-extrabold text-white leading-tight">
              {product.title}
            </h3>

            {/* Ratings */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-xs font-bold text-slate-200 ml-1.5">{product.rating || '5.0'}</span>
              </div>
              <span className="text-xs text-slate-500">
                ({product.reviews_count || 14} verified customer reviews)
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-cyan-400">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price > product.price && (
                <>
                  <span className="text-base text-slate-500 line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300">
                    Save ${(product.original_price - product.price).toFixed(2)} ({product.discount_pct}%)
                  </span>
                </>
              )}
            </div>

            {/* Condition details if refurbished */}
            {product.condition_notes && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-emerald-400 block mb-0.5">
                  Inspection Grade Note:
                </span>
                {product.condition_notes}
              </div>
            )}

            {/* Short spec list */}
            {product.specs && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(product.specs).slice(0, 4).map(([k, v]) => (
                  <div key={k} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">{k}</span>
                    <span className="text-slate-200 font-medium truncate block">{v}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <Truck className="w-4 h-4" />
              <span>Ships within 24 hours in secure foam packaging</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={product.stock <= 0}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  added
                    ? 'bg-emerald-500 text-black'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-black hover:shadow-neon-cyan'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add {quantity > 1 ? `(${quantity})` : ''} to Cart</span>
                  </>
                )}
              </button>
            </div>

            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="block text-center text-xs text-cyan-400 hover:text-cyan-300 font-medium hover:underline pt-1"
            >
              View Full Technical Specs & Customer Reviews &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
