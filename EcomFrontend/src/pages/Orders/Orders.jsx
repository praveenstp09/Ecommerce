import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { orderService } from '../../services/orderService';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/helpers';
import OrderCard from '../../components/OrderCard';
import { SlideUp } from "../../components/animations/SlideUp";
import styles from './Orders.jsx.module.css';

const Orders = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('active');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchOrders = async () => {
      try {
        const fetched = await orderService.getOrders();
        if (active) {
          setOrders(fetched);
          if (fetched.length > 0) {
            setSelectedOrder(fetched[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchOrders();
    return () => { active = false; };
  }, []);

  const activeOrders = orders.filter((o) =>
    ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery'].includes(o.status)
  );
  
  const pastOrders = orders.filter((o) =>
    ['delivered', 'cancelled', 'returned'].includes(o.status)
  );

  const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart(item, item.quantity);
    });
    navigate('/cart');
  };

  const getStatusColor = (status) => {
    const colors = {
      delivered: '#22C55E',
      shipped: '#06B6D4',
      confirmed: '#8B5CF6',
      placed: '#6366F1',
      cancelled: '#EF4444',
      returned: '#94A3B8',
      out_for_delivery: '#F59E0B',
    };
    return colors[status] || '#6366F1';
  };

  if (loading) {
    return (
      <div className={`${styles.ordersWrapper} container`} style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <div style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text-muted)' }}>Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className={`${styles.ordersWrapper} container`}>
      <SlideUp>
        <h1 className={styles.pageTitle}>Your Orders</h1>
      </SlideUp>

      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📦</span>
          <h2>No Orders Yet</h2>
          <p>Looks like you haven't placed any orders yet. Start shopping to place your first order!</p>
          <button onClick={() => navigate('/products')} className={styles.shopBtn}>
            Shop Products ⚡
          </button>
        </div>
      ) : (
        <div className={styles.layout}>
          {/* Left Column: Order List & Tabs */}
          <div className={styles.listColumn}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tabBtn} ${activeTab === 'active' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('active')}
              >
                Active ({activeOrders.length})
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'past' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('past')}
              >
                Past ({pastOrders.length})
              </button>
            </div>

            <div className={styles.ordersList}>
              <AnimatePresence mode="wait">
                {displayedOrders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.noTabOrders}
                  >
                    <p>No {activeTab} orders found.</p>
                  </motion.div>
                ) : (
                  displayedOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`${styles.cardWrapper} ${
                        selectedOrder?.id === order.id ? styles.selectedCard : ''
                      }`}
                    >
                      <OrderCard order={order} onReorder={handleReorder} />
                    </div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Active Selected Order Detail Panel */}
          <div className={styles.detailColumn}>
            {selectedOrder ? (
              <div className={styles.detailCard}>
                <div className={styles.detailHeader}>
                  <div>
                    <h3>{selectedOrder.id}</h3>
                    <p className={styles.orderDate}>Ordered on {formatDate(selectedOrder.date)}</p>
                  </div>
                  <span
                    className={styles.statusPill}
                    style={{
                      backgroundColor: `${getStatusColor(selectedOrder.status)}20`,
                      color: getStatusColor(selectedOrder.status),
                    }}
                  >
                    {selectedOrder.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>

                <div className={styles.detailSection}>
                  <h4>Delivery Address</h4>
                  <div className={styles.addressBox}>
                    {typeof selectedOrder.address === 'object' && selectedOrder.address !== null ? (
                      <>
                        <strong>{selectedOrder.address.name}</strong>
                        <p>
                          {selectedOrder.address.line1}, {selectedOrder.address.line2 && `${selectedOrder.address.line2}, `}
                          {selectedOrder.address.city}, {selectedOrder.address.state} — {selectedOrder.address.pincode}
                        </p>
                        <span>📞 {selectedOrder.address.phone}</span>
                      </>
                    ) : (
                      <p>{selectedOrder.address}</p>
                    )}
                  </div>
                </div>

                {/* Complete Timeline tracker */}
                <div className={styles.detailSection}>
                  <h4>Tracking Details</h4>
                  <div className={styles.verticalTimeline}>
                    {selectedOrder.timeline.map((step, idx) => (
                      <div
                        key={idx}
                        className={`${styles.timelineStep} ${step.done ? styles.stepDone : ''}`}
                      >
                        <div className={styles.iconNode}>
                          {step.done ? '✓' : '●'}
                        </div>
                        {idx < selectedOrder.timeline.length - 1 && (
                          <div className={styles.connectingLine} />
                        )}
                        <div className={styles.stepInfo}>
                          <h5>{step.status}</h5>
                          {step.date && <p>{formatDate(step.date)}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.detailSection}>
                  <h4>Item Details</h4>
                  <div className={styles.itemsTable}>
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className={styles.detailItem}>
                        <img src={item.image} alt={item.name} className={styles.itemImg} />
                        <div className={styles.itemMeta}>
                          <h5>{item.name}</h5>
                          <p>Qty: {item.quantity} × {formatPrice(item.price)}</p>
                        </div>
                        <span className={styles.itemPrice}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.invoiceDivider}></div>

                <div className={styles.totalsBox}>
                  <div className={styles.totalsRow}>
                    <span>Subtotal</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className={styles.totalsRow}>
                    <span>Delivery Charges</span>
                    <span>{selectedOrder.shipping === 0 ? 'FREE' : formatPrice(selectedOrder.shipping)}</span>
                  </div>
                  <div className={styles.totalsRow}>
                    <span>Tax (18%)</span>
                    <span>{formatPrice(selectedOrder.tax)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className={`${styles.totalsRow} ${styles.discountRow}`}>
                      <span>Coupon Discount</span>
                      <span>-{formatPrice(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className={styles.totalsRow}>
                    <strong>Total Amount</strong>
                    <strong className={styles.totalPrice}>{formatPrice(selectedOrder.total)}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.selectOrderNotice}>
                <span>📦</span>
                <p>Select an order from the list to view its complete tracking and transaction details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
