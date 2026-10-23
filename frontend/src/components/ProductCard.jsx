// frontend/src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  SlidersHorizontal,
  ShoppingCart,
  Star,
  Eye,
  Check,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const { compareItems, addToCompare, removeFromCompare, isInCompare } = useCompare();

  const [addedAnimation, setAddedAnimation] = useState(false);

  const isRefurbished = product.condition?.toLowerCase().includes('refurbished');
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1600);
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

  // Format first 2 key specs for quick chip display
  let quickSpecs = [];
  if (product.specs && typeof product.specs === 'object') {
    quickSpecs = Object.entries(product.specs).slice(0, 2).map(([key, val]) => `${key}: ${val}`);
  }

  return (
    <div className="group relative bg-[#0d1424] rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-neon-cyan/20">
      {/* Top Badges Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between pointer-events-none">
        <div className="flex flex-col gap-1">
          {/* Condition Badge */}
          {isRefurbished ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-sm">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              {product.condition.includes('A+') ? 'Refurbished A+' : 'Refurbished'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40 backdrop-blur-md">
              Brand New
            </span>
          )}

          {/* Deal / Savings Badge */}
          {product.discount_pct > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              Save {product.discount_pct}%
            </span>
          )}
        </div>

        {/* Wishlist & Compare interactive floating buttons */}
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              inWishlist
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-900/80 text-slate-300 hover:text-rose-400 border border-slate-700/60'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleToggleCompare}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              inCompare
                ? 'bg-cyan-500 text-black shadow-md'
                : 'bg-slate-900/80 text-slate-300 hover:text-cyan-400 border border-slate-700/60'
            }`}
            title={inCompare ? 'Remove from Compare' : 'Add to Compare'}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Image Container */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block h-52 w-full overflow-hidden bg-slate-900/80 p-6 flex items-center justify-center cursor-pointer"
      >
        <img
          src={mainImage}
          alt={product.title}
          className="h-full w-full object-contain transform group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Quick View Hover Overlay Button */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-cyan-600 hover:text-black border border-cyan-500/40 text-xs font-semibold text-cyan-300 flex items-center gap-1.5 shadow-lg backdrop-blur-md"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        )}
      </Link>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-cyan-400 tracking-wider uppercase text-[11px]">
              {product.brand}
            </span>
            <span className="text-slate-500 text-[11px]">{product.category}</span>
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
            className="block text-sm font-bold text-white hover:text-cyan-300 transition-colors line-clamp-2 leading-snug"
          >
            {product.title}
          </Link>

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold text-slate-200 ml-1">{product.rating || '5.0'}</span>
            </div>
            <span className="text-[11px] text-slate-500">
              ({product.reviews_count || 12} reviews)
            </span>
          </div>

          {/* Quick Specs Chips */}
          <p className="text-[11px] text-slate-400 mt-2 line-clamp-1">
            {product.short_description || 'High performance tech hardware'}
          </p>
        </div>

        {/* Bottom Price & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-cyan-400">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.original_price > product.price && (
                <span className="text-xs text-slate-500 line-through">
                  ₹{Number(product.original_price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className={`text-[10px] block font-medium ${
              product.stock > 3 ? 'text-emerald-400' : product.stock > 0 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {product.stock > 3 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              product.stock <= 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-500 text-black scale-95'
                : 'bg-cyan-600 hover:bg-cyan-500 text-black hover:shadow-neon-cyan'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
