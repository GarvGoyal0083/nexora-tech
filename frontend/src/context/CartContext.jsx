// frontend/src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('nexora_cart');
      const parsed = saved ? JSON.parse(saved) : [];
      // Clear legacy USD cart items if any item has legacy USD pricing (< 5000)
      if (Array.isArray(parsed) && parsed.some(item => item.price < 5000)) {
        localStorage.removeItem('nexora_cart');
        return [];
      }
      return parsed;
    } catch (e) {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('nexora_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [shippingMethod, setShippingMethod] = useState('standard');

  useEffect(() => {
    localStorage.setItem('nexora_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('nexora_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('nexora_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock || 99) }
            : item
        );
      } else {
        const image = Array.isArray(product.images) && product.images.length > 0
          ? product.images[0]
          : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
        return [
          ...prevCart,
          {
            id: product.id,
            title: product.title,
            slug: product.slug,
            price: product.price,
            original_price: product.original_price,
            condition: product.condition,
            brand: product.brand,
            category: product.category,
            image,
            stock: product.stock,
            quantity: Math.max(1, quantity)
          }
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.min(newQuantity, item.stock || 99) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Shipping calculation (INR)
  const shippingFee = shippingMethod === 'overnight'
    ? 1499
    : shippingMethod === 'express'
    ? 799
    : subtotal >= 10000 || subtotal === 0
    ? 0
    : 499;

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.discount_type === 'pct') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  const tax = Math.round((subtotal - discountAmount) * 0.18);
  const total = Math.max(0, Math.round(subtotal - discountAmount + shippingFee + tax));

  const applyCoupon = async (code) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply coupon');
      setAppliedCoupon(data);
      return { success: true, message: `Coupon ${data.code} applied successfully!` };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        shippingMethod,
        setShippingMethod,
        shippingFee,
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
        tax,
        total,
        freeShippingThreshold: 10000
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
