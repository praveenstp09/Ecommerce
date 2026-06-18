import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../utils/formatCurrency';
import { SlideUp } from "../../components/animations/SlideUp";
import Loader from '../../components/common/Loader/Loader';
import styles from './OrderSuccess.module.css';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('id');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchOrder = async () => {
      if (!orderId) {
        navigate('/');
        return;
      }
      try {
        const data = await orderService.getOrderById(orderId);
        if (active) {
          if (!data) {
            navigate('/');
          } else {
            setOrder(data);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          navigate('/');
        }
      }
    };

    fetchOrder();
    return () => { active = false; };
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <Loader size="lg" />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) return null;

  const renderAddress = (address) => {
    if (!address) return 'N/A';
    if (typeof address === 'string') {
      return address.split(', ').map((line, idx) => (
        <span key={idx}>
          {line}
          {idx < address.split(', ').length - 1 && <br />}
        </span>
      ));
    }
    return (
      <>
        {address.name} <br />
        {address.line1}, {address.line2 && `${address.line2}, `}
        {address.city}, {address.state} — {address.pincode}
      </>
    );
  };

  return (
    <div className={`${styles.successWrapper} container`}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Checkmark */}
        <div className={styles.checkmarkWrapper}>
          <motion.div
            className={styles.checkmarkCircle}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
          >
            <motion.span
              className={styles.checkIcon}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              ✓
            </motion.span>
          </motion.div>
        </div>

        <SlideUp>
          <span className={styles.badge}>Order Confirmed</span>
          <h1 className={styles.title}>Thank You For Your Order!</h1>
          <p className={styles.subtitle}>
            Your order has been placed successfully and is being processed.
          </p>
        </SlideUp>

        {/* Order Details */}
        <div className={styles.detailsBox}>
          <div className={styles.detailRow}>
            <span>Order ID</span>
            <strong>{order.id}</strong>
          </div>
          <div className={styles.detailRow}>
            <span>Estimated Delivery</span>
            <strong className={styles.deliveryDate}>{order.estimatedDelivery}</strong>
          </div>
          <div className={styles.detailRow}>
            <span>Delivery Address</span>
            <span className={styles.address}>
              {renderAddress(order.address)}
            </span>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.detailRow}>
            <span>Amount Paid</span>
            <strong className={styles.totalPrice}>{formatPrice(order.total)}</strong>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link to="/orders" className={styles.trackBtn}>
            📦 Track Order
          </Link>
          <Link to="/products" className={styles.shopBtn}>
            🛍️ Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
