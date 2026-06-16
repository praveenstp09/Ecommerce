// App
export const APP_NAME = 'Ecommerce';
export const APP_VERSION = '1.0.0';
export const APP_TAGLINE = 'Shop the Future';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Auth
export const OTP_DEFAULT = '0000';
export const OTP_LENGTH = 4;
export const AUTH_KEY = 'nexus_auth';
export const USER_KEY = 'nexus_user';
export const CART_KEY = 'nexus_cart';
export const ORDERS_KEY = 'nexus_orders';
export const THEME_KEY = 'nexus_theme';

// Pagination
export const PRODUCTS_PER_PAGE = 12;
export const ORDERS_PER_PAGE = 10;

// Price
export const TAX_RATE = 0.18;
export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_COST = 99;

// Coupon codes
export const VALID_COUPONS = {
  NEXUS10: { discount: 10, type: 'percent', description: '10% off on all orders' },
  FLAT200:  { discount: 200, type: 'flat', description: 'Flat ₹200 off' },
  SAVE50:   { discount: 50, type: 'percent', description: '50% off (max ₹500)' },
  NEWUSER:  { discount: 15, type: 'percent', description: '15% off for new users' },
  PREMIUM:  { discount: 500, type: 'flat', description: 'Flat ₹500 off on premium items' },
};

// Sort options
export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'discount', label: 'Biggest Discount' },
];

// Price ranges
export const PRICE_RANGES = [
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 – ₹5,000', min: 1000, max: 5000 },
  { label: '₹5,000 – ₹15,000', min: 5000, max: 15000 },
  { label: '₹15,000 – ₹50,000', min: 15000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: Infinity },
];

// Order statuses
export const ORDER_STATUS = {
  placed: { label: 'Order Placed', color: '#6366F1', icon: '📦' },
  confirmed: { label: 'Confirmed', color: '#8B5CF6', icon: '✅' },
  packed: { label: 'Packed', color: '#F59E0B', icon: '📫' },
  shipped: { label: 'Shipped', color: '#06B6D4', icon: '🚚' },
  out_for_delivery: { label: 'Out for Delivery', color: '#22C55E', icon: '🛵' },
  delivered: { label: 'Delivered', color: '#22C55E', icon: '✅' },
  cancelled: { label: 'Cancelled', color: '#EF4444', icon: '❌' },
  returned: { label: 'Returned', color: '#94A3B8', icon: '↩️' },
};

// Payment methods
export const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: '📱', description: 'Pay with any UPI app' },
  { id: 'credit_card', label: 'Credit Card', icon: '💳', description: 'Visa, Mastercard, Amex' },
  { id: 'debit_card', label: 'Debit Card', icon: '🏦', description: 'All major debit cards' },
  { id: 'net_banking', label: 'Net Banking', icon: '🌐', description: 'All major banks' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', description: 'Pay when delivered' },
];

// Ratings
export const RATING_LABELS = {
  5: '⭐ Excellent',
  4: '😊 Good',
  3: '😐 Average',
  2: '😕 Poor',
  1: '😞 Terrible',
};

// Delivery estimates
export const DELIVERY_ESTIMATE_DAYS = {
  standard: 5,
  express: 2,
  overnight: 1,
};
