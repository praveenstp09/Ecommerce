import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatCurrency';
import styles from './CartItem.module.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <motion.div
      className={styles.item}
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.imageWrapper}>
        <img
          src={item.image}
          alt={item.name}
          className={styles.image}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=200&q=80'; }}
        />
      </div>

      <div className={styles.details}>
        <p className={styles.brand}>{item.brand}</p>
        <h4 className={styles.name}>{item.name}</h4>
        <div className={styles.priceLine}>
          <span className={styles.price}>{formatPrice(item.price)}</span>
          {item.originalPrice > item.price && (
            <span className={styles.originalPrice}>{formatPrice(item.originalPrice)}</span>
          )}
        </div>
        {item.discount > 0 && (
          <span className={styles.saving}>🎉 You save {formatPrice((item.originalPrice - item.price) * item.quantity)}</span>
        )}
      </div>

      <div className={styles.actions}>
        <div className={styles.qtyControl}>
          <button
            className={styles.qtyBtn}
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >−</button>
          <span className={styles.qty}>{item.quantity}</span>
          <button
            className={styles.qtyBtn}
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
          >+</button>
        </div>
        <p className={styles.lineTotal}>{formatPrice(item.price * item.quantity)}</p>
        <button
          className={styles.removeBtn}
          onClick={() => removeFromCart(item.id)}
        >
          🗑️ Remove
        </button>
      </div>
    </motion.div>
  );
};

export default CartItem;
