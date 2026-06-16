import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatCurrency';
import styles from './ProductCard.module.css';

const StarRating = ({ rating }) => {
  return (
    <div className={styles.stars}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= Math.floor(rating) ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      ))}
      <span className={styles.ratingNum}>{rating}</span>
    </div>
  );
};

const ProductCard = ({ product, view = 'grid', hideAddToCart = false }) => {
  const { addToCart, isInCart } = useCart();
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const inCart = isInCart(product.id);
  const hasSecondImage = product.images && product.images.length > 1;

  return (
    <motion.div
      className={`${styles.card} ${view === 'list' ? styles.listView : ''}`}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Link to={`/product/${product.id}`} className={styles.link}>
        {/* Image */}
        <div className={styles.imageContainer}>
          {/* Skeleton */}
          {!imgLoaded && <div className={styles.skeleton} />}

          <img
            src={product.images[0]}
            alt={product.name}
            className={`${styles.image} ${styles.imagePrimary} ${hasSecondImage && hovered ? styles.imageHidden : ''}`}
            loading='lazy'
            onLoad={() => setImgLoaded(true)}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80'; }}
          />
          {/* Second image crossfade */}
          {hasSecondImage && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate`}
              className={`${styles.image} ${styles.imageSecondary} ${hovered ? styles.imageVisible : ''}`}
              loading='lazy'
            />
          )}

          {product.badge && (
            <span className={`${styles.badge} ${styles['badge' + product.badge.replace(' ', '')]}`}>
              {product.badge}
            </span>
          )}
          {product.discount > 0 && (
            <span className={styles.discountTag}>{product.discount}% OFF</span>
          )}
          {product.freeShipping && (
            <span className={styles.freeShipping}>Free Ship</span>
          )}

          {/* Quick actions removed per user request */}
        </div>

        {/* Info */}
        <div className={styles.info}>
          <p className={styles.brand}>{product.brand}</p>
          <h3 className={styles.name}>{product.name}</h3>
          <StarRating rating={product.rating} />
          <p className={styles.reviews}>({product.reviewCount.toLocaleString()} reviews)</p>

          {/* Price */}
          <div className={styles.priceRow}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {product.stock <= 10 && product.stock > 0 && (
            <p className={styles.lowStock}>Only {product.stock} left</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
