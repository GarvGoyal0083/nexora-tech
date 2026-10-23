// frontend/src/components/QuickViewModal.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Check,
  Plus,
  Minus
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
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="relative w-full max-w-3xl bg-white border border-neutral-200 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-100 text-neutral-600 hover:text-black transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Images */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between bg-neutral-50 border-b md:border-b-0 md:border-r border-neutral-200">
          <div className="h-64 w-full flex items-center justify-center p-4">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="max-h-full max-w-full object-contain mix-blend-multiply"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border p-1 bg-white transition-all ${
                    selectedImage === idx ? 'border-black' : 'border-neutral-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="md:w-1/2 p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
                {product.brand}
              </span>
              <span className="text-neutral-300">•</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 text-black">
                {isRefurbished ? 'Certified Refurbished' : 'Brand New'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-black leading-snug">
              {product.title}
            </h3>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-black">
                ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              {product.original_price > product.price && (
                <span className="text-sm text-neutral-400 line-through">
                  ${product.original_price.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-full border border-neutral-200 px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-neutral-600 hover:text-black"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-semibold text-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="p-1.5 text-neutral-600 hover:text-black"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={product.stock <= 0}
                className="flex-1 py-3 px-6 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <span>Add to Bag</span>
                )}
              </button>
            </div>

            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="block text-center text-xs text-neutral-500 hover:text-black underline underline-offset-4 pt-1"
            >
              View full specifications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
