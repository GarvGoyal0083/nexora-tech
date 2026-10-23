// frontend/src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  SlidersHorizontal,
  Plus,
  Minus,
  Check,
  ChevronRight
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

        if (data.product) {
          document.title = `${data.product.title} — Nexora Tech`;
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
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-neutral-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-black">Product Not Found</h2>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 rounded-full bg-black text-white font-medium text-xs"
        >
          Back to Catalog
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
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 space-y-20">
      {/* Minimal Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400">
        <Link to="/" className="hover:text-black">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/shop?category=${product.category}`} className="hover:text-black">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-black font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
        {/* Left: Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl bg-neutral-100 p-10 h-96 sm:h-[440px] flex items-center justify-center">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="max-h-full max-w-full object-contain mix-blend-multiply"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl bg-neutral-100 border p-2 shrink-0 transition-all ${
                    selectedImage === idx ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info (6 cols) */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                {product.brand}
              </span>
              <span
                className={`px-3 py-0.5 rounded-full text-[11px] font-medium ${
                  isRefurbished
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-black'
                }`}
              >
                {product.condition}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight leading-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-bold text-black">
                ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              {product.original_price > product.price && (
                <span className="text-base text-neutral-400 line-through">
                  ${product.original_price.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {isRefurbished && product.condition_notes && (
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1.5 text-xs">
              <span className="font-semibold text-black block">
                Certified Refurbished Report
              </span>
              <p className="text-neutral-600 leading-relaxed">{product.condition_notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4 pt-2 border-t border-neutral-200">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>
                {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
              </span>
              <span>{product.warranty}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center rounded-full border border-neutral-300 px-3 py-1.5 w-full sm:w-auto justify-between">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-neutral-600 hover:text-black"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="p-1.5 text-neutral-600 hover:text-black"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 w-full sm:w-auto py-3.5 px-6 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <span>Add to Bag</span>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-white hover:bg-neutral-100 text-black border border-neutral-300 font-medium text-xs transition-colors"
              >
                Buy Now
              </button>
            </div>

            <div className="flex items-center gap-6 pt-2 text-xs text-neutral-500">
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex items-center gap-1.5 hover:text-black ${
                  inWishlist ? 'text-black font-semibold' : ''
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
                <span>{inWishlist ? 'Saved' : 'Save to Wishlist'}</span>
              </button>

              <button
                onClick={() => inCompare ? removeFromCompare(product.id) : addToCompare(product)}
                className={`flex items-center gap-1.5 hover:text-black ${
                  inCompare ? 'text-black font-semibold' : ''
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{inCompare ? 'Comparing' : 'Compare Specs'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <section className="space-y-6 pt-8 border-t border-neutral-200">
        <h2 className="text-xl font-bold text-black">Specifications</h2>

        {product.specs && Object.keys(product.specs).length > 0 ? (
          <div className="rounded-2xl border border-neutral-200 overflow-hidden divide-y divide-neutral-200">
            {Object.entries(product.specs).map(([key, val]) => (
              <div
                key={key}
                className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs sm:text-sm bg-white"
              >
                <span className="font-medium text-neutral-500">{key}</span>
                <span className="sm:col-span-2 text-black mt-1 sm:mt-0">
                  {val}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* Customer Reviews */}
      <section className="space-y-8 pt-8 border-t border-neutral-200">
        <h2 className="text-xl font-bold text-black">Reviews ({reviews.length})</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-neutral-500">No reviews yet.</p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-black">{r.user_name}</span>
                    <div className="flex items-center text-black">
                      {[...Array(r.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  {r.title && <h4 className="text-xs font-bold text-black">{r.title}</h4>}
                  <p className="text-xs text-neutral-600 leading-relaxed">{r.comment}</p>
                </div>
              ))
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl border border-neutral-200 space-y-4">
              <h3 className="text-sm font-bold text-black">Write a Review</h3>
              {reviewSubmitted ? (
                <p className="text-xs text-neutral-600">Thank you for your review.</p>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-neutral-600 mb-1">Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`p-1.5 rounded-lg border ${
                            reviewRating >= star ? 'border-black text-black' : 'border-neutral-200 text-neutral-300'
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 text-black focus:outline-none"
                  />

                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Headline"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 text-black focus:outline-none"
                  />

                  <textarea
                    rows="3"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Your review..."
                    required
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 text-black focus:outline-none"
                  />

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-2.5 rounded-full bg-black text-white font-medium text-xs"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-8 pt-8 border-t border-neutral-200">
          <h2 className="text-xl font-bold text-black">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {related.slice(0, 3).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
