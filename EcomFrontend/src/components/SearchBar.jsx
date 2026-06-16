import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../hooks/useDebounce';
import { productService } from '../services/productService';
import styles from './SearchBar.module.css';

const SearchBar = ({ compact = false, onClose }) => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  // Sync state if URL search param changes (e.g. user clears search or navigates back)
  useEffect(() => {
    const qParam = searchParams.get('search') || '';
    if (qParam !== query) {
      setQuery(qParam);
    }
  }, [searchParams]);

  // Fetch quick suggestions for the dropdown
  useEffect(() => {
    let active = true;
    const fetchResults = async () => {
      if (debouncedQuery.length >= 2) {
        try {
          const found = await productService.search(debouncedQuery);
          if (active) {
            setResults(found.slice(0, 6));
          }
        } catch (err) {
          console.error('Search failed:', err);
        }
      } else {
        if (active) setResults([]);
      }
    };
    fetchResults();
    return () => { active = false; };
  }, [debouncedQuery]);

  // Automatically trigger search navigation as user types (debounced)
  useEffect(() => {
    if (debouncedQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(debouncedQuery.trim())}`, { replace: true });
    } else if (query === '') {
      // If the query was explicitly cleared by the user, reset the search parameter
      if (window.location.pathname === '/products') {
        navigate('/products', { replace: true });
      }
    }
  }, [debouncedQuery, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setResults([]);
      onClose?.();
    }
  };

  const handleSelect = (product) => {
    navigate(`/product/${product.id}`);
    setQuery('');
    setResults([]);
    onClose?.();
  };

  useEffect(() => {
    if (!compact) inputRef.current?.focus();
  }, [compact]);

  return (
    <div className={`${styles.container} ${compact ? styles.compact : ''}`}>
      <form onSubmit={handleSearch} className={styles.form}>
        <input
          ref={inputRef}
          type='text'
          placeholder='Search products, brands...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          className={styles.input}
        />
        {query && (
          <button type='button' className={styles.clear} onClick={() => setQuery('')}>&times;</button>
        )}
        <button type='submit' className={styles.submitBtn}>Search</button>
      </form>

      <AnimatePresence>
        {focused && results.length > 0 && window.location.pathname !== '/products' && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {results.map(product => (
              <div
                key={product.id}
                className={styles.result}
                onClick={() => handleSelect(product)}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className={styles.resultImg}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                />
                <div className={styles.resultInfo}>
                  <p className={styles.resultName}>{product.name}</p>
                  <p className={styles.resultMeta}>{product.brand} &bull; ₹{product.price.toLocaleString('en-IN')}</p>
                </div>
                <span className={styles.resultCategory}>{product.category}</span>
              </div>
            ))}
            <div className={styles.seeAll} onClick={handleSearch}>
              See all results for &quot;{query}&quot; →
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
