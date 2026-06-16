import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button/Button';
import styles from './NotFound.module.css';

const NotFound = () => (
  <div className={styles.page}>
    <motion.div
      className={styles.content}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className={styles.code}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        404
      </motion.div>
      <h1 className={styles.title}>Oops! Page Not Found</h1>
      <p className={styles.subtitle}>
        The page you're looking for seems to have wandered off into the digital void.
      </p>
      <div className={styles.actions}>
        <Link to='/'>
          <Button size='lg'>🏠 Go Home</Button>
        </Link>
        <Link to='/products'>
          <Button variant='ghost' size='lg'>🛍️ Browse Products</Button>
        </Link>
      </div>
    </motion.div>
  </div>
);

export default NotFound;
