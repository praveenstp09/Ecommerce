import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatCurrency';
import { VALID_COUPONS } from '../../utils/constants';
import CartItem from '../../components/CartItem';
import { SlideUp } from "../../components/animations/SlideUp";
import styles from './Cart.module.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, totals, couponCode, couponApplied, applyCoupon, removeCoupon, clearCart } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [justApplied, setJustApplied] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const formattedCode = couponInput.trim().toUpperCase();
    if (VALID_COUPONS[formattedCode]) {
      applyCoupon(formattedCode);
      setCouponError('');
      setCouponInput('');
      setJustApplied(true);
      setTimeout(() => setJustApplied(false), 2000);
    } else {
      setCouponError('Invalid coupon code. Try NEXUS10, SAVE50, or FLAT200.');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponError('');
  };

  if (cartItems.length === 0) {
    return (
      <div className={`${styles.emptyCart} container`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={styles.emptyContent}
        >
          <div className={styles.emptyCartWrap}>
            <motion.div 
              className={styles.emptyCartIcon}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              🛒
            </motion.div>
          </div>
          <h2 className={styles.emptyTitle}>Your Cart is Empty</h2>
          <p className={styles.emptyDesc}>Discover our curated collections and add some exceptional pieces to your cart.</p>
          <Link to="/products" className={`${styles.shopBtn} shimmer-cta`}>
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  // Animation variants
  const summaryVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`${styles.cartWrapper} container`}>
      <SlideUp>
        <div className={styles.header}>
          <h1 className={styles.title}>Shopping Cart <span className={styles.itemCountBadge}>{totals.itemCount}</span></h1>
          <button onClick={clearCart} className={styles.clearCartBtn}>
            Clear Cart
          </button>
        </div>
      </SlideUp>

      <div className={styles.layout}>
        {/* Left column: Cart Items list */}
        <div className={styles.itemsColumn}>
          <AnimatePresence mode="popLayout">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </div>

        {/* Right column: Coupon & Summary */}
        <motion.div 
          className={styles.summaryColumn}
          variants={summaryVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Summary Card with Glassmorphism */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryCardHeader}></div>
            <div className={styles.summaryCardInner}>
              <motion.h3 variants={itemVariant} className={styles.cardTitle}>Order Summary</motion.h3>

              {/* Coupon Code Section inside Summary */}
              <motion.div variants={itemVariant} className={styles.couponSection}>
                {couponApplied ? (
                  <motion.div 
                    className={`${styles.appliedCoupon} ${justApplied ? styles.celebrationPulse : ''}`}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <div className={styles.couponMeta}>
                      <span className={styles.couponTag}>✓ {couponCode}</span>
                      <p className={styles.couponDesc}>
                        {VALID_COUPONS[couponCode]?.description}
                      </p>
                    </div>
                    <button onClick={handleRemoveCoupon} className={styles.removeCouponBtn}>
                      Remove
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
                    <div className={styles.couponInputWrap}>
                      <input
                        type="text"
                        placeholder="Promo Code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className={styles.couponInput}
                      />
                      <button type="submit" className={styles.applyBtn}>
                        Apply
                      </button>
                    </div>
                    {couponError && <p className={styles.couponError}>{couponError}</p>}
                    <div className={styles.suggestedCoupons}>
                      <span>Try:</span>
                      <button type="button" onClick={() => setCouponInput('NEXUS10')}>NEXUS10</button>
                      <button type="button" onClick={() => setCouponInput('SAVE50')}>SAVE50</button>
                    </div>
                  </form>
                )}
              </motion.div>

              <div className={styles.divider}></div>

              <motion.div variants={itemVariant} className={styles.totalsTable}>
                <div className={styles.row}>
                  <span>Subtotal</span>
                  <span className={styles.val}>{formatPrice(totals.subtotal)}</span>
                </div>

                <div className={styles.row}>
                  <span>
                    Delivery{' '}
                    {totals.shipping === 0 && <span className={styles.freeBadge}>FREE</span>}
                  </span>
                  <span className={styles.val}>{totals.shipping === 0 ? 'Complimentary' : formatPrice(totals.shipping)}</span>
                </div>

                <div className={styles.row}>
                  <span>Estimated Tax</span>
                  <span className={styles.val}>{formatPrice(totals.tax)}</span>
                </div>

                {totals.discount > 0 && (
                  <div className={`${styles.row} ${styles.discountRow}`}>
                    <span>Discount</span>
                    <span className={styles.val}>-{formatPrice(totals.discount)}</span>
                  </div>
                )}
              </motion.div>

              <div className={styles.dividerStrong}></div>

              <motion.div variants={itemVariant} className={`${styles.row} ${styles.totalRow}`}>
                <span>Total</span>
                <span>{formatPrice(totals.total)}</span>
              </motion.div>

              <motion.button
                variants={itemVariant}
                onClick={() => navigate('/checkout')}
                className={`${styles.checkoutBtn} shimmer-cta`}
              >
                Proceed to Checkout
              </motion.button>

              {totals.shipping > 0 && (
                <motion.p variants={itemVariant} className={styles.shippingTip}>
                  You're <strong>{formatPrice(999 - totals.subtotal)}</strong> away from complimentary delivery.
                </motion.p>
              )}
              
              <div className={styles.secureCheckout}>
                <span className={styles.lockIcon}>🔒</span> Secure Checkout
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
