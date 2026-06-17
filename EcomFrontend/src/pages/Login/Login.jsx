import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { validators } from '../../utils/validators';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import styles from './Login.module.css';

// Animated Counter component
const AnimatedCounter = ({ from, to, duration = 2 }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * (to - from) + from));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [from, to, duration]);

  return <span>{count}</span>;
};

const Login = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { sendOTP, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validators.phone(phone);
    if (err) { setError(err); return; }
    setError('');
    try {
      await sendOTP(phone);
      navigate('/verify-otp', { state: { phone } });
    } catch (ex) {
      setError(ex.message || 'Failed to send OTP');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className={styles.page}>
      {/* Dynamic Background with Film Grain */}
      <div className={styles.bg}>
        <div className={styles.bgOverlay} />
        <div className={styles.grainTexture} />
      </div>

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <div className={styles.logoWrap}>
          <h1 className={styles.brand}>Ecommerce</h1>
          <p className={styles.tagline}>Curated for the discerning</p>
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Enter your mobile number to continue</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label='Mobile Number'
              type='tel'
              placeholder='Enter 10-digit mobile number'
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              error={error}
              leftIcon=''
              maxLength={10}
              autoFocus
            />

            <Button
              type='submit'
              fullWidth
              size='lg'
              loading={loading}
              className="shimmer-cta"
            >
              Get OTP →
            </Button>
          </form>

          <p className={styles.hint}>
            <span className={styles.lockIcon}>🔒</span> Secure login with encrypted OTP verification
          </p>

       // <div> className={styles.demoBox}>
         //   <p>Demo: Use any 10-digit number (e.g., 9876543210)</p>
         //   <p>OTP: <strong>0000</strong></p>
        //  </div>

          <div className={styles.features}>
            {[
              { icon: '✦', text: 'Track orders in real-time' },
              { icon: '✦', text: 'Complimentary shipping on orders above ₹999' },
              { icon: '✦', text: 'Curated premium selections' },
            ].map(f => (
              <div key={f.text} className={styles.feature}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Side Content */}
      <motion.div
        className={styles.side}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className={styles.sideGlassPanel}>
          <motion.h2 variants={itemVariants} className={styles.sideTitle}>Find Yourself Here</motion.h2>
          <motion.p variants={itemVariants} className={styles.sideText}>
            An ode to discovery — explore our handpicked collection of premium goods for life lived beautifully.
          </motion.p>

          <motion.div variants={itemVariants} className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}><AnimatedCounter from={0} to={2} />M+</span>
              <span className={styles.statLabel}>Happy Customers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}><AnimatedCounter from={0} to={50} />K+</span>
              <span className={styles.statLabel}>Curated Products</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}><AnimatedCounter from={0} to={4} />.9★</span>
              <span className={styles.statLabel}>App Rating</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
