import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from './common/Loader/Loader';
import styles from './ProductGrid.module.css';

const ProductGrid = ({ products, loading = false, emptyMessage = 'No products found' }) => {
  const [view, setView] = useState('grid');

  const isInitialLoad = loading && (!products || products.length === 0);

  if (isInitialLoad) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>&#128269;</div>
        <h3 className={styles.emptyTitle}>{emptyMessage}</h3>
        <p className={styles.emptyDesc}>Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <span className={styles.count}>{products.length} products found</span>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${view === 'grid' ? styles.active : ''}`}
            onClick={() => setView('grid')}
          >⊞ Grid</button>
          <button
            className={`${styles.viewBtn} ${view === 'list' ? styles.active : ''}`}
            onClick={() => setView('list')}
          >≡ List</button>
        </div>
      </div>

      <motion.div
        className={view === 'grid' ? styles.grid : styles.list}
        style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s ease' }}
        layout
      >
        <AnimatePresence>
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <ProductCard product={product} view={view} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProductGrid;
