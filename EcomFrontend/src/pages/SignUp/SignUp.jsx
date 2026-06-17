import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { validators } from '../../utils/validators';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import styles from './SignUp.module.css';

const SignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const phoneFromState = location.state?.phone || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(phoneFromState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If we have a phone number from the login redirect, set it
    if (phoneFromState) {
      setPhone(phoneFromState);
    }
  }, [phoneFromState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const nameErr = validators.name ? validators.name(name) : (name ? '' : 'Name is required');
    const emailErr = validators.email ? validators.email(email) : (email ? '' : 'Email is required');
    const phoneErr = validators.phone ? validators.phone(phone) : (phone ? '' : 'Phone is required');

    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (phoneErr) newErrors.phone = phoneErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      await register(name, email, phone);
      // Success, redirect to login page where they enter mobile number and proceed
      navigate('/login', { state: { phone, registerSuccess: true } });
    } catch (ex) {
      setErrors({ api: ex.message || 'Registration failed' });
    }
  };

  return (
    <div className={styles.page}>
      {/* Background overlay */}
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
        <div className={styles.logoWrap}>
          <h1 className={styles.brand}>Ecommerce</h1>
          <p className={styles.tagline}>Curated for the discerning</p>
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>Complete your profile to shop the collection</p>

          {errors.api && <div className={styles.apiError}>{errors.api}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label='Full Name'
              type='text'
              placeholder='Enter your full name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              leftIcon='👤'
              autoFocus
            />

            <Input
              label='Email Address'
              type='email'
              placeholder='Enter your email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              leftIcon='✉️'
            />

            <Input
              label='Mobile Number'
              type='tel'
              placeholder='10-digit mobile number'
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              error={errors.phone}
              leftIcon='📱'
              maxLength={10}
              disabled={!!phoneFromState}
            />

            <Button
              type='submit'
              fullWidth
              size='lg'
              loading={loading}
              className="shimmer-cta"
            >
              Sign Up & Register →
            </Button>
          </form>

          <p className={styles.backToLogin}>
            Already have an account? <Link to="/login" className={styles.link}>Sign In</Link>
          </p>
        </div>
      </motion.div>

      {/* Side Content */}
      <div className={styles.side}>
        <div className={styles.sideGlassPanel}>
          <h2 className={styles.sideTitle}>Welcome to Ecommerce</h2>
          <p className={styles.sideText}>
            Join our curated community. Experience bespoke luxury and handpicked premium selections for your modern lifestyle.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
