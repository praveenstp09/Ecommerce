import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatCurrency';
import ProductCard from '../../components/ProductCard';
import { SlideUp } from "../../components/animations/SlideUp";
import Loader from '../../components/common/Loader/Loader';
import styles from './ProductDetails.module.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [zoomStyle, setZoomStyle] = useState({});
  const imageContainerRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const prod = await productService.getProductById(id);
        if (!prod) {
          if (active) {
            navigate('/not-found');
          }
          return;
        }
        const related = await productService.getRelated(prod.id, prod.category);
        if (active) {
          setProduct(prod);
          setRelatedProducts(related);
          setActiveImage(prod.images[0] || '');
          setSelectedQuantity(1);
          setLoading(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProductData();
    return () => {
      active = false;
    };
  }, [id, navigate]);

  if (loading) {
    return <Loader fullPage={true} text="Loading product details..." />;
  }

  if (!product) return null;

  const inCart = isInCart(product.id);
  const currentCartQty = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedQuantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleQuantityIncrement = () => {
    if (selectedQuantity < product.stock) {
      setSelectedQuantity((prev) => prev + 1);
    }
  };

  const handleQuantityDecrement = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity((prev) => prev - 1);
    }
  };

  // Image Zoom Lens effect
  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  // Generate dynamic reviews based on rating
  const mockReviews = [
    {
      id: 1,
      name: 'Amit Verma',
      rating: 5,
      date: '2025-05-18',
      comment: `Incredible product! The ${product.brand} quality shines through. Highly recommended to everyone looking for a premium experience.`
    },
    {
      id: 2,
      name: 'Sneha Patel',
      rating: Math.floor(product.rating),
      date: '2025-05-02',
      comment: `Really happy with my purchase. It works perfectly and the specifications are exactly as described. The shipping was incredibly fast.`
    },
    {
      id: 3,
      name: 'Rohan Deshmukh',
      rating: Math.ceil(product.rating - 0.5),
      date: '2025-04-20',
      comment: 'Build quality is absolutely top-notch. Feels very sturdy. Good value for money.'
    },
  ];

  return (
    <div className={`${styles.detailsWrapper} container`}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <Link to="/">Home</Link> <span className={styles.breadcrumbSeparator}>/</span>{' '}
        <Link to={`/products?category=${product.category}`}>
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </Link>{' '}
        <span className={styles.breadcrumbSeparator}>/</span> <span className={styles.breadcrumbActive}>{product.name}</span>
      </div>

      {/* Main product display */}
      <div className={styles.productMain}>
        {/* Left column: Image Gallery */}
        <div className={styles.galleryContainer}>
          <div 
            className={styles.mainImageWrap}
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.img
              key={activeImage}
              src={activeImage}
              alt={product.name}
              className={styles.mainImage}
              style={zoomStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
            {product.badge && (
              <span className={`${styles.badge} ${styles['badge' + product.badge.replace(' ', '')]}`}>
                {product.badge}
              </span>
            )}
            {product.discount > 0 && (
              <span className={styles.discountTag}>{product.discount}% OFF</span>
            )}
          </div>

          <div className={styles.thumbnails}>
            {product.images.map((img, idx) => (
              <button
                key={idx}
                className={`${styles.thumbnailBtn} ${activeImage === img ? styles.thumbnailActive : ''}`}
                onClick={() => setActiveImage(img)}
              >
                <img src={img} alt={`${product.name} preview ${idx}`} />
                {activeImage === img && (
                  <motion.div 
                    layoutId="activeThumb" 
                    className={styles.activeThumbIndicator}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right column: Info & purchase actions */}
        <div className={styles.productInfo}>
          <span className={styles.brand}>{product.brand}</span>
          <h1 className={styles.title}>{product.name}</h1>

          {/* Rating */}
          <div className={styles.ratingRow}>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={i <= Math.floor(product.rating) ? styles.starFilled : styles.starEmpty}
                >
                  ★
                </span>
              ))}
            </div>
            <span className={styles.ratingVal}>{product.rating}</span>
            <span className={styles.reviewsCount}>
              ({product.reviewCount.toLocaleString()} Customer Reviews)
            </span>
          </div>

          {/* Price */}
          <div className={styles.priceRow}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className={styles.originalPrice}>
                  {formatPrice(product.originalPrice)}
                </span>
                <span className={styles.savings}>
                  Save {formatPrice(product.originalPrice - product.price)} ({product.discount}%)
                </span>
              </>
            )}
          </div>

          <p className={styles.description}>{product.description}</p>

          {/* Key Features Bullet List */}
          {product.features && product.features.length > 0 && (
            <div className={styles.featuresList}>
              <h4>Highlights</h4>
              <ul>
                {product.features.map((feat, idx) => (
                  <li key={idx}><span className={styles.featureDot} /> {feat}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Add to Cart Control Block — Floating Glassmorphism Card */}
          <div className={styles.purchaseBlock}>
            {product.stock > 0 ? (
              <>
                <div className={styles.stockStatus}>
                  <span className={styles.inStock}>● In Stock</span>
                  {product.stock <= 10 && (
                    <span className={styles.lowStockWarning}>
                      (Hurry! Only {product.stock} left)
                    </span>
                  )}
                </div>

                <div className={styles.actionRow}>
                  <div className={styles.quantitySelector}>
                    <button onClick={handleQuantityDecrement} disabled={selectedQuantity <= 1}>
                      -
                    </button>
                    <span>{selectedQuantity}</span>
                    <button
                      onClick={handleQuantityIncrement}
                      disabled={selectedQuantity >= product.stock}
                    >
                      +
                    </button>
                  </div>

                  <motion.button
                    className={`${styles.addToCartBtn} ${addedFeedback ? styles.added : ''}`}
                    onClick={handleAddToCart}
                    whileTap={{ scale: 0.95 }}
                  >
                    {addedFeedback ? (
                      <span className={styles.successCheckWrap}>
                        <svg className={styles.successCheckIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Added
                      </span>
                    ) : inCart ? (
                      `Add More (${currentCartQty})`
                    ) : (
                      'Add to Cart'
                    )}
                  </motion.button>
                </div>
              </>
            ) : (
              <div className={styles.outOfStockStatus}>
                <span>✕ Out of Stock</span>
                <p>This item is currently unavailable. Check back later!</p>
              </div>
            )}
          </div>

          {/* Logistics benefits */}
          <div className={styles.logisticsInfo}>
            <div className={styles.logisticsItem}>
              <span className={styles.logisticsIcon}>🚚</span>
              <div>
                <h5>{product.freeShipping ? 'Complimentary Delivery' : 'Standard Delivery'}</h5>
                <p>Delivered within 3-5 business days</p>
              </div>
            </div>
            <div className={styles.logisticsItem}>
              <span className={styles.logisticsIcon}>🛡️</span>
              <div>
                <h5>Secure Payment</h5>
                <p>100% secure checkout and transaction processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs section (Specifications, reviews) */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'specs' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Specifications
            {activeTab === 'specs' && (
              <motion.div layoutId="tabIndicator" className={styles.tabIndicator} />
            )}
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.reviewCount})
            {activeTab === 'reviews' && (
              <motion.div layoutId="tabIndicator" className={styles.tabIndicator} />
            )}
          </button>
        </div>

        <div className={styles.tabsContent}>
          <AnimatePresence mode="wait">
            {activeTab === 'specs' && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={styles.specsTab}
              >
                <table className={styles.specsTable}>
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <tr key={key}>
                        <td className={styles.specKey}>{key}</td>
                        <td className={styles.specVal}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={styles.reviewsTab}
              >
                {/* Review summary stats dashboard */}
                <div className={styles.reviewStats}>
                  <div className={styles.statsBox}>
                    <h3 className={styles.avgRatingNum}>{product.rating}</h3>
                    <div className={styles.stars}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={
                            i <= Math.floor(product.rating) ? styles.starFilled : styles.starEmpty
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className={styles.statsLabel}>Based on {product.reviewCount} reviews</p>
                  </div>

                  <div className={styles.statsBars}>
                    {[5, 4, 3, 2, 1].map((stars, idx) => {
                      // Mock distribution percentage
                      const percent =
                        stars === 5 ? 75 : stars === 4 ? 15 : stars === 3 ? 6 : stars === 2 ? 3 : 1;
                      return (
                        <div key={stars} className={styles.statsBarRow}>
                          <span className={styles.barStarsCount}>{stars} ★</span>
                          <div className={styles.barContainer}>
                            <motion.div 
                              className={styles.barFill} 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${percent}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                            />
                          </div>
                          <span className={styles.barPercent}>{percent}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Individual reviews list */}
                <div className={styles.reviewsList}>
                  {mockReviews.map((rev) => (
                    <div key={rev.id} className={styles.reviewItem}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewAuthorWrap}>
                          <div className={styles.authorAvatar}>
                            {rev.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h5 className={styles.authorName}>{rev.name}</h5>
                            <span className={styles.reviewDate}>{rev.date}</span>
                          </div>
                        </div>
                        <div className={styles.stars}>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span
                              key={i}
                              className={i <= rev.rating ? styles.starFilled : styles.starEmpty}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className={styles.reviewComment}>{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className={styles.relatedSection}>
          <SlideUp>
            <div className={styles.relatedHeader}>
              <h2 className={styles.relatedTitle}>You May Also Like</h2>
              <div className={styles.relatedDivider}></div>
            </div>
          </SlideUp>

          <div className={styles.relatedGrid}>
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
