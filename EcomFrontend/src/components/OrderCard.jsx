import { motion } from 'framer-motion';
import { formatPrice } from '../utils/formatCurrency';
import { formatDate } from '../utils/helpers';
import Button from './common/Button/Button';
import styles from './OrderCard.module.css';

const STATUS_COLORS = {
  delivered: '#22C55E',
  shipped: '#06B6D4',
  confirmed: '#8B5CF6',
  placed: '#6366F1',
  cancelled: '#EF4444',
  returned: '#94A3B8',
  out_for_delivery: '#F59E0B',
};

const OrderCard = ({ order, onReorder }) => {
  const statusColor = STATUS_COLORS[order.status] || '#6366F1';
  const isActive = !['delivered', 'cancelled', 'returned'].includes(order.status);

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div>
          <p className={styles.orderId}>{order.id}</p>
          <p className={styles.date}>{formatDate(order.date)}</p>
        </div>
        <div className={styles.statusPill} style={{ background: `${statusColor}20`, color: statusColor }}>
          {order.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </div>
      </div>

      {/* Items */}
      <div className={styles.items}>
        {order.items.slice(0, 2).map(item => (
          <div key={item.id} className={styles.item}>
            <img
              src={item.image}
              alt={item.name}
              className={styles.itemImg}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
            />
            <div className={styles.itemInfo}>
              <p className={styles.itemName}>{item.name}</p>
              <p className={styles.itemMeta}>Qty: {item.quantity} &bull; {formatPrice(item.price)}</p>
            </div>
          </div>
        ))}
        {order.items.length > 2 && (
          <p className={styles.moreItems}>+{order.items.length - 2} more item(s)</p>
        )}
      </div>

      {/* Tracking Timeline (for active orders) */}
      {isActive && (
        <div className={styles.timeline}>
          {order.timeline.map((step, i) => (
            <div key={i} className={`${styles.timelineStep} ${step.done ? styles.done : ''}`}>
              <div className={styles.dot} />
              {i < order.timeline.length - 1 && <div className={styles.line} />}
              <span className={styles.stepLabel}>{step.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <div>
          <p className={styles.totalLabel}>Order Total</p>
          <p className={styles.total}>{formatPrice(order.total)}</p>
        </div>
        <div className={styles.btnGroup}>
          {!isActive && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onReorder?.(order)}
            >
              🔄 Reorder
            </Button>
          )}
          <Button variant='ghost' size='sm'>
            📄 Invoice
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;
