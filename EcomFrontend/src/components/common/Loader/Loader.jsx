import { motion } from 'framer-motion';
import styles from './Loader.module.css';

const Loader = ({ size = 'md', color = 'primary', fullPage = false, text = '' }) => {
  const loaderEl = (
    <div className={`${styles.loader} ${styles[size]}`}>
      <motion.div
        className={`${styles.ring} ${styles[color]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className={styles.fullPage}>
        {loaderEl}
      </div>
    );
  }

  return loaderEl;
};

export const ProductCardSkeleton = () => (
  <div className={styles.cardSkeleton}>
    <div className={`${styles.skeletonImg} skeleton`} />
    <div className={styles.skeletonBody}>
      <div className={`${styles.skeletonLine} ${styles.w80} skeleton`} />
      <div className={`${styles.skeletonLine} ${styles.w60} skeleton`} />
      <div className={`${styles.skeletonLine} ${styles.w40} skeleton`} />
    </div>
  </div>
);

export default Loader;
