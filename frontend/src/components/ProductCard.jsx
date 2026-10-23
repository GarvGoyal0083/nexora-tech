// frontend/src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  SlidersHorizontal,
  Check,
  Eye
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const [addedAnimation, setAddedAnimation] = useState(false);

  const isRefurbished = product.condition?.toLowerCase().includes('refurbished');
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  const handleToggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const mainImage = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200 hover:border-black transition-all duration-300 flex flex-col p-5">
      {/* Image Well */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block h-56 w-full rounded-xl bg-neutral-100 p-6 flex items-center justify-center overflow-hidden mb-5"
      >
        {/* Minimal Condition Tag */}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
            isRefurbished
              ? 'bg-black text-white'
              : 'bg-white text-black border border-neutral-200'
          }`}
        >
          {isRefurbished ? 'Refurbished' : 'New'}
        </span>

        {/* Minimal Action Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full transition-colors ${
              inWishlist
                ? 'bg-black text-white'
                : 'bg-white text-neutral-700 hover:text-black shadow-sm'
            }`}
            title="Save"
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleToggleCompare}
            className={`p-2 rounded-full transition-colors ${
              inCompare
                ? 'bg-black text-white'
                : 'bg-white text-neutral-700 hover:text-black shadow-sm'
            }`}
            title="Compare"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="p-2 rounded-full bg-white text-neutral-700 hover:text-black shadow-sm transition-colors"
              title="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <img
          src={mainImage}
          alt={product.title}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out mix-blend-multiply"
          loading="lazy"
        />
      </Link>

      {/* Minimal Card Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-widest text-neutral-400 block">
            {product.brand}
          </span>

          <Link
            to={`/product/${product.slug}`}
            className="block text-base font-semibold text-black hover:underline underline-offset-4 line-clamp-1 mt-1"
          >
            {product.title}
          </Link>

          <p className="text-xs text-neutral-500 mt-1.5 line-clamp-1">
            {product.short_description}
          </p>
        </div>

        {/* Clean Price & Action Row */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-black">
              ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            {product.original_price > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                ${product.original_price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              product.stock <= 0
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : addedAnimation
                ? 'bg-neutral-800 text-white'
                : 'bg-black hover:bg-neutral-800 text-white'
            }`}
          >
            {product.stock <= 0 ? (
              'Sold Out'
            ) : addedAnimation ? (
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Added
              </span>
            ) : (
              'Add to Bag'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
