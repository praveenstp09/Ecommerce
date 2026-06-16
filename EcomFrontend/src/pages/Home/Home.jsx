import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { productService } from '../../services/productService';
import { categories } from '../../data/categories';
import { heroBanners, promoBanners, editorialSections, galleryImages } from '../../data/banners';
import ProductCard from '../../components/ProductCard';
import { FadeIn } from "../../components/animations/FadeIn";
import { SlideUp } from "../../components/animations/SlideUp";
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [galleryIndex, setGalleryIndex] = useState(0);

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const [featured, trending, deals] = await Promise.all([
          productService.getFeatured(),
          productService.getTrending(),
          productService.getDeals()
        ]);
        if (active) {
          setFeaturedProducts(featured);
          setTrendingProducts(trending);
          setDealProducts(deals.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load home page products:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadData();
    return () => { active = false; };
  }, []);

  const hero = heroBanners[0];

  // Gallery auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setGalleryIndex((i) => (i + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError('Please enter your email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setSubscribed(true);
    setEmail('');
    setFirstName('');
    setLastName('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const nextGallery = () => setGalleryIndex((i) => (i + 1) % galleryImages.length);
  const prevGallery = () => setGalleryIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);

  // Stagger animation variants
  const heroTextVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.3 }
    }
  };

  const heroWordVariant = {
    hidden: { opacity: 0, y: 40, clipPath: 'inset(100% 0 0 0)' },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0% 0 0 0)',
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  };

  if (loading) {
    return (
      <div className={styles.homeContainer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading products...</p>
      </div>
    );
  }

  return (
    <div className={styles.homeContainer}>
      {/* ── HERO ── */}
      <section className={styles.heroSection}>
        <div
          className={styles.heroBg}
          style={{ backgroundImage: `url(${hero.image})` }}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroGrain} />
        <motion.div
          className={styles.heroContent}
          variants={heroTextVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={heroWordVariant}>
            <Link to="/products" className={styles.heroStoryLink}>{hero.badge}</Link>
          </motion.div>

          <motion.h1 className={styles.heroTitle} variants={heroWordVariant}>
            {hero.title}
          </motion.h1>

          <motion.p className={styles.heroDesc} variants={heroWordVariant}>
            {hero.description}
          </motion.p>

          <motion.div variants={heroWordVariant} className={styles.heroCtaWrap}>
            <div className={styles.heroCtaLine} />
            <button
              className={styles.heroCta}
              onClick={() => navigate(hero.ctaLink)}
            >
              {hero.cta}
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator}>
          <span className={styles.scrollText}>Scroll</span>
          <span className={styles.scrollLine} />
        </div>
      </section>

      {/* ── PROMO STRIP ── */}
      {/* <section className={styles.promoStrip}>
        <div className="container">
          <div className={styles.promoGrid}>
            {promoBanners.map((promo, idx) => (
              <motion.div
                key={promo.id}
                className={styles.promoCard}
                style={{ backgroundColor: promo.bgColor, color: promo.textColor }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                onClick={() => navigate(promo.link)}
              >
                <div className={styles.promoInfo}>
                  <span className={styles.promoIcon}>
                    {idx === 0 ? '✦' : idx === 1 ? '◇' : '↗'}
                  </span>
                  <h4 className={styles.promoTitle}>{promo.title}</h4>
                  <p className={styles.promoSubtitle}>{promo.subtitle}</p>
                </div>
                <span className={styles.promoDiscount}>{promo.discount}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── SHOP WITH US (Categories) — Bento Grid ── */}
      <section className={`${styles.shopSection} container`}>
        <SlideUp>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Collections</span>
            <h2 className={styles.sectionTitle}>Shop with us</h2>
            <div className={styles.sectionDivider} />
            <p className={styles.sectionDesc}>
              A sanctuary of curated goods — handpicked for those who appreciate the finer things.
            </p>
          </div>
        </SlideUp>

        <div className={styles.bentoGrid}>
          {categories.slice(1, 6).map((cat, idx) => (
            <motion.div
              key={cat.id}
              className={`${styles.bentoCard} ${idx === 0 ? styles.bentoFeatured : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              onClick={() => navigate(`/products?category=${cat.id}`)}
            >
              <div className={styles.bentoImageWrap}>
                <img src={cat.image} alt={cat.name} className={styles.bentoImage} />
                <div className={styles.bentoOverlay} />
              </div>
              <div className={styles.bentoContent}>
                <span className={styles.bentoEyebrow}>{cat.productCount}+ pieces</span>
                <h3 className={styles.bentoName}>{cat.name}</h3>
                <span className={styles.bentoLink}>
                  View Collection <span className={styles.bentoArrow}>→</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className={styles.viewAllWrap}>
          <Link to="/products" className={styles.viewAllBtn}>View all Collections</Link>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className={styles.gallerySection}>
        <div className={styles.galleryInner}>
          <div className={styles.galleryMain}>
            <AnimatePresence mode="wait">
              <motion.img
                key={galleryIndex}
                src={galleryImages[galleryIndex].src}
                alt={galleryImages[galleryIndex].alt}
                className={styles.galleryImage}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              />
            </AnimatePresence>
            {/* Caption */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`cap-${galleryIndex}`}
                className={styles.galleryCaption}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
              >
                {galleryImages[galleryIndex].alt}
              </motion.div>
            </AnimatePresence>
            <div className={styles.galleryControls}>
              <button onClick={prevGallery} className={styles.galleryArrow} aria-label="Previous">←</button>
              <span className={styles.galleryCounter}>
                {galleryIndex + 1} / {galleryImages.length}
              </span>
              <button onClick={nextGallery} className={styles.galleryArrow} aria-label="Next">→</button>
            </div>
          </div>
          <div className={styles.galleryThumbs}>
            {galleryImages.map((img, i) => (
              <button
                key={i}
                className={`${styles.galleryThumb} ${i === galleryIndex ? styles.galleryThumbActive : ''}`}
                onClick={() => setGalleryIndex(i)}
              >
                <img src={img.src} alt={img.alt} />
                {/* Progress bar on active thumb */}
                {i === galleryIndex && (
                  <div className={styles.thumbProgress}>
                    <div className={styles.thumbProgressBar} key={`prog-${galleryIndex}`} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL SECTIONS ── */}
      {editorialSections.map((section, idx) => (
        <section
          key={section.id}
          className={`${styles.editorialSection} ${idx % 2 !== 0 ? styles.editorialReverse : ''}`}
        >
          <motion.div
            className={styles.editorialImageWrap}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={section.image} alt={section.title} className={styles.editorialImage} />
          </motion.div>
          <div className={styles.editorialContent}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className={styles.eyebrow}>{section.label}</span>
              <h2 className={styles.editorialTitle}>{section.title}</h2>
              <p className={styles.editorialDesc}>{section.description}</p>
              <Link to={section.link} className={styles.editorialCta}>{section.cta}</Link>
            </motion.div>
          </div>
        </section>
      ))}

      {/* ── DEALS ── */}
      {dealProducts.length > 0 && (
        <section className={styles.dealsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Limited Time</span>
              <h2 className={styles.sectionTitle}>Seasonal Offers</h2>
              <div className={styles.sectionDivider} />
              <p className={styles.sectionDesc}>
                Unforgettable savings on premium selections. Limited stock only.
              </p>
            </div>
            <div className={styles.dealsProducts}>
              {dealProducts.map((product, idx) => (
                <FadeIn key={product.id} delay={idx * 0.1}>
                  <ProductCard product={product} hideAddToCart={true} />
                </FadeIn>
              ))}
            </div>
            <div className={styles.viewAllWrap}>
              <Link to="/products?sort=discount" className={styles.viewAllBtn}>View All Offers</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── BEST SELLERS ── */}
      <section className="container section">
        <SlideUp>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Highly Rated</span>
            <h2 className={styles.sectionTitle}>Best Sellers</h2>
            <div className={styles.sectionDivider} />
          </div>
        </SlideUp>
        <div className={styles.productsGrid}>
          {featuredProducts.map((product, idx) => (
            <FadeIn key={product.id} delay={idx * 0.1}>
              <ProductCard product={product} hideAddToCart={true} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── TRENDING ── */}
      <section className={`${styles.trendingSection} container section`}>
        <SlideUp>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Popular Picks</span>
            <h2 className={styles.sectionTitle}>Trending Now</h2>
            <div className={styles.sectionDivider} />
          </div>
        </SlideUp>
        <div className={styles.productsGrid}>
          {trendingProducts.map((product, idx) => (
            <FadeIn key={product.id} delay={idx * 0.1}>
              <ProductCard product={product} hideAddToCart={true} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      {/* <section className={styles.newsletterSection}>
        <div className={styles.newsletterPattern} />
        <div className="container">
          <div className={styles.newsletterInner}>
            <SlideUp>
              <h2 className={styles.newsletterTitle}>Sign up for special offers and promotions</h2>
            </SlideUp>

            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div
                  className={styles.successMessage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <span className={styles.successIcon}>✓</span>
                  <h3>Thanks for subscribing!</h3>
                  <p>Look out for exclusive special offers and promotions.</p>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleNewsletterSubmit}
                  className={styles.newsletterForm}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="firstName">First name</label>
                      <input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={styles.newsletterInput}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="lastName">Last name</label>
                      <input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={styles.newsletterInput}
                      />
                    </div>
                  </div>
                  <div className={styles.formField}>
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${styles.newsletterInput} ${emailError ? styles.inputError : ''}`}
                    />
                  </div>
                  {emailError && <p className={styles.errorText}>{emailError}</p>}
                  <button type="submit" className={styles.newsletterBtn}>Sign up</button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
