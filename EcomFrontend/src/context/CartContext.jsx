/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { calculateCartTotals } from '../utils/helpers';
import { useAuth } from './AuthContext';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState(() => cartService.getLocalCart());
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart with database when user logs in or mounts
  useEffect(() => {
    let active = true;
    const syncCart = async () => {
      try {
        const items = await cartService.getCart(user?.id);
        if (active) {
          setCartItems(items);
        }
      } catch (err) {
        console.error('Failed to sync cart:', err);
      }
    };
    syncCart();
    return () => { active = false; };
  }, [user, isAuthenticated]);

  const totals = useMemo(() =>
    calculateCartTotals(cartItems, couponApplied ? couponCode : null),
    [cartItems, couponCode, couponApplied]
  );

  const addToCart = useCallback(async (product, quantity = 1) => {
    try {
      const updated = await cartService.addToCart(product, quantity, user?.id);
      setCartItems([...updated]);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  }, [user]);

  const removeFromCart = useCallback(async (productId) => {
    try {
      const updated = await cartService.removeFromCart(productId, user?.id);
      setCartItems([...updated]);
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  }, [user]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    try {
      const updated = await cartService.updateQuantity(productId, quantity, user?.id);
      setCartItems([...updated]);
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  }, [user]);

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart(user?.id);
      setCartItems([]);
      setCouponCode('');
      setCouponApplied(false);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  }, [user]);

  const applyCoupon = useCallback((code) => {
    setCouponCode(code);
    setCouponApplied(true);
  }, []);

  const removeCoupon = useCallback(() => {
    setCouponCode('');
    setCouponApplied(false);
  }, []);

  const isInCart = useCallback((productId) =>
    cartItems.some(item => item.id.toString() === productId.toString()), [cartItems]
  );

  const getItemQuantity = useCallback((productId) => {
    const item = cartItems.find(i => i.id.toString() === productId.toString());
    return item ? item.quantity : 0;
  }, [cartItems]);

  const value = {
    cartItems,
    totals,
    couponCode,
    couponApplied,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
