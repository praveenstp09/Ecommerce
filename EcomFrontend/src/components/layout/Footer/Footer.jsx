import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className={styles.footer}>
      {/* Wave Divider */}
      <div className={styles.waveDivider}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className={styles.waveSvg}>
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,0 L0,0 Z" fill="var(--color-bg-primary)" />
        </svg>
      </div>

      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brand}>
            <Link to='/' className={styles.logo}>
              Ecommerce
            </Link>
            <p className={styles.tagline}>
              An ode to discovery — a curated collection for life lived beautifully.
            </p>
          </div>

          <div className={styles.linksGrid}>
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>Shop</h4>
              <Link to='/products?category=electronics' className={styles.link}>Electronics</Link>
              <Link to='/products?category=fashion' className={styles.link}>Fashion</Link>
              <Link to='/products?category=home' className={styles.link}>Home &amp; Living</Link>
              <Link to='/products?category=sports' className={styles.link}>Sports</Link>
              <Link to='/products?sort=discount' className={styles.link}>Offers</Link>
            </div>
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>Account</h4>
              <Link to='/profile' className={styles.link}>My Profile</Link>
              <Link to='/orders' className={styles.link}>My Orders</Link>
              <Link to='/cart' className={styles.link}>My Cart</Link>
              <Link to='/login' className={styles.link}>Sign In</Link>
            </div>
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>Help</h4>
              <a href='#' className={styles.link}>Contact Us</a>
              <a href='#' className={styles.link}>FAQ</a>
              <a href='#' className={styles.link}>Return Policy</a>
              <a href='#' className={styles.link}>Shipping Info</a>
              <a href='#' className={styles.link}>Privacy Policy</a>
            </div>
          </div>
        </div>

        <div className={styles.socialSection}>
          <p className={styles.socialTitle}>Connect with us</p>
          <p className={styles.socialSubtitle}>Inspired by you, always — #EcommerceCollective</p>
          <div className={styles.socials}>
            {['Instagram', 'Twitter', 'Facebook', 'Pinterest'].map(s => (
              <motion.a
                key={s}
                href='#'
                className={styles.social}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {s}
              </motion.a>
            ))}
          </div>
        </div>
      </div>


      {/* Back to Top */}
      <motion.button
        className={styles.backToTop}
        onClick={scrollToTop}
        initial={false}
        animate={{
          opacity: showBackToTop ? 1 : 0,
          y: showBackToTop ? 0 : 20,
          pointerEvents: showBackToTop ? 'auto' : 'none',
        }}
        transition={{ duration: 0.3 }}
        aria-label="Back to top"
      >
        ↑
      </motion.button>
    </footer>
  );
};

export default Footer;
