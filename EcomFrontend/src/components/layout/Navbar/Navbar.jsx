import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useTheme } from '../../../context/ThemeContext';
import SearchBar from '../../SearchBar';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totals } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [marqueeVisible, setMarqueeVisible] = useState(true);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY > 200) setMarqueeVisible(false);
      else setMarqueeVisible(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home', num: '01' },
    { to: '/products', label: 'Shop', num: '02' },
    ...(isAuthenticated ? [{ to: '/orders', label: 'Orders', num: '03' }] : []),
  ];

  const checkIsActive = (to) => {
    return location.pathname === to;
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/login');
  };

  const marqueeItems = [
    'Complimentary Shipping on orders above ₹999',
    'New Season Arrivals — Shop the Edit',
    'Use code NEXUS10 for 10% off your first order',
    'Curated Premium Selections — Handpicked for You',
  ];

  return (
    <>
      {/* Announcement Marquee Bar */}
      {/* <div className={`${styles.marqueeBar} ${!marqueeVisible || scrolled ? styles.marqueeHidden : ''}`}>
        <div className={styles.marqueeTrack}>
          <div className={styles.marqueeContent}>
            {[...marqueeItems, ...marqueeItems].map((item, idx) => (
              <span key={idx} className={styles.marqueeItem}>
                <span className={styles.marqueeDot}>◆</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div> */}

      <motion.nav
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}` 
        // ${marqueeVisible && !scrolled ? styles.withMarquee : ''}`
      }
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.inner}>
          {/* LEFT: Menu / Links */}
          <div className={styles.leftGroup}>
            <button
              className={styles.menuToggle}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span className={styles.menuLabel}>Menu</span>
            </button>

            <nav className={styles.desktopNav}>
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`${styles.navLink} ${checkIsActive(to) ? styles.navActive : ''}`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* CENTER: Logo */}
          <Link to='/' className={styles.logo}>
            <span className={styles.logoText}>Ecommerce</span>
          </Link>

          {/* RIGHT: Actions */}
          <div className={styles.rightGroup}>
            <div className={styles.searchSlideContainer}>
              <AnimatePresence mode="wait">
                {!searchOpen ? (
                  <motion.button
                    key="search-btn"
                    className={styles.iconBtn}
                    onClick={() => setSearchOpen(true)}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Search"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Search
                  </motion.button>
                ) : (
                  <motion.div
                    key="search-input"
                    className={styles.inlineSearchWrap}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 300, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <SearchBar compact onClose={() => setSearchOpen(false)} />
                    <button className={styles.inlineCloseSearch} onClick={() => setSearchOpen(false)}>✕</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              className={styles.iconBtn}
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              title='Toggle theme'
              aria-label="Toggle theme"
            >
              {isDark ? 'Light' : 'Dark'}
            </motion.button>



            <Link to='/cart' className={styles.cartBtn} aria-label="Cart">
              <svg className={styles.cartIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className={styles.cartLabel}>Cart</span>
              {totals.itemCount > 0 && (
                <motion.span
                  className={styles.cartBadge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={totals.itemCount}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                >
                  {totals.itemCount > 99 ? '99+' : totals.itemCount}
                </motion.span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className={styles.profileWrap} ref={profileRef}>
                <motion.button
                  className={styles.profileBtn}
                  onClick={() => setProfileOpen(!profileOpen)}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={styles.avatar}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      className={styles.dropdown}
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className={styles.dropdownHeader}>
                        <p className={styles.dropdownName}>{user?.name}</p>
                        <p className={styles.dropdownPhone}>{user?.phone}</p>
                      </div>
                      <Link to='/profile' className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                        My Profile
                      </Link>
                      <div className={styles.dropdownDivider} />
                      {user?.role === 'admin' && (
                        <>
                          <Link to='/admin' className={styles.dropdownItem} onClick={() => setProfileOpen(false)} style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-medium)' }}>
                            🛡️ Admin Panel
                          </Link>
                          <div className={styles.dropdownDivider} />
                        </>
                      )}
                      <button className={`${styles.dropdownItem} ${styles.logoutBtn}`} onClick={handleLogout}>
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to='/login' className={styles.loginBtn}>
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Gradient bottom line */}
        <div className={styles.navbarGradientLine} />
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className={styles.mobileOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className={styles.mobileMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.mobileMenuHeader}>
                <Link to='/' className={styles.mobileLogo} onClick={() => setMobileOpen(false)}>
                  Ecommerce
                </Link>
                <button className={styles.closeMobile} onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  Close
                </button>
              </div>

              <nav className={styles.mobileNav}>
                {navLinks.map(({ to, label, num }, idx) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.06, duration: 0.4 }}
                  >
                    <Link
                      to={to}
                      className={`${styles.mobileNavLink} ${checkIsActive(to) ? styles.mobileActive : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className={styles.mobileNavNum}>{num}</span>
                      {label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <NavLink
                    to='/profile'
                    className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.mobileActive : ''}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className={styles.mobileNavNum}>05</span>
                    Profile
                  </NavLink>
                </motion.div>
              </nav>

              <div className={styles.mobileFooter}>
                {isAuthenticated ? (
                  <>
                    <p className={styles.mobileUserName}>{user?.name}</p>
                    <button className={styles.mobileLogout} onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to='/login' className={styles.mobileLogin} onClick={() => setMobileOpen(false)}>
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
