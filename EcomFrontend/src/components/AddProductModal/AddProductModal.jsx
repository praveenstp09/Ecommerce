import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../../services/productService';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';
import styles from './AddProductModal.module.css';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    subcategory: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    badge: '',
    discount: '0',
    freeShipping: false,
    description: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || !formData.category || !formData.price || !formData.stockQuantity) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      discount: Number(formData.discount),
      imagesJson: JSON.stringify([formData.imageUrl || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80']),
      specificationsJson: '{}',
      featuresJson: '[]',
      tagsJson: JSON.stringify([formData.brand.toLowerCase(), formData.category.toLowerCase(), 'new'])
    };

    try {
      await productService.createProduct(payload);
      onProductAdded();
      onClose();
      // Reset form
      setFormData({
        name: '',
        brand: '',
        category: '',
        subcategory: '',
        price: '',
        stockQuantity: '',
        imageUrl: '',
        badge: '',
        discount: '0',
        freeShipping: false,
        description: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay}>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.header}>
              <h3>Add New Product</h3>
              <button className={styles.closeBtn} onClick={onClose}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <div className={styles.errorBanner}>{error}</div>}

              <div className={styles.row}>
                <Input
                  label="Product Name (Required)"
                  name="name"
                  type="text"
                  placeholder="e.g. Sony WH-1000XM5"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Brand (Required)"
                  name="brand"
                  type="text"
                  placeholder="e.g. Sony"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.row}>
                <Input
                  label="Category (Required)"
                  name="category"
                  type="text"
                  placeholder="e.g. electronics"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Subcategory"
                  name="subcategory"
                  type="text"
                  placeholder="e.g. Audio"
                  value={formData.subcategory}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.row}>
                <Input
                  label="Price (INR, Required)"
                  name="price"
                  type="number"
                  placeholder="e.g. 24999"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Stock Quantity (Required)"
                  name="stockQuantity"
                  type="number"
                  placeholder="e.g. 45"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.row}>
                <Input
                  label="Image URL"
                  name="imageUrl"
                  type="text"
                  placeholder="Image link (Unsplash, etc.)"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
                <div className={styles.innerRow}>
                  <Input
                    label="Badge"
                    name="badge"
                    type="text"
                    placeholder="e.g. Best Seller"
                    value={formData.badge}
                    onChange={handleChange}
                  />
                  <Input
                    label="Discount (%)"
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g. 10"
                    value={formData.discount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.checkboxContainer}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="freeShipping"
                    checked={formData.freeShipping}
                    onChange={handleChange}
                    className={styles.checkboxInput}
                  />
                  <span>Free Shipping Available</span>
                </label>
              </div>

              <div className={styles.textareaGroup}>
                <label className={styles.label}>Product Description</label>
                <textarea
                  name="description"
                  placeholder="Enter detailed description..."
                  value={formData.description}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={4}
                />
              </div>

              <div className={styles.footer}>
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="shimmer-cta">
                  Save Product
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddProductModal;
