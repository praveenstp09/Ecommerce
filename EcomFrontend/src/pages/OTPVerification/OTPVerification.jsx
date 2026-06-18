import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button/Button';
import styles from './OTPVerification.module.css';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  
  const ref0 = useRef();
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const refs = useMemo(() => [ref0, ref1, ref2, ref3], []);
  const { verifyOTP, sendOTP, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || '';
  const from = location.state?.from || '/';

  useEffect(() => {
    if (!phone) { navigate('/login'); return; }
    refs[0].current?.focus();
  }, [phone, navigate, refs]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    setError('');
    if (val && i < 3) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs[i - 1].current?.focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const newOtp = ['', '', '', ''];
    text.split('').forEach((c, i) => { newOtp[i] = c; });
    setOtp(newOtp);
    refs[Math.min(text.length, 3)].current?.focus();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const code = otp.join('');
    if (code.length !== 4) { setError('Enter complete 4-digit OTP'); return; }
    try {
      await verifyOTP(phone, code);
      navigate(from);
    } catch (err) {
      setError(err.message || 'Invalid OTP. Hint: use 0000');
      setOtp(['', '', '', '']);
      refs[0].current?.focus();
    }
  };

  const handleResend = async () => {
    try {
      await sendOTP(phone);
      setResendTimer(30);
      setError('');
    } catch {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
      </div>

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <motion.div
          className={styles.iconWrap}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          📲
        </motion.div>

        <h1 className={styles.title}>OTP Verification</h1>
        <p className={styles.subtitle}>
          We sent a 4-digit code to<br />
          <strong>+91 {phone}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.otpRow} onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <motion.input
                key={i}
                ref={refs[i]}
                type='text'
                inputMode='numeric'
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`${styles.otpInput} ${digit ? styles.filled : ''} ${error ? styles.errInput : ''}`}
                whileFocus={{ scale: 1.05, borderColor: 'var(--color-primary)' }}
                transition={{ duration: 0.15 }}
              />
            ))}
          </div>

          {error && (
            <motion.p
              className={styles.error}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ⚠️ {error}
            </motion.p>
          )}

          <Button
            type='submit'
            fullWidth
            size='lg'
            loading={loading}
            disabled={otp.join('').length !== 4}
            style={{ marginTop: '1.5rem' }}
          >
            Verify OTP ✓
          </Button>
        </form>

        <div className={styles.resend}>
          {resendTimer > 0 ? (
            <p className={styles.resendTimer}>Resend OTP in {resendTimer}s</p>
          ) : (
            <button className={styles.resendBtn} onClick={handleResend} disabled={loading}>
              🔄 Resend OTP
            </button>
          )}
        </div>

        <Link to='/login' className={styles.changeNumber}>
          ← Change number
        </Link>
      </motion.div>
    </div>
  );
};

export default OTPVerification;
