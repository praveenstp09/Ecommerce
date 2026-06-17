import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../../services/productService';
import { categories } from '../../data/categories';
import { SORT_OPTIONS, PRICE_RANGES, PRODUCTS_PER_PAGE } from '../../utils/constants';
import ProductGrid from '../../components/ProductGrid';
import { SlideUp } from "../../components/animations/SlideUp";
import { filterProducts, sortProducts } from '../../utils/helpers';
import styles from './ProductListing.module.css';

// Reusable collapsible filter section
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.filterGroup}>
      <button 
        className={styles.filterGroupHeader} 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h4 className={styles.filterTitle}>{title}</h4>
        <span className={`${styles.filterChevron} ${isOpen ? styles.chevronOpen : ''}`}>▼</span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={styles.filterContentWrap}
          >
            <div className={styles.filterContent}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CustomCheckbox = ({ checked, onChange, label }) => (
  <label className={styles.checkboxLabel}>
    <div className={styles.checkboxContainer}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={styles.hiddenCheckbox}
      />
      <div className={`${styles.customCheck} ${checked ? styles.customCheckActive : ''}`}>
        <motion.svg
          initial={false}
          animate={checked ? "checked" : "unchecked"}
          variants={{
            checked: { pathLength: 1, opacity: 1 },
            unchecked: { pathLength: 0, opacity: 0 }
          }}
          transition={{ duration: 0.3 }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.checkIcon}
        >
          <motion.polyline points="20 6 9 17 4 12" />
        </motion.svg>
      </div>
    </div>
    <span className={styles.checkboxText}>{label}</span>
  </label>
);

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const sortParam = searchParams.get('sort') || 'relevance';

  // State
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [minRating, setMinRating] = useState(0);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Deriving category/sort state and resetting filters on change
  const [prevCategory, setPrevCategory] = useState(categoryParam);
  if (categoryParam !== prevCategory) {
    setPrevCategory(categoryParam);
    setSelectedBrands([]);
    setCurrentPage(1);
  }

  const [prevSort, setPrevSort] = useState(sortParam);
  if (sortParam !== prevSort) {
    setPrevSort(sortParam);
    setCurrentPage(1);
  }

  // Sync URL with category when selection changes
  const handleCategoryChange = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId) {
      newParams.set('category', catId);
    } else {
      newParams.delete('category');
    }
    newParams.delete('search'); // Clear search when category changes
    setSearchParams(newParams);
  };

  // State for async data
  const [availableBrands, setAvailableBrands] = useState([]);
  const [filteredProductsList, setFilteredProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch available brands when category changes
  useEffect(() => {
    let active = true;
    const fetchBrands = async () => {
      try {
        const brands = await productService.getBrands(categoryParam);
        if (active) {
          setAvailableBrands(brands);
        }
      } catch (err) {
        console.error('Failed to fetch brands:', err);
      }
    };
    fetchBrands();
    return () => {
      active = false;
    };
  }, [categoryParam]);

  // Handle brand checklist
  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  // Reset Filters
  const handleClearFilters = () => {
    setSelectedBrands([]);
    setPriceRange({ min: '', max: '' });
    setMinRating(0);
    setFreeShippingOnly(false);
    setCurrentPage(1);
    const newParams = new URLSearchParams();
    setSearchParams(newParams);
  };

  // Pre-set price ranges handler
  const handlePresetPriceRange = (min, max) => {
    setPriceRange({ min: min === 0 ? '' : min, max: max === Infinity ? '' : max });
    setCurrentPage(1);
  };

  // Compile active filters
  const activeFilters = useMemo(() => {
    const filters = {};
    if (categoryParam) filters.category = categoryParam;
    if (selectedBrands.length > 0) filters.brands = selectedBrands;
    if (priceRange.min !== '') filters.minPrice = Number(priceRange.min);
    if (priceRange.max !== '') filters.maxPrice = Number(priceRange.max);
    if (minRating > 0) filters.minRating = minRating;
    if (freeShippingOnly) filters.freeShipping = true;
    if (queryParam) filters.query = queryParam;
    return filters;
  }, [categoryParam, selectedBrands, priceRange, minRating, freeShippingOnly, queryParam]);

  // Fetch filtered products when filters or sorting change
  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const products = await productService.getAllProducts(activeFilters, sortParam);
        if (active) {
          setFilteredProductsList(products);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchProducts();
    return () => {
      active = false;
    };
  }, [activeFilters, sortParam]);

  // Infinite scroll displayed products
  const totalPages = Math.ceil(filteredProductsList.length / PRODUCTS_PER_PAGE);
  const displayedProducts = useMemo(() => {
    return filteredProductsList.slice(0, currentPage * PRODUCTS_PER_PAGE);
  }, [filteredProductsList, currentPage]);

  const observerRef = useRef(null);

  const handleObserver = useCallback((entries) => {
    const [target] = entries;
    if (target.isIntersecting && currentPage < totalPages && !loading) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages, loading]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '200px',
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    const currentTarget = observerRef.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [handleObserver]);

  const currentCategoryObj = categories.find((c) => c.id === categoryParam);

  const FilterPanelContent = () => (
    <>
      <FilterSection title="Category" defaultOpen={true}>
        <div className={styles.categoryList}>
          <button
            className={`${styles.categoryItem} ${!categoryParam ? styles.categoryActive : ''}`}
            onClick={() => handleCategoryChange('')}
          >
            <span className={styles.categoryEmoji}>📁</span> All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.categoryItem} ${categoryParam === cat.id ? styles.categoryActive : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              <span className={styles.categoryEmoji}>{cat.emoji}</span> {cat.name}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range" defaultOpen={true}>
        <div className={styles.priceInputs}>
          <div className={styles.priceInputWrap}>
            <span className={styles.currencySymbol}>₹</span>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => {
                setPriceRange((prev) => ({ ...prev, min: e.target.value }));
                setCurrentPage(1);
              }}
              className={styles.priceInput}
            />
          </div>
          <span className={styles.priceRangeSeparator}>—</span>
          <div className={styles.priceInputWrap}>
            <span className={styles.currencySymbol}>₹</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => {
                setPriceRange((prev) => ({ ...prev, max: e.target.value }));
                setCurrentPage(1);
              }}
              className={styles.priceInput}
            />
          </div>
        </div>
        <div className={styles.visualSlider}>
          <div className={styles.visualSliderTrack}></div>
          <div className={styles.visualSliderFill}></div>
        </div>
        <div className={styles.presetPrices}>
          {PRICE_RANGES.map((range, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetPriceRange(range.min, range.max)}
              className={styles.presetBtn}
            >
              {range.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {availableBrands.length > 0 && (
        <FilterSection title="Brands" defaultOpen={true}>
          <div className={styles.brandList}>
            {availableBrands.map((brand) => (
              <CustomCheckbox
                key={brand}
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                label={brand}
              />
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Customer Rating" defaultOpen={false}>
        <div className={styles.ratingList}>
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className={styles.radioLabel}>
              <div className={styles.customRadioWrap}>
                <input
                  type="radio"
                  name="rating-filter"
                  checked={minRating === rating}
                  onChange={() => {
                    setMinRating(rating);
                    setCurrentPage(1);
                  }}
                  className={styles.hiddenRadio}
                />
                <div className={`${styles.customRadio} ${minRating === rating ? styles.customRadioActive : ''}`} />
              </div>
              <span className={styles.starsSpan}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>
                    ★
                  </span>
                ))}
                <span className={styles.ratingText}>& Up</span>
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Logistics" defaultOpen={false}>
        <CustomCheckbox
          checked={freeShippingOnly}
          onChange={(e) => {
            setFreeShippingOnly(e.target.checked);
            setCurrentPage(1);
          }}
          label="🚚 Free Shipping"
        />
      </FilterSection>
    </>
  );

  return (
    <div className={`${styles.listingWrapper} container`}>
      {/* ── Page Header ── */}
      <div className={styles.headerBand}></div>
      <SlideUp>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              {currentCategoryObj ? `${currentCategoryObj.name}` : queryParam ? `Search Results for "${queryParam}"` : 'The Collection'}
            </h1>
            <p className={styles.subtitle}>
              {filteredProductsList.length} items found
            </p>
          </div>

          <div className={styles.sortWrapper}>
            <label htmlFor="sort-select">Sort By</label>
            <div className={styles.selectWrapper}>
              <select
                id="sort-select"
                value={sortParam}
                onChange={(e) => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('sort', e.target.value);
                  setSearchParams(newParams);
                }}
                className={styles.sortSelect}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className={styles.selectArrow}>▼</span>
            </div>
            <button
              className={styles.mobileFilterBtn}
              onClick={() => setMobileFilterOpen(true)}
            >
              Filters
            </button>
          </div>
        </div>
      </SlideUp>

      <div className={styles.layout}>
        {/* ── Desktop Sidebar Filter Panel ── */}
        <aside className={styles.sidebar}>
          <div className={styles.filterHeader}>
            <h3>Filters</h3>
            <button onClick={handleClearFilters} className={styles.clearBtn}>
              Clear All
            </button>
          </div>
          
          <div className={styles.sidebarScroll}>
            <FilterPanelContent />
          </div>
        </aside>

        {/* ── Main Products Grid Content ── */}
        <main className={styles.mainContent}>
          <ProductGrid products={displayedProducts} loading={loading} emptyMessage="No products match your filters. Try adjusting them." />

          {/* Sentinel element for Infinite Scroll */}
          <div ref={observerRef} style={{ height: '20px', margin: '20px 0' }} />

          {loading && currentPage > 1 && (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-secondary)' }}>
              Loading more products...
            </div>
          )}
        </main>
      </div>

      {/* ── Mobile Filters Modal Overlay ── */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className={styles.mobileFilterModal}>
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.div
              className={styles.mobilePanel}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className={styles.mobileFilterHeader}>
                <h3>Filters</h3>
                <button
                  className={styles.closeBtn}
                  onClick={() => setMobileFilterOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className={styles.mobileFilterBody}>
                <FilterPanelContent />
              </div>

              <div className={styles.mobileFilterFooter}>
                <button
                  onClick={() => {
                    handleClearFilters();
                    setMobileFilterOpen(false);
                  }}
                  className={styles.mobileClearAllBtn}
                >
                  Clear All
                </button>
                <button
                  className={`${styles.applyBtn} shimmer-cta`}
                  onClick={() => setMobileFilterOpen(false)}
                >
                  Show Results ({filteredProductsList.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductListing;
