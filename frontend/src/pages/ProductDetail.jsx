// frontend/src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Heart,
  SlidersHorizontal,
  ShoppingCart,
  Zap,
  Plus,
  Minus,
  Check,
  Award,
  Layers,
  ChevronRight,
  PackageCheck,
  Send,
  MessageSquare
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data.product);
        setReviews(data.reviews || []);
        setRelated(data.related || []);
        setSelectedImage(0);

        // Update document title for SEO
        if (data.product) {
          document.title = `${data.product.title} | Nexora Tech`;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Loading hardware specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-white">Hardware Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested product may have been archived or is out of stock.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'];

  const isRefurbished = product.condition?.toLowerCase().includes('refurbished');
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          user_name: reviewName,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment
        })
      });
      if (res.ok) {
        setReviewSubmitted(true);
        setReviews([
          {
            id: Date.now(),
            user_name: reviewName,
            rating: reviewRating,
            title: reviewTitle,
            comment: reviewComment,
            verified_purchase: 1,
            created_at: new Date().toISOString()
          },
          ...reviews
        ]);
        setReviewName('');
        setReviewTitle('');
        setReviewComment('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-cyan-400">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to="/shop" className="hover:text-cyan-400">Hardware</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to={`/shop?category=${product.category}`} className="hover:text-cyan-400">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-200 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Multi-Photo Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-3xl bg-[#0c1322] border border-cyan-500/20 p-6 h-80 sm:h-96 flex items-center justify-center overflow-hidden shadow-xl">
            {/* Condition badge overlay */}
            <div className="absolute top-4 left-4 z-10">
              {isRefurbished ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {product.condition}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 backdrop-blur-md">
                  Brand New Sealed
                </span>
              )}
            </div>

            <img
              src={images[selectedImage]}
              alt={product.title}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,240,255,0.15)] transition-all duration-300"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl bg-slate-900 border-2 p-1.5 shrink-0 transition-all ${
                    selectedImage === idx
                      ? 'border-cyan-400 scale-105 shadow-neon-cyan/40'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <Truck className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white block">Insured Courier</span>
                <span className="text-slate-400 text-[11px]">Free tech shipping over $150</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white block">30-Day Guarantee</span>
                <span className="text-slate-400 text-[11px]">Hassle-free return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product Buy Box & Specs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-cyan-400 uppercase tracking-widest text-sm">
                {product.brand}
              </span>
              <span className="font-mono text-slate-500">SKU: {product.sku || 'NEX-8841'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {product.title}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
                <span className="ml-2 font-bold text-slate-200 text-sm">{product.rating || '5.0'}</span>
              </div>
              <span className="text-xs text-slate-500">
                ({product.reviews_count || reviews.length} customer ratings)
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-cyan-400 font-semibold">100% Authentic Guaranteed</span>
            </div>

            {/* Pricing Area */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-wrap items-baseline gap-4">
              <div>
                <span className="text-3xl sm:text-4xl font-black text-cyan-400">
                  ${product.price.toFixed(2)}
                </span>
                {product.original_price > product.price && (
                  <span className="text-base text-slate-500 line-through ml-3">
                    ${product.original_price.toFixed(2)}
                  </span>
                )}
              </div>

              {product.original_price > product.price && (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Save ${(product.original_price - product.price).toFixed(2)} ({product.discount_pct}% OFF)
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Certified Refurbished Inspection Box */}
          {isRefurbished && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  Nexora 52-Point Certified Refurbished Inspection
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  GRADE A+ VERIFIED
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {product.condition_notes || 'Inspected under microscope, thermal stress tested, 100% functional components.'}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-emerald-400 font-bold block">Cosmetic Grade</span>
                  <span className="text-slate-400">Like-New (A+)</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-emerald-400 font-bold block">Battery Capacity</span>
                  <span className="text-slate-400">95% - 100% Health</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-emerald-400 font-bold block">Nexora Warranty</span>
                  <span className="text-slate-400">1 Year Full Coverage</span>
                </div>
              </div>
            </div>
          )}

          {/* Stock & Quantity & Purchase Controls */}
          <div className="p-6 rounded-2xl bg-[#0c1322] border border-cyan-500/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Inventory Status:</span>
                <span className={`font-bold flex items-center gap-1 ${
                  product.stock > 3 ? 'text-emerald-400' : product.stock > 0 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                  {product.stock > 3 ? `In Stock (${product.stock} units)` : product.stock > 0 ? `Only ${product.stock} units left!` : 'Out of Stock'}
                </span>
              </div>

              <span className="text-slate-500 text-[11px]">Warranty: {product.warranty}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1 w-full sm:w-auto justify-between">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-300"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 w-full sm:w-auto py-3 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  product.stock <= 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : addedAnimation
                    ? 'bg-emerald-500 text-black scale-95'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-black shadow-neon-cyan'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-cyan-500/40 hover:border-cyan-400 font-extrabold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Instant Checkout</span>
              </button>
            </div>

            {/* Wishlist & Compare Quick Buttons */}
            <div className="flex items-center gap-4 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex items-center gap-1.5 hover:text-white transition-colors ${
                  inWishlist ? 'text-rose-400 font-semibold' : ''
                }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current text-rose-500' : ''}`} />
                <span>{inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={() => inCompare ? removeFromCompare(product.id) : addToCompare(product)}
                className={`flex items-center gap-1.5 hover:text-white transition-colors ${
                  inCompare ? 'text-cyan-400 font-semibold' : ''
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>{inCompare ? 'In Comparison Matrix' : 'Add to Compare'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <section className="space-y-4 pt-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Technical Specifications</h2>
        </div>

        {product.specs && Object.keys(product.specs).length > 0 ? (
          <div className="rounded-2xl bg-[#0c1322] border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
            {Object.entries(product.specs).map(([key, val], idx) => (
              <div
                key={key}
                className={`grid grid-cols-1 sm:grid-cols-3 p-4 text-xs sm:text-sm ${
                  idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-[#0c1322]'
                }`}
              >
                <span className="font-semibold text-cyan-400">{key}</span>
                <span className="sm:col-span-2 text-slate-300 mt-1 sm:mt-0 font-medium">
                  {val}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">Full specs sheet available upon request.</p>
        )}
      </section>

      {/* Customer Reviews Section */}
      <section className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Customer Reviews & Benchmarks</h2>
          </div>
          <span className="text-xs text-slate-400">{reviews.length} Verified Buyer Reviews</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Reviews List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {reviews.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#0c1322] border border-slate-800 text-center text-slate-400 text-xs">
                No reviews yet. Be the first enthusiast to review this hardware!
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="p-5 rounded-2xl bg-[#0c1322] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-cyan-600/30 text-cyan-300 font-bold flex items-center justify-center text-xs">
                        {r.user_name.charAt(0)}
                      </div>
                      <span className="font-bold text-white">{r.user_name}</span>
                      {r.verified_purchase && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Purchase
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-amber-400">
                      {[...Array(r.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  {r.title && <h4 className="text-sm font-bold text-slate-100">{r.title}</h4>}
                  <p className="text-xs text-slate-300 leading-relaxed">{r.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Write Review Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-[#0c1322] border border-cyan-500/30 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                Write an Enthusiast Review
              </h3>

              {reviewSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Thank you! Your review has been published.
                  </p>
                  <p className="text-slate-300">
                    Your real-world benchmark helps other gamers and builders make the right choice.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            reviewRating >= star
                              ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
                              : 'text-slate-600 border-slate-800'
                          }`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Name</label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Alex R."
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Headline / Title</label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g. Blazing fast frame rates and pristine thermals"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Detailed Experience</label>
                    <textarea
                      rows="3"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your thermal performance, display clarity, build quality, or gaming benchmarks..."
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-neon-cyan"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Submitting...' : 'Post Verified Review'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">Recommended Alternatives & Upgrades</h2>
            <Link to={`/shop?category=${product.category}`} className="text-xs text-cyan-400 hover:underline">
              View all {product.category} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
