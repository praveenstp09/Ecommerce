import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD, VALID_COUPONS } from './constants';

// Generate unique order ID
export const generateOrderId = () => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `ORD-NX-${num}`;
};

// Calculate delivery date
export const getDeliveryDate = (days = 5) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
};

// Format date
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Format time
export const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Calculate cart totals
export const calculateCartTotals = (cartItems, couponCode = null) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE);

  let discount = 0;
  if (couponCode && VALID_COUPONS[couponCode]) {
    const coupon = VALID_COUPONS[couponCode];
    if (coupon.type === 'percent') {
      discount = Math.round((subtotal * coupon.discount) / 100);
      if (coupon.discount === 50) discount = Math.min(discount, 500);
    } else {
      discount = coupon.discount;
    }
  }

  const total = subtotal + shipping + tax - discount;
  return { subtotal, shipping, tax, discount, total, itemCount: cartItems.reduce((s, i) => s + i.quantity, 0) };
};

// Get discount percentage
export const getDiscountPercent = (original, current) => {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
};

// Validate phone number
export const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

// Validate email
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Validate pincode
export const isValidPincode = (pin) => /^[1-9]\d{5}$/.test(pin);

// Scroll to top
export const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// Debounce
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Get star array
export const getStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= Math.floor(rating)) return 'full';
    if (i < rating) return 'half';
    return 'empty';
  });
};

// Storage helpers
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Storage error:', e);
  }
};

// Sort products
export const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  switch (sortBy) {
    case 'price_asc': return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc': return sorted.sort((a, b) => b.price - a.price);
    case 'rating': return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest': return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    case 'discount': return sorted.sort((a, b) => b.discount - a.discount);
    default: return sorted;
  }
};

// Filter products
export const filterProducts = (products, filters) => {
  return products.filter(p => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.minPrice !== undefined && p.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false;
    if (filters.minRating && p.rating < filters.minRating) return false;
    if (filters.brands && filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
    if (filters.freeShipping && !p.freeShipping) return false;
    return true;
  });
};
